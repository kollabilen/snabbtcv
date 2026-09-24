const translations = {
    sv: {
        tab_personal: "Personuppgifter",
        tab_experience: "Erfarenhet",
        tab_skills: "Kompetenser",
        title_personal: "Personuppgifter",
        lbl_photo: "Profilbild (Valfritt)",
        lbl_name: "Namn",
        lbl_title: "Yrkesroll / Titel",
        lbl_email: "E-post",
        lbl_phone: "Telefon",
        lbl_korkort: "Körkort",
        lbl_truckkort: "Truckkort",
        lbl_summary: "Profil / Om mig",
        title_experience: "Arbetslivserfarenhet",
        btn_add_exp: "Lägg till erfarenhet",
        title_skills: "Utbildning & Kompetenser",
        btn_add_edu: "Lägg till utbildning",
        lbl_skills: "Färdigheter / Datorkunskaper",
        lbl_languages: "Språk",
        btn_next: "Nästa ➔",
        btn_prev: "⬅ Föregående",
        preview_profile: "Profil",
        preview_experience: "Arbetslivserfarenhet",
        preview_education: "Utbildning",
        preview_skills: "Kompetenser",
        preview_languages: "Språk",
        preview_references: "Referenser lämnas gärna på begäran.",
        dl_btn: "Ladda ner PDF"
    },
    en: {
        tab_personal: "Personal Info",
        tab_experience: "Experience",
        tab_skills: "Skills",
        title_personal: "Personal Details",
        lbl_photo: "Profile Picture (Optional)",
        lbl_name: "Full Name",
        lbl_title: "Job Title",
        lbl_email: "Email",
        lbl_phone: "Phone",
        lbl_korkort: "Driver's License",
        lbl_truckkort: "Forklift License",
        lbl_summary: "Profile / Summary",
        title_experience: "Work Experience",
        btn_add_exp: "Add Experience",
        title_skills: "Education & Skills",
        btn_add_edu: "Add Education",
        lbl_skills: "Skills",
        lbl_languages: "Languages",
        btn_next: "Next ➔",
        btn_prev: "⬅ Previous",
        preview_profile: "Profile",
        preview_experience: "Work Experience",
        preview_education: "Education",
        preview_skills: "Skills",
        preview_languages: "Languages",
        preview_references: "References available upon request.",
        dl_btn: "Download PDF"
    }
};

let currentLang = 'sv';

function changeLanguage(lang) {
    currentLang = lang;
    document.querySelectorAll('[data-i18n]').forEach(element => {
        const key = element.getAttribute('data-i18n');
        if (translations[lang][key]) {
            element.innerText = translations[lang][key];
        }
    });
}

function showStep(stepNumber) {
    document.getElementById('step-1').classList.add('hidden');
    document.getElementById('step-2').classList.add('hidden');
    document.getElementById('step-3').classList.add('hidden');

    [1, 2, 3].forEach(i => {
        document.getElementById(`step-tab-${i}`).className = "text-gray-400 pb-1";
    });

    document.getElementById(`step-${stepNumber}`).classList.remove('hidden');
    document.getElementById(`step-tab-${stepNumber}`).className = "text-blue-600 border-b-2 border-blue-600 pb-1 font-semibold";
}

// Photo Upload
document.getElementById('input-photo').addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(event) {
            document.getElementById('preview-photo').src = event.target.result;
            document.getElementById('photo-container').classList.remove('hidden');
        };
        reader.readAsDataURL(file);
    }
});

// Sync Basic Input Fields
const simpleInputs = [
    { id: 'input-name', target: 'preview-name' },
    { id: 'input-title', target: 'preview-title' },
    { id: 'input-email', target: 'preview-email' },
    { id: 'input-phone', target: 'preview-phone' }
];

simpleInputs.forEach(item => {
    document.getElementById(item.id).addEventListener('input', (e) => {
        document.getElementById(item.target).innerText = e.target.value.trim();
    });
});

// Summary
document.getElementById('input-summary').addEventListener('input', (e) => {
    const val = e.target.value.trim();
    const sec = document.getElementById('sec-summary');
    if (val) {
        document.getElementById('preview-summary').innerText = val;
        sec.classList.remove('hidden');
    } else {
        sec.classList.add('hidden');
    }
});

// Licenses Check
function checkLicenses() {
    const kor = document.getElementById('input-korkort').value.trim();
    const truck = document.getElementById('input-truckkort').value.trim();
    const sec = document.getElementById('sec-licenses');

    if (kor || truck) sec.classList.remove('hidden');
    else sec.classList.add('hidden');
}

document.getElementById('input-korkort').addEventListener('input', (e) => {
    const val = e.target.value.trim();
    const container = document.getElementById('preview-korkort-container');
    if (val) {
        document.getElementById('preview-korkort').innerText = val;
        container.classList.remove('hidden');
    } else {
        container.classList.add('hidden');
    }
    checkLicenses();
});

document.getElementById('input-truckkort').addEventListener('input', (e) => {
    const val = e.target.value.trim();
    const container = document.getElementById('preview-truckkort-container');
    if (val) {
        document.getElementById('preview-truckkort').innerText = val;
        container.classList.remove('hidden');
    } else {
        container.classList.add('hidden');
    }
    checkLicenses();
});

