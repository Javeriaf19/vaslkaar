/* ============================================
   VASLKAAR — Storage Module
   localStorage CRUD Wrapper
   ============================================ */

const STORAGE_KEYS = {
  DNA: 'vaslkaar_dna',
  PROJECTS: 'vaslkaar_projects',
  CLIENTS: 'vaslkaar_clients',
  INVOICES: 'vaslkaar_invoices',
};

// ---- Design DNA ---- //
function saveDNA(profile) {
  try {
    localStorage.setItem(STORAGE_KEYS.DNA, JSON.stringify(profile));
    return true;
  } catch (e) {
    console.error('Failed to save DNA:', e);
    showToast('Storage error — try clearing browser data');
    return false;
  }
}

function getDNA() {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.DNA);
    return data ? JSON.parse(data) : null;
  } catch (e) {
    console.error('Failed to read DNA:', e);
    return null;
  }
}

// ---- Projects ---- //
function saveProject(project) {
  try {
    const projects = getProjects();
    // Add unique ID and timestamp
    project.id = project.id || 'proj_' + Date.now() + '_' + Math.random().toString(36).substr(2, 6);
    project.createdAt = project.createdAt || new Date().toISOString();
    project.status = project.status || 'draft';
    projects.unshift(project); // newest first
    localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(projects));
    return project;
  } catch (e) {
    console.error('Failed to save project:', e);
    showToast('Storage error — project too large or storage full');
    return null;
  }
}

function getProjects() {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.PROJECTS);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    console.error('Failed to read projects:', e);
    return [];
  }
}

function getProject(id) {
  const projects = getProjects();
  return projects.find(p => p.id === id) || null;
}

function updateProject(id, updates) {
  try {
    const projects = getProjects();
    const index = projects.findIndex(p => p.id === id);
    if (index === -1) return false;
    projects[index] = { ...projects[index], ...updates };
    localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(projects));
    return true;
  } catch (e) {
    console.error('Failed to update project:', e);
    return false;
  }
}

function deleteProjectById(id) {
  try {
    const projects = getProjects();
    const filtered = projects.filter(p => p.id !== id);
    localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(filtered));
    return true;
  } catch (e) {
    console.error('Failed to delete project:', e);
    return false;
  }
}

// ---- Helpers ---- //
function getStorageUsage() {
  let total = 0;
  for (let key in localStorage) {
    if (localStorage.hasOwnProperty(key)) {
      total += localStorage[key].length * 2; // UTF-16 = 2 bytes/char
    }
  }
  return {
    usedMB: (total / (1024 * 1024)).toFixed(2),
    usedKB: (total / 1024).toFixed(0),
  };
}
