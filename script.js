let expCount = 0;
let eduCount = 0;
let skillCount = 0;
let langCount = 0;
let hobbyCount = 0;

const months = ["Januari", "Februari", "Mars", "April", "Maj", "Juni", "Juli", "Augusti", "September", "Oktober", "November", "December"];

document.addEventListener("DOMContentLoaded", () => {
    setupBasicListeners();
    addExperienceField();
    addEducationField();
});

// Synkronisera grundläggande information
function setupBasicListeners() {
    const inputs = [
        { id: "input-name", target: "preview-name" },
        { id: "input-title", target: "preview-title" },
        { id: "input-email", target: "preview-email" },
        { id: "input-phone", target: "preview-phone" },
        { id: "input-city", target: "preview-city" }
    ];

    inputs.forEach(item => {
        document.getElementById(item.id)?.addEventListener("input", (e) => {
            document.getElementById(item.target).textContent = e.target.value.trim();
        });
    });

    document.getElementById("input-summary")?.addEventListener("input", (e) => {
        const val = e.target.value.trim();
        document.getElementById("preview-summary").textContent = val;
        toggleSection("sec-summary", val !== "");
    });

    document.getElementById("input-photo")?.addEventListener("change", (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                document.getElementById("preview-photo").src = event.target.result;
                document.getElementById("photo-container").classList.remove("hidden");
            };
            reader.readAsDataURL(file);
        }
    });
}

// Extra dynamiska fält
function addExtraField(label) {
    const container = document.getElementById("extra-fields-container");
    const fieldId = `extra-${Date.now()}`;
    
    const div = document.createElement("div");
    div.className = "flex items-center gap-2";
    div.id = fieldId;
    div.innerHTML = `
        <span class="text-xs font-medium text-gray-500 w-24">${label}:</span>
        <input type="text" oninput="renderExtraFields()" class="extra-val border border-gray-200 rounded p-1 text-xs flex-1" placeholder="Ange ${label}">
        <button onclick="document.getElementById('${fieldId}').remove(); renderExtraFields();" class="text-red-500 text-xs">✕</button>
    `;
    div.dataset.label = label;
    container.appendChild(div);
}

function renderExtraFields() {
    const preview = document.getElementById("preview-extras");
    preview.innerHTML = "";
    document.querySelectorAll("#extra-fields-container > div").forEach(div => {
        const label = div.dataset.label;
        const val = div.querySelector(".extra-val").value.trim();
        if (val) {
            const p = document.createElement("p");
            p.className = "text-[11px] text-slate-300";
            p.textContent = `${label}: ${val}`;
            preview.appendChild(p);
        }
    });
}

// Dynamiska datumalternativ
function getYearOptions() {
    let opts = '<option value="">År</option>';
    const currentYear = new Date().getFullYear();
    for (let i = currentYear; i >= 1970; i--) {
        opts += `<option value="${i}">${i}</option>`;
    }
    return opts;
}

function getMonthOptions() {
    let opts = '<option value="">Månad</option>';
    months.forEach(m => opts += `<option value="${m}">${m}</option>`);
    return opts;
}

