/* ============================================
   VASLKAAR — Graphic Studio Module (HTML-to-Image)
   Auto-renders project case studies into graphics
   ============================================ */

let GRAPHIC_STATE = {
  format: 'square',
  theme: 'gold',
  data: {
    badge: 'CASE STUDY • 2026',
    headline: 'Brand Identity & Visual System',
    sub: 'Crafted strategic visual storytelling with high-converting creative assets.',
    statNum: '+180%',
    statLabel: 'Brand Reach',
    author: '@vaslkaar.creative',
    image: null,
    colors: ['#C9A84C', '#1C1917', '#E5E7EB'],
  }
};

// ---- Initialize Studio from AI Result ---- //
function initGraphicStudio(projectData, aiResult) {
  if (!projectData || !aiResult) return;

  const b = aiResult.behance || {};
  const l = aiResult.linkedin || {};
  const dna = typeof getDNA === 'function' ? getDNA() : null;

  const brand = projectData.brandName || projectData.name || 'Creative Brand';
  const authorName = dna?.profession ? `${dna.profession.toLowerCase().replace(/\s+/g, '')}.co` : 'vaslkaar.studio';

  GRAPHIC_STATE.data = {
    badge: `${(projectData.clientType || 'DESIGN').toUpperCase()} • ${new Date().getFullYear()}`,
    headline: b.title || `${brand} Visual System`,
    sub: l.short || (b.solution ? b.solution.substring(0, 140) + '...' : projectData.description || ''),
    statNum: '100%',
    statLabel: 'Custom Built',
    author: `@${authorName}`,
    image: projectData.images && projectData.images.length > 0 ? projectData.images[0] : null,
    colors: projectData.dominantColors && projectData.dominantColors.length > 0
      ? projectData.dominantColors
      : ['#C9A84C', '#1C1917', '#E4E4E7']
  };

  // Sync inputs
  syncGraphicInputs();

  // Render Artboard
  renderGraphicArtboard();
}

// ---- Sync Inputs with State ---- //
function syncGraphicInputs() {
  const d = GRAPHIC_STATE.data;
  const setVal = (id, val) => {
    const el = document.getElementById(id);
    if (el) el.value = val || '';
  };

  setVal('g-input-badge', d.badge);
  setVal('g-input-headline', d.headline);
  setVal('g-input-sub', d.sub);
  setVal('g-input-stat-num', d.statNum);
  setVal('g-input-stat-label', d.statLabel);
  setVal('g-input-author', d.author);
}

// ---- Format Switcher ---- //
function setGraphicFormat(format) {
  GRAPHIC_STATE.format = format;

  document.querySelectorAll('.graphic-format-btn').forEach(btn => {
    btn.classList.remove('active');
    btn.classList.add('text-vasl-gray');
  });

  const activeBtn = document.getElementById(`format-${format}-btn`);
  if (activeBtn) {
    activeBtn.classList.add('active');
    activeBtn.classList.remove('text-vasl-gray');
  }

  renderGraphicArtboard();
}

// ---- Theme Switcher ---- //
function setGraphicTheme(theme) {
  GRAPHIC_STATE.theme = theme;

  document.querySelectorAll('.graphic-theme-btn').forEach(btn => {
    btn.classList.remove('active');
    btn.classList.add('text-vasl-gray');
  });

  const activeBtn = document.getElementById(`theme-${theme}-btn`);
  if (activeBtn) {
    activeBtn.classList.add('active');
    activeBtn.classList.remove('text-vasl-gray');
  }

  renderGraphicArtboard();
}

// ---- Live Update on Input ---- //
function updateGraphicLive() {
  GRAPHIC_STATE.data.badge = document.getElementById('g-input-badge')?.value || '';
  GRAPHIC_STATE.data.headline = document.getElementById('g-input-headline')?.value || '';
  GRAPHIC_STATE.data.sub = document.getElementById('g-input-sub')?.value || '';
  GRAPHIC_STATE.data.statNum = document.getElementById('g-input-stat-num')?.value || '';
  GRAPHIC_STATE.data.statLabel = document.getElementById('g-input-stat-label')?.value || '';
  GRAPHIC_STATE.data.author = document.getElementById('g-input-author')?.value || '';

  renderGraphicArtboard();
}

