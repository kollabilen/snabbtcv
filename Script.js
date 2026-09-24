// 1. القاموس للغتين السويدية والإنجليزية (I18n Dictionary)
const translations = {
    sv: {
        tab_personal: "Personuppgifter",
        tab_experience: "Arbetslivserfarenhet",
        tab_skills: "Utbildning & Färdigheter",
        title_personal: "Personuppgifter",
        lbl_name: "Fullständigt namn",
        lbl_title: "Yrkesroll",
        lbl_email: "E-postadress",
        lbl_phone: "Telefonnummer",
        lbl_summary: "Profiltext",
        title_experience: "Arbetslivserfarenhet",
        lbl_company: "Företag / Arbetsgivare",
        lbl_desc: "Beskrivning & Ansvarsområden",
        title_skills: "Utbildning & Färdigheter",
        lbl_education: "Utbildning",
        lbl_skills: "Färdigheter (separera med kommatecken)",
        btn_next: "Nästa ➔",
        btn_prev: "⬅ Föregående",
        preview_profile: "Profil",
        preview_experience: "Arbetslivserfarenhet",
        preview_education: "Utbildning",
        preview_skills: "Färdigheter",
        dl_btn: "Ladda ner PDF 📥"
    },
    en: {
        tab_personal: "Personal Info",
        tab_experience: "Work Experience",
        tab_skills: "Education & Skills",
        title_personal: "Personal Details",
        lbl_name: "Full Name",
        lbl_title: "Job Title",
        lbl_email: "Email Address",
        lbl_phone: "Phone Number",
        lbl_summary: "Professional Summary",
        title_experience: "Work Experience",
        lbl_company: "Company / Employer",
        lbl_desc: "Description & Responsibilities",
        title_skills: "Education & Skills",
        lbl_education: "Education",
        lbl_skills: "Skills (comma separated)",
        btn_next: "Next ➔",
        btn_prev: "⬅ Previous",
        preview_profile: "Profile",
        preview_experience: "Work Experience",
        preview_education: "Education",
        preview_skills: "Skills",
        dl_btn: "Download PDF 📥"
    }
};

// تغيير لغة الموقع بالكامل
function changeLanguage(lang) {
    document.querySelectorAll('[data-i18n]').forEach(element => {
        const key = element.getAttribute('data-i18n');
        if (translations[lang][key]) {
            element.innerText = translations[lang][key];
        }
    });
}

// 2. التنقل بين الخطوات الثلاث
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

// 3. المزامنة المباشرة للمعاينة (Live Preview Sync)
const inputs = [
    { inputId: 'input-name', previewId: 'preview-name', defaultValue: 'Anna Karlsson' },
    { inputId: 'input-title', previewId: 'preview-title', defaultValue: 'Systemutvecklare' },
    { inputId: 'input-email', previewId: 'preview-email', defaultValue: 'anna@example.se' },
    { inputId: 'input-phone', previewId: 'preview-phone', defaultValue: '070 123 45 67' },
    { inputId: 'input-summary', previewId: 'preview-summary', defaultValue: 'Erfaren och engagerad utvecklare...' },
    { inputId: 'input-company', previewId: 'preview-company', defaultValue: 'Företag AB' },
    { inputId: 'input-experience', previewId: 'preview-experience', defaultValue: '• Utvecklade webbapplikationer\n• Arbetade i ett agilt team' },
    { inputId: 'input-education', previewId: 'preview-education', defaultValue: 'Kandidatexamen i Datavetenskap' }
];

inputs.forEach(item => {
    const inputElement = document.getElementById(item.inputId);
    const previewElement = document.getElementById(item.previewId);

    inputElement.addEventListener('input', (e) => {
        previewElement.innerText = e.target.value.trim() !== '' ? e.target.value : item.defaultValue;
    });
});

// معالجة المهارات (Skills)
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

// 4. توليد وتحميل PDF
document.getElementById('download-btn').addEventListener('click', () => {
    const element = document.getElementById('cv-preview');
    
    const opt = {
        margin:       0,
        filename:     'mitt-cv.pdf',
        image:        { type: 'jpeg', quality: 0.98 },
        html2canvas:  { scale: 2, useCORS: true },
        jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    html2pdf().set(opt).from(element).save();
});
