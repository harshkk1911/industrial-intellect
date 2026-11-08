import { ArrowRight, BookOpen, GraduationCap, Layers3, PlayCircle, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useMemo, useState } from 'react';
import SearchBar from '../components/SearchBar';
import VideoCard from '../components/VideoCard';
import { sampleVideos, sampleArticles } from '../data/sampleContent';

export default function Home({ library }) {
  const [query, setQuery] = useState('');
  const videos = useMemo(() => sampleVideos.filter(video => `${video.title} ${video.description} ${video.category}`.toLowerCase().includes(query.toLowerCase())), [query]);
  const featured = videos.filter(video => video.featured);
  const stats = [
    ['Videos', sampleVideos.length, PlayCircle],
    ['Courses', 1, GraduationCap],
    ['Articles', sampleArticles.length, BookOpen],
    ['Categories', 5, Layers3]
  ];

  return (
    <>
      <section className="hero-section">
        <div className="hero-glow glow-one" /><div className="hero-glow glow-two" />
        <div className="container hero-content">
          <div className="eyebrow hero-eyebrow"><Sparkles size={15} /> YOUR SPACE TO GROW</div>
          <h1>Curiosity builds<br /><span>what comes next.</span></h1>
          <p>Explore ideas, learn practical skills and discover resources that move your thinking forward.</p>
          <div className="hero-actions">
            <Link className="button button-primary" to="/courses">Explore courses <ArrowRight size={17} /></Link>
            <Link className="button button-secondary" to="/categories">Explore library</Link>
          </div>
          <div className="hero-note"><span className="status-dot" /> Learn. Explore. Innovate.</div>
        </div>
      </section>

      <section className="container stats-grid" aria-label="Platform content statistics">
        {stats.map(([label, value, Icon]) => <div className="stat-card" key={label}><Icon size={20} /><strong>{value}</strong><span>{label}</span></div>)}
      </section>

      <section className="section container">
        <div className="section-heading"><div><div className="eyebrow">DISCOVER SOMETHING NEW</div><h2>Explore the library</h2><p className="muted">Find videos and learning resources by topic, course or keyword.</p></div></div>
        <SearchBar value={query} onChange={setQuery} />
        <div className="content-grid">
          {videos.map(video => <VideoCard key={video._id} video={video} saved={library.isSaved(video._id)} favourite={library.isFavourite(video._id)} onToggleSaved={library.toggleWatchLater} onToggleFavourite={library.toggleFavourite} />)}
        </div>
        {videos.length === 0 && <div className="empty-state">No videos match that search. Try another keyword.</div>}
      </section>

      <section className="section section-soft">
        <div className="container split-feature">
          <div><div className="eyebrow">LEARNING, YOUR WAY</div><h2>Build knowledge<br />one idea at a time.</h2><p className="muted">Follow curated playlists, save videos for later and keep track of the lessons you complete.</p><Link className="text-link" to="/courses">Browse courses <ArrowRight size={16} /></Link></div>
          <div className="feature-tiles"><div className="feature-tile tile-blue"><BookOpen /><strong>Structured learning</strong><span>Courses and playlists</span></div><div className="feature-tile tile-purple"><PlayCircle /><strong>Learn visually</strong><span>Video lessons</span></div><div className="feature-tile tile-green"><Sparkles /><strong>Keep exploring</strong><span>Articles and resources</span></div></div>
        </div>
      </section>
    </>
  );
}
