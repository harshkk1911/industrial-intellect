import { useEffect, useMemo, useState } from 'react';
import { ExternalLink, CheckCircle2 } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import VideoCard from '../components/VideoCard';
import { getYouTubeEmbedUrl } from '../utils/youtube';
import { apiRequest } from '../services/api';

export default function VideoDetail({ library }) {
  const { slug } = useParams();
  const [video, setVideo] = useState(null);
  const [relatedVideos, setRelatedVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;

    async function loadVideo() {
      setLoading(true);
      setError('');
      setVideo(null);
      try {
        const data = await apiRequest(`/content/${encodeURIComponent(slug)}`);
        if (cancelled) return;
        setVideo(data.item);

        const params = new URLSearchParams({ type: 'video', limit: '50' });
        if (data.item.category) params.set('category', data.item.category);
        const related = await apiRequest(`/content?${params.toString()}`);
        if (!cancelled) {
          setRelatedVideos((related.items || []).filter(item => item._id !== data.item._id).slice(0, 6));
        }
      } catch (err) {
        if (!cancelled) setError(err.message || 'Unable to load this video.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadVideo();
    return () => { cancelled = true; };
  }, [slug]);

  const embed = useMemo(() => getYouTubeEmbedUrl(video?.youtubeUrl || ''), [video]);
  const done = video ? library.completed.includes(video._id) : false;

  if (loading) return <div className="container page-section"><div className="empty-state">Loading video...</div></div>;
  if (error || !video) return <div className="container page-section"><div className="empty-state">{error || 'Video not found.'} <Link to="/">Return home</Link></div></div>;

  return (
    <section className="container page-section">
      <div className="video-layout">
        <div>
          <div className="video-player">
            {embed ? <iframe src={embed} title={video.title} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen referrerPolicy="strict-origin-when-cross-origin" /> : <div className="empty-state">No playable YouTube URL was provided.</div>}
          </div>
          <div className="video-detail-heading"><div className="eyebrow">{video.category || 'Learning'}{video.courseTitle ? ` · ${video.courseTitle}` : ''}</div><h1>{video.title}</h1><p className="muted">{video.description}</p></div>
          <div className="video-detail-actions">
            <button className={`button ${done ? 'button-primary' : 'button-secondary'}`} onClick={() => library.toggleCompleted(video._id)}><CheckCircle2 size={17} /> {done ? 'Completed' : 'Mark as completed'}</button>
            <a className="button button-secondary" href={video.youtubeUrl} target="_blank" rel="noreferrer">Open on YouTube <ExternalLink size={16} /></a>
          </div>
        </div>
        <aside className="playlist-panel">
          <h3>Up next</h3><p className="muted">More to explore</p>
          {relatedVideos.length ? relatedVideos.map(item => <Link className="playlist-item" key={item._id} to={`/video/${item.slug}`}><span className="playlist-number">▶</span><span><strong>{item.title}</strong><small>{item.courseTitle || item.category || 'Learning'}</small></span></Link>) : <p className="muted">No related videos yet.</p>}
        </aside>
      </div>
    </section>
  );
}
