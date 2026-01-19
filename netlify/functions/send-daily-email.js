const fetch = require('node-fetch');

exports.handler = async function(event, context) {
    const BREVO_API_KEY = process.env.BREVO_API_KEY;
    const FLORIA_EMAIL = 'floria@email.com'; // ← CAMBIA ESTO al email real de Floria
    
    const START_DATE = new Date('2026-01-21T00:00:00-05:00');
    const now = new Date();
    const diffDays = Math.floor((now - START_DATE) / (1000 * 60 * 60 * 24));
    const currentDay = Math.max(1, Math.min(diffDays + 1, 1000));
    
    const emailData = {
        sender: {
            name: "Mauricio",
            email: "mauricio@email.com" // ← CAMBIA ESTO al email verificado en Brevo
        },
        to: [{
            email: FLORIA_EMAIL,
            name: "Floria"
        }],
        subject: `Day ${currentDay} ✨`,
        htmlContent: `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <style>
                    body { font-family: 'Georgia', serif; background: #0a0a0a; color: #fff; padding: 40px 20px; text-align: center; }
                    .container { max-width: 500px; margin: 0 auto; background: #111; border: 1px solid #333; border-radius: 10px; padding: 40px; }
                    h1 { font-size: 24px; color: #fff; margin-bottom: 20px; }
                    p { font-size: 16px; line-height: 1.8; margin-bottom: 15px; color: #ccc; }
                    .divider { border-top: 1px solid #333; margin: 30px 0; }
                    a { display: inline-block; background: #fff; color: #0a0a0a; padding: 15px 40px; border-radius: 8px; text-decoration: none; font-weight: bold; margin-top: 20px; }
                </style>
            </head>
            <body>
                <div class="container">
                    <h1>Day ${currentDay} ✨</h1>
                    <p>Mi amor,</p>
                    <p>Te amo.</p>
                    <p>Tu palabra del día te está esperando.</p>
                    <div class="divider"></div>
                    <a href="https://1000words.formyfloria.com">Ver mi palabra del día →</a>
                    <div class="divider"></div>
                    <p style="font-size: 14px; color: #666;">Con todo mi amor,<br>Mauricio</p>
                </div>
            </body>
            </html>
        `
    };
    
    try {
        const response = await fetch('https://api.brevo.com/v3/smtp/email', {
            method: 'POST',
            headers: {
                'accept': 'application/json',
                'api-key': BREVO_API_KEY,
                'content-type': 'application/json'
            },
            body: JSON.stringify(emailData)
        });
        
        const data = await response.json();
        
        return {
            statusCode: 200,
            body: JSON.stringify({ success: true, messageId: data.messageId })
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: error.message })
        };
    }
};
```

4. **Commit new file**

---

## **ARCHIVOS QUE DEBEN QUEDAR EN GITHUB:**
```
1000words/
├── index.html
├── styles.css
├── script.js
├── words.js
├── package.json
├── netlify.toml
└── netlify/
    └── functions/
        └── send-daily-email.js
