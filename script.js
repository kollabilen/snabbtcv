import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { 
    getAuth, 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword, 
    signOut, 
    onAuthStateChanged 
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { 
    getFirestore, 
    doc, 
    setDoc, 
    getDoc 
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

// ⚠️ مفاتيح مشروعك في Firebase
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

let currentUser = null;
let isSignUpMode = false;

// تحديث المعاينة الحية
function updatePreview() {
    const firstName = document.getElementById('input-firstname').value;
    const lastName = document.getElementById('input-lastname').value;
    const title = document.getElementById('input-title').value;
    const email = document.getElementById('input-email').value;
    const phone = document.getElementById('input-phone').value;
    const address = document.getElementById('input-address').value;
    const zip = document.getElementById('input-zip').value;
    const city = document.getElementById('input-city').value;
    const dob = document.getElementById('input-dob').value;
    const website = document.getElementById('input-website').value;
    const korkort = document.getElementById('input-korkort').value;
    const truckkort = document.getElementById('input-truckkort').value;
    const summary = document.getElementById('input-summary').value;
    const skills = document.getElementById('input-skills').value;
    const languages = document.getElementById('input-languages').value;
    const references = document.getElementById('input-references').value;

    // الاسم والعنوان
    document.getElementById('preview-name').textContent = `${firstName} ${lastName}`.trim();
    document.getElementById('preview-title').textContent = title;

    // الاتصال والمعلومات الشخصية
    const contactParts = [];
    if (email) contactParts.push(`📧 ${email}`);
    if (phone) contactParts.push(`📞 ${phone}`);
    if (address || city) contactParts.push(`📍 ${[address, zip, city].filter(Boolean).join(', ')}`);
    if (dob) contactParts.push(`🗓️ ${dob}`);
    if (website) contactParts.push(`🔗 ${website}`);
    if (korkort) contactParts.push(`🚗 Körkort: ${korkort}`);
    if (truckkort) contactParts.push(`🚜 Truckkort: ${truckkort}`);
    
    document.getElementById('preview-contact').innerHTML = contactParts.map(p => `<span>${p}</span>`).join(' • ');

    // Profil
    const summarySec = document.getElementById('preview-summary-section');
    if (summary.trim()) {
        summarySec.classList.remove('hidden');
        document.getElementById('preview-summary').textContent = summary;
    } else {
        summarySec.classList.add('hidden');
    }

    // Skills & Languages
    const skillsSec = document.getElementById('preview-skills-section');
    const skillsContainer = document.getElementById('preview-skills-container');
    const langContainer = document.getElementById('preview-languages-container');

    if (skills.trim() || languages.trim()) {
        skillsSec.classList.remove('hidden');
        if (skills.trim()) {
            skillsContainer.classList.remove('hidden');
            document.getElementById('preview-skills').textContent = skills;
        } else {
            skillsContainer.classList.add('hidden');
        }

        if (languages.trim()) {
            langContainer.classList.remove('hidden');
            document.getElementById('preview-languages').textContent = languages;
        } else {
            langContainer.classList.add('hidden');
        }
    } else {
        skillsSec.classList.add('hidden');
    }

    // Referenser
    const refsSec = document.getElementById('preview-refs-section');
    if (references.trim()) {
        refsSec.classList.remove('hidden');
        document.getElementById('preview-references').textContent = references;
    } else {
        refsSec.classList.add('hidden');
    }

    // Update Work & Education List
    updateWorkPreview();
    updateEduPreview();
}

// استماع لإدخال النصوص
document.querySelectorAll('.cv-input').forEach(input => {
    input.addEventListener('input', updatePreview);
});

// إدارة الخبرة العملية
const workList = document.getElementById('work-list');
const addWorkBtn = document.getElementById('add-work-btn');

addWorkBtn.addEventListener('click', () => {
    const div = document.createElement('div');
    div.className = 'work-item border border-slate-100 bg-slate-50 p-3 rounded-lg space-y-2 relative';
    div.innerHTML = `
        <button class="remove-btn absolute top-2 right-2 text-red-500 font-bold text-xs hover:text-red-700">✕</button>
        <div class="grid grid-cols-2 gap-2">
            <input type="text" placeholder="Titel / Roll" class="work-title border p-1.5 rounded text-xs w-full">
            <input type="text" placeholder="Arbetsgivare / Företag" class="work-company border p-1.5 rounded text-xs w-full">
        </div>
        <div class="grid grid-cols-2 gap-2">
            <input type="text" placeholder="Period (t.ex. 2020 - Present)" class="work-period border p-1.5 rounded text-xs w-full">
            <input type="text" placeholder="Ort" class="work-city border p-1.5 rounded text-xs w-full">
        </div>
        <textarea placeholder="Beskrivning av dina arbetsuppgifter..." rows="2" class="work-desc border p-1.5 rounded text-xs w-full resize-none"></textarea>
    `;

    div.querySelectorAll('input, textarea').forEach(i => i.addEventListener('input', updatePreview));
    div.querySelector('.remove-btn').addEventListener('click', () => {
        div.remove();
        updatePreview();
    });

    workList.appendChild(div);
});

function updateWorkPreview() {
    const previewList = document.getElementById('preview-work-list');
    const workSec = document.getElementById('preview-work-section');
    previewList.innerHTML = '';

    const items = document.querySelectorAll('.work-item');
    if (items.length === 0) {
        workSec.classList.add('hidden');
        return;
    }

    let hasData = false;
    items.forEach(item => {
        const title = item.querySelector('.work-title').value;
        const company = item.querySelector('.work-company').value;
        const period = item.querySelector('.work-period').value;
        const city = item.querySelector('.work-city').value;
        const desc = item.querySelector('.work-desc').value;

        if (title || company) {
            hasData = true;
            const el = document.createElement('div');
            el.className = 'space-y-0.5';
            el.innerHTML = `
                <div class="flex justify-between items-baseline">
                    <span class="font-bold text-slate-800 text-xs">${title} ${company ? '— ' + company : ''}</span>
                    <span class="text-[10px] text-slate-400">${period} ${city ? '| ' + city : ''}</span>
                </div>
                <p class="text-xs text-slate-600 leading-relaxed">${desc}</p>
            `;
            previewList.appendChild(el);
        }
    });

    if (hasData) workSec.classList.remove('hidden');
    else workSec.classList.add('hidden');
}

// إدارة التعليم
const eduList = document.getElementById('edu-list');
const addEduBtn = document.getElementById('add-edu-btn');

addEduBtn.addEventListener('click', () => {
    const div = document.createElement('div');
    div.className = 'edu-item border border-slate-100 bg-slate-50 p-3 rounded-lg space-y-2 relative';
    div.innerHTML = `
        <button class="remove-btn absolute top-2 right-2 text-red-500 font-bold text-xs hover:text-red-700">✕</button>
        <div class="grid grid-cols-2 gap-2">
            <input type="text" placeholder="Examensbevis / Utbildning" class="edu-degree border p-1.5 rounded text-xs w-full">
            <input type="text" placeholder="Skola / Skolnamn" class="edu-school border p-1.5 rounded text-xs w-full">
        </div>
        <div class="grid grid-cols-2 gap-2">
            <input type="text" placeholder="Period (t.ex. 2016 - 2019)" class="edu-period border p-1.5 rounded text-xs w-full">
            <input type="text" placeholder="Ort" class="edu-city border p-1.5 rounded text-xs w-full">
        </div>
    `;

    div.querySelectorAll('input').forEach(i => i.addEventListener('input', updatePreview));
    div.querySelector('.remove-btn').addEventListener('click', () => {
        div.remove();
        updatePreview();
    });

    eduList.appendChild(div);
});

function updateEduPreview() {
    const previewList = document.getElementById('preview-edu-list');
    const eduSec = document.getElementById('preview-edu-section');
    previewList.innerHTML = '';

    const items = document.querySelectorAll('.edu-item');
    if (items.length === 0) {
        eduSec.classList.add('hidden');
        return;
    }

    let hasData = false;
    items.forEach(item => {
        const degree = item.querySelector('.edu-degree').value;
        const school = item.querySelector('.edu-school').value;
        const period = item.querySelector('.edu-period').value;
        const city = item.querySelector('.edu-city').value;

        if (degree || school) {
            hasData = true;
            const el = document.createElement('div');
            el.className = 'space-y-0.5';
            el.innerHTML = `
                <div class="flex justify-between items-baseline">
                    <span class="font-bold text-slate-800 text-xs">${degree} ${school ? '— ' + school : ''}</span>
                    <span class="text-[10px] text-slate-400">${period} ${city ? '| ' + city : ''}</span>
                </div>
            `;
            previewList.appendChild(el);
        }
    });

    if (hasData) eduSec.classList.remove('hidden');
    else eduSec.classList.add('hidden');
}

// تحميل PDF
document.getElementById('download-pdf-btn').addEventListener('click', () => {
    const element = document.getElementById('cv-preview');
    const opt = {
        margin:       0.5,
        filename:     'mitt-cv.pdf',
        image:        { type: 'jpeg', quality: 0.98 },
        html2canvas:  { scale: 2 },
        jsPDF:        { unit: 'in', format: 'a4', orientation: 'portrait' }
    };
    html2pdf().set(opt).from(element).save();
});

// Firebase Auth & Modal Controls
const authBtn = document.getElementById('auth-btn');
const saveCvBtn = document.getElementById('save-cv-btn');
const authModal = document.getElementById('auth-modal');
const closeModalBtn = document.getElementById('close-modal-btn');
const authForm = document.getElementById('auth-form');
const toggleAuthMode = document.getElementById('toggle-auth-mode');
const modalTitle = document.getElementById('modal-title');
const authSubmitBtn = document.getElementById('auth-submit-btn');

authBtn.addEventListener('click', () => {
    if (currentUser) {
        signOut(auth);
    } else {
        authModal.classList.remove('hidden');
    }
});

closeModalBtn.addEventListener('click', () => authModal.classList.add('hidden'));

toggleAuthMode.addEventListener('click', () => {
    isSignUpMode = !isSignUpMode;
    modalTitle.textContent = isSignUpMode ? 'Skapa konto' : 'Logga in';
    authSubmitBtn.textContent = isSignUpMode ? 'Registrera' : 'Logga in';
    toggleAuthMode.textContent = isSignUpMode ? 'Har du redan ett konto? Logga in' : 'Skapa ett konto?';
});

authForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('auth-email').value;
    const password = document.getElementById('auth-password').value;

    try {
        if (isSignUpMode) {
            await createUserWithEmailAndPassword(auth, email, password);
            alert('Konto skapat!');
        } else {
            await signInWithEmailAndPassword(auth, email, password);
        }
        authModal.classList.add('hidden');
    } catch (error) {
        alert('Fel: ' + error.message);
    }
});

onAuthStateChanged(auth, async (user) => {
    currentUser = user;
    if (user) {
        authBtn.textContent = 'Logga ut';
        saveCvBtn.classList.remove('hidden');
    } else {
        authBtn.textContent = 'Logga in';
        saveCvBtn.classList.add('hidden');
    }
});
