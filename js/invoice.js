/* ============================================
   VASLKAAR — Invoice Module
   Invoice creation, PDF generation, list
   ============================================ */

// ---- Storage ---- //
function getInvoices() {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.INVOICES);
    return data ? JSON.parse(data) : [];
  } catch (e) { return []; }
}

function saveInvoice(invoice) {
  const invoices = getInvoices();
  invoice.id = 'inv_' + Date.now() + '_' + Math.random().toString(36).substr(2, 6);
  invoice.createdAt = new Date().toISOString();
  invoice.status = 'sent';
  invoices.unshift(invoice);
  localStorage.setItem(STORAGE_KEYS.INVOICES, JSON.stringify(invoices));
  return invoice;
}

function updateInvoice(id, updates) {
  const invoices = getInvoices();
  const idx = invoices.findIndex(i => i.id === id);
  if (idx === -1) return;
  invoices[idx] = { ...invoices[idx], ...updates };
  localStorage.setItem(STORAGE_KEYS.INVOICES, JSON.stringify(invoices));
}

function deleteInvoiceById(id) {
  const invoices = getInvoices().filter(i => i.id !== id);
  localStorage.setItem(STORAGE_KEYS.INVOICES, JSON.stringify(invoices));
}

// ---- Currency Helpers ---- //
const CURRENCY_SYMBOLS = { PKR: 'Rs.', USD: '$', EUR: '€', GBP: '£' };

function formatCurrency(amount, currency) {
  const sym = CURRENCY_SYMBOLS[currency] || currency;
  return `${sym} ${Number(amount || 0).toLocaleString()}`;
}

// ---- Modal ---- //
function openInvoiceForm() {
  const modal = document.getElementById('invoice-modal');
  const form = document.getElementById('invoice-form');
  form.reset();

  // Set defaults
  document.getElementById('invoice-date').value = new Date().toISOString().split('T')[0];
  const dueDate = new Date();
  dueDate.setDate(dueDate.getDate() + 14);
  document.getElementById('invoice-due').value = dueDate.toISOString().split('T')[0];

  // Auto invoice number
  const invoices = getInvoices();
  document.getElementById('invoice-number').value = `INV-${String(invoices.length + 1).padStart(3, '0')}`;

  // Populate client dropdown
  const clientSelect = document.getElementById('invoice-client');
  const clients = typeof getClients === 'function' ? getClients() : [];
  clientSelect.innerHTML = '<option value="">Select client...</option>' +
    clients.map(c => `<option value="${c.id}">${escapeHtml(c.name)}</option>`).join('');

  // Reset items
  document.getElementById('invoice-items').innerHTML = `
    <div class="invoice-item flex gap-3 items-start">
      <input type="text" placeholder="Service description" class="input-field flex-1 inv-desc" />
      <input type="number" placeholder="Amount" class="input-field w-28 inv-amount" min="0" oninput="updateInvoiceTotal()" />
      <button type="button" onclick="this.closest('.invoice-item').remove(); updateInvoiceTotal()" class="w-8 h-8 flex items-center justify-center text-vasl-gray hover:text-vasl-error mt-2">×</button>
    </div>`;
  document.getElementById('invoice-total').textContent = 'Rs. 0';

  modal.classList.remove('hidden');
  if (typeof lucide !== 'undefined') lucide.createIcons();
}

function closeInvoiceModal() {
  document.getElementById('invoice-modal').classList.add('hidden');
}

function addInvoiceItem() {
  const container = document.getElementById('invoice-items');
  const item = document.createElement('div');
  item.className = 'invoice-item flex gap-3 items-start';
  item.innerHTML = `
    <input type="text" placeholder="Service description" class="input-field flex-1 inv-desc" />
    <input type="number" placeholder="Amount" class="input-field w-28 inv-amount" min="0" oninput="updateInvoiceTotal()" />
    <button type="button" onclick="this.closest('.invoice-item').remove(); updateInvoiceTotal()" class="w-8 h-8 flex items-center justify-center text-vasl-gray hover:text-vasl-error mt-2">×</button>`;
  container.appendChild(item);
}

function updateInvoiceTotal() {
  const amounts = document.querySelectorAll('.inv-amount');
  let total = 0;
  amounts.forEach(a => { total += Number(a.value) || 0; });
  const currency = document.getElementById('invoice-currency')?.value || 'PKR';
  document.getElementById('invoice-total').textContent = formatCurrency(total, currency);
}

