/**
 * General helper functions for BookBridge
 */

export const formatCurrency = (amount) => {
  if (amount === 0 || amount === '0' || amount === null || amount === undefined) {
    return 'FREE';
  }
  const numeric = typeof amount === 'number' ? amount : parseFloat(amount);
  if (isNaN(numeric) || numeric === 0) return 'FREE';
  return `₹${numeric.toLocaleString('en-IN')}`;
};

export const formatDate = (isoString) => {
  if (!isoString) return '';
  const date = new Date(isoString);
  return date.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });
};

export const timeAgo = (isoString) => {
  if (!isoString) return '';
  const date = new Date(isoString);
  const now = new Date();
  const seconds = Math.floor((now - date) / 1000);

  if (seconds < 60) return 'Just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  const months = Math.floor(days / 30);
  if (months < 12) return `${months}mo ago`;
  return `${Math.floor(months / 12)}y ago`;
};

export const truncate = (text, maxLength = 100) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trim() + '...';
};

export const generateId = (prefix = 'id') => {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;
};

/**
 * Validates and converts an uploaded image File to Base64 string.
 * Enforces a 1.5MB max limit to avoid overflowing LocalStorage.
 */
export const fileToBase64 = (file, maxSizeMB = 1.5) => {
  return new Promise((resolve, reject) => {
    if (!file) {
      return reject(new Error('No file provided'));
    }

    // Check mime type
    if (!file.type.startsWith('image/')) {
      return reject(new Error('Please upload an image file (PNG, JPG, WebP)'));
    }

    // Check size
    const maxSizeBytes = maxSizeMB * 1024 * 1024;
    if (file.size > maxSizeBytes) {
      return reject(new Error(`Image must be smaller than ${maxSizeMB}MB`));
    }

    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = (err) => reject(err);
    reader.readAsDataURL(file);
  });
};

/**
 * Generates an elegant SVG placeholder book cover when an image fails to load
 */
export const getFallbackCover = (title = 'Book', author = 'Author') => {
  const safeTitle = title.length > 25 ? title.substring(0, 22) + '...' : title;
  const safeAuthor = author.length > 20 ? author.substring(0, 18) + '...' : author;
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="400" height="600" viewBox="0 0 400 600">
      <defs>
        <linearGradient id="bookGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#254D3D" />
          <stop offset="100%" stop-color="#142B22" />
        </linearGradient>
        <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#F2D199" />
          <stop offset="100%" stop-color="#D6A66A" />
        </linearGradient>
      </defs>
      <rect width="400" height="600" fill="url(#bookGrad)" rx="8" />
      <rect x="20" y="20" width="360" height="560" fill="none" stroke="url(#goldGrad)" stroke-width="2" rx="4" opacity="0.6" />
      <rect x="30" y="30" width="340" height="540" fill="none" stroke="url(#goldGrad)" stroke-width="1" rx="2" opacity="0.4" />
      <circle cx="200" cy="180" r="45" fill="none" stroke="url(#goldGrad)" stroke-width="2" opacity="0.7"/>
      <path d="M185 180 L200 165 L215 180 L200 195 Z" fill="url(#goldGrad)" opacity="0.7"/>
      <text x="200" y="290" font-family="'Cinzel', 'Lora', serif" font-size="24" font-weight="bold" fill="#F7F5EF" text-anchor="middle">
        ${safeTitle}
      </text>
      <line x1="140" y1="320" x2="260" y2="320" stroke="url(#goldGrad)" stroke-width="2" opacity="0.6" />
      <text x="200" y="360" font-family="'Plus Jakarta Sans', sans-serif" font-size="16" fill="#DCE9DD" text-anchor="middle">
        by ${safeAuthor}
      </text>
      <text x="200" y="530" font-family="'Cinzel', serif" font-size="12" letter-spacing="3" fill="#D6A66A" text-anchor="middle" opacity="0.8">
        BOOKBRIDGE EDITION
      </text>
    </svg>
  `;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
};

