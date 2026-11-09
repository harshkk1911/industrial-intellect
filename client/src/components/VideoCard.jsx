import { Bookmark, Heart, Play } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getYouTubeThumbnail } from '../utils/youtube';

export default function VideoCard({ video, saved, favourite, onToggleSaved, onToggleFavourite }) {
  const thumbnail = video.thumbnailUrl || getYouTubeThumbnail(video.youtubeUrl);

  return (
    <article className="content-card">
      <Link to={`/video/${video.slug}`} className="thumbnail-wrap" aria-label={`Watch ${video.title}`}>
        {thumbnail
          ? <img src={thumbnail} alt="" loading="lazy" />
          : <div className="thumbnail-placeholder"><Play size={34} /></div>}
        <span className="play-overlay"><Play size={20} fill="currentColor" /></span>
        {video.duration && <span className="duration">{video.duration}</span>}
      </Link>
      <div className="card-body">
        <div className="eyebrow">{video.category || 'Learning'}{video.courseTitle ? ` · ${video.courseTitle}` : ''}</div>
        <Link to={`/video/${video.slug}`} className="card-title">{video.title}</Link>
        <p className="muted clamp-2">{video.description}</p>
        <div className="card-actions">
          <button className={`icon-button ${saved ? 'is-active' : ''}`} onClick={() => onToggleSaved(video._id)} title="Watch later" aria-label="Watch later"><Bookmark size={17} /></button>
          <button className={`icon-button ${favourite ? 'is-active' : ''}`} onClick={() => onToggleFavourite(video._id)} title="Favourite" aria-label="Favourite"><Heart size={17} /></button>
          <Link className="text-link" to={`/video/${video.slug}`}>Watch video <span aria-hidden>→</span></Link>
        </div>
      </div>
    </article>
  );
}
