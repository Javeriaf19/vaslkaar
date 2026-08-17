/* ============================================
   VASLKAAR — Projects Module
   My Projects list + project detail view
   ============================================ */

// ---- Render Projects List ---- //
function renderProjectsList() {
  const grid = document.getElementById('projects-grid');
  const empty = document.getElementById('projects-empty');
  const projects = getProjects();

  if (!grid) return;

  if (projects.length === 0) {
    grid.innerHTML = '';
    if (empty) empty.classList.remove('hidden');
    return;
  }

  if (empty) empty.classList.add('hidden');

  grid.innerHTML = projects.map(project => `
    <div class="project-card" onclick="viewProject('${project.id}')">
      <div class="project-card-thumb" style="background-image: url('${project.thumbnail || ''}'); ${!project.thumbnail ? 'display: flex; align-items: center; justify-content: center;' : ''}">
        ${!project.thumbnail ? '<i data-lucide="image" class="w-8 h-8 text-gray-300"></i>' : ''}
      </div>
      <div class="project-card-body">
        <div class="flex items-start justify-between gap-2 mb-2">
          <h3 class="font-heading font-semibold text-sm leading-tight line-clamp-2">${escapeHtml(project.name || 'Untitled')}</h3>
          <span class="status-badge ${project.status || 'draft'} flex-shrink-0">${project.status || 'draft'}</span>
        </div>
        <p class="text-vasl-gray text-xs font-body">${formatDate(project.createdAt)}</p>
      </div>
    </div>
  `).join('');

  // Re-init Lucide
  if (typeof lucide !== 'undefined') lucide.createIcons();
}

// ---- Update Dashboard ---- //
function updateDashboard() {
  const projects = getProjects();

  // Stats
  const totalProjects = projects.length;
  const published = projects.filter(p => p.status === 'published').length;
  const drafts = projects.filter(p => p.status === 'draft').length;
  const hoursSaved = totalProjects * 3; // 3 hours saved per project

  setText('stat-projects', totalProjects);
  setText('stat-published', published);
  setText('stat-drafts', drafts);
  setText('stat-hours', hoursSaved);

  // Recent projects (show max 3)
  const dashGrid = document.getElementById('dashboard-projects-grid');
  const dashEmpty = document.getElementById('dashboard-empty');

  if (projects.length === 0) {
    if (dashGrid) dashGrid.innerHTML = '';
    if (dashEmpty) dashEmpty.classList.remove('hidden');
  } else {
    if (dashEmpty) dashEmpty.classList.add('hidden');
    if (dashGrid) {
      const recent = projects.slice(0, 3);
      dashGrid.innerHTML = recent.map(project => `
        <div class="project-card" onclick="viewProject('${project.id}')">
          <div class="project-card-thumb" style="background-image: url('${project.thumbnail || ''}'); ${!project.thumbnail ? 'display: flex; align-items: center; justify-content: center;' : ''}">
            ${!project.thumbnail ? '<i data-lucide="image" class="w-8 h-8 text-gray-300"></i>' : ''}
          </div>
          <div class="project-card-body">
            <div class="flex items-start justify-between gap-2 mb-2">
              <h3 class="font-heading font-semibold text-sm leading-tight line-clamp-2">${escapeHtml(project.name || 'Untitled')}</h3>
              <span class="status-badge ${project.status || 'draft'} flex-shrink-0">${project.status || 'draft'}</span>
            </div>
            <p class="text-vasl-gray text-xs font-body">${formatDate(project.createdAt)}</p>
          </div>
        </div>
      `).join('');
    }
  }

  // Re-init Lucide
  if (typeof lucide !== 'undefined') lucide.createIcons();
}

// ---- View Project Detail ---- //
let currentDetailProject = null;

