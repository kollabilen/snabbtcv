// Dictionary Translations (Svenska / English)
const translations = {
    sv: {
        tab_personal: "Personuppgifter",
        tab_experience: "Arbetslivserfarenhet",
        tab_skills: "Utbildning & Färdigheter",
        title_personal: "Personuppgifter",
        lbl_photo: "Profilbild",
        lbl_name: "Fullständigt namn",
        lbl_title: "Yrkesroll",
        lbl_email: "E-postadress",
        lbl_phone: "Telefonnummer",
        lbl_driver_license: "Körkort (t.ex. Ja (B))",
        lbl_summary: "Profiltext",
        title_experience: "Arbetslivserfarenhet",
        btn_add_exp: "Lägg till erfarenhet",
        title_skills: "Utbildning & Färdigheter",
        btn_add_edu: "Lägg till utbildning",
        lbl_skills: "Färdigheter (separera med kommatecken)",
        btn_next: "Nästa ➔",
        btn_prev: "⬅ Föregående",
        preview_profile: "Profil",
        preview_experience: "Arbetslivserfarenhet",
        preview_education: "Utbildning",
        preview_skills: "Färdigheter",
        dl_btn: "Ladda ner PDF"
    },
    en: {
        tab_personal: "Personal Info",
        tab_experience: "Work Experience",
        tab_skills: "Education & Skills",
        title_personal: "Personal Details",
        lbl_photo: "Profile Picture",
        lbl_name: "Full Name",
        lbl_title: "Job Title",
        lbl_email: "Email Address",
        lbl_phone: "Phone Number",
        lbl_driver_license: "Driver's License (e.g., Yes (B))",
        lbl_summary: "Professional Summary",
        title_experience: "Work Experience",
        btn_add_exp: "Add Experience",
        title_skills: "Education & Skills",
        btn_add_edu: "Add Education",
        lbl_skills: "Skills (comma separated)",
        btn_next: "Next ➔",
        btn_prev: "⬅ Previous",
        preview_profile: "Profile",
        preview_experience: "Work Experience",
        preview_education: "Education",
        preview_skills: "Skills",
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
        const tab = document.getElementById(`step-tab-${i}`);
        tab.className = "text-gray-400 pb-1";
    });

    document.getElementById(`step-${stepNumber}`).classList.remove('hidden');
    const activeTab = document.getElementById(`step-tab-${stepNumber}`);
    activeTab.className = "font-semibold text-blue-600 border-b-2 border-blue-600 pb-1";
}

// Photo Upload Logic
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

// Single Inputs Sync
const inputs = [
    { inputId: 'input-name', previewId: 'preview-name', defaultValue: 'Anna Karlsson' },
    { inputId: 'input-title', previewId: 'preview-title', defaultValue: 'Systemutvecklare' },
    { inputId: 'input-email', previewId: 'preview-email', defaultValue: 'anna@example.se' },
    { inputId: 'input-phone', previewId: 'preview-phone', defaultValue: '070 123 45 67' },
    { inputId: 'input-summary', previewId: 'preview-summary', defaultValue: 'Erfaren och engagerad utvecklare...' }
];

inputs.forEach(item => {
    document.getElementById(item.inputId).addEventListener('input', (e) => {
        document.getElementById(item.previewId).innerText = e.target.value.trim() !== '' ? e.target.value : item.defaultValue;
    });
});

// Driver's License Input Sync
document.getElementById('input-license').addEventListener('input', (e) => {
    const val = e.target.value.trim();
    const container = document.getElementById('preview-license-container');
    if (val !== '') {
        document.getElementById('preview-license').innerText = val;
        container.classList.remove('hidden');
    } else {
        container.classList.add('hidden');
    }
});

// Dynamic Experiences Logic
let expCount = 0;
function addExperienceField() {
    expCount++;
    const id = expCount;
    const container = document.getElementById('experience-list');
    
    const div = document.createElement('div');
    div.id = `exp-item-${id}`;
    div.className = "p-3 border border-gray-200 rounded-lg space-y-2 relative bg-gray-50";
    div.innerHTML = `
        <button type="button" onclick="removeExperienceField(${id})" class="absolute top-2 right-2 text-red-500 hover:text-red-700 text-xs font-bold">✕ Sätt bort</button>
        <input type="text" id="exp-title-${id}" oninput="renderExperiences()" class="w-full border border-gray-200 rounded p-2 text-sm focus:outline-none" placeholder="Företag & Roll (t.ex. Volvo - Utvecklare)">
        <textarea id="exp-desc-${id}" oninput="renderExperiences()" rows="2" class="w-full border border-gray-200 rounded p-2 text-sm focus:outline-none" placeholder="Beskrivning av dina arbetsuppgifter..."></textarea>
    `;
    container.appendChild(div);
    renderExperiences();
}

