/* ============================================
   VASLKAAR — Output Module
   Results display, copy buttons, tab content
   ============================================ */

// ---- Display Results ---- //
function displayResults(result, projectData) {
  // --- Behance Tab ---
  setText('behance-title', result.behance.title || 'Untitled Project');
  setText('behance-challenge', result.behance.challenge || '');
  setText('behance-process', result.behance.process || '');
  setText('behance-solution', result.behance.solution || '');
  setText('behance-full', result.behance.full_description || '');

  // Tags
  const tagsEl = document.getElementById('behance-tags');
  if (tagsEl) {
    const allTags = [
      ...(result.behance.tools || []),
      ...(result.behance.tags || [])
    ];
    tagsEl.innerHTML = allTags.map(t =>
      `<span class="seo-chip" onclick="copyToClipboard('${t.replace(/'/g, "\\'")}')">${t}</span>`
    ).join('');
  }

  // Update results title with project name
  const titleEl = document.getElementById('results-title');
  if (titleEl && result.behance.title) {
    titleEl.textContent = result.behance.title;
  }

  // --- LinkedIn Tab ---
  setText('linkedin-short', result.linkedin.short || '');
  setText('linkedin-medium', result.linkedin.medium || '');
  setText('linkedin-long', result.linkedin.long || '');

  // Character counts
  setCount('linkedin-short-count', result.linkedin.short);
  setCount('linkedin-medium-count', result.linkedin.medium);
  setCount('linkedin-long-count', result.linkedin.long);

  // --- SEO Tab ---
  const hashtagsEl = document.getElementById('seo-hashtags');
  if (hashtagsEl && result.seo.hashtags) {
    hashtagsEl.innerHTML = result.seo.hashtags.map(h =>
      `<span class="seo-chip" onclick="copyToClipboard('${h.replace(/'/g, "\\'")}')">${h}</span>`
    ).join('');
  }

  const altsEl = document.getElementById('seo-alts');
  if (altsEl && result.seo.alt_texts) {
    altsEl.innerHTML = result.seo.alt_texts.map((alt, i) =>
      `<div class="bg-vasl-bg rounded-input p-3">
        <span class="text-xs text-vasl-gray font-heading font-medium">Image ${i + 1}:</span>
        <p class="text-sm font-body mt-1">${alt}</p>
      </div>`
    ).join('');
  }

  setText('seo-meta', result.seo.meta_description || '');

  const keywordsEl = document.getElementById('seo-keywords');
  if (keywordsEl && result.seo.keywords) {
    keywordsEl.innerHTML = result.seo.keywords.map(k =>
      `<span class="seo-chip" onclick="copyToClipboard('${k.replace(/'/g, "\\'")}')">${k}</span>`
    ).join('');
  }

  // --- Initialize Graphic Studio Tab ---
  if (typeof initGraphicStudio === 'function') {
    initGraphicStudio(projectData, result);
  }

  // Reset to Behance tab
  switchResultTab('behance');
}

// ---- Helper: Set Text Content ---- //
function setText(id, text) {
  const el = document.getElementById(id);
  if (el) el.textContent = text;
}

function setCount(id, text) {
  const el = document.getElementById(id);
  if (el) el.textContent = (text || '').length;
}

// ---- Copy Functions ---- //
function copyText(elementId) {
  const el = document.getElementById(elementId);
  if (!el) return;

  const text = el.textContent || el.innerText;
  copyToClipboard(text);

  // Visual feedback on the copy button
  const btn = el.closest('.result-card')?.querySelector('.copy-btn');
  if (btn) {
    btn.classList.add('copied');
    const originalHTML = btn.innerHTML;
    btn.innerHTML = '<i data-lucide="check" class="w-3.5 h-3.5"></i> Copied!';
    if (typeof lucide !== 'undefined') lucide.createIcons();
    setTimeout(() => {
      btn.classList.remove('copied');
      btn.innerHTML = originalHTML;
      if (typeof lucide !== 'undefined') lucide.createIcons();
    }, 2000);
  }
}

function copyAllBehance() {
  if (!APP.generatedResult?.behance) return;

  const b = APP.generatedResult.behance;
  const fullText = [
    b.title,
    '',
    '— The Challenge —',
    b.challenge,
    '',
    '— The Process —',
    b.process,
    '',
    '— The Solution —',
    b.solution,
    '',
    '— Full Description —',
    b.full_description,
    '',
    'Tools: ' + (b.tools || []).join(', '),
    'Tags: ' + (b.tags || []).join(', '),
  ].join('\n');

  copyToClipboard(fullText);
}

// ---- Save Current Project ---- //
function saveCurrentProject() {
  if (!APP.generatedResult || !APP.currentProject) {
    showToast('Nothing to save');
    return;
  }

  const project = {
    name: APP.generatedResult.behance?.title || APP.currentProject.name || 'Untitled Project',
    description: APP.currentProject.description,
    clientType: APP.currentProject.clientType,
    tools: APP.currentProject.tools,
    images: APP.currentProject.images?.slice(0, 3) || [], // Save max 3 images
    thumbnail: APP.currentProject.images?.[0] || null,
    result: APP.generatedResult,
    status: 'draft',
  };

  const saved = saveProject(project);
  if (saved) {
    showToast('Project saved! ✨');
    // Update button
    const btn = document.getElementById('save-project-btn');
    if (btn) {
      btn.innerHTML = '<i data-lucide="check" class="w-4 h-4"></i> Saved';
      btn.disabled = true;
      btn.classList.remove('btn-gold');
      btn.classList.add('btn-outline');
      if (typeof lucide !== 'undefined') lucide.createIcons();
    }
  }
}
