import { Link } from 'react-router-dom';
import VideoCard from '../components/VideoCard';
import { sampleVideos, sampleCategories, sampleArticles } from '../data/sampleContent';

export function SavedPage({ library, mode }) {
  const ids = mode === 'favourites' ? library.favourites : library.watchLater;
  const videos = sampleVideos.filter(video => ids.includes(video._id));
  return <section className="container page-section"><div className="eyebrow">YOUR LIBRARY</div><h1>{mode === 'favourites' ? 'Favourites' : 'Watch Later'}</h1><p className="muted">Saved in this browser. Your list is not synced across devices.</p>{videos.length ? <div className="content-grid">{videos.map(video => <VideoCard key={video._id} video={video} saved={library.isSaved(video._id)} favourite={library.isFavourite(video._id)} onToggleSaved={library.toggleWatchLater} onToggleFavourite={library.toggleFavourite} />)}</div> : <div className="empty-state">Nothing saved here yet. <Link to="/">Explore videos</Link></div>}</section>;
}

export function CategoriesPage() {
  return <section className="container page-section"><div className="eyebrow">BROWSE BY TOPIC</div><h1>Categories</h1><p className="muted">Explore learning topics. Categories can be managed from the admin area in the next iteration.</p><div className="category-grid">{sampleCategories.map((category, index) => <Link className="category-card" to={`/courses?category=${encodeURIComponent(category)}`} key={category}><span>0{index + 1}</span><h3>{category}</h3><small>Explore resources →</small></Link>)}</div></section>;
}

export function CoursesPage() {
  return <section className="container page-section"><div className="eyebrow">LEARN IN SEQUENCE</div><h1>Courses & Playlists</h1><p className="muted">Organized learning collections to help you follow a topic step by step.</p><div className="course-card"><div className="course-art"><span>II</span></div><div><div className="eyebrow">START HERE</div><h2>Getting Started</h2><p className="muted">A sample playlist demonstrating how course collections will appear.</p><Link className="text-link" to="/video/introduction-to-learning-with-video">Open first lesson →</Link></div></div></section>;
}

export function BlogPage() {
  return <section className="container page-section"><div className="eyebrow">IDEAS & INSIGHTS</div><h1>Blog & Tutorials</h1><p className="muted">Articles, explainers and practical guides from Industrial Intellect.</p><div className="article-grid">{sampleArticles.map(article => <article className="article-card" key={article._id}><span className="eyebrow">{article.category}</span><h2>{article.title}</h2><p className="muted">{article.description}</p><span className="muted small-text">Sample article preview</span></article>)}</div></section>;
}

export function AboutPage() {
  return <section className="container page-section narrow-page"><div className="eyebrow">OUR PURPOSE</div><h1>About Industrial Intellect</h1><p className="lead">Learn. Explore. Innovate.</p><p className="muted">Industrial Intellect is a learning space for discovering useful ideas, educational videos, tutorials and resources. Our goal is to make knowledge easier to explore and apply.</p><p className="muted">This is starter copy. Replace it with your own story, mission and details before publishing.</p></section>;
}

export function ContactPage() {
  return <section className="container page-section narrow-page"><div className="eyebrow">GET IN TOUCH</div><h1>Contact</h1><p className="muted">Have a question or suggestion? Add your official contact details here before launch.</p><div className="notice-card">Contact form submission is not connected yet. Configure a backend email provider or contact endpoint before accepting messages.</div></section>;
}
