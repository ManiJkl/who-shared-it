export const Utils = {
  createId(prefix = 'id') {
    const random = Math.random().toString(36).slice(2, 10);
    return `${prefix}_${Date.now()}_${random}`;
  },

  shuffle(list) {
    const copy = [...list];
    for (let i = copy.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  },

  clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  },

  sanitizeText(value) {
    return String(value || '').trim();
  },

  detectPlatform(url) {
    const lower = (url || '').toLowerCase();
    if (lower.includes('tiktok.com')) {
      return 'tiktok';
    }
    if (lower.includes('instagram.com') && (lower.includes('/reel/') || lower.includes('/reels/'))) {
      return 'instagram';
    }
    return 'unknown';
  }
};