// ---- Form Submit ---- //
document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('invoice-form');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const items = [];
      document.querySelectorAll('.invoice-item').forEach(row => {
        const desc = row.querySelector('.inv-desc')?.value?.trim();
        const amount = Number(row.querySelector('.inv-amount')?.value) || 0;
        if (desc && amount > 0) items.push({ description: desc, amount });
      });

      if (items.length === 0) {
        showToast('Add at least one line item');
        return;
      }

      const clientId = document.getElementById('invoice-client').value;
      const clients = typeof getClients === 'function' ? getClients() : [];
      const client = clients.find(c => c.id === clientId);

      const invoice = {
        number: document.getElementById('invoice-number').value,
        date: document.getElementById('invoice-date').value,
        dueDate: document.getElementById('invoice-due').value,
        clientId: clientId,
        clientName: client?.name || 'Unknown Client',
        clientContact: client?.contact || '',
        items: items,
        total: items.reduce((sum, i) => sum + i.amount, 0),
        currency: document.getElementById('invoice-currency').value,
        notes: document.getElementById('invoice-notes').value.trim(),
      };

      saveInvoice(invoice);
      closeInvoiceModal();
      renderInvoiceList();
      showToast('Invoice created! ✓');
    });
  }

  // Update total on currency change
  const currencyEl = document.getElementById('invoice-currency');
  if (currencyEl) currencyEl.addEventListener('change', updateInvoiceTotal);
});

// ---- Render Invoice List ---- //
function renderInvoiceList() {
  const invoices = getInvoices();
  const list = document.getElementById('invoice-list');
  const empty = document.getElementById('invoices-empty');

  // Stats
  const total = invoices.length;
  const paid = invoices.filter(i => i.status === 'paid').length;
  const pending = invoices.filter(i => i.status === 'sent').length;
  const overdue = invoices.filter(i => {
    if (i.status === 'paid') return false;
    return new Date(i.dueDate) < new Date();
  }).length;

  setText('inv-stat-total', total);
  setText('inv-stat-paid', paid);
  setText('inv-stat-pending', pending);
  setText('inv-stat-overdue', overdue);

  if (invoices.length === 0) {
    list.innerHTML = '';
    if (empty) empty.classList.remove('hidden');
    return;
  }
  if (empty) empty.classList.add('hidden');

  list.innerHTML = invoices.map(inv => {
    const isOverdue = inv.status !== 'paid' && new Date(inv.dueDate) < new Date();
    const statusClass = inv.status === 'paid' ? 'text-vasl-success bg-vasl-success/10' :
                        isOverdue ? 'text-vasl-error bg-vasl-error/10' :
                        'text-vasl-warning bg-vasl-warning/10';
    const statusLabel = inv.status === 'paid' ? 'Paid' : isOverdue ? 'Overdue' : 'Pending';

    return `
    <div class="bg-white rounded-card border border-vasl-light-gray/50 p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div class="flex items-center gap-4 flex-1">
        <div class="w-10 h-10 bg-vasl-dark rounded-input flex items-center justify-center flex-shrink-0">
          <i data-lucide="receipt" class="w-5 h-5 text-vasl-gold"></i>
        </div>
        <div class="flex-1 min-w-0">
          <h3 class="font-heading font-semibold text-sm">${escapeHtml(inv.number)} — ${escapeHtml(inv.clientName)}</h3>
          <p class="text-vasl-gray text-xs font-body">Due: ${formatDate(inv.dueDate)} · ${formatCurrency(inv.total, inv.currency)}</p>
        </div>
      </div>
      <div class="flex items-center gap-2">
        <span class="text-xs font-heading font-semibold px-2.5 py-1 rounded-full ${statusClass}">${statusLabel}</span>
        ${inv.status !== 'paid' ? `
          <button onclick="markInvoicePaid('${inv.id}')" class="text-xs font-heading font-medium text-vasl-success hover:underline px-2 py-1">Mark Paid</button>
        ` : ''}
        <button onclick="generateInvoicePDF('${inv.id}')" class="w-8 h-8 flex items-center justify-center rounded-input hover:bg-vasl-bg text-vasl-gray hover:text-vasl-dark" title="Download PDF">
          <i data-lucide="download" class="w-3.5 h-3.5"></i>
        </button>
        <button onclick="shareInvoiceWhatsApp('${inv.id}')" class="w-8 h-8 flex items-center justify-center rounded-input hover:bg-vasl-success/10 text-vasl-gray hover:text-vasl-success" title="Send via WhatsApp">
          <i data-lucide="message-circle" class="w-3.5 h-3.5"></i>
        </button>
        <button onclick="confirmDeleteInvoice('${inv.id}')" class="w-8 h-8 flex items-center justify-center rounded-input hover:bg-vasl-error/5 text-vasl-gray hover:text-vasl-error">
          <i data-lucide="trash-2" class="w-3.5 h-3.5"></i>
        </button>
      </div>
    </div>`;
  }).join('');

  if (typeof lucide !== 'undefined') lucide.createIcons();
}