// ---- Reset to Defaults ---- //
function resetGraphicDefaults() {
  if (APP.currentProject && APP.generatedResult) {
    initGraphicStudio(APP.currentProject, APP.generatedResult);
    showToast('Graphic reset to original ✨');
  }
}

// ---- Render The Visual Artboard ---- //
function renderGraphicArtboard() {
  const artboard = document.getElementById('graphic-artboard');
  if (!artboard) return;

  const { format, theme, data } = GRAPHIC_STATE;

  // Set class attributes for sizing & color theme
  artboard.className = `graphic-artboard theme-${theme} format-${format} shadow-2xl rounded-2xl p-6 sm:p-8 flex flex-col justify-between overflow-hidden relative`;

  // Dynamic Accent styles based on theme
  const themeStyles = {
    gold: {
      badgeBg: 'rgba(201, 168, 76, 0.15)',
      badgeText: '#C9A84C',
      badgeBorder: '1px solid rgba(201, 168, 76, 0.4)',
      titleColor: '#FFFFFF',
      subColor: '#A1A1AA',
      footerBg: 'rgba(255, 255, 255, 0.05)',
      footerBorder: 'rgba(255, 255, 255, 0.1)',
      accentColor: '#C9A84C'
    },
    minimal: {
      badgeBg: '#F4F4F5',
      badgeText: '#18181B',
      badgeBorder: '1px solid #E4E4E7',
      titleColor: '#18181B',
      subColor: '#52525B',
      footerBg: '#F4F4F5',
      footerBorder: '#E4E4E7',
      accentColor: '#18181B'
    },
    cyber: {
      badgeBg: 'rgba(99, 102, 241, 0.15)',
      badgeText: '#818CF8',
      badgeBorder: '1px solid rgba(99, 102, 241, 0.4)',
      titleColor: '#F8FAFC',
      subColor: '#94A3B8',
      footerBg: 'rgba(255, 255, 255, 0.05)',
      footerBorder: 'rgba(99, 102, 241, 0.2)',
      accentColor: '#38BDF8'
    },
    emerald: {
      badgeBg: 'rgba(16, 185, 129, 0.15)',
      badgeText: '#34D399',
      badgeBorder: '1px solid rgba(16, 185, 129, 0.4)',
      titleColor: '#ECFDF5',
      subColor: '#A7F3D0',
      footerBg: 'rgba(0, 0, 0, 0.2)',
      footerBorder: 'rgba(16, 185, 129, 0.2)',
      accentColor: '#10B981'
    }
  }[theme] || themeStyles.gold;

  const colorDots = (data.colors || []).slice(0, 4).map(c => `
    <span style="display:inline-block; width:14px; height:14px; border-radius:50%; background-color:${c}; border: 1.5px solid rgba(255,255,255,0.4); box-shadow: 0 1px 3px rgba(0,0,0,0.2);"></span>
  `).join('');

  // Sizing adjustments for banner vs square vs portrait
  const titleSize = format === 'banner' ? 'font-size: 1.4rem; line-height: 1.25;' : 'font-size: 1.55rem; line-height: 1.25;';
  const showImage = Boolean(data.image);

  artboard.innerHTML = `
    <!-- Decorative background ambient glow -->
    <div style="position:absolute; top:-30px; right:-30px; width:160px; height:160px; border-radius:50%; background:${themeStyles.accentColor}; opacity:0.12; filter:blur(40px); pointer-events:none;"></div>

    <!-- Artboard Header -->
    <div style="display:flex; align-items:center; justify-content:space-between; width:100%; z-index:2;">
      <div style="display:inline-flex; align-items:center; gap:6px; padding:4px 12px; border-radius:20px; background:${themeStyles.badgeBg}; border:${themeStyles.badgeBorder};">
        <span style="font-size:10px; font-weight:700; letter-spacing:0.08em; text-transform:uppercase; color:${themeStyles.badgeText}; font-family:'Plus Jakarta Sans', sans-serif;">
          ${escapeHtml(data.badge)}
        </span>
      </div>
      <div style="display:flex; align-items:center; gap:6px;">
        <span style="font-size:10px; font-weight:700; letter-spacing:0.08em; text-transform:uppercase; color:${themeStyles.subColor}; opacity:0.8;">
          VASLKAAR OS
        </span>
      </div>
    </div>

    <!-- Artboard Center / Hero Content -->
    <div style="margin: 14px 0; z-index:2; flex:1; display:flex; flex-direction:column; justify-content:center;">
      <h2 style="${titleSize} font-weight:800; color:${themeStyles.titleColor}; margin:0 0 10px 0; font-family:'Plus Jakarta Sans', sans-serif; letter-spacing:-0.02em;">
        ${escapeHtml(data.headline)}
      </h2>
      <p style="font-size:0.85rem; color:${themeStyles.subColor}; line-height:1.45; margin:0 0 14px 0; max-width:92%;">
        ${escapeHtml(data.sub)}
      </p>

      ${showImage ? `
      <!-- Embedded Visual / Thumbnail Preview -->
      <div style="display:flex; align-items:center; gap:12px; margin-top:2px;">
        <div style="width:${format === 'banner' ? '64px' : '76px'}; height:${format === 'banner' ? '64px' : '76px'}; border-radius:10px; overflow:hidden; border:2px solid ${themeStyles.accentColor}; box-shadow: 0 4px 12px rgba(0,0,0,0.25); flex-shrink:0;">
          <img src="${data.image}" alt="Preview" style="width:100%; height:100%; object-fit:cover;" />
        </div>
        <div style="display:flex; flex-direction:column; gap:4px;">
          <span style="font-size:11px; font-weight:600; color:${themeStyles.titleColor}; opacity:0.9;">Extracted Palette</span>
          <div style="display:flex; align-items:center; gap:6px;">
            ${colorDots}
          </div>
        </div>
      </div>
      ` : `
      <div style="display:flex; align-items:center; gap:6px; margin-top:4px;">
        ${colorDots}
      </div>
      `}
    </div>

    <!-- Artboard Footer -->
    <div style="display:flex; align-items:center; justify-content:space-between; width:100%; padding-top:12px; border-top:1px solid ${themeStyles.footerBorder}; z-index:2;">
      <div style="display:flex; align-items:center; gap:8px;">
        <div style="padding:4px 10px; border-radius:8px; background:${themeStyles.footerBg}; border:1px solid ${themeStyles.footerBorder};">
          <span style="font-size:11px; font-weight:700; color:${themeStyles.accentColor}; font-family:'Plus Jakarta Sans', sans-serif;">
            ${escapeHtml(data.statNum)}
          </span>
          <span style="font-size:10px; color:${themeStyles.subColor}; margin-left:4px;">
            ${escapeHtml(data.statLabel)}
          </span>
        </div>
      </div>
      <div style="font-size:11px; font-weight:600; color:${themeStyles.subColor}; font-family:'Plus Jakarta Sans', sans-serif;">
        ${escapeHtml(data.author)}
      </div>
    </div>
  `;
}

