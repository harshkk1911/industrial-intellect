import { useMemo } from 'react';
import { ExternalLink, CheckCircle2 } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import VideoCard from '../components/VideoCard';
import { sampleVideos } from '../data/sampleContent';
import { getYouTubeEmbedUrl } from '../utils/youtube';

export default function VideoDetail({ library }) {
  const { slug } = useParams();
  const video = sampleVideos.find(item => item.slug === slug);
  const related = useMemo(() => sampleVideos.filter(item => item._id !== video?._id), [video]);

  if (!video) return <div className="container page-section"><div className="empty-state">Video not found. <Link to="/">Return home</Link></div></div>;

  const embed = getYouTubeEmbedUrl(video.youtubeUrl);
  const done = library.completed.includes(video._id);

  return (
    <section className="container page-section">
      <div className="video-layout">
        <div>
          <div className="video-player">
            {embed ? <iframe src={embed} title={video.title} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen referrerPolicy="strict-origin-when-cross-origin" /> : <div className="empty-state">No playable YouTube URL was provided.</div>}
          </div>
          <div className="video-detail-heading"><div className="eyebrow">{video.category} · {video.courseTitle}</div><h1>{video.title}</h1><p className="muted">{video.description}</p></div>
          <div className="video-detail-actions">
            <button className={`button ${done ? 'button-primary' : 'button-secondary'}`} onClick={() => library.toggleCompleted(video._id)}><CheckCircle2 size={17} /> {done ? 'Completed' : 'Mark as completed'}</button>
            <a className="button button-secondary" href={video.youtubeUrl} target="_blank" rel="noreferrer">Open on YouTube <ExternalLink size={16} /></a>
          </div>
        </div>
        <aside className="playlist-panel">
          <h3>Up next</h3><p className="muted">More to explore</p>
          {related.map(item => <Link className="playlist-item" key={item._id} to={`/video/${item.slug}`}><span className="playlist-number">▶</span><span><strong>{item.title}</strong><small>{item.courseTitle}</small></span></Link>)}
        </aside>
      </div>
    </section>
  );
}
