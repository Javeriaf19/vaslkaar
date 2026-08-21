/* ============================================
   VASLKAAR — Client CRM Module
   Client management + modal + list
   ============================================ */

// ---- Storage Helpers ---- //
function getClients() {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.CLIENTS);
    return data ? JSON.parse(data) : [];
  } catch (e) { return []; }
}

function saveClientToStorage(client) {
  const clients = getClients();
  client.id = client.id || 'cli_' + Date.now() + '_' + Math.random().toString(36).substr(2, 6);
  client.createdAt = client.createdAt || new Date().toISOString();
  clients.unshift(client);
  localStorage.setItem(STORAGE_KEYS.CLIENTS, JSON.stringify(clients));
  return client;
}

function updateClient(id, updates) {
  const clients = getClients();
  const idx = clients.findIndex(c => c.id === id);
  if (idx === -1) return false;
  clients[idx] = { ...clients[idx], ...updates };
  localStorage.setItem(STORAGE_KEYS.CLIENTS, JSON.stringify(clients));
  return true;
}

function deleteClient(id) {
  const clients = getClients().filter(c => c.id !== id);
  localStorage.setItem(STORAGE_KEYS.CLIENTS, JSON.stringify(clients));
}

// ---- Modal ---- //
function openClientModal(editId) {
  const modal = document.getElementById('client-modal');
  const title = document.getElementById('client-modal-title');
  const form = document.getElementById('client-form');

  if (editId) {
    const client = getClients().find(c => c.id === editId);
    if (client) {
      title.textContent = 'Edit Client';
      document.getElementById('client-edit-id').value = editId;
      document.getElementById('client-name').value = client.name || '';
      document.getElementById('client-platform').value = client.platform || '';
      document.getElementById('client-contact').value = client.contact || '';
      document.getElementById('client-status').value = client.status || 'active';
      document.getElementById('client-notes').value = client.notes || '';
    }
  } else {
    title.textContent = 'Add New Client';
    document.getElementById('client-edit-id').value = '';
    form.reset();
  }

  modal.classList.remove('hidden');
  if (typeof lucide !== 'undefined') lucide.createIcons();
}

function closeClientModal() {
  document.getElementById('client-modal').classList.add('hidden');
}

// ---- Form Submit ---- //
document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('client-form');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const editId = document.getElementById('client-edit-id').value;
      const clientData = {
        name: document.getElementById('client-name').value.trim(),
        platform: document.getElementById('client-platform').value,
        contact: document.getElementById('client-contact').value.trim(),
        status: document.getElementById('client-status').value,
        notes: document.getElementById('client-notes').value.trim(),
      };

      if (!clientData.name) return;

      if (editId) {
        updateClient(editId, clientData);
        showToast('Client updated! ✓');
      } else {
        saveClientToStorage(clientData);
        showToast('Client added! ✓');
      }

      closeClientModal();
      renderClientList();
    });
  }
});

// ---- Render Client List ---- //
function renderClientList() {
  const clients = getClients();
  const list = document.getElementById('crm-client-list');
  const empty = document.getElementById('crm-empty');

  // Stats
  const total = clients.length;
  const active = clients.filter(c => c.status === 'active').length;
  const hold = clients.filter(c => c.status === 'on-hold').length;
  const completed = clients.filter(c => c.status === 'completed').length;

  setText('crm-stat-total', total);
  setText('crm-stat-active', active);
  setText('crm-stat-hold', hold);
  setText('crm-stat-completed', completed);

  if (clients.length === 0) {
    list.innerHTML = '';
    if (empty) empty.classList.remove('hidden');
    return;
  }

  if (empty) empty.classList.add('hidden');

  const statusColors = {
    'active': 'text-vasl-success bg-vasl-success/10',
    'completed': 'text-vasl-gray bg-vasl-bg',
    'on-hold': 'text-vasl-warning bg-vasl-warning/10',
    'problem': 'text-vasl-error bg-vasl-error/10',
  };

  const platformIcons = {
    'fiverr': '🟢', 'upwork': '🟩', 'direct': '🤝', 'job': '💼',
    'linkedin': '🔗', 'referral': '📣', 'other': '📌'
  };

  list.innerHTML = clients.map(c => `
    <div class="bg-white rounded-card border border-vasl-light-gray/50 p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-vasl-gold/30 transition-colors">
      <div class="flex items-center gap-4 flex-1">
        <div class="w-10 h-10 bg-vasl-gold/10 rounded-full flex items-center justify-center flex-shrink-0">
          <span class="text-lg">${platformIcons[c.platform] || '👤'}</span>
        </div>
        <div class="flex-1 min-w-0">
          <h3 class="font-heading font-semibold text-sm">${escapeHtml(c.name)}</h3>
          <p class="text-vasl-gray text-xs font-body truncate">${c.platform ? c.platform.charAt(0).toUpperCase() + c.platform.slice(1) : 'No platform'} ${c.contact ? '· ' + escapeHtml(c.contact) : ''}</p>
        </div>
      </div>
      <div class="flex items-center gap-2">
        <span class="text-xs font-heading font-semibold px-2.5 py-1 rounded-full ${statusColors[c.status] || statusColors.active}">${(c.status || 'active').replace('-', ' ')}</span>
        ${c.contact ? `
        <button onclick="chatClientWhatsApp('${c.contact.replace(/'/g, "\\'")}', '${c.name.replace(/'/g, "\\'")}')" class="w-8 h-8 flex items-center justify-center rounded-input hover:bg-vasl-success/10 text-vasl-gray hover:text-vasl-success transition-colors" title="Chat on WhatsApp">
          <i data-lucide="message-circle" class="w-3.5 h-3.5"></i>
        </button>
        ` : ''}
        <button onclick="openClientModal('${c.id}')" class="w-8 h-8 flex items-center justify-center rounded-input hover:bg-vasl-bg text-vasl-gray hover:text-vasl-dark transition-colors" title="Edit Client">
          <i data-lucide="pencil" class="w-3.5 h-3.5"></i>
        </button>
        <button onclick="confirmDeleteClient('${c.id}')" class="w-8 h-8 flex items-center justify-center rounded-input hover:bg-vasl-error/5 text-vasl-gray hover:text-vasl-error transition-colors" title="Delete Client">
          <i data-lucide="trash-2" class="w-3.5 h-3.5"></i>
        </button>
      </div>
    </div>
  `).join('');

  if (typeof lucide !== 'undefined') lucide.createIcons();
}

function chatClientWhatsApp(contact, clientName) {
  const phone = contact.replace(/[^0-9+]/g, '');
  const greeting = encodeURIComponent(`Hi ${clientName}! 👋 Reaching out from VASLKAAR regarding our current project.`);
  const url = phone ? `https://wa.me/${phone}?text=${greeting}` : `https://wa.me/?text=${greeting}`;
  window.open(url, '_blank');
}

function confirmDeleteClient(id) {
  if (confirm('Delete this client?')) {
    deleteClient(id);
    renderClientList();
    showToast('Client deleted');
  }
}
