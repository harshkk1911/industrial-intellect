import { Link } from 'react-router-dom';
import { BrainCircuit } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container footer-inner">
        <div className="footer-brand">
          <BrainCircuit size={25} />
          <div><strong>INDUSTRIAL INTELLECT</strong><small>Learn. Explore. Innovate.</small></div>
        </div>
        <p className="muted">A place to learn, explore ideas and keep innovating.</p>
        <div className="footer-links"><Link to="/about">About</Link><Link to="/contact">Contact</Link><Link to="/admin/login">Admin</Link></div>
        <small className="muted">© {new Date().getFullYear()} Industrial Intellect. All rights reserved.</small>
      </div>
    </footer>
  );
}
