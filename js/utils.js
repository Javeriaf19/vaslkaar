/* ============================================
   VASLKAAR — Utilities Module
   Voice input, color extraction, CSV export
   ============================================ */

// ===== VOICE INPUT (Browser Speech Recognition) ===== //
let voiceRecognition = null;
let activeVoiceField = null;

function toggleVoiceInput(fieldId) {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecognition) {
    showToast('Voice input not supported in this browser. Use Chrome or Edge.');
    return;
  }

  // If already recording, stop
  if (voiceRecognition && activeVoiceField === fieldId) {
    voiceRecognition.stop();
    voiceRecognition = null;
    activeVoiceField = null;
    return;
  }

  // Stop any existing recording
  if (voiceRecognition) voiceRecognition.stop();

  voiceRecognition = new SpeechRecognition();
  voiceRecognition.lang = 'en-US';
  voiceRecognition.interimResults = true;
  voiceRecognition.continuous = true;
  activeVoiceField = fieldId;

  const field = document.getElementById(fieldId);
  if (!field) return;

  // Visual feedback — find mic button near this field
  const micBtn = field.closest('.relative')?.querySelector('button[onclick*="toggleVoiceInput"]') || 
                 field.parentElement?.querySelector('button[onclick*="toggleVoiceInput"]');
  if (micBtn) micBtn.classList.add('text-vasl-error', 'animate-pulse');

  showToast('🎤 Listening... speak now');

  voiceRecognition.onresult = (e) => {
    let transcript = '';
    for (let i = 0; i < e.results.length; i++) {
      transcript += e.results[i][0].transcript;
    }
    // Append to existing text
    const existing = field.value || '';
    if (existing && !existing.endsWith(' ')) {
      field.value = existing + ' ' + transcript;
    } else {
      field.value = existing + transcript;
    }
  };

  voiceRecognition.onerror = (e) => {
    console.error('Voice error:', e.error);
    if (e.error === 'not-allowed') {
      showToast('Microphone access denied. Allow it in browser settings.');
    } else {
      showToast('Voice input error — try again');
    }
    stopVoice(micBtn);
  };

  voiceRecognition.onend = () => {
    stopVoice(micBtn);
    showToast('🎤 Voice input saved ✓');
  };

  voiceRecognition.start();

  // Auto-stop after 30 seconds
  setTimeout(() => {
    if (voiceRecognition && activeVoiceField === fieldId) {
      voiceRecognition.stop();
    }
  }, 30000);
}

function stopVoice(micBtn) {
  voiceRecognition = null;
  activeVoiceField = null;
  if (micBtn) micBtn.classList.remove('text-vasl-error', 'animate-pulse');
}


// ===== COLOR EXTRACTION FROM IMAGES ===== //
function extractDominantColors(base64Img) {
  try {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    img.src = base64Img;

    canvas.width = 50; // Small for speed
    canvas.height = 50;
    ctx.drawImage(img, 0, 0, 50, 50);

    const pixels = ctx.getImageData(0, 0, 50, 50).data;
    const colorMap = {};

    for (let i = 0; i < pixels.length; i += 16) { // Sample every 4th pixel
      const r = Math.round(pixels[i] / 32) * 32;
      const g = Math.round(pixels[i+1] / 32) * 32;
      const b = Math.round(pixels[i+2] / 32) * 32;
      const hex = `#${r.toString(16).padStart(2,'0')}${g.toString(16).padStart(2,'0')}${b.toString(16).padStart(2,'0')}`;
      colorMap[hex] = (colorMap[hex] || 0) + 1;
    }

    // Sort by frequency, return top 5
    return Object.entries(colorMap)
      .sort((a,b) => b[1] - a[1])
      .slice(0, 5)
      .map(([hex]) => hex);
  } catch(e) {
    console.error('Color extraction error:', e);
    return [];
  }
}


// ===== CSV EXPORT ===== //
function exportClientsCSV() {
  const clients = typeof getClients === 'function' ? getClients() : [];
  if (clients.length === 0) { showToast('No clients to export'); return; }

  const headers = ['Name', 'Platform', 'Contact', 'Status', 'Notes', 'Added'];
  const rows = clients.map(c => [
    c.name || '', c.platform || '', c.contact || '', c.status || '',
    (c.notes || '').replace(/"/g, '""'), formatDate(c.createdAt)
  ]);

  downloadCSV('vaslkaar_clients.csv', headers, rows);
  showToast('Clients exported to CSV ✓');
}

function exportInvoicesCSV() {
  const invoices = typeof getInvoices === 'function' ? getInvoices() : [];
  if (invoices.length === 0) { showToast('No invoices to export'); return; }

  const headers = ['Invoice #', 'Client', 'Date', 'Due Date', 'Total', 'Currency', 'Status', 'Items'];
  const rows = invoices.map(inv => [
    inv.number || '', inv.clientName || '', formatDate(inv.date),
    formatDate(inv.dueDate), inv.total || 0, inv.currency || 'PKR',
    inv.status || 'sent',
    (inv.items || []).map(i => `${i.description}: ${i.amount}`).join('; ')
  ]);

  downloadCSV('vaslkaar_invoices.csv', headers, rows);
  showToast('Invoices exported to CSV ✓');
}

function exportPaymentsCSV() {
  const invoices = typeof getInvoices === 'function' ? getInvoices() : [];
  if (invoices.length === 0) { showToast('No payments to export'); return; }

  const headers = ['Invoice #', 'Client', 'Amount', 'Currency', 'Status', 'Due Date', 'Paid At'];
  const now = new Date();
  const rows = invoices.map(inv => {
    const isOverdue = inv.status !== 'paid' && new Date(inv.dueDate) < now;
    return [
      inv.number || '', inv.clientName || '', inv.total || 0,
      inv.currency || 'PKR',
      inv.status === 'paid' ? 'Paid' : isOverdue ? 'Overdue' : 'Pending',
      formatDate(inv.dueDate), inv.paidAt ? formatDate(inv.paidAt) : ''
    ];
  });

  downloadCSV('vaslkaar_payments.csv', headers, rows);
  showToast('Payments exported to CSV ✓');
}

function downloadCSV(filename, headers, rows) {
  const csv = [headers.join(','), ...rows.map(r =>
    r.map(v => `"${String(v).replace(/"/g, '""')}"`).join(',')
  )].join('\n');

  const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

// Note: copyToClipboard is in app.js, setText is in output.js, 
// escapeHtml and formatDate are in projects.js
