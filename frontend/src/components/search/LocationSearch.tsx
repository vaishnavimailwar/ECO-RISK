import { FormEvent, useEffect, useRef, useState } from 'react';
import { Loader2, Search } from 'lucide-react';
import { searchLocation } from '../../services/geocoding';
import { LocationPoint } from '../../types/location';

interface LocationSearchProps {
    onLocationFound: (location: LocationPoint) => void;
}

export default function LocationSearch({ onLocationFound }: LocationSearchProps) {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<LocationPoint[]>([]);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const requestController = useRef<AbortController | null>(null);

    useEffect(() => () => requestController.current?.abort(), []);

    const handleSubmit = async (event: FormEvent) => {
        event.preventDefault();
        const trimmedQuery = query.trim();
        if (!trimmedQuery) {
            setMessage('Enter a place name, address or landmark.');
            return;
        }

        requestController.current?.abort();
        const controller = new AbortController();
        requestController.current = controller;
        setLoading(true);
        setMessage('');
        setResults([]);

        try {
            const locations = await searchLocation(trimmedQuery, controller.signal);
            if (locations.length === 0) {
                setMessage('No matching locations found. Try a broader search.');
            } else {
                setResults(locations.map((location) => ({ ...location, source: 'search' })));
            }
        } catch (error) {
            if (!(error instanceof DOMException && error.name === 'AbortError')) {
                setMessage(error instanceof Error ? error.message : 'Unable to search for that location.');
            }
        } finally {
            if (!controller.signal.aborted) setLoading(false);
        }
    };

    const selectResult = (location: LocationPoint) => {
        setQuery(location.name);
        setResults([]);
        setMessage('');
        onLocationFound(location);
    };

    return (
        <>
            <form className="search-field" onSubmit={handleSubmit}>
                <Search size={17} aria-hidden="true" />
                <input
                    type="search"
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    placeholder="Search location, landmark or address"
                    aria-label="Search location"
                />
                <button type="submit" className="icon-button" aria-label="Search location" disabled={loading}>
                    {loading ? <Loader2 size={16} className="spin" /> : <Search size={16} />}
                </button>
            </form>
            {results.length > 0 && (
                <div className="search-results" role="listbox" aria-label="Location search results">
                    {results.map((result) => (
                        <button type="button" key={`${result.latitude}-${result.longitude}`} onClick={() => selectResult(result)}>
                            <strong>{result.name.split(',')[0]}</strong>
                            <span>{result.name}</span>
                        </button>
                    ))}
                </div>
            )}
            {message && <p className="field-message field-message--error">{message}</p>}
            {!message && <p className="field-helper">Search cities, villages, districts, addresses or landmarks across India.</p>}
        </>
    );
}