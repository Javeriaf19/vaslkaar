/* ============================================
   VASLKAAR — Design DNA Module
   Style profile setup + DNA card rendering
   ============================================ */

// ---- DNA Form Init ---- //
document.addEventListener('DOMContentLoaded', () => {
  // Aesthetic tag chip toggle
  document.querySelectorAll('.tag-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      chip.classList.toggle('selected');
    });
  });

  // DNA upload zone
  const dnaZone = document.getElementById('dna-upload-zone');
  const dnaInput = document.getElementById('dna-file-input');

  if (dnaZone && dnaInput) {
    dnaZone.addEventListener('click', () => dnaInput.click());
    dnaZone.addEventListener('dragover', (e) => {
      e.preventDefault();
      dnaZone.classList.add('drag-over');
    });
    dnaZone.addEventListener('dragleave', () => {
      dnaZone.classList.remove('drag-over');
    });
    dnaZone.addEventListener('drop', (e) => {
      e.preventDefault();
      dnaZone.classList.remove('drag-over');
      handleDnaFiles(e.dataTransfer.files);
    });
    dnaInput.addEventListener('change', (e) => {
      handleDnaFiles(e.target.files);
    });
  }

  // DNA form submit
  const dnaForm = document.getElementById('dna-form');
  if (dnaForm) {
    dnaForm.addEventListener('submit', (e) => {
      e.preventDefault();
      submitDnaForm();
    });
  }
});

// DNA sample images storage (temp, before save)
let dnaSampleImages = [];

function handleDnaFiles(files) {
  const maxFiles = 5;
  const fileArray = Array.from(files).slice(0, maxFiles - dnaSampleImages.length);

  fileArray.forEach(file => {
    if (!file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      dnaSampleImages.push(e.target.result);
      renderDnaPreview();
    };
    reader.readAsDataURL(file);
  });
}

function renderDnaPreview() {
  const grid = document.getElementById('dna-preview-grid');
  if (!grid) return;

  grid.innerHTML = dnaSampleImages.map((src, i) => `
    <div class="preview-img">
      <img src="${src}" alt="Sample ${i + 1}" />
      <button class="remove-btn" onclick="removeDnaSample(${i})" type="button">×</button>
    </div>
  `).join('');
}

function removeDnaSample(index) {
  dnaSampleImages.splice(index, 1);
  renderDnaPreview();
}

function submitDnaForm() {
  // Gather selected aesthetics
  const selectedTags = [];
  document.querySelectorAll('.tag-chip.selected').forEach(chip => {
    selectedTags.push(chip.dataset.tag);
  });

  const inspirations = document.getElementById('dna-inspirations')?.value?.trim() || '';
  const description = document.getElementById('dna-description')?.value?.trim() || '';

  // Build DNA profile
  const dnaProfile = {
    aesthetics: selectedTags,
    inspirations: inspirations,
    description: description,
    sampleImages: dnaSampleImages.slice(0, 3), // Store max 3 thumbnails to save space
    createdAt: new Date().toISOString(),
  };

  // Save
  saveDNA(dnaProfile);

  // Navigate to dashboard
  navigateTo('dashboard');
  showToast('Design DNA saved! ✨');
}

// ---- DNA Card Rendering (Settings page) ---- //
function renderDnaCard() {
  const dna = getDNA();
  const card = document.getElementById('dna-card');
  const cardEmpty = document.getElementById('dna-card-empty');
  const editBtn = document.getElementById('dna-edit-btn');

  if (!dna || (!dna.aesthetics.length && !dna.inspirations && !dna.description)) {
    // No DNA — show empty state
    if (card) card.classList.add('hidden');
    if (cardEmpty) cardEmpty.classList.remove('hidden');
    if (editBtn) editBtn.classList.add('hidden');
    return;
  }

  // Show DNA card
  if (card) card.classList.remove('hidden');
  if (cardEmpty) cardEmpty.classList.add('hidden');
  if (editBtn) editBtn.classList.remove('hidden');

  // Fill in values
  const aestheticEl = document.getElementById('dna-card-aesthetic');
  const inspirationsEl = document.getElementById('dna-card-inspirations');
  const styleEl = document.getElementById('dna-card-style');

  if (aestheticEl) aestheticEl.textContent = dna.aesthetics.join(', ') || 'Not set';
  if (inspirationsEl) inspirationsEl.textContent = dna.inspirations || 'Not set';
  if (styleEl) styleEl.textContent = dna.description || 'No description added';
}
