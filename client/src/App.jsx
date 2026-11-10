import { Route, Routes } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import VideoDetail from './pages/VideoDetail';
import { AboutPage, CategoriesPage, CategoryPage, ContactPage, SavedPage, ResourceDetail } from './pages/LibraryPages';
import { AdminDashboard, AdminLogin } from './pages/Admin';
import { useLocalLibrary } from './hooks/useLocalLibrary';

export default function App() {
  const library = useLocalLibrary();
  return <Routes><Route element={<Layout />}>
    <Route path="/" element={<Home library={library} />} />
    <Route path="/categories" element={<CategoriesPage />} />
    <Route path="/category/:category" element={<CategoryPage library={library} />} />
    <Route path="/video/:slug" element={<VideoDetail library={library} />} />
    <Route path="/resource/:id" element={<ResourceDetail />} />
    <Route path="/watch-later" element={<SavedPage library={library} mode="watch-later" />} />
    <Route path="/favourites" element={<SavedPage library={library} mode="favourites" />} />
    <Route path="/about" element={<AboutPage />} />
    <Route path="/contact" element={<ContactPage />} />
    <Route path="/admin/login" element={<AdminLogin />} />
    <Route path="/admin" element={<AdminDashboard />} />
  </Route></Routes>;
}