// ---- High-Res HTML-to-Image Exporter (html2canvas) ---- //
async function downloadGraphicPNG() {
  const artboard = document.getElementById('graphic-artboard');
  if (!artboard) {
    showToast('Artboard element not found');
    return;
  }

  if (typeof html2canvas === 'undefined') {
    showToast('html2canvas library is loading... please try again in a moment');
    return;
  }

  const btn = document.getElementById('download-graphic-btn');
  const originalHtml = btn ? btn.innerHTML : '';

  try {
    if (btn) {
      btn.disabled = true;
      btn.innerHTML = '<span class="animate-spin mr-1">⏳</span> Exporting 2x PNG...';
    }

    showToast('🎨 Rendering High-Res Graphic...');

    // Render high resolution canvas (scale: 2 = 2x Retina Quality)
    const canvas = await html2canvas(artboard, {
      scale: 2.5,
      useCORS: true,
      allowTaint: true,
      backgroundColor: null,
      logging: false,
    });

    const imageURI = canvas.toDataURL('image/png');
    const safeHeadline = (GRAPHIC_STATE.data.headline || 'vaslkaar_graphic')
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '_')
      .substring(0, 30);

    const filename = `${safeHeadline}_${GRAPHIC_STATE.format}_card.png`;

    // Trigger download
    const link = document.createElement('a');
    link.download = filename;
    link.href = imageURI;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToast('Graphic exported & downloaded! 🖼️✨');
  } catch (error) {
    console.error('Graphic export failed:', error);
    showToast('Failed to export graphic. Try again.');
  } finally {
    if (btn) {
      btn.disabled = false;
      btn.innerHTML = originalHtml;
      if (typeof lucide !== 'undefined') lucide.createIcons();
    }
  }
}
