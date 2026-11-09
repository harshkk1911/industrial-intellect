export function getYouTubeId(url = '') {
  try {
    const parsed = new URL(url);
    const host = parsed.hostname.replace(/^www\./, '');
    let id = '';

    if (host === 'youtu.be') {
      id = parsed.pathname.split('/').filter(Boolean)[0] || '';
    } else if (['youtube.com', 'm.youtube.com', 'youtube-nocookie.com'].includes(host)) {
      if (parsed.pathname.startsWith('/shorts/') || parsed.pathname.startsWith('/embed/')) {
        id = parsed.pathname.split('/')[2] || '';
      } else {
        id = parsed.searchParams.get('v') || '';
      }
    }

    return /^[a-zA-Z0-9_-]{11}$/.test(id) ? id : null;
  } catch {
    return null;
  }
}

export function getYouTubeThumbnail(url) {
  const id = getYouTubeId(url || '');
  return id ? `https://img.youtube.com/vi/${id}/hqdefault.jpg` : '';
}

export function getYouTubeEmbedUrl(url) {
  const id = getYouTubeId(url || '');
  return id ? `https://www.youtube-nocookie.com/embed/${id}?rel=0` : '';
}