function removeExperienceField(id) {
    const item = document.getElementById(`exp-item-${id}`);
    if (item) item.remove();
    renderExperiences();
}

function renderExperiences() {
    const previewContainer = document.getElementById('preview-experience-list');
    previewContainer.innerHTML = '';

    const items = document.querySelectorAll('#experience-list > div');
    if (items.length === 0) {
        previewContainer.innerHTML = '<div><h4 class="font-semibold text-xs text-gray-800">Företag AB</h4><p class="text-xs text-gray-600 whitespace-pre-line mt-0.5">• Utvecklade webbapplikationer.</p></div>';
        return;
    }

    items.forEach(item => {
        const id = item.id.replace('exp-item-', '');
        const title = document.getElementById(`exp-title-${id}`).value;
        const desc = document.getElementById(`exp-desc-${id}`).value;

        if (title || desc) {
            const expDiv = document.createElement('div');
            expDiv.innerHTML = `
                <h4 class="font-semibold text-xs text-gray-800">${title || 'Arbetsplats'}</h4>
                <p class="text-xs text-gray-600 whitespace-pre-line mt-0.5">${desc}</p>
            `;
            previewContainer.appendChild(expDiv);
        }
    });
}

// Dynamic Education Logic
let eduCount = 0;
function addEducationField() {
    eduCount++;
    const id = eduCount;
    const container = document.getElementById('education-list');

    const div = document.createElement('div');
    div.id = `edu-item-${id}`;
    div.className = "p-3 border border-gray-200 rounded-lg space-y-2 relative bg-gray-50";
    div.innerHTML = `
        <button type="button" onclick="removeEducationField(${id})" class="absolute top-2 right-2 text-red-500 hover:text-red-700 text-xs font-bold">✕ Sätt bort</button>
        <input type="text" id="edu-title-${id}" oninput="renderEducations()" class="w-full border border-gray-200 rounded p-2 text-sm focus:outline-none" placeholder="Utbildning & Examen (t.ex. Datavetenskap)">
        <input type="text" id="edu-school-${id}" oninput="renderEducations()" class="w-full border border-gray-200 rounded p-2 text-sm focus:outline-none" placeholder="Skola / Universitet (t.ex. KTH)">
    `;
    container.appendChild(div);
    renderEducations();
}

function removeEducationField(id) {
    const item = document.getElementById(`edu-item-${id}`);
    if (item) item.remove();
    renderEducations();
}

function renderEducations() {
    const previewContainer = document.getElementById('preview-education-list');
    previewContainer.innerHTML = '';

    const items = document.querySelectorAll('#education-list > div');
    if (items.length === 0) {
        previewContainer.innerHTML = '<div><h4 class="font-semibold text-xs text-gray-800">Kandidatexamen</h4><p class="text-xs text-gray-500">Universitet</p></div>';
        return;
    }

    items.forEach(item => {
        const id = item.id.replace('edu-item-', '');
        const title = document.getElementById(`edu-title-${id}`).value;
        const school = document.getElementById(`edu-school-${id}`).value;

        if (title || school) {
            const eduDiv = document.createElement('div');
            eduDiv.innerHTML = `
                <h4 class="font-semibold text-xs text-gray-800">${title || 'Utbildning'}</h4>
                <p class="text-xs text-gray-500">${school}</p>
            `;
            previewContainer.appendChild(eduDiv);
        }
    });
}

// Skills Input Sync
document.getElementById('input-skills').addEventListener('input', (e) => {
    const skillsContainer = document.getElementById('preview-skills');
    const skillsArray = e.target.value.split(',');

    skillsContainer.innerHTML = '';
    
    skillsArray.forEach(skill => {
        if(skill.trim() !== '') {
            const tag = document.createElement('span');
            tag.className = 'bg-slate-100 text-slate-700 text-xs px-2.5 py-1 rounded-md font-medium';
            tag.innerText = skill.trim();
            skillsContainer.appendChild(tag);
        }
    });
});

// Initialize first dynamic fields
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
