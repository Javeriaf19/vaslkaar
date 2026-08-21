/* ============================================
   VASLKAAR — Opportunities Module
   AI-powered gig & job finder
   with Real Platform Search & Interactive Roadmaps
   ============================================ */

let CURRENT_OPPS_CACHE = [];

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
    CURRENT_OPPS_CACHE = data.ideas || [];
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

  listEl.innerHTML = opps.map((opp, i) => {
    // Generate verified live deep search URL
    const verifiedUrl = typeof getVerifiedPlatformUrl === 'function'
      ? getVerifiedPlatformUrl(opp.platform, opp.searchKeyword || opp.title, opp.title)
      : `https://www.upwork.com/nx/search/jobs/?q=${encodeURIComponent(opp.title)}`;

    const hasRoadmap = Boolean(opp.roadmap);

    return `
    <div class="bg-white rounded-card border border-vasl-light-gray/50 p-5 hover:border-vasl-gold/40 hover:shadow-sm transition-all" style="animation: fadeInUp 0.4s ease ${i * 0.08}s both">
      <div class="flex flex-col sm:flex-row gap-4 justify-between">
        <div class="flex-1">
          <div class="flex items-center gap-2 mb-2">
            <span class="text-lg">${typeIcons[opp.difficulty] || '📌'}</span>
            <h3 class="font-heading font-semibold text-sm">${escapeHtml(opp.title || '')}</h3>
          </div>
          <p class="text-vasl-gray font-body text-sm mb-3 leading-relaxed">${escapeHtml(opp.description || '')}</p>
          <div class="flex flex-wrap gap-2 text-xs font-body mb-3">
            ${opp.earning ? `<span class="text-vasl-success font-heading font-semibold bg-vasl-success/10 px-2.5 py-0.5 rounded-full border border-vasl-success/20">${escapeHtml(opp.earning)}</span>` : ''}
            ${opp.platform ? `<span class="text-vasl-gray bg-vasl-bg px-2 py-0.5 rounded-full border border-vasl-light-gray/40">📍 ${escapeHtml(opp.platform)}</span>` : ''}
            ${opp.timeframe ? `<span class="text-vasl-gray bg-vasl-bg px-2 py-0.5 rounded-full border border-vasl-light-gray/40">⏱ ${escapeHtml(opp.timeframe)}</span>` : ''}
          </div>

          ${opp.action ? `
          <div class="bg-vasl-bg/70 rounded-input p-2.5 border border-vasl-light-gray/30 mb-2">
            <p class="text-xs font-body text-vasl-dark">
              <span class="font-heading font-semibold text-vasl-gold">⚡ Action Step:</span> ${escapeHtml(opp.action)}
            </p>
          </div>` : ''}
        </div>

        <div class="flex sm:flex-col items-center sm:items-end gap-2 flex-shrink-0">
          <a href="${escapeHtml(verifiedUrl)}" target="_blank" class="btn-gold text-xs py-2 px-4 font-heading font-semibold whitespace-nowrap flex items-center gap-1.5">
            <i data-lucide="external-link" class="w-3.5 h-3.5"></i>
            Live Jobs / Apply ↗
          </a>
          ${hasRoadmap ? `
          <button onclick="toggleOppRoadmap(${i})" class="btn-outline text-xs py-1.5 px-3 font-heading font-medium whitespace-nowrap text-vasl-dark">
            <span id="opp-roadmap-btn-text-${i}">🗺️ Roadmap</span>
          </button>
          ` : ''}
        </div>
      </div>

      <!-- Expandable Roadmap -->
      ${hasRoadmap ? `
      <div id="opp-roadmap-${i}" class="hidden mt-4 pt-3 border-t border-dashed border-vasl-light-gray/80 space-y-3">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
          <!-- Phase 1 -->
          <div class="bg-vasl-bg/90 rounded-card p-3 border border-vasl-light-gray/40">
            <p class="font-heading font-semibold text-vasl-dark mb-1">1. ${escapeHtml(opp.roadmap?.phase1?.title || 'Setup')}</p>
            <ul class="space-y-1 text-vasl-gray list-disc list-inside">
              ${(opp.roadmap?.phase1?.steps || ['Prepare portfolio assets']).map(s => `<li>${escapeHtml(s)}</li>`).join('')}
            </ul>
          </div>
          <!-- Phase 2 -->
          <div class="bg-vasl-bg/90 rounded-card p-3 border border-vasl-light-gray/40">
            <p class="font-heading font-semibold text-vasl-dark mb-1">2. ${escapeHtml(opp.roadmap?.phase2?.title || 'Build')}</p>
            <ul class="space-y-1 text-vasl-gray list-disc list-inside">
              ${(opp.roadmap?.phase2?.steps || ['Craft application proposal']).map(s => `<li>${escapeHtml(s)}</li>`).join('')}
            </ul>
          </div>
          <!-- Phase 3 -->
          <div class="bg-vasl-bg/90 rounded-card p-3 border border-vasl-light-gray/40">
            <p class="font-heading font-semibold text-vasl-dark mb-1">3. ${escapeHtml(opp.roadmap?.phase3?.title || 'Apply')}</p>
            <ul class="space-y-1 text-vasl-gray list-disc list-inside">
              ${(opp.roadmap?.phase3?.steps || ['Send direct application']).map(s => `<li>${escapeHtml(s)}</li>`).join('')}
            </ul>
          </div>
        </div>
      </div>
      ` : ''}
    </div>
  `;
  }).join('');

  if (typeof lucide !== 'undefined') lucide.createIcons();
}

function toggleOppRoadmap(index) {
  const container = document.getElementById(`opp-roadmap-${index}`);
  const btnText = document.getElementById(`opp-roadmap-btn-text-${index}`);
  if (!container) return;

  const isHidden = container.classList.contains('hidden');
  if (isHidden) {
    container.classList.remove('hidden');
    if (btnText) btnText.textContent = 'Hide Roadmap ▴';
  } else {
    container.classList.add('hidden');
    if (btnText) btnText.textContent = '🗺️ Roadmap';
  }

  if (typeof lucide !== 'undefined') lucide.createIcons();
}