// Arbetslivserfarenhet
function addExperienceField() {
    expCount++;
    const id = expCount;
    const container = document.getElementById("experience-list");

    const div = document.createElement("div");
    div.id = `exp-item-${id}`;
    div.className = "p-3 border border-gray-200 rounded-lg bg-gray-50 space-y-2 relative";
    div.innerHTML = `
        <button onclick="removeExp(${id})" class="absolute top-2 right-2 text-red-500 text-xs font-bold">✕</button>
        <div>
            <label class="text-[10px] text-gray-400 font-semibold uppercase">Tjänst</label>
            <input type="text" id="exp-role-${id}" oninput="renderExp()" class="w-full border rounded p-1.5 text-xs">
        </div>
        <div>
            <label class="text-[10px] text-gray-400 font-semibold uppercase">Arbetsgivare</label>
            <input type="text" id="exp-company-${id}" oninput="renderExp()" class="w-full border rounded p-1.5 text-xs">
        </div>
        <div class="grid grid-cols-2 gap-2">
            <div>
                <label class="text-[10px] text-gray-400 font-semibold uppercase">Startdatum</label>
                <div class="flex gap-1">
                    <select id="exp-s-m-${id}" onchange="renderExp()" class="border rounded p-1 text-xs w-1/2">${getMonthOptions()}</select>
                    <select id="exp-s-y-${id}" onchange="renderExp()" class="border rounded p-1 text-xs w-1/2">${getYearOptions()}</select>
                </div>
            </div>
            <div>
                <div class="flex justify-between items-center">
                    <label class="text-[10px] text-gray-400 font-semibold uppercase">Slutdatum</label>
                    <label class="text-[10px] text-blue-600 flex items-center gap-1 cursor-pointer">
                        <input type="checkbox" id="exp-present-${id}" onchange="togglePresent(${id})"> Nutid
                    </label>
                </div>
                <div id="exp-end-container-${id}" class="flex gap-1">
                    <select id="exp-e-m-${id}" onchange="renderExp()" class="border rounded p-1 text-xs w-1/2">${getMonthOptions()}</select>
                    <select id="exp-e-y-${id}" onchange="renderExp()" class="border rounded p-1 text-xs w-1/2">${getYearOptions()}</select>
                </div>
            </div>
        </div>
        <div>
            <label class="text-[10px] text-gray-400 font-semibold uppercase">Beskrivning</label>
            <textarea id="exp-desc-${id}" oninput="renderExp()" rows="2" class="w-full border rounded p-1.5 text-xs" placeholder="Börja skriva här..."></textarea>
        </div>
    `;
    container.appendChild(div);
}

function togglePresent(id) {
    const isPresent = document.getElementById(`exp-present-${id}`).checked;
    const container = document.getElementById(`exp-end-container-${id}`);
    if (isPresent) {
        container.classList.add("hidden");
    } else {
        container.classList.remove("hidden");
    }
    renderExp();
}

function removeExp(id) {
    document.getElementById(`exp-item-${id}`)?.remove();
    renderExp();
}

function renderExp() {
    const preview = document.getElementById("preview-experience-list");
    preview.innerHTML = "";
    let hasData = false;

    document.querySelectorAll("#experience-list > div").forEach(div => {
        const id = div.id.replace("exp-item-", "");
        const role = document.getElementById(`exp-role-${id}`)?.value.trim();
        const company = document.getElementById(`exp-company-${id}`)?.value.trim();
        const sm = document.getElementById(`exp-s-m-${id}`)?.value;
        const sy = document.getElementById(`exp-s-y-${id}`)?.value;
        const isPresent = document.getElementById(`exp-present-${id}`)?.checked;
        const em = document.getElementById(`exp-e-m-${id}`)?.value;
        const ey = document.getElementById(`exp-e-y-${id}`)?.value;
        const desc = document.getElementById(`exp-desc-${id}`)?.value.trim();

        if (role || company) {
            hasData = true;
            const start = `${sm} ${sy}`.trim();
            const end = isPresent ? "Nutid" : `${em} ${ey}`.trim();
            const dateStr = start || end ? `${start} - ${end}` : "";

            const item = document.createElement("div");
            item.innerHTML = `
                <div class="flex justify-between items-baseline">
                    <h4 class="font-bold text-xs text-slate-800">${role}</h4>
                    <span class="text-[10px] text-slate-500">${dateStr}</span>
                </div>
                <p class="text-xs text-blue-600 font-semibold">${company}</p>
                <p class="text-xs text-gray-600 leading-relaxed mt-1 whitespace-pre-line">${desc}</p>
            `;
            preview.appendChild(item);
        }
    });

    toggleSection("sec-experience", hasData);
}

