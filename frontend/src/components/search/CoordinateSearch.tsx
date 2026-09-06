import { FormEvent, useState } from 'react';
import { LocateFixed } from 'lucide-react';
import { isWithinIndiaFocus, LocationPoint } from '../../types/location';

interface CoordinateSearchProps {
    onLocationFound: (location: LocationPoint) => void;
}

function parseCoordinatePair(value: string): [number, number] | null {
    const parts = value.split(',').map((part) => Number(part.trim()));
    if (parts.length !== 2 || parts.some((part) => !Number.isFinite(part))) return null;
    return [parts[0], parts[1]];
}

function isValidCoordinates(latitude: number, longitude: number) {
    return latitude >= -90 && latitude <= 90 && longitude >= -180 && longitude <= 180;
}

export default function CoordinateSearch({ onLocationFound }: CoordinateSearchProps) {
    const [pair, setPair] = useState('');
    const [latitude, setLatitude] = useState('');
    const [longitude, setLongitude] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = (event: FormEvent) => {
        event.preventDefault();
        const parsedPair = pair.trim() ? parseCoordinatePair(pair) : null;
        const parsedLatitude = parsedPair?.[0] ?? Number(latitude.trim());
        const parsedLongitude = parsedPair?.[1] ?? Number(longitude.trim());

        if (!Number.isFinite(parsedLatitude) || !Number.isFinite(parsedLongitude) || !isValidCoordinates(parsedLatitude, parsedLongitude)) {
            setMessage('Enter valid coordinates between -90/90 latitude and -180/180 longitude.');
            return;
        }

        setMessage(isWithinIndiaFocus(parsedLatitude, parsedLongitude)
            ? ''
            : 'This location is outside the India-focused study area. Assessment can still be explored in the prototype.');
        onLocationFound({
            name: `Coordinates ${parsedLatitude.toFixed(5)}, ${parsedLongitude.toFixed(5)}`,
            latitude: parsedLatitude,
            longitude: parsedLongitude,
            source: 'coordinates',
        });
    };

    return (
        <form onSubmit={handleSubmit}>
            <input
                className="coordinate-pair-input"
                value={pair}
                onChange={(event) => setPair(event.target.value)}
                placeholder="17.3297, 76.8343"
                aria-label="Coordinates as latitude, longitude"
            />
            <p className="coordinate-or">Or enter separately</p>
            <div className="coordinate-fields">
                <label>
                    <span>Latitude</span>
                    <input type="text" value={latitude} onChange={(event) => setLatitude(event.target.value)} placeholder="17.3297" aria-label="Latitude" />
                </label>
                <label>
                    <span>Longitude</span>
                    <input type="text" value={longitude} onChange={(event) => setLongitude(event.target.value)} placeholder="76.8343" aria-label="Longitude" />
                </label>
            </div>
            <button type="submit" className="secondary-button">
                <LocateFixed size={16} />
                Locate Coordinates
            </button>
            {message && <p className={`field-message ${message.startsWith('This location is outside') ? 'field-message--info' : 'field-message--error'}`}>{message}</p>}
        </form>
    );
}