function markInvoicePaid(id) {
  updateInvoice(id, { status: 'paid', paidAt: new Date().toISOString() });
  renderInvoiceList();
  showToast('Invoice marked as paid! 💰');
}

function confirmDeleteInvoice(id) {
  if (confirm('Delete this invoice?')) {
    deleteInvoiceById(id);
    renderInvoiceList();
    showToast('Invoice deleted');
  }
}

// ---- WhatsApp Share ---- //
function shareInvoiceWhatsApp(id) {
  const inv = getInvoices().find(i => i.id === id);
  if (!inv) return;

  const items = inv.items.map(i => `• ${i.description}: ${formatCurrency(i.amount, inv.currency)}`).join('\n');
  const message = encodeURIComponent(
    `📄 *Invoice ${inv.number}*\n\nHi ${inv.clientName},\n\nHere's your invoice:\n\n${items}\n\n*Total: ${formatCurrency(inv.total, inv.currency)}*\nDue: ${formatDate(inv.dueDate)}\n${inv.notes ? '\nNote: ' + inv.notes : ''}\n\nThank you! 🙏\n— Sent via VASLKAAR`
  );

  const phone = inv.clientContact?.replace(/[^0-9+]/g, '') || '';
  const url = phone ? `https://wa.me/${phone}?text=${message}` : `https://wa.me/?text=${message}`;
  window.open(url, '_blank');
}

// ---- PDF Generation ---- //
function generateInvoicePDF(id) {
  const inv = getInvoices().find(i => i.id === id);
  if (!inv) return;

  try {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    const sym = CURRENCY_SYMBOLS[inv.currency] || inv.currency;

    // Header
    doc.setFillColor(26, 26, 26);
    doc.rect(0, 0, 210, 40, 'F');
    doc.setTextColor(201, 168, 76);
    doc.setFontSize(24);
    doc.setFont('helvetica', 'bold');
    doc.text('INVOICE', 20, 28);
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(12);
    doc.text(inv.number, 190, 28, { align: 'right' });

    // Info
    doc.setTextColor(100, 100, 100);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(`Date: ${formatDate(inv.date)}`, 20, 55);
    doc.text(`Due: ${formatDate(inv.dueDate)}`, 20, 62);
    doc.setTextColor(26, 26, 26);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text(`Bill To: ${inv.clientName}`, 20, 78);

    // Table header
    let y = 95;
    doc.setFillColor(250, 250, 250);
    doc.rect(20, y - 5, 170, 10, 'F');
    doc.setFontSize(9);
    doc.setTextColor(100, 100, 100);
    doc.setFont('helvetica', 'bold');
    doc.text('DESCRIPTION', 22, y + 1);
    doc.text('AMOUNT', 188, y + 1, { align: 'right' });
    y += 14;

    // Items
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(26, 26, 26);
    doc.setFontSize(10);
    inv.items.forEach(item => {
      doc.text(item.description, 22, y);
      doc.text(`${sym} ${Number(item.amount).toLocaleString()}`, 188, y, { align: 'right' });
      y += 10;
    });

    // Total
    y += 5;
    doc.setDrawColor(229, 231, 235);
    doc.line(20, y, 190, y);
    y += 10;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.text('Total:', 130, y);
    doc.setTextColor(201, 168, 76);
    doc.text(`${sym} ${Number(inv.total).toLocaleString()}`, 188, y, { align: 'right' });

    // Notes
    if (inv.notes) {
      y += 20;
      doc.setTextColor(100, 100, 100);
      doc.setFontSize(9);
      doc.setFont('helvetica', 'normal');
      doc.text(`Notes: ${inv.notes}`, 20, y);
    }

    // Footer
    doc.setTextColor(180, 180, 180);
    doc.setFontSize(8);
    doc.text('Generated by VASLKAAR — vaslkaar.vercel.app', 105, 285, { align: 'center' });

    doc.save(`${inv.number}_${inv.clientName.replace(/\s+/g, '_')}.pdf`);
    showToast('Invoice PDF downloaded! 📄');
  } catch (e) {
    console.error('PDF error:', e);
    showToast('PDF generation failed — try again');
  }
}
