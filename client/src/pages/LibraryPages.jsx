import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { FileText } from 'lucide-react';
import VideoCard from '../components/VideoCard';
import { apiRequest } from '../services/api';

function usePublicContent(type) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;
    apiRequest(`/content?type=${encodeURIComponent(type)}&limit=50`)
      .then(data => { if (!cancelled) setItems(data.items || []); })
      .catch(err => { if (!cancelled) setError(err.message || 'Unable to load content.'); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [type]);

  return { items, loading, error };
}

export function SavedPage({ library, mode }) {
  const ids = mode === 'favourites' ? library.favourites : library.watchLater;
  const { items, loading, error } = usePublicContent('video');
  const videos = items.filter(video => ids.includes(video._id));
  return <section className="container page-section"><div className="eyebrow">YOUR LIBRARY</div><h1>{mode === 'favourites' ? 'Favourites' : 'Watch Later'}</h1><p className="muted">Saved in this browser. Your list is not synced across devices.</p>{loading ? <div className="empty-state">Loading your library...</div> : error ? <div className="empty-state">{error}</div> : videos.length ? <div className="content-grid">{videos.map(video => <VideoCard key={video._id} video={video} saved={library.isSaved(video._id)} favourite={library.isFavourite(video._id)} onToggleSaved={library.toggleWatchLater} onToggleFavourite={library.toggleFavourite} />)}</div> : <div className="empty-state">Nothing saved here yet. <Link to="/">Explore videos</Link></div>}</section>;
}

export function CategoriesPage() {
  const categories = ['Market Intelligence', 'Industrial Skills', 'Soft Skills', 'Others'];
  return <section className="container page-section"><div className="eyebrow">BROWSE BY TOPIC</div><h1>Categories</h1><p className="muted">Choose a category to explore its videos and view-only resources.</p><div className="category-grid">{categories.map((category,index)=><Link className="category-card" to={`/category/${encodeURIComponent(category)}`} key={category}><span>{String(index+1).padStart(2,'0')}</span><h3>{category}</h3><small>Explore videos and resources →</small></Link>)}</div></section>;
}


export function CategoryPage({ library }) {
  const { category } = useParams();

  const [videos, setVideos] = useState([]);
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const decodedCategory = decodeURIComponent(category || '');

  useEffect(() => {
    let active = true;

    Promise.all([
      apiRequest(
        `/content?type=video&category=${encodeURIComponent(decodedCategory)}&limit=50`
      ),
      apiRequest(
        `/content?type=resource&category=${encodeURIComponent(decodedCategory)}&limit=50`
      )
    ])
      .then(([videoData, resourceData]) => {
        if (active) {
          setVideos(videoData.items || []);
          setResources(resourceData.items || []);
        }
      })
      .catch(err => {
        if (active) {
          setError(err.message || 'Unable to load category content.');
        }
      })
      .finally(() => {
        if (active) {
          setLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, [decodedCategory]);

  return (
    <section className="container page-section">
      <div className="eyebrow">CATEGORY</div>

      <h1>{decodedCategory}</h1>

      <p className="muted">
        Videos and reference materials in this category.
      </p>

      {loading ? (
        <div className="empty-state">Loading content...</div>
      ) : error ? (
        <div className="empty-state">{error}</div>
      ) : (
        <div className="content-grid">

          {videos.map(video => (
            <VideoCard
              key={video._id}
              video={video}
              saved={library.isSaved(video._id)}
              favourite={library.isFavourite(video._id)}
              onToggleSaved={library.toggleWatchLater}
              onToggleFavourite={library.toggleFavourite}
            />
          ))}

          {resources.map(resource => (
            <Link
              className="resource-card resource-card-inline"
              to={`/resource/${resource._id}`}
              key={resource._id}
            >
              <div className="resource-card-icon">
                <FileText size={30} />
                <span>
                  {resource.fileName?.split('.').pop()?.toUpperCase() || 'FILE'}
                </span>
              </div>

              <div className="resource-card-content">
                <span className="eyebrow">VIEW-ONLY RESOURCE</span>

                <h3>{resource.title}</h3>

                <p>
                  {resource.description || resource.fileName}
                </p>

                <span className="resource-card-action">
                  View document →
                </span>
              </div>
            </Link>
          ))}

          {videos.length === 0 && resources.length === 0 && (
            <div className="empty-state">
              No content published in this category yet.
            </div>
          )}

        </div>
      )}
    </section>
  );
}



export function ResourceDetail() {
  const { id } = useParams();
  const [item, setItem] = useState(null);
  const [error, setError] = useState('');

  const API_URL = (
    import.meta.env.VITE_API_URL ||
    (import.meta.env.DEV ? 'http://localhost:5000/api' : '/api')
  ).replace(/\/+$/, '');

  useEffect(() => {
    let active = true;

    apiRequest(`/content/${encodeURIComponent(id)}`)
      .then(data => {
        if (active) setItem(data.item);
      })
      .catch(err => {
        if (active) setError(err.message);
      });

    return () => {
      active = false;
    };
  }, [id]);

  return (
    <section className="container page-section resource-detail-page">
      <Link className="text-link" to="/">← Home</Link>

      {error ? (
        <div className="empty-state">{error}</div>
      ) : !item ? (
        <div className="empty-state">Loading resource...</div>
      ) : (
        <>
          <div className="eyebrow">
            {item.category} · VIEW ONLY
          </div>

          <h1>{item.title}</h1>
          <p className="muted">{item.description}</p>

          <div className="resource-viewer">
            <iframe
              title={item.title}
              src={`${API_URL}/content/resources/${item._id}/view#toolbar=0&navpanes=0`}
            />
          </div>

          <p className="muted small-text">
            This resource is provided for online viewing.
            Download controls are not provided.
          </p>
        </>
      )}
    </section>
  );
}


export function AboutPage() {
  return <section className="container page-section narrow-page"><div className="eyebrow">OUR PURPOSE</div><h1>About Industrial Intellect</h1><p className="lead">Learn. Explore. Innovate.</p><p className="muted">Industrial Intellect is a learning space for discovering useful ideas, educational videos, tutorials and resources. Our goal is to make knowledge easier to explore and apply.</p><p className="muted">This is starter copy. Replace it with your own story, mission and details before publishing.</p></section>;
}

export function ContactPage() {
  return <section className="container page-section narrow-page"><div className="eyebrow">GET IN TOUCH</div><h1>Contact</h1><p className="muted">Have a question or suggestion? Add your official contact details here before launch.</p><div className="notice-card">Contact form submission is not connected yet. Configure a backend email provider or contact endpoint before accepting messages.</div></section>;
}