// Utbildning
function addEducationField() {
    eduCount++;
    const id = eduCount;
    const container = document.getElementById("education-list");

    const div = document.createElement("div");
    div.id = `edu-item-${id}`;
    div.className = "p-3 border border-gray-200 rounded-lg bg-gray-50 space-y-2 relative";
    div.innerHTML = `
        <button onclick="document.getElementById('edu-item-${id}').remove(); renderEdu();" class="absolute top-2 right-2 text-red-500 text-xs font-bold">✕</button>
        <input type="text" id="edu-title-${id}" oninput="renderEdu()" placeholder="Utbildning" class="w-full border rounded p-1.5 text-xs">
        <input type="text" id="edu-school-${id}" oninput="renderEdu()" placeholder="Lärosäte / Skola" class="w-full border rounded p-1.5 text-xs">
        <div class="flex gap-1">
            <select id="edu-y-${id}" onchange="renderEdu()" class="border rounded p-1 text-xs w-full">${getYearOptions()}</select>
        </div>
    `;
    container.appendChild(div);
}

function renderEdu() {
    const preview = document.getElementById("preview-education-list");
    preview.innerHTML = "";
    let hasData = false;

    document.querySelectorAll("#education-list > div").forEach(div => {
        const id = div.id.replace("edu-item-", "");
        const title = document.getElementById(`edu-title-${id}`)?.value.trim();
        const school = document.getElementById(`edu-school-${id}`)?.value.trim();
        const year = document.getElementById(`edu-y-${id}`)?.value;

        if (title || school) {
            hasData = true;
            const item = document.createElement("div");
            item.innerHTML = `
                <div class="flex justify-between items-baseline">
                    <h4 class="font-bold text-xs text-slate-800">${title}</h4>
                    <span class="text-[10px] text-slate-500">${year}</span>
                </div>
                <p class="text-xs text-gray-600">${school}</p>
            `;
            preview.appendChild(item);
        }
    });

    toggleSection("sec-education", hasData);
}

// Färdigheter
function addSkillField(name = "", level = "") {
    skillCount++;
    const id = skillCount;
    const container = document.getElementById("skills-list");

    const div = document.createElement("div");
    div.id = `skill-item-${id}`;
    div.className = "flex gap-2 items-center bg-gray-50 p-2 rounded border";
    div.innerHTML = `
        <input type="text" id="skill-name-${id}" value="${name}" oninput="renderSkills()" placeholder="Färdighet" class="border rounded p-1 text-xs flex-1">
        <select id="skill-level-${id}" onchange="renderSkills()" class="border rounded p-1 text-xs text-gray-600">
            <option value="">Gör ett val</option>
            <option value="Nybörjare" ${level==='Nybörjare'?'selected':''}>Nybörjare</option>
            <option value="Medel" ${level==='Medel'?'selected':''}>Medel</option>
            <option value="Avancerad" ${level==='Avancerad'?'selected':''}>Avancerad</option>
            <option value="Expert" ${level==='Expert'?'selected':''}>Expert</option>
        </select>
        <button onclick="document.getElementById('skill-item-${id}').remove(); renderSkills();" class="text-red-500 text-xs">✕</button>
    `;
    container.appendChild(div);
    renderSkills();
}

function addSkillFromTag(skillName) {
    addSkillField(skillName, "Medel");
}

function renderSkills() {
    const preview = document.getElementById("preview-skills-list");
    preview.innerHTML = "";
    let hasData = false;

    document.querySelectorAll("#skills-list > div").forEach(div => {
        const id = div.id.replace("skill-item-", "");
        const name = document.getElementById(`skill-name-${id}`)?.value.trim();
        const level = document.getElementById(`skill-level-${id}`)?.value;

        if (name) {
            hasData = true;
            const p = document.createElement("p");
            p.className = "text-[11px] text-slate-200 flex justify-between";
            p.innerHTML = `<span>• ${name}</span> <span class="text-slate-400 text-[10px]">${level}</span>`;
            preview.appendChild(p);
        }
    });

    toggleSection("sec-skills", hasData);
}

