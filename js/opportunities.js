/* ============================================
   VASLKAAR — Opportunities Module
   AI-powered gig & job finder
   ============================================ */

// ---- Find Opportunities ---- //
async function findOpportunities() {
  const loadingEl = document.getElementById('opps-loading');
  const resultsEl = document.getElementById('opps-results');
  const emptyEl = document.getElementById('opps-empty');

  // Show loading
  loadingEl.classList.remove('hidden');
  resultsEl.classList.add('hidden');
  emptyEl.classList.add('hidden');

  const dna = typeof getDNA === 'function' ? getDNA() : null;

  try {
    const response = await fetch('/api/ideas', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        category: 'opportunities',
        skills: dna?.aesthetics || ['Graphic Design', 'Video Editing', 'AI Content'],
        aesthetics: dna?.aesthetics || ['Modern'],
        experience: 'Intermediate',
      }),
    });

    if (!response.ok) {
      const err = await response.json();
      throw new Error(err.error || 'Failed to find opportunities');
    }

    const data = await response.json();
    displayOpportunities(data);
  } catch (error) {
    console.error('Opportunities error:', error);
    showToast('Scanning failed — try again');
    loadingEl.classList.add('hidden');
    emptyEl.classList.remove('hidden');
  }
}

// ---- Display Opportunities ---- //
function displayOpportunities(data) {
  const loadingEl = document.getElementById('opps-loading');
  const resultsEl = document.getElementById('opps-results');
  const listEl = document.getElementById('opps-list');

  loadingEl.classList.add('hidden');
  resultsEl.classList.remove('hidden');

  const opps = data.ideas || [];
  if (opps.length === 0) {
    listEl.innerHTML = '<p class="text-vasl-gray text-center py-8">No opportunities found. Try updating your Design DNA with more skills.</p>';
    return;
  }

  const typeIcons = {
    'Easy': '⚡', 'Medium': '🔥', 'Hard': '💎',
  };

  listEl.innerHTML = opps.map((opp, i) => `
    <div class="bg-white rounded-card border border-vasl-light-gray/50 p-5 hover:border-vasl-gold/30 hover:shadow-sm transition-all" style="animation: fadeInUp 0.4s ease ${i * 0.08}s both">
      <div class="flex flex-col sm:flex-row gap-4">
        <div class="flex-1">
          <div class="flex items-center gap-2 mb-2">
            <span class="text-lg">${typeIcons[opp.difficulty] || '📌'}</span>
            <h3 class="font-heading font-semibold text-sm">${escapeHtml(opp.title || '')}</h3>
          </div>
          <p class="text-vasl-gray font-body text-sm mb-3 leading-relaxed">${escapeHtml(opp.description || '')}</p>
          <div class="flex flex-wrap gap-3 text-xs font-body">
            ${opp.earning ? `<span class="text-vasl-success font-heading font-semibold bg-vasl-success/10 px-2 py-0.5 rounded-full">${escapeHtml(opp.earning)}</span>` : ''}
            ${opp.platform ? `<span class="text-vasl-gray bg-vasl-bg px-2 py-0.5 rounded-full">📍 ${escapeHtml(opp.platform)}</span>` : ''}
            ${opp.timeframe ? `<span class="text-vasl-gray bg-vasl-bg px-2 py-0.5 rounded-full">⏱ ${escapeHtml(opp.timeframe)}</span>` : ''}
            ${opp.difficulty ? `<span class="text-vasl-gray bg-vasl-bg px-2 py-0.5 rounded-full">${opp.difficulty}</span>` : ''}
          </div>
        </div>
        <div class="flex sm:flex-col items-center gap-2 flex-shrink-0">
          ${opp.link ? `
          <a href="${escapeHtml(opp.link)}" target="_blank" class="btn-gold text-xs py-2 px-4 font-heading font-medium whitespace-nowrap">
            Apply →
          </a>` : ''}
          ${opp.action ? `
          <button onclick="copyToClipboard(\`${escapeHtml(opp.action).replace(/`/g, '')}\`); showToast('Action step copied! ✓')" class="btn-outline text-xs py-2 px-3 font-heading font-medium whitespace-nowrap">
            Copy Step
          </button>` : ''}
        </div>
      </div>
    </div>
  `).join('');
}
