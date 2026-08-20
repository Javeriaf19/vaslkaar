/* ============================================
   VASLKAAR — Upload Module
   Project upload form + image handling
   ============================================ */

// Uploaded images for current project
let projectImages = [];

document.addEventListener('DOMContentLoaded', () => {
  const uploadZone = document.getElementById('project-upload-zone');
  const fileInput = document.getElementById('project-file-input');

  if (uploadZone && fileInput) {
    // Click to browse
    uploadZone.addEventListener('click', () => fileInput.click());

    // Drag and drop
    uploadZone.addEventListener('dragover', (e) => {
      e.preventDefault();
      uploadZone.classList.add('drag-over');
    });

    uploadZone.addEventListener('dragleave', () => {
      uploadZone.classList.remove('drag-over');
    });

    uploadZone.addEventListener('drop', (e) => {
      e.preventDefault();
      uploadZone.classList.remove('drag-over');
      handleProjectFiles(e.dataTransfer.files);
    });

    // File input change
    fileInput.addEventListener('change', (e) => {
      handleProjectFiles(e.target.files);
    });
  }

  // Project form submit
  const projectForm = document.getElementById('project-form');
  if (projectForm) {
    projectForm.addEventListener('submit', (e) => {
      e.preventDefault();
      submitProjectForm();
    });
  }
});

function handleProjectFiles(files) {
  const maxFiles = 10;
  const fileArray = Array.from(files).slice(0, maxFiles - projectImages.length);

  fileArray.forEach(file => {
    if (!file.type.startsWith('image/')) return;

    // Resize image before storing to save localStorage space
    resizeImage(file, 800, 600, (dataUrl) => {
      projectImages.push(dataUrl);
      renderProjectPreview();
    });
  });

  // Hide upload error
  const errorEl = document.getElementById('upload-error');
  if (errorEl) errorEl.classList.add('hidden');
}

function resizeImage(file, maxWidth, maxHeight, callback) {
  const reader = new FileReader();
  reader.onload = (e) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      let { width, height } = img;

      // Scale down if needed
      if (width > maxWidth || height > maxHeight) {
        const ratio = Math.min(maxWidth / width, maxHeight / height);
        width = Math.round(width * ratio);
        height = Math.round(height * ratio);
      }

      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, width, height);
      callback(canvas.toDataURL('image/jpeg', 0.8));
    };
    img.src = e.target.result;
  };
  reader.readAsDataURL(file);
}

function renderProjectPreview() {
  const grid = document.getElementById('project-preview-grid');
  if (!grid) return;

  grid.innerHTML = projectImages.map((src, i) => `
    <div class="preview-img">
      <img src="${src}" alt="Screenshot ${i + 1}" />
      <button class="remove-btn" onclick="removeProjectImage(${i})" type="button">×</button>
    </div>
  `).join('');
}

function removeProjectImage(index) {
  projectImages.splice(index, 1);
  renderProjectPreview();
}

function submitProjectForm() {
  // Validate
  let hasError = false;

  if (projectImages.length === 0) {
    const errorEl = document.getElementById('upload-error');
    if (errorEl) errorEl.classList.remove('hidden');
    hasError = true;
  }

  const description = document.getElementById('project-description')?.value?.trim();
  if (!description) {
    const errorEl = document.getElementById('description-error');
    if (errorEl) errorEl.classList.remove('hidden');
    hasError = true;
  }

  if (hasError) return;

  // Gather form data
  const projectName = document.getElementById('project-name')?.value?.trim() || '';
  const clientType = document.getElementById('client-type')?.value || '';

  // Get selected tools
  const tools = [];
  document.querySelectorAll('#tools-grid input:checked').forEach(cb => {
    tools.push(cb.value);
  });

  // Build project data
  const brandName = document.getElementById('brand-name')?.value?.trim() || '';
  if (!brandName) {
    showToast('Please enter the brand / client name');
    return;
  }

  // Extract dominant colors from first image
  const colors = projectImages.length > 0 ? extractDominantColors(projectImages[0]) : [];

  const projectData = {
    name: projectName,
    brandName: brandName,
    clientType: clientType,
    description: description,
    tools: tools,
    images: projectImages,
    imageCount: projectImages.length,
    dominantColors: colors,
  };

  // Store current project for generation
  APP.currentProject = projectData;

  // Start generation
  if (typeof startGeneration === 'function') {
    startGeneration(projectData);
  } else {
    console.error('Generation module not loaded');
    showToast('Generation module not loaded yet');
  }
}

// Reset form for new project
function resetProjectForm() {
  projectImages = [];
  renderProjectPreview();

  const form = document.getElementById('project-form');
  if (form) form.reset();

  // Uncheck all tool checkboxes
  document.querySelectorAll('#tools-grid input').forEach(cb => {
    cb.checked = false;
  });

  // Hide errors
  document.getElementById('upload-error')?.classList.add('hidden');
  document.getElementById('description-error')?.classList.add('hidden');
}