// Språk
function addLangField(name = "", level = "") {
    langCount++;
    const id = langCount;
    const container = document.getElementById("language-list");

    const div = document.createElement("div");
    div.id = `lang-item-${id}`;
    div.className = "flex gap-2 items-center bg-gray-50 p-2 rounded border";
    div.innerHTML = `
        <input type="text" id="lang-name-${id}" value="${name}" oninput="renderLangs()" placeholder="Språk" class="border rounded p-1 text-xs flex-1">
        <select id="lang-level-${id}" onchange="renderLangs()" class="border rounded p-1 text-xs text-gray-600">
            <option value="">Gör ett val</option>
            <option value="Modersmål" ${level==='Modersmål'?'selected':''}>Modersmål</option>
            <option value="Flytande" ${level==='Flytande'?'selected':''}>Flytande</option>
            <option value="God kunskap" ${level==='God kunskap'?'selected':''}>God kunskap</option>
            <option value="Grundläggande" ${level==='Grundläggande'?'selected':''}>Grundläggande</option>
        </select>
        <button onclick="document.getElementById('lang-item-${id}').remove(); renderLangs();" class="text-red-500 text-xs">✕</button>
    `;
    container.appendChild(div);
    renderLangs();
}

function addLangFromTag(langName) {
    addLangField(langName, "Flytande");
}

function renderLangs() {
    const preview = document.getElementById("preview-lang-list");
    preview.innerHTML = "";
    let hasData = false;

    document.querySelectorAll("#language-list > div").forEach(div => {
        const id = div.id.replace("lang-item-", "");
        const name = document.getElementById(`lang-name-${id}`)?.value.trim();
        const level = document.getElementById(`lang-level-${id}`)?.value;

        if (name) {
            hasData = true;
            const p = document.createElement("p");
            p.className = "text-[11px] text-slate-200 flex justify-between";
            p.innerHTML = `<span>${name}</span> <span class="text-slate-400 text-[10px]">${level}</span>`;
            preview.appendChild(p);
        }
    });

    toggleSection("sec-languages", hasData);
}

// Hobbys
function addHobbyField(name = "") {
    hobbyCount++;
    const id = hobbyCount;
    const container = document.getElementById("hobby-list");

    const div = document.createElement("div");
    div.id = `hobby-item-${id}`;
    div.className = "flex gap-2 items-center bg-gray-50 p-1.5 rounded border";
    div.innerHTML = `
        <input type="text" id="hobby-name-${id}" value="${name}" oninput="renderHobbies()" placeholder="Hobby" class="border rounded p-1 text-xs flex-1">
        <button onclick="document.getElementById('hobby-item-${id}').remove(); renderHobbies();" class="text-red-500 text-xs">✕</button>
    `;
    container.appendChild(div);
    renderHobbies();
}

function addHobbyFromTag(hobbyName) {
    addHobbyField(hobbyName);
}

function renderHobbies() {
    const preview = document.getElementById("preview-hobby-list");
    preview.innerHTML = "";
    let hasData = false;

    document.querySelectorAll("#hobby-list > div").forEach(div => {
        const id = div.id.replace("hobby-item-", "");
        const name = document.getElementById(`hobby-name-${id}`)?.value.trim();

        if (name) {
            hasData = true;
            const span = document.createElement("span");
            span.className = "bg-slate-700 text-slate-200 text-[10px] px-2 py-0.5 rounded";
            span.textContent = name;
            preview.appendChild(span);
        }
    });

    toggleSection("sec-hobbies", hasData);
}

// Hjälpfunktioner
function toggleSection(id, show) {
    const el = document.getElementById(id);
    if (el) {
        if (show) el.classList.remove("hidden");
        else el.classList.add("hidden");
    }
}

// Ladda ned PDF
document.getElementById("download-btn")?.addEventListener("click", () => {
    const element = document.getElementById("cv-preview");
    const name = document.getElementById("input-name").value.trim();
    const fileName = name ? `CV_${name.replace(/\s+/g, "_")}.pdf` : "Mitt_CV.pdf";

    const opt = {
        margin: 0,
        filename: fileName,
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { unit: "mm", format: "a4", orientation: "portrait" }
    };
    html2pdf().set(opt).from(element).save();
});
