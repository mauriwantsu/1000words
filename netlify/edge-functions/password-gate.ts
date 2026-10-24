// Protects the whole site with a single shared password.
// The password is read from the SITE_PASSWORD environment variable.

const COOKIE_NAME = "site_auth";
const LOGIN_PATH = "/__login";
const MAX_AGE = 60 * 60 * 24 * 30; // 30 days

async function sign(value: string): Promise<string> {
  const data = new TextEncoder().encode(`site-gate:${value}`);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

function safeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

function getCookie(req: Request, name: string): string | null {
  const header = req.headers.get("cookie") || "";
  for (const part of header.split(";")) {
    const [k, ...v] = part.trim().split("=");
    if (k === name) return v.join("=");
  }
  return null;
}

function safeRedirect(target: string | null): string {
  if (!target || !target.startsWith("/") || target.startsWith("//")) return "/";
  return target;
}

function escapeHtml(s: string): string {
  return s.replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!
  );
}

function loginPage(next: string, message = "", status = 401): Response {
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="robots" content="noindex">
    <title>1000 Words</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=Lato:wght@300;400&display=swap" rel="stylesheet">
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            background: #0a0a0a;
            color: #fff;
            font-family: 'Lato', sans-serif;
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 2rem;
        }
        .container { max-width: 400px; width: 100%; text-align: center; }
        h1 {
            font-family: 'Playfair Display', serif;
            font-size: 2.5rem;
            font-weight: 400;
            margin-bottom: 2rem;
        }
        .divider { width: 60px; height: 1px; background: #333; margin: 0 auto 2rem; }
        input {
            width: 100%;
            padding: 0.9rem 1rem;
            background: transparent;
            border: 1px solid #333;
            color: #fff;
            font-family: 'Lato', sans-serif;
            font-size: 1rem;
            text-align: center;
            letter-spacing: 2px;
            outline: none;
            transition: border-color 0.3s;
        }
        input:focus { border-color: #888; }
        button {
            margin-top: 1rem;
            width: 100%;
            padding: 0.9rem 1rem;
            background: transparent;
            border: 1px solid #555;
            color: #ccc;
            font-family: 'Lato', sans-serif;
            font-size: 0.85rem;
            letter-spacing: 3px;
            text-transform: uppercase;
            cursor: pointer;
            transition: all 0.3s;
        }
        button:hover { border-color: #fff; color: #fff; }
        .message { margin-top: 1.5rem; color: #a66; font-size: 0.9rem; min-height: 1.2em; }
    </style>
</head>
<body>
    <div class="container">
        <h1>1000 Words</h1>
        <div class="divider"></div>
        <form method="POST" action="${LOGIN_PATH}">
            <input type="hidden" name="next" value="${escapeHtml(next)}">
            <input type="password" name="password" placeholder="Password" autocomplete="current-password" autofocus required>
            <button type="submit">Enter</button>
        </form>
        <p class="message">${escapeHtml(message)}</p>
    </div>
</body>
</html>`;
  return new Response(html, {
    status,
    headers: {
      "content-type": "text/html; charset=utf-8",
      "cache-control": "no-store",
    },
  });
}

export default async (req: Request) => {
  const url = new URL(req.url);
  const password = Netlify.env.get("SITE_PASSWORD");

  if (!password) {
    return loginPage("/", "This site is locked. The password has not been set up yet.", 503);
  }

  const expected = await sign(password);

  if (url.pathname === LOGIN_PATH && req.method === "POST") {
    const form = await req.formData();
    const attempt = String(form.get("password") || "");
    const next = safeRedirect(String(form.get("next") || "/"));

    if (!safeEqual(await sign(attempt), expected)) {
      return loginPage(next, "Incorrect password.");
    }

    return new Response(null, {
      status: 303,
      headers: {
        location: next,
        "set-cookie": `${COOKIE_NAME}=${expected}; Path=/; Max-Age=${MAX_AGE}; HttpOnly; Secure; SameSite=Lax`,
        "cache-control": "no-store",
      },
    });
  }

  const cookie = getCookie(req, COOKIE_NAME);
  if (cookie && safeEqual(cookie, expected)) {
    return; // authorized — continue to the site
  }

  const next = url.pathname === LOGIN_PATH ? "/" : url.pathname + url.search;
  return loginPage(next);
};

export const config = {
  path: "/*",
  excludedPath: ["/.netlify/*"],
};
