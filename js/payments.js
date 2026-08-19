/* ============================================
   VASLKAAR — Payment Tracker Module
   Revenue dashboard + payment history
   ============================================ */

// ---- Render Payment Dashboard ---- //
function renderPaymentDashboard() {
  const invoices = typeof getInvoices === 'function' ? getInvoices() : [];
  const historyEl = document.getElementById('payment-history');
  const emptyEl = document.getElementById('payments-empty');

  // Calculate totals
  const now = new Date();
  let totalEarned = 0;
  let totalPending = 0;
  let totalOverdue = 0;

  invoices.forEach(inv => {
    const amount = Number(inv.total) || 0;
    if (inv.status === 'paid') {
      totalEarned += amount;
    } else if (new Date(inv.dueDate) < now) {
      totalOverdue += amount;
    } else {
      totalPending += amount;
    }
  });

  // Determine primary currency
  const currency = invoices.length > 0 ? (invoices[0].currency || 'PKR') : 'PKR';
  const sym = { PKR: 'Rs.', USD: '$', EUR: '€', GBP: '£' }[currency] || currency;

  setText('pay-total-earned', `${sym} ${totalEarned.toLocaleString()}`);
  setText('pay-total-pending', `${sym} ${totalPending.toLocaleString()}`);
  setText('pay-total-overdue', `${sym} ${totalOverdue.toLocaleString()}`);

  if (invoices.length === 0) {
    if (historyEl) historyEl.innerHTML = '';
    if (emptyEl) emptyEl.classList.remove('hidden');
    return;
  }

  if (emptyEl) emptyEl.classList.add('hidden');

  // Render payment history (all invoices as payment entries)
  historyEl.innerHTML = invoices.map(inv => {
    const isOverdue = inv.status !== 'paid' && new Date(inv.dueDate) < now;
    const isPaid = inv.status === 'paid';

    const statusDot = isPaid ? 'bg-vasl-success' : isOverdue ? 'bg-vasl-error' : 'bg-vasl-warning';
    const statusText = isPaid ? 'Paid' : isOverdue ? 'Overdue' : 'Pending';
    const statusTextColor = isPaid ? 'text-vasl-success' : isOverdue ? 'text-vasl-error' : 'text-vasl-warning';
    const amountColor = isPaid ? 'text-vasl-success' : 'text-vasl-dark';

    return `
    <div class="bg-white rounded-card border border-vasl-light-gray/50 p-4 flex items-center justify-between gap-4">
      <div class="flex items-center gap-4 flex-1">
        <div class="w-2.5 h-2.5 rounded-full ${statusDot} flex-shrink-0"></div>
        <div class="flex-1 min-w-0">
          <h4 class="font-heading font-medium text-sm">${escapeHtml(inv.clientName)}</h4>
          <p class="text-vasl-gray text-xs font-body">${escapeHtml(inv.number)} · Due ${formatDate(inv.dueDate)}</p>
        </div>
      </div>
      <div class="text-right flex-shrink-0">
        <p class="font-heading font-bold text-sm ${amountColor}">${formatCurrency(inv.total, inv.currency)}</p>
        <p class="text-xs font-body ${statusTextColor}">${statusText}</p>
      </div>
      ${!isPaid ? `
      <div class="flex items-center gap-1 flex-shrink-0">
        <button onclick="markInvoicePaid('${inv.id}'); renderPaymentDashboard()" class="text-xs font-heading text-vasl-success hover:underline px-2 py-1" title="Mark as paid">✓ Paid</button>
        <button onclick="generateReminder('${inv.id}')" class="text-xs font-heading text-vasl-warning hover:underline px-2 py-1" title="Send reminder">📩 Remind</button>
      </div>` : ''}
    </div>`;
  }).join('');

  if (typeof lucide !== 'undefined') lucide.createIcons();
}

// ---- Generate Payment Reminder ---- //
function generateReminder(invoiceId) {
  const inv = (typeof getInvoices === 'function' ? getInvoices() : []).find(i => i.id === invoiceId);
  if (!inv) return;

  const sym = { PKR: 'Rs.', USD: '$', EUR: '€', GBP: '£' }[inv.currency] || inv.currency;
  const isOverdue = new Date(inv.dueDate) < new Date();

  let message;
  if (isOverdue) {
    message = `Hi ${inv.clientName}, I hope you're doing well! Just a gentle reminder that invoice ${inv.number} for ${sym} ${Number(inv.total).toLocaleString()} was due on ${formatDate(inv.dueDate)}. Could you kindly process the payment at your earliest convenience? Thank you so much! 🙏`;
  } else {
    message = `Hi ${inv.clientName}! Just a friendly heads up — invoice ${inv.number} for ${sym} ${Number(inv.total).toLocaleString()} is due on ${formatDate(inv.dueDate)}. Let me know if you need any details. Thanks! 😊`;
  }

  // Copy to clipboard
  copyToClipboard(message);

  // Also offer WhatsApp
  const phone = inv.clientContact?.replace(/[^0-9+]/g, '') || '';
  const url = phone
    ? `https://wa.me/${phone}?text=${encodeURIComponent(message)}`
    : `https://wa.me/?text=${encodeURIComponent(message)}`;

  if (confirm('Reminder copied to clipboard! ✓\n\nOpen WhatsApp to send it?')) {
    window.open(url, '_blank');
  }
}
