// import { BookOpen, BrainCircuit, Heart, Menu, Moon, Sun, X } from 'lucide-react';
// import { Link, NavLink } from 'react-router-dom';
// import { useState } from 'react';
// import { useTheme } from '../context/ThemeContext';

// const links = [['Home', '/'], ['Categories', '/categories'], ['About', '/about'], ['Contact', '/contact']];

// export default function Header() {
//   const { theme, toggleTheme } = useTheme();
//   const [open, setOpen] = useState(false);

//   return (
//     <header className="site-header">
//       <div className="container nav-inner">
//         <Link to="/" className="brand" onClick={() => setOpen(false)}>
//           <span className="brand-mark"><BrainCircuit size={24} /></span>
//           <span><strong>INDUSTRIAL INTELLECT</strong><small>Learn. Explore. Innovate.</small></span>
//         </Link>
//         <button className="mobile-menu icon-button" onClick={() => setOpen(!open)} aria-label="Toggle navigation">
//           {open ? <X /> : <Menu />}
//         </button>
//         <nav className={`main-nav ${open ? 'nav-open' : ''}`}>
//           {links.map(([label, path]) => <NavLink key={path} to={path} end={path === '/'} onClick={() => setOpen(false)}>{label}</NavLink>)}
//           <NavLink to="/watch-later" onClick={() => setOpen(false)}><BookOpen size={16} /> Saved</NavLink>
//           <NavLink to="/favourites" onClick={() => setOpen(false)}><Heart size={16} /> Favourites</NavLink>
//           <button className="icon-button theme-toggle" onClick={toggleTheme} aria-label="Toggle theme">{theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}</button>
//         </nav>
//       </div>
//     </header>
//   );
// }


import { BookOpen, Heart, Menu, Moon, Sun, X } from 'lucide-react';
import { Link, NavLink } from 'react-router-dom';
import { useState } from 'react';
import { useTheme } from '../context/ThemeContext';

const links = [
  ['Home', '/'],
  ['Categories', '/categories'],
  ['Courses', '/courses'],
  ['Blog', '/blog'],
  ['About', '/about'],
  ['Contact', '/contact']
];

export default function Header() {
  const { theme, toggleTheme } = useTheme();
  const [open, setOpen] = useState(false);

  return (
    <header className="site-header">
      <div className="container nav-inner">
        <Link to="/" className="brand" onClick={() => setOpen(false)}>
          <span className="brand-mark">
            <img
              src="/industrial-intellect-logo.png"
              alt="Industrial Intellect"
            />
          </span>

          <span>
            <strong>INDUSTRIAL INTELLECT</strong>
            <small>Learn. Explore. Innovate.</small>
          </span>
        </Link>

        <button
          className="mobile-menu icon-button"
          onClick={() => setOpen(!open)}
          aria-label="Toggle navigation"
        >
          {open ? <X /> : <Menu />}
        </button>

        <nav className={`main-nav ${open ? 'nav-open' : ''}`}>
          {links.map(([label, path]) => (
            <NavLink
              key={path}
              to={path}
              end={path === '/'}
              onClick={() => setOpen(false)}
            >
              {label}
            </NavLink>
          ))}

          <NavLink to="/watch-later" onClick={() => setOpen(false)}>
            <BookOpen size={16} /> Saved
          </NavLink>

          <NavLink to="/favourites" onClick={() => setOpen(false)}>
            <Heart size={16} /> Favourites
          </NavLink>

          <button
            className="icon-button theme-toggle"
            onClick={toggleTheme}
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        </nav>
      </div>
    </header>
  );
}
