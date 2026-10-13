/* ============================================
   VASLKAAR — Tailwind Configuration
   Configures brand palette, fonts, and radii
   ============================================ */

tailwind.config = {
  theme: {
    extend: {
      colors: {
        'vasl-dark': '#1A1A1A',
        'vasl-gold': '#C9A84C',
        'vasl-gold-hover': '#B8963F',
        'vasl-bg': '#FAFAFA',
        'vasl-success': '#2D9E5F',
        'vasl-warning': '#E8A020',
        'vasl-error': '#D04040',
        'vasl-gray': '#6B7280',
        'vasl-light-gray': '#E5E7EB',
        'vasl-card': '#FFFFFF',
      },
      fontFamily: {
        'heading': ['"Inter"', 'system-ui', 'sans-serif'],
        'body': ['"DM Sans"', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        'card': '12px',
        'input': '8px',
      },
    }
  }
};
