import { useState, useEffect, useRef } from "react";
import { MapPin } from "lucide-react";
import { searchAddress } from "../../api/geocode.api";

export default function AddressAutocomplete({ onSelect }) {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const debounceRef = useRef(null);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(() => {
      if (query.trim().length < 3) {
        setSuggestions([]);
        return;
      }

      searchAddress(query).then((res) => {
        setSuggestions(res.results || []);
        setShowSuggestions(true);
      });
    }, 400);

    return () => clearTimeout(debounceRef.current);
  }, [query]);

  const handleSelect = (result) => {
    setQuery(result.displayName);
    setShowSuggestions(false);
    onSelect(result);
  };

  return (
    <div className="relative">
      <div className="relative">
        <MapPin size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => query.length >= 3 && setShowSuggestions(true)}
          placeholder="Start typing your address..."
          className="w-full pl-9 pr-4 py-2.5 rounded-lg border border-primary-100 font-body text-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-100 outline-none transition"
        />
      </div>

      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute z-[9999] mt-1 w-full bg-white rounded-lg shadow-card-hover border border-primary-100 max-h-56 overflow-y-auto">
          {suggestions.map((result, index) => (
            <button
              key={index}
              type="button"
              onClick={() => handleSelect(result)}
              className="w-full text-left px-4 py-2.5 text-sm font-body hover:bg-primary-50 transition border-b border-primary-50 last:border-0"
            >
              {result.displayName}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}