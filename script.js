 // Configuración
const START_DATE = new Date('2026-01-20T00:00:00-05:00'); // 21 de enero 2026, Panamá timezone

// Días especiales
const SPECIAL_DAYS = {
    25: {
        title: "Happy Valentine's Day, My Love",
        message: "There are 1,000 words waiting for you here. One for each day and I want you to wake up knowing you are my world.\n\nToday, on this day that belongs to love, I dont need a word.\n\nI need you to know something.\n\nI think about the way you laugh when something genuinely surprises you. The way your mind works — fast, curious, always three steps ahead. The way you move through the world with this quiet confidence that makes everyone around you feel like they're exactly where theyre supposed to be. Thats how you make me feel.\n\nI think about these things at 4am when the restaurant is finally quiet and the city outside sounds like its exhaling. I think about them in the small breaks between studying — and somehow, thinking of you makes even the hardest days feel like theyre easy.\n\nYou might be far away right now. Oceans and timezones and thousands of miles of sky between us. And still — you are the first thing I think of when something good happens. You are who I want to call when something breaks. You are the person Im building toward every day.\n\nI dont know exactly what our future looks like yet. But I know youre in it. Clearly. Completely. Without question.\n\nSo today, while the world celebrates love with flowers and dinners and grand gestures — I just want to say this, simply:\n\nI love you.\n\nI miss you in a way that has no good word for it in any language.\n\nAnd I am waiting for the day when the distance is just a story we tell.\n\nUntil then — theres a new word for you every morning. Because some things are worth saying 1,000 times.\n\nCon todo mi amor,\nMauricio"
   
    34: { // 24 de febrero - Cumpleaños de Floria
        title: "Happy Birthday, My Love ✨",
        message: "Today is your special day, and I want you to know that you are the most incredible gift in my life. Every moment with you is a celebration. Te amo con todo mi corazón. 🎂💖"
    },
    289: { // 5 de noviembre - Aniversario
        title: "Happy Anniversary, Mi Amor 💕",
        message: "One year of love, laughter, and endless memories. You are my everything, and I'm so grateful for every single day with you. Here's to forever. 🥂❤️"
    },
    500: {
        title: "Day 500 - Halfway to Forever 🌟",
        message: "[Placeholder: Escribe aquí tu mensaje especial para el día 500]"
    },
    1000: {
        title: "Day 1000 - Our Eternity Begins Here 💫",
        message: "[Placeholder: Escribe aquí tu mensaje final para el día 1000]"
    }
};

// Calcular día actual
function getCurrentDay() {
    const now = new Date();
    const diffTime = now - START_DATE;
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    return Math.max(1, Math.min(diffDays + 1, 1000)); // Entre 1 y 1000
}

// Obtener palabra del día
function getWordOfDay() {
    const day = getCurrentDay();
    return words.find(w => w.day === day) || words[0];
}

// Favoritos (localStorage)
function getFavorites() {
    const favs = localStorage.getItem('favorites');
    return favs ? JSON.parse(favs) : [];
}

function saveFavorites(favorites) {
    localStorage.setItem('favorites', JSON.stringify(favorites));
}

function isFavorite(day) {
    const favorites = getFavorites();
    return favorites.includes(day);
}

function toggleFavorite() {
    const day = getCurrentDay();
    let favorites = getFavorites();
    
    if (isFavorite(day)) {
        favorites = favorites.filter(d => d !== day);
    } else {
        favorites.push(day);
    }
    
    saveFavorites(favorites);
    updateHeartButton();
    updateFavoritesList();
}

function updateHeartButton() {
    const day = getCurrentDay();
    const heartButton = document.getElementById('heartButton');
    
    if (isFavorite(day)) {
        heartButton.classList.add('active');
    } else {
        heartButton.classList.remove('active');
    }
}

// Mostrar favoritos
function toggleFavorites() {
    const panel = document.getElementById('favoritesPanel');
    panel.classList.toggle('active');
    updateFavoritesList();
}

function updateFavoritesList() {
    const favorites = getFavorites();
    const list = document.getElementById('favoritesList');
    const count = document.getElementById('favCount');
    
    count.textContent = favorites.length;
    
    if (favorites.length === 0) {
        list.innerHTML = '<p style="color: #666; text-align: center; padding: 2rem;">No favorites yet mi amor. Click the heart to save words you love, my love</p>';
        return;
    }
    
    list.innerHTML = favorites
        .sort((a, b) => b - a)
        .map(day => {
            const word = words.find(w => w.day === day);
            return `
                <div class="favorite-item" onclick="showDefinition('${word.word}')">
                    <div class="word">${word.word}</div>
                    ${word.translation ? `<div class="translation">${word.translation}</div>` : ''}
                    <div class="day">Day ${day}</div>
                </div>
            `;
        })
        .join('');
}

// Definición de palabra (API)
// Definiciones personalizadas románticas
const CUSTOM_DEFINITIONS = {
    // 1-20
    "Beautiful": "What I see every time I look at you. A beauty that goes far beyond the surface - it radiates from your soul.",
    "Radiant": "The way you light up every room, every moment, every part of my life. Your energy is contagious, your presence is magnetic.",
    "Intelligent": "Not just book smart, but wise. You see the world with depth and clarity that amazes me every day.",
    "Kind": "The gentleness in your heart that makes everyone around you feel safe, valued, and loved.",
    "Thoughtful": "How you remember the smallest details, how you care in ways that words can't capture. You think of others before yourself.",
    "Brave": "The courage you show every single day - to be yourself, to love deeply, to face challenges head-on. You inspire me.",
    "Strong": "Not just physically, but in spirit. Your resilience in the face of difficulty is one of the things I admire most about you.",
    "Graceful": "The elegance in how you move through life - with poise, dignity, and a quiet confidence that captivates me.",
    "Genuine": "You are real in a world full of pretense. Your authenticity is a rare and precious gift.",
    "Warm": "Like coming home. Your presence feels like comfort, safety, and love all wrapped into one.",
    "Compassionate": "The depth of your empathy, how you feel for others, how you want to make the world better. Your heart is enormous.",
    "Brilliant": "Your mind shines. The way you think, create, and solve problems leaves me in awe.",
    "Adventurous": "Your willingness to explore, to try new things, to say yes to life. You make every day an adventure.",
    "Independent": "You don't need anyone to complete you - you're whole on your own. And yet, you choose to share your life with me.",
    "Resilient": "How you bounce back from setbacks, how you grow through challenges. Nothing can keep you down for long.",
    "Captivating": "I could watch you for hours and never get bored. Everything about you draws me in.",
    "Inspiring": "You make me want to be better. Your example pushes me to grow, to dream bigger, to love harder.",
    "Creative": "The way your mind works fascinates me. You see possibilities where others see limitations.",
    "Passionate": "When you care about something, you give it everything. Your intensity is beautiful.",
    "Loyal": "Your commitment is unwavering. When you love, you love completely and without conditions.",
    
    // 21-40
    "Trustworthy": "I can tell you anything and know it's safe with you. You've earned my complete trust.",
    "Honest": "You speak truth even when it's hard. Your integrity is unshakeable.",
    "Witty": "Your humor catches me off guard in the best way. You make me laugh like no one else can.",
    "Charming": "There's something about you that's simply irresistible. You win hearts without even trying.",
    "Elegant": "The way you carry yourself, the way you speak, the way you move - everything about you is refined and graceful.",
    "Sophisticated": "Your taste, your style, your perspective - you have a worldliness that I deeply admire.",
    "Down-to-earth": "Despite all your amazing qualities, you remain humble and approachable. You never put yourself above anyone.",
    "Spontaneous": "Your ability to be present and embrace the unexpected makes life with you thrilling.",
    "Curious": "You ask questions, you wonder, you want to understand. Your mind never stops exploring.",
    "Open-minded": "You listen without judgment, you consider perspectives different from your own. You make space for growth.",
    "Understanding": "You get me in ways no one else does. You see past my words to what I really mean.",
    "Patient": "With me, with others, with life. You know that good things take time, and you're willing to wait.",
    "Supportive": "You're my biggest cheerleader. You believe in me even when I don't believe in myself.",
    "Encouraging": "Your words lift me up. You know exactly what to say to help me keep going.",
    "Empowering": "You don't just support me - you help me discover my own strength. You make me feel capable of anything.",
    "Magnetic": "I'm drawn to you like gravity. There's a pull I can't resist and don't want to.",
    "Alluring": "There's a mystery to you that keeps me wanting to know more, to get closer, to understand you deeper.",
    "Enchanting": "You've cast a spell on me. I'm completely under your charm and I never want to break free.",
    "Mesmerizing": "I get lost in you - in your eyes, your voice, your presence. Time stops when I'm with you.",
    "Stunning": "You take my breath away. Every time I see you, it's like the first time all over again.",
    
    // 41-60
    "Gorgeous": "Your beauty is undeniable. Inside and out, you are absolutely gorgeous.",
    "Lovely": "Everything about you is lovely - your smile, your laugh, your heart, your soul.",
    "Exquisite": "Like a rare work of art. You are delicate, detailed, and absolutely perfect.",
    "Delightful": "You bring joy wherever you go. Being around you is pure delight.",
    "Amazing": "You amaze me every single day. I don't know how you do it, but you always surprise me.",
    "Extraordinary": "You are beyond ordinary in every way. There is nothing average or typical about you.",
    "Remarkable": "Worthy of being noticed, remembered, celebrated. You leave a mark on everyone you meet.",
    "Wonderful": "Full of wonder. You make me see the world with fresh eyes and renewed appreciation.",
    "Fantastic": "Beyond my wildest dreams. You exceed every expectation I could have had.",
    "Incredible": "Hard to believe you're real. Sometimes I have to pinch myself because you're too good to be true.",
    "Phenomenal": "A phenomenon. Something special that doesn't come around often. I'm lucky to have found you.",
    "Spectacular": "A sight to behold. You are a spectacle of beauty, intelligence, and grace.",
    "Magnificent": "Grand and impressive. Your presence commands attention and admiration.",
    "Marvelous": "Causing wonder and astonishment. You are a marvel to me.",
    "Splendid": "Impressive and magnificent in appearance. You are splendid in every way.",
    "Sublime": "Of such excellence or beauty as to inspire great admiration. You are the definition of sublime.",
    "Divine": "Like something sent from heaven. You are a blessing in my life.",
    "Angelic": "Pure, innocent, and good. Your spirit is angelic.",
    "Heavenly": "Perfect, wonderful, like paradise. Being with you is heavenly.",
    "Magical": "You make the impossible feel possible. There's magic in everything you do.",
    
    // 61-80
    "Luminous": "You glow from within. Your light guides me through dark times.",
    "Glowing": "Radiating warmth and happiness. Your positive energy is contagious.",
    "Shining": "Your brilliance can't be hidden. You shine brighter than any star.",
    "Sparkling": "Full of life and energy. Your eyes sparkle when you're happy and it makes my heart soar.",
    "Dazzling": "So bright and impressive that you're almost blinding. You dazzle everyone around you.",
    "Breathtaking": "You literally take my breath away. I forget to breathe when I look at you.",
    "Heart-stopping": "You make my heart skip a beat. Every. Single. Time.",
    "Soul-stirring": "You touch something deep within me. You move my soul in ways I can't explain.",
    "Life-changing": "Meeting you changed everything. My life is divided into before you and after you.",
    "Unforgettable": "Impossible to forget. You're etched into my memory and my heart forever.",
    "Irreplaceable": "There could never be another you. You are singular, unique, and impossible to replace.",
    "Precious": "More valuable than anything in this world. You are my greatest treasure.",
    "Treasured": "Kept safe in my heart, protected and cherished every single day.",
    "Cherished": "Loved and protected with tenderness. You are cherished beyond measure.",
    "Beloved": "Dearly loved. You are my beloved, now and always.",
    "Adored": "Loved and respected deeply. I adore everything about you.",
    "Admired": "Regarded with respect and warm approval. I admire who you are and who you're becoming.",
    "Respected": "You have my deepest respect. Your character, your values, your strength - I respect it all.",
    "Valued": "Considered important and beneficial. You add immeasurable value to my life.",
    "Appreciated": "Recognized and enjoyed for your qualities. I appreciate you more than words can say.",
    
    // 81-100
    "Celebrated": "You deserve to be celebrated every single day. Your existence is worth celebrating.",
    "Honored": "I am honored to know you, to love you, to be loved by you. It's a privilege.",
    "Revered": "Regarded with deep respect and admiration. You are revered in my heart.",
    "Esteemed": "Held in great respect and high regard. I esteem you above all others.",
    "Distinguished": "Successful, authoritative, and worthy of respect. You stand out in the best way.",
    "Exceptional": "Unusually good, outstanding. You are the exception to every rule.",
    "Outstanding": "Exceptionally good, clearly noticeable. You stand out in every crowd.",
    "Superior": "Higher in quality than others. You set the standard for excellence.",
    "First-rate": "Of the best class or quality. You are absolutely first-rate.",
    "Top-notch": "Of the highest quality. You are top-notch in every way.",
    "World-class": "Among the best in the world. You could compete on any stage and win.",
    "Incomparable": "Without an equal in quality or extent. There is no comparison - you are in a league of your own.",
    "Unmatched": "Not equaled or rivaled by another. Nobody matches you.",
    "Unrivaled": "Better than everyone or everything of the same type. You have no rival in my heart.",
    "Peerless": "Unequaled, unmatched. You have no peers - you stand alone at the top.",
    "Matchless": "Unable to be equaled. You are matchless, one of a kind.",
    "Unique": "Being the only one of its kind. Unlike anything or anyone else. That's you - unique and irreplaceable.",
    "One-of-a-kind": "Completely unique. There is literally no one else like you in the entire world, and that makes you infinitely precious to me.",
    "Singular": "Exceptionally good or great, remarkable. You are singular in your beauty, your character, your everything.",
    "Rare": "Not found in large numbers and consequently of interest or value. You are a rare gem that I was lucky enough to find.",
    "Forever-Mine": "The state of belonging to someone eternally, beyond time and space. What Floria is to Mauricio.",
    "One-of-a-kind": "Completely unique and irreplaceable. Like Floria - there is no one else like her in the entire world.",
    "My-everything": "The totality of what matters. Every thought, every breath, every heartbeat - all of it is you.",
    "Beautiful": "What I see every time I look at you. A beauty that goes far beyond the surface - it radiates from your soul.",
    "Radiant": "The way you light up every room, every moment, every part of my life.",
    "Beloved": "The one who holds my heart completely. Mi amor, mi vida, mi todo.",
    "Precious": "More valuable than anything in this world. You are my greatest treasure.",
    "Treasured": "Kept safe in my heart, protected and cherished every single day.",
    "Irreplaceable": "There could never be another you. You are singular, perfect, mine.",
    "Forever-beautiful": "Beauty that transcends time. You will be stunning to me in every moment of forever.",
    "Eternally-radiant": "A light that never dims. Your glow is eternal in my eyes.",
    "Infinitely-precious": "Your worth cannot be measured. You are priceless beyond infinity.",
    "Simply-Floria": "No adjective can fully capture you. You are simply, perfectly, wonderfully yourself.",
    "Perfectly-you": "Exactly as you should be. Every part of you is exactly what I love."
};

async function showDefinition(word) {
    const modal = document.getElementById('definitionModal');
    const modalWord = document.getElementById('modalWord');
    const modalDefinition = document.getElementById('modalDefinition');
    
    modalWord.textContent = word;
    modalDefinition.innerHTML = '<div style="text-align: center; padding: 2rem;"><p style="color: #666;">Loading...</p></div>';
    modal.classList.add('active');
    
    let htmlContent = '<div style="padding: 1rem 0;">';
    let hasCustomDef = false;
    let hasApiDef = false;
    
    // Primero: Definición personalizada si existe
    if (CUSTOM_DEFINITIONS[word]) {
        hasCustomDef = true;
        htmlContent += `
            <div style="background: rgba(255, 255, 255, 0.03); padding: 1.5rem; border-radius: 8px; margin-bottom: 1.5rem; border-left: 3px solid #fff;">
                <p style="color: #fff; font-size: 0.75rem; text-transform: uppercase; letter-spacing: 2px; margin-bottom: 0.8rem; opacity: 0.7;">For You</p>
                <p style="color: #e0e0e0; line-height: 1.9; font-size: 1.05rem; font-style: italic;">
                    ${CUSTOM_DEFINITIONS[word]}
                </p>
            </div>
        `;
    }
    
    // Segundo: Intentar obtener definición del API
    try {
        const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word.split('-')[0]}`);
        
        if (response.ok) {
            const data = await response.json();
            const entry = data[0];
            hasApiDef = true;
            
            // Agregar separador si ya hay definición personalizada
            if (hasCustomDef) {
                htmlContent += '<div style="border-top: 1px solid #222; margin: 1.5rem 0;"></div>';
            }
            
            // Phonetic (pronunciación)
            if (entry.phonetic) {
                htmlContent += `<p style="color: #777; font-size: 0.9rem; margin-bottom: 1.5rem; font-style: italic; text-align: center;">${entry.phonetic}</p>`;
            }
            
            // Definiciones del diccionario
            entry.meanings.slice(0, 2).forEach((meaning, idx) => {
                if (idx > 0) htmlContent += '<div style="border-top: 1px dashed #222; margin: 1.2rem 0;"></div>';
                
                htmlContent += `<p style="color: #fff; font-size: 0.75rem; text-transform: uppercase; letter-spacing: 2px; margin-bottom: 1rem; opacity: 0.7;">${meaning.partOfSpeech}</p>`;
                
                meaning.definitions.slice(0, 2).forEach((def, i) => {
                    htmlContent += `
                        <div style="margin-bottom: 1.2rem;">
                            <p style="color: #ccc; line-height: 1.8; margin-bottom: 0.5rem;">
                                <span style="color: #fff; font-weight: 500; margin-right: 0.5rem;">${i + 1}.</span>${def.definition}
                            </p>
                    `;
                    
                    // Ejemplo si existe
                    if (def.example) {
                        htmlContent += `<p style="color: #666; font-style: italic; padding-left: 2rem; font-size: 0.92rem; margin-top: 0.5rem;">"${def.example}"</p>`;
                    }
                    
                    htmlContent += `</div>`;
                });
            });
        }
    } catch (error) {
        console.log('API error:', error);
    }
    
    // Si no hay ninguna definición (ni personalizada ni del API)
    if (!hasCustomDef && !hasApiDef) {
        htmlContent = `
            <div style="text-align: center; padding: 3rem 1rem;">
                <p style="color: #aaa; font-size: 1.1rem; margin-bottom: 1rem; line-height: 1.6;">
                    This word is so special, it transcends definition.
                </p>
                <p style="color: #777; font-size: 0.95rem; font-style: italic;">
                    It simply describes you perfectly. ✨
                </p>
            </div>
        `;
    } else {
        htmlContent += '</div>';
    }
    
    modalDefinition.innerHTML = htmlContent;
}

function closeDefinition() {
    document.getElementById('definitionModal').classList.remove('active');
}

// Constelación de fondo
function drawConstellation() {
    const canvas = document.getElementById('constellation');
    const ctx = canvas.getContext('2d');
    
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    const currentDay = getCurrentDay();
    const pastWords = words.filter(w => w.day < currentDay).slice(-50); // Últimas 50 palabras
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    pastWords.forEach(word => {
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        const opacity = Math.random() * 0.15 + 0.05;
        
        ctx.font = `${Math.random() * 10 + 8}px 'Playfair Display', serif`;
        ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`;
        ctx.fillText(word.word, x, y);
    });
}

// Mensaje especial
function checkSpecialDay() {
    const day = getCurrentDay();
    
    if (SPECIAL_DAYS[day]) {
        const modal = document.getElementById('specialMessage');
        const title = document.getElementById('specialTitle');
        const text = document.getElementById('specialText');
        
        title.textContent = SPECIAL_DAYS[day].title;
        text.textContent = SPECIAL_DAYS[day].message;
        
        setTimeout(() => {
            modal.classList.add('active');
        }, 2000);
    }
}

function closeSpecialMessage() {
    document.getElementById('specialMessage').classList.remove('active');
}

// Click en palabra para ver definición
document.addEventListener('DOMContentLoaded', () => {
    const wordContainer = document.querySelector('.word-container');
    const mainWord = document.getElementById('mainWord');
    
    wordContainer.addEventListener('click', () => {
        const word = mainWord.textContent;
        showDefinition(word);
    });
});

// Typing effect
function typeWord(word, element) {
    element.textContent = '';
    element.style.opacity = '1';
    let index = 0;
    
    const typeInterval = setInterval(() => {
        if (index < word.length) {
            element.textContent += word[index];
            index++;
        } else {
            clearInterval(typeInterval);
        }
    }, 100); // 100ms entre cada letra
}

// Inicialización
window.addEventListener('load', () => {
    const currentDay = getCurrentDay();
    const wordOfDay = getWordOfDay();
    
    // Mostrar día
    document.getElementById('dayNumber').textContent = currentDay;
    
    // Typing effect en la palabra principal
    const mainWordElement = document.getElementById('mainWord');
    setTimeout(() => {
        typeWord(wordOfDay.word, mainWordElement);
    }, 500); // Espera 500ms antes de empezar a escribir
    
    // Mostrar traducción si existe
    if (wordOfDay.translation) {
        document.getElementById('translation').textContent = wordOfDay.translation;
    } else {
        document.getElementById('translation').style.display = 'none';
    }
    
    // Actualizar botón de favoritos
    updateHeartButton();
    updateFavoritesList();
    
    // Dibujar constelación
    drawConstellation();
    
    // Verificar días especiales
    checkSpecialDay();
});

// Redimensionar canvas
window.addEventListener('resize', drawConstellation);

// Cerrar modal al hacer click fuera
document.getElementById('definitionModal').addEventListener('click', (e) => {
    if (e.target.id === 'definitionModal') {
        closeDefinition();
    }
});
