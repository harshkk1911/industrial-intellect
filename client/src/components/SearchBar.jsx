import { Search } from 'lucide-react';

export default function SearchBar({ value, onChange, placeholder = 'Search videos, courses and articles...' }) {
  return (
    <label className="search-bar">
      <Search size={19} />
      <input value={value} onChange={event => onChange(event.target.value)} placeholder={placeholder} />
      <kbd>⌘ K</kbd>
    </label>
  );
}