// Dynamic Experiences
let expCount = 0;
function addExperienceField() {
    expCount++;
    const id = expCount;
    const container = document.getElementById('experience-list');
    
    const div = document.createElement('div');
    div.id = `exp-item-${id}`;
    div.className = "p-2.5 border border-gray-200 rounded-lg space-y-2 relative bg-gray-50";
    div.innerHTML = `
        <button type="button" onclick="removeExperienceField(${id})" class="absolute top-2 right-2 text-red-500 hover:text-red-700 text-xs font-bold">✕ Ta bort</button>
        <input type="text" id="exp-title-${id}" oninput="renderExperiences()" class="w-full border border-gray-200 rounded p-1.5 text-xs" placeholder="Företag & Roll (t.ex. Volvo - Montör)">
        <input type="text" id="exp-date-${id}" oninput="renderExperiences()" class="w-full border border-gray-200 rounded p-1.5 text-xs" placeholder="Tidsperiod (t.ex. 2020 - Nuvarande)">
        <textarea id="exp-desc-${id}" oninput="renderExperiences()" rows="2" class="w-full border border-gray-200 rounded p-1.5 text-xs" placeholder="Arbetsuppgifter..."></textarea>
    `;
    container.appendChild(div);
}

function removeExperienceField(id) {
    const item = document.getElementById(`exp-item-${id}`);
    if (item) item.remove();
    renderExperiences();
}

function renderExperiences() {
    const previewContainer = document.getElementById('preview-experience-list');
    const sec = document.getElementById('sec-experience');
    previewContainer.innerHTML = '';

    const items = document.querySelectorAll('#experience-list > div');
    let hasContent = false;

    items.forEach(item => {
        const id = item.id.replace('exp-item-', '');
        const title = document.getElementById(`exp-title-${id}`).value.trim();
        const date = document.getElementById(`exp-date-${id}`).value.trim();
        const desc = document.getElementById(`exp-desc-${id}`).value.trim();

        if (title || desc) {
            hasContent = true;
            const expDiv = document.createElement('div');
            expDiv.innerHTML = `
                <div class="flex justify-between items-baseline">
                    <h4 class="font-bold text-xs text-slate-800">${title}</h4>
                    <span class="text-[10px] font-semibold text-slate-500">${date}</span>
                </div>
                <p class="text-xs text-gray-600 whitespace-pre-line mt-0.5">${desc}</p>
            `;
            previewContainer.appendChild(expDiv);
        }
    });

    if (hasContent) sec.classList.remove('hidden');
    else sec.classList.add('hidden');
}

// Dynamic Education
let eduCount = 0;
function addEducationField() {
    eduCount++;
    const id = eduCount;
    const container = document.getElementById('education-list');

    const div = document.createElement('div');
    div.id = `edu-item-${id}`;
    div.className = "p-2.5 border border-gray-200 rounded-lg space-y-2 relative bg-gray-50";
    div.innerHTML = `
        <button type="button" onclick="removeEducationField(${id})" class="absolute top-2 right-2 text-red-500 hover:text-red-700 text-xs font-bold">✕ Ta bort</button>
        <input type="text" id="edu-title-${id}" oninput="renderEducations()" class="w-full border border-gray-200 rounded p-1.5 text-xs" placeholder="Utbildning / Examen">
        <input type="text" id="edu-school-${id}" oninput="renderEducations()" class="w-full border border-gray-200 rounded p-1.5 text-xs" placeholder="Skola / Ort & År">
    `;
    container.appendChild(div);
}

function removeEducationField(id) {
    const item = document.getElementById(`edu-item-${id}`);
    if (item) item.remove();
    renderEducations();
}

function renderEducations() {
    const previewContainer = document.getElementById('preview-education-list');
    const sec = document.getElementById('sec-education');
    previewContainer.innerHTML = '';

    const items = document.querySelectorAll('#education-list > div');
    let hasContent = false;

    items.forEach(item => {
        const id = item.id.replace('edu-item-', '');
        const title = document.getElementById(`edu-title-${id}`).value.trim();
        const school = document.getElementById(`edu-school-${id}`).value.trim();

        if (title || school) {
            hasContent = true;
            const eduDiv = document.createElement('div');
            eduDiv.innerHTML = `
                <h4 class="font-bold text-xs text-slate-800">${title}</h4>
                <p class="text-xs text-gray-500">${school}</p>
            `;
            previewContainer.appendChild(eduDiv);
        }
    });

    if (hasContent) sec.classList.remove('hidden');
    else sec.classList.add('hidden');
}

// Skills Sync
document.getElementById('input-skills').addEventListener('input', (e) => {
    const val = e.target.value.trim();
    const sec = document.getElementById('sec-skills');
    const container = document.getElementById('preview-skills');
    
    if (val) {
        const skills = val.split(',').filter(s => s.trim() !== '');
        container.innerHTML = skills.map(s => `<span>• ${s.trim()}</span>`).join('');
        sec.classList.remove('hidden');
    } else {
        sec.classList.add('hidden');
    }
});

// Languages Sync
document.getElementById('input-languages').addEventListener('input', (e) => {
    const val = e.target.value.trim();
    const sec = document.getElementById('sec-languages');
    if (val) {
        document.getElementById('preview-languages').innerText = val;
        sec.classList.remove('hidden');
    } else {
        sec.classList.add('hidden');
    }
});

// Initialize First Entry Fields
addExperienceField();
addEducationField();

// Download PDF
document.getElementById('download-btn').addEventListener('click', () => {
    const element = document.getElementById('cv-preview');
    const opt = {
        margin:       0,
        filename:     'Mitt-CV.pdf',
        image:        { type: 'jpeg', quality: 0.98 },
        html2canvas:  { scale: 2, useCORS: true },
        jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };
    html2pdf().set(opt).from(element).save();
});
