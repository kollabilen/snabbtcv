document.addEventListener('DOMContentLoaded', () => {

    // --- 1. Steg-navigering (Step Navigation) ---
    const steps = document.querySelectorAll('.form-step');
    const nextBtns = document.querySelectorAll('.btn-next');
    const prevBtns = document.querySelectorAll('.btn-prev');
    const navItems = document.querySelectorAll('.step-item');

    let currentStep = 0;

    function updateStep(stepIndex) {
        steps.forEach((step, index) => {
            step.classList.toggle('active', index === stepIndex);
        });
        navItems.forEach((item, index) => {
            item.classList.toggle('active', index === stepIndex);
        });
    }

    nextBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            if (currentStep < steps.length - 1) {
                currentStep++;
                updateStep(currentStep);
            }
        });
    });

    prevBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            if (currentStep > 0) {
                currentStep--;
                updateStep(currentStep);
            }
        });
    });

    // --- 2. Realtidsuppdatering (Real-time Preview Update) ---
    const inputs = {
        name: document.getElementById('input-name'),
        title: document.getElementById('input-title'),
        email: document.getElementById('input-email'),
        phone: document.getElementById('input-phone'),
        korkort: document.getElementById('input-korkort'),
        truckkort: document.getElementById('input-truckkort'),
        about: document.getElementById('input-about')
    };

    const preview = {
        name: document.getElementById('preview-name'),
        title: document.getElementById('preview-title'),
        email: document.getElementById('preview-email'),
        phone: document.getElementById('preview-phone'),
        korkort: document.getElementById('preview-korkort'),
        truckkort: document.getElementById('preview-truckkort'),
        about: document.getElementById('preview-about')
    };

    // Uppdatera personuppgifter
    inputs.name?.addEventListener('input', (e) => {
        preview.name.textContent = e.target.value || 'FÖRNAMN EFTERNAMN';
    });

    inputs.title?.addEventListener('input', (e) => {
        preview.title.textContent = e.target.value || 'YRKESTITEL';
    });

    inputs.email?.addEventListener('input', (e) => {
        preview.email.textContent = e.target.value || 'din.e-post@exempel.se';
    });

    inputs.phone?.addEventListener('input', (e) => {
        preview.phone.textContent = e.target.value || '070 123 45 67';
    });

    inputs.korkort?.addEventListener('input', (e) => {
        preview.korkort.textContent = e.target.value || 'B-körkort';
    });

    inputs.truckkort?.addEventListener('input', (e) => {
        preview.truckkort.textContent = e.target.value || 'A1-A4, B1-B4';
    });

    inputs.about?.addEventListener('input', (e) => {
        preview.about.textContent = e.target.value || 'Kort beskrivning om dig själv...';
    });

    // Profilbild uppladdning
    const imageInput = document.getElementById('input-photo');
    const previewPhoto = document.getElementById('preview-photo');

    imageInput?.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(event) {
                previewPhoto.src = event.target.result;
                previewPhoto.style.display = 'block';
            };
            reader.readAsDataURL(file);
        }
    });

    // --- 3. Dynamiska sektioner (Erfarenheter & Kompetenser) ---
    
    // Lägg till Arbetslivserfarenhet
    const expContainer = document.getElementById('experience-inputs');
    const addExpBtn = document.getElementById('add-experience-btn');
    const expPreviewContainer = document.getElementById('preview-experience-list');

    addExpBtn?.addEventListener('click', () => {
        const id = Date.now();
        const expItemHtml = `
            <div class="dynamic-item" data-id="${id}">
                <input type="text" placeholder="Företag" class="exp-company">
                <input type="text" placeholder="Roll / Titel" class="exp-role">
                <input type="text" placeholder="Period (t.ex. 2020 - Nuvarande)" class="exp-period">
                <textarea placeholder="Beskrivning av dina arbetsuppgifter..." class="exp-desc"></textarea>
                <button type="button" class="btn-remove">Ta bort</button>
            </div>
        `;
        expContainer.insertAdjacentHTML('beforeend', expItemHtml);

        // Skapa motsvarande i förhandsgranskningen
        const previewHtml = `
            <div class="cv-item" id="preview-exp-${id}">
                <div class="cv-item-header">
                    <strong class="prev-exp-role">Roll / Titel</strong> — <span class="prev-exp-company">Företag</span>
                    <span class="cv-date prev-exp-period">Period</span>
                </div>
                <p class="prev-exp-desc">Beskrivning...</p>
            </div>
        `;
        expPreviewContainer.insertAdjacentHTML('beforeend', previewHtml);

        // Koppla händelser
        const currentItem = expContainer.querySelector(`[data-id="${id}"]`);
        const currentPreview = expPreviewContainer.querySelector(`#preview-exp-${id}`);

        currentItem.querySelector('.exp-company').addEventListener('input', (e) => {
            currentPreview.querySelector('.prev-exp-company').textContent = e.target.value || 'Företag';
        });
        currentItem.querySelector('.exp-role').addEventListener('input', (e) => {
            currentPreview.querySelector('.prev-exp-role').textContent = e.target.value || 'Roll / Titel';
        });
        currentItem.querySelector('.exp-period').addEventListener('input', (e) => {
            currentPreview.querySelector('.prev-exp-period').textContent = e.target.value || 'Period';
        });
        currentItem.querySelector('.exp-desc').addEventListener('input', (e) => {
            currentPreview.querySelector('.prev-exp-desc').textContent = e.target.value || 'Beskrivning...';
        });

        currentItem.querySelector('.btn-remove').addEventListener('click', () => {
            currentItem.remove();
            currentPreview.remove();
        });
    });

    // --- 4. Ladda ner PDF med användarens namn (Download PDF with User Name) ---
    const downloadBtn = document.getElementById('download-btn');

    downloadBtn?.addEventListener('click', () => {
        const element = document.getElementById('cv-preview');

        // Hämta namnet från formuläret och rensa bort extra mellanslag
        const userName = inputs.name ? inputs.name.value.trim() : '';

        // Om namnet finns skapas filnamnet som "CV_Förnamn_Efternamn.pdf", annars "Mitt_CV.pdf"
        const formattedName = userName ? userName.replace(/\s+/g, '_') : '';
        const fileName = formattedName ? `CV_${formattedName}.pdf` : 'Mitt_CV.pdf';

        const opt = {
            margin:       0,
            filename:     fileName,
            image:        { type: 'jpeg', quality: 0.98 },
            html2canvas:  { scale: 2, useCORS: true },
            jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' }
        };

        // Generera PDF
        html2pdf().set(opt).from(element).save();
    });

});
