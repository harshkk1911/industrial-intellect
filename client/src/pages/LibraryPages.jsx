import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
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
  const { items, loading, error } = usePublicContent('video');
  const categories = [...new Set(items.map(item => item.category).filter(Boolean))].sort((a, b) => a.localeCompare(b));
  return <section className="container page-section"><div className="eyebrow">BROWSE BY TOPIC</div><h1>Categories</h1><p className="muted">Explore learning topics published on Industrial Intellect.</p>{loading ? <div className="empty-state">Loading categories...</div> : error ? <div className="empty-state">{error}</div> : categories.length ? <div className="category-grid">{categories.map((category, index) => <Link className="category-card" to={`/courses?category=${encodeURIComponent(category)}`} key={category}><span>{String(index + 1).padStart(2, '0')}</span><h3>{category}</h3><small>{items.filter(item => item.category === category).length} videos · Explore →</small></Link>)}</div> : <div className="empty-state">No categories yet. Published videos will create categories automatically when you add a category in the Admin Panel.</div>}</section>;
}

export function CoursesPage() {
  const { items: videos, loading: videosLoading, error: videosError } = usePublicContent('video');
  const { items: courses, loading: coursesLoading, error: coursesError } = usePublicContent('course');
  const category = new URLSearchParams(window.location.search).get('category');
  const visibleVideos = category ? videos.filter(video => video.category === category) : videos;
  const courseNames = [...new Set(visibleVideos.map(video => video.courseTitle).filter(Boolean))];
  const loading = videosLoading || coursesLoading;
  const error = videosError || coursesError;

  return <section className="container page-section"><div className="eyebrow">LEARN IN SEQUENCE</div><h1>{category ? `${category} videos` : 'Courses & Playlists'}</h1><p className="muted">Explore published courses and video collections.</p>{loading ? <div className="empty-state">Loading courses...</div> : error ? <div className="empty-state">{error}</div> : <>
    {courses.map(course => <article className="course-card" key={course._id}><div className="course-art"><span>II</span></div><div><div className="eyebrow">COURSE</div><h2>{course.title}</h2><p className="muted">{course.description}</p></div></article>)}
    {courseNames.map(name => { const lessons = visibleVideos.filter(video => video.courseTitle === name); return <article className="course-card" key={name}><div className="course-art"><span>II</span></div><div><div className="eyebrow">PLAYLIST · {lessons.length} VIDEOS</div><h2>{name}</h2><p className="muted">{lessons[0]?.description || 'Explore this learning playlist.'}</p>{lessons[0] && <Link className="text-link" to={`/video/${lessons[0].slug}`}>Open first lesson →</Link>}</div></article>; })}
    {!courses.length && !courseNames.length && <div className="empty-state">No courses or playlists published yet. Add videos with a course title from the Admin Panel.</div>}
  </>}</section>;
}

export function BlogPage() {
  const { items: articles, loading, error } = usePublicContent('article');
  return <section className="container page-section"><div className="eyebrow">IDEAS & INSIGHTS</div><h1>Blog & Tutorials</h1><p className="muted">Articles, explainers and practical guides from Industrial Intellect.</p>{loading ? <div className="empty-state">Loading articles...</div> : error ? <div className="empty-state">{error}</div> : articles.length ? <div className="article-grid">{articles.map(article => <article className="article-card" key={article._id}><span className="eyebrow">{article.category}</span><h2>{article.title}</h2><p className="muted">{article.description}</p><span className="muted small-text">{article.publishedAt ? new Date(article.publishedAt).toLocaleDateString() : ''}</span></article>)}</div> : <div className="empty-state">No articles published yet.</div>}</section>;
}

export function AboutPage() {
  return <section className="container page-section narrow-page"><div className="eyebrow">OUR PURPOSE</div><h1>About Industrial Intellect</h1><p className="lead">Learn. Explore. Innovate.</p><p className="muted">Industrial Intellect is a learning space for discovering useful ideas, educational videos, tutorials and resources. Our goal is to make knowledge easier to explore and apply.</p><p className="muted">This is starter copy. Replace it with your own story, mission and details before publishing.</p></section>;
}

export function ContactPage() {
  return <section className="container page-section narrow-page"><div className="eyebrow">GET IN TOUCH</div><h1>Contact</h1><p className="muted">Have a question or suggestion? Add your official contact details here before launch.</p><div className="notice-card">Contact form submission is not connected yet. Configure a backend email provider or contact endpoint before accepting messages.</div></section>;
}