function viewProject(id) {
  const project = getProject(id);
  if (!project) {
    showToast('Project not found');
    return;
  }

  currentDetailProject = project;
  navigateTo('project-detail');

  // Fill header
  const titleEl = document.getElementById('detail-title');
  const dateEl = document.getElementById('detail-date');
  const thumbEl = document.getElementById('detail-thumbnail');
  const statusEl = document.getElementById('detail-status');

  if (titleEl) titleEl.textContent = project.name || 'Untitled';
  if (dateEl) dateEl.textContent = formatDate(project.createdAt);
  if (statusEl) statusEl.value = project.status || 'draft';

  if (thumbEl) {
    if (project.thumbnail) {
      thumbEl.innerHTML = `<img src="${project.thumbnail}" class="w-full h-full object-cover" alt="${escapeHtml(project.name)}" />`;
    } else {
      thumbEl.innerHTML = '<div class="w-full h-full flex items-center justify-center"><i data-lucide="image" class="w-8 h-8 text-gray-300"></i></div>';
    }
  }

  // Show Behance tab by default
  renderDetailTabContent('behance');

  if (typeof lucide !== 'undefined') lucide.createIcons();
}

function renderDetailTabContent(tabName) {
  const container = document.getElementById('detail-content');
  if (!container || !currentDetailProject?.result) {
    container.innerHTML = '<p class="text-vasl-gray text-center py-12">No generated content available.</p>';
    return;
  }

  const result = currentDetailProject.result;

  switch (tabName) {
    case 'behance':
      container.innerHTML = `
        <div class="result-card">
          <div class="result-card-header">
            <h3 class="font-heading font-semibold text-sm text-vasl-gray">PROJECT TITLE</h3>
            <button class="copy-btn" onclick="copyToClipboard(\`${escapeForJs(result.behance?.title)}\`)">
              <i data-lucide="copy" class="w-3.5 h-3.5"></i> Copy
            </button>
          </div>
          <p class="font-heading font-bold text-xl">${escapeHtml(result.behance?.title)}</p>
        </div>
        <div class="result-card">
          <div class="result-card-header">
            <h3 class="font-heading font-semibold text-sm text-vasl-gray">THE CHALLENGE</h3>
            <button class="copy-btn" onclick="copyToClipboard(\`${escapeForJs(result.behance?.challenge)}\`)">
              <i data-lucide="copy" class="w-3.5 h-3.5"></i> Copy
            </button>
          </div>
          <p class="font-body leading-relaxed">${escapeHtml(result.behance?.challenge)}</p>
        </div>
        <div class="result-card">
          <div class="result-card-header">
            <h3 class="font-heading font-semibold text-sm text-vasl-gray">THE PROCESS</h3>
            <button class="copy-btn" onclick="copyToClipboard(\`${escapeForJs(result.behance?.process)}\`)">
              <i data-lucide="copy" class="w-3.5 h-3.5"></i> Copy
            </button>
          </div>
          <p class="font-body leading-relaxed">${escapeHtml(result.behance?.process)}</p>
        </div>
        <div class="result-card">
          <div class="result-card-header">
            <h3 class="font-heading font-semibold text-sm text-vasl-gray">THE SOLUTION</h3>
            <button class="copy-btn" onclick="copyToClipboard(\`${escapeForJs(result.behance?.solution)}\`)">
              <i data-lucide="copy" class="w-3.5 h-3.5"></i> Copy
            </button>
          </div>
          <p class="font-body leading-relaxed">${escapeHtml(result.behance?.solution)}</p>
        </div>
        <div class="result-card">
          <div class="result-card-header">
            <h3 class="font-heading font-semibold text-sm text-vasl-gray">FULL DESCRIPTION</h3>
            <button class="copy-btn" onclick="copyToClipboard(\`${escapeForJs(result.behance?.full_description)}\`)">
              <i data-lucide="copy" class="w-3.5 h-3.5"></i> Copy
            </button>
          </div>
          <p class="font-body leading-relaxed">${escapeHtml(result.behance?.full_description)}</p>
        </div>
      `;
      break;

    case 'linkedin':
      container.innerHTML = `
        <div class="result-card">
          <div class="result-card-header">
            <h3 class="font-heading font-semibold text-sm text-vasl-gray">SHORT VERSION</h3>
            <button class="copy-btn" onclick="copyToClipboard(\`${escapeForJs(result.linkedin?.short)}\`)">
              <i data-lucide="copy" class="w-3.5 h-3.5"></i> Copy
            </button>
          </div>
          <p class="font-body leading-relaxed">${escapeHtml(result.linkedin?.short)}</p>
        </div>
        <div class="result-card">
          <div class="result-card-header">
            <h3 class="font-heading font-semibold text-sm text-vasl-gray">MEDIUM VERSION</h3>
            <button class="copy-btn" onclick="copyToClipboard(\`${escapeForJs(result.linkedin?.medium)}\`)">
              <i data-lucide="copy" class="w-3.5 h-3.5"></i> Copy
            </button>
          </div>
          <p class="font-body leading-relaxed">${escapeHtml(result.linkedin?.medium)}</p>
        </div>
        <div class="result-card">
          <div class="result-card-header">
            <h3 class="font-heading font-semibold text-sm text-vasl-gray">LONG VERSION</h3>
            <button class="copy-btn" onclick="copyToClipboard(\`${escapeForJs(result.linkedin?.long)}\`)">
              <i data-lucide="copy" class="w-3.5 h-3.5"></i> Copy
            </button>
          </div>
          <p class="font-body leading-relaxed whitespace-pre-line">${escapeHtml(result.linkedin?.long)}</p>
        </div>
      `;
      break;

    case 'seo':
      container.innerHTML = `
        <div class="result-card">
          <div class="result-card-header">
            <h3 class="font-heading font-semibold text-sm text-vasl-gray">HASHTAGS</h3>
          </div>
          <div class="flex flex-wrap gap-2">${(result.seo?.hashtags || []).map(h => `<span class="seo-chip" onclick="copyToClipboard('${h}')">${escapeHtml(h)}</span>`).join('')}</div>
        </div>
        <div class="result-card">
          <div class="result-card-header">
            <h3 class="font-heading font-semibold text-sm text-vasl-gray">META DESCRIPTION</h3>
            <button class="copy-btn" onclick="copyToClipboard(\`${escapeForJs(result.seo?.meta_description)}\`)">
              <i data-lucide="copy" class="w-3.5 h-3.5"></i> Copy
            </button>
          </div>
          <p class="font-body leading-relaxed">${escapeHtml(result.seo?.meta_description)}</p>
        </div>
        <div class="result-card">
          <div class="result-card-header">
            <h3 class="font-heading font-semibold text-sm text-vasl-gray">KEYWORDS</h3>
          </div>
          <div class="flex flex-wrap gap-2">${(result.seo?.keywords || []).map(k => `<span class="seo-chip" onclick="copyToClipboard('${k}')">${escapeHtml(k)}</span>`).join('')}</div>
        </div>
      `;
      break;
  }

  if (typeof lucide !== 'undefined') lucide.createIcons();
}

// ---- Update Project Status ---- //
function updateProjectStatus() {
  if (!currentDetailProject) return;
  const status = document.getElementById('detail-status')?.value;
  if (status && currentDetailProject.id) {
    updateProject(currentDetailProject.id, { status });
    currentDetailProject.status = status;
    showToast(`Status updated to ${status}`);
  }
}

// ---- Delete Project ---- //
function deleteProject() {
  if (!currentDetailProject) return;
  if (!confirm('Delete this project? This cannot be undone.')) return;

  deleteProjectById(currentDetailProject.id);
  currentDetailProject = null;
  showToast('Project deleted');
  navigateTo('projects');
}

// ---- Helpers ---- //
function escapeHtml(text) {
  if (!text) return '';
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

function escapeForJs(text) {
  if (!text) return '';
  return text.replace(/\\/g, '\\\\').replace(/`/g, '\\`').replace(/\$/g, '\\$');
}

function formatDate(dateString) {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
}
