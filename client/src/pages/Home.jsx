import { ArrowRight, PlayCircle, Sparkles, FileText } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useEffect, useMemo, useState } from 'react';
import SearchBar from '../components/SearchBar';
import VideoCard from '../components/VideoCard';
import { apiRequest } from '../services/api';

const CATEGORIES = [
  'Market Intelligence',
  'Industrial Skills',
  'Soft Skills',
  'Others'
];

function ResourceCard({ resource }) {
  const extension = resource.fileName?.split('.').pop()?.toUpperCase() || 'FILE';

  return (
    <Link
      className="resource-card resource-card-inline"
      to={`/resource/${resource._id}`}
    >
      <div className="resource-card-icon">
        <FileText size={30} />
        <span>{extension}</span>
      </div>
      <div className="resource-card-content">
        <span className="eyebrow">VIEW-ONLY RESOURCE</span>
        <h3>{resource.title}</h3>
        <p>{resource.description || resource.fileName}</p>
        <span className="resource-card-action">View document <ArrowRight size={15} /></span>
      </div>
    </Link>
  );
}

export default function Home({ library }) {
  const [query, setQuery] = useState('');
  const [videos, setVideos] = useState([]);
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;

    Promise.all([
      apiRequest('/content?type=video&limit=50'),
      apiRequest('/content?type=resource&limit=50')
    ])
      .then(([videoData, resourceData]) => {
        if (active) {
          setVideos(videoData.items || []);
          setResources(resourceData.items || []);
        }
      })
      .catch(err => {
        if (active) setError(err.message || 'Unable to load content.');
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const filteredVideos = useMemo(() => {
    const q = query.trim().toLowerCase();

    return q
      ? videos.filter(v =>
          `${v.title} ${v.description} ${v.category} ${(v.tags || []).join(' ')}`
            .toLowerCase()
            .includes(q)
        )
      : videos;
  }, [videos, query]);

  const filteredResources = useMemo(() => {
    const q = query.trim().toLowerCase();

    return q
      ? resources.filter(r =>
          `${r.title} ${r.description} ${r.category} ${r.fileName}`
            .toLowerCase()
            .includes(q)
        )
      : resources;
  }, [resources, query]);

  return (
    <>
      <section className="hero-section">
        <div className="hero-glow glow-one" />
        <div className="hero-glow glow-two" />
        <div className="container hero-content">
          <div className="eyebrow hero-eyebrow">
            <Sparkles size={15} /> YOUR SPACE TO GROW
          </div>
          <h1>
            Curiosity builds<br />
            <span>what comes next.</span>
          </h1>
          <p>
            Explore ideas, learn practical skills and discover resources that
            move your thinking forward.
          </p>
          <div className="hero-actions">
            <Link className="button button-primary" to="/categories">
              Explore categories <ArrowRight size={17} />
            </Link>
          </div>
          <div className="hero-note">
            <span className="status-dot" />
            Learn. Explore. Innovate.
          </div>
        </div>
      </section>

      <section className="container stats-grid">
        <div className="stat-card">
          <PlayCircle />
          <strong>{videos.length}</strong>
          <span>Videos</span>
        </div>
        <div className="stat-card">
          <FileText />
          <strong>{resources.length}</strong>
          <span>Resources</span>
        </div>
        <div className="stat-card">
          <Sparkles />
          <strong>4</strong>
          <span>Categories</span>
        </div>
        <div className="stat-card">
          <PlayCircle />
          <strong>{videos.filter(v => v.featured).length}</strong>
          <span>Featured</span>
        </div>
      </section>

      <section className="section container">
        <div className="section-heading">
          <div>
            <div className="eyebrow">DISCOVER SOMETHING NEW</div>
            <h2>Explore all content</h2>
            <p className="muted">
              Browse videos, PDFs, spreadsheets and other learning materials.
            </p>
          </div>
        </div>

        <SearchBar value={query} onChange={setQuery} />

        {loading ? (
          <div className="empty-state">Loading content...</div>
        ) : error ? (
          <div className="empty-state">{error}</div>
        ) : (
          <>
            <div className="content-grid">
              {filteredVideos.map(video => (
                <VideoCard
                  key={video._id}
                  video={video}
                  saved={library.isSaved(video._id)}
                  favourite={library.isFavourite(video._id)}
                  onToggleSaved={library.toggleWatchLater}
                  onToggleFavourite={library.toggleFavourite}
                />
              ))}

              {filteredResources.map(resource => (
                <ResourceCard key={resource._id} resource={resource} />
              ))}
            </div>

            {!filteredVideos.length && !filteredResources.length && (
              <div className="empty-state">
                No content found. Try another search.
              </div>
            )}
          </>
        )}
      </section>

      <section className="section section-soft">
        <div className="container">
          <div className="section-heading">
            <div>
              <div className="eyebrow">BROWSE BY INTEREST</div>
              <h2>Explore categories</h2>
            </div>
          </div>

          <div className="category-grid">
            {CATEGORIES.map((cat, i) => (
              <Link
                className="category-card"
                to={`/category/${encodeURIComponent(cat)}`}
                key={cat}
              >
                <span>{String(i + 1).padStart(2, '0')}</span>
                <h3>{cat}</h3>
                <small>
                  {videos.filter(v => v.category === cat).length} videos ·{' '}
                  {resources.filter(r => r.category === cat).length} resources →
                </small>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}