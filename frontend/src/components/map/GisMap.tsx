import { useEffect } from 'react';
import { CircleMarker, MapContainer, TileLayer, useMap } from 'react-leaflet';
import { Layers3 } from 'lucide-react';
import { AssessmentSite, LocationPoint } from '../../types/location';

const INDIA_CENTER: [number, number] = [22.5, 79.0];

interface GisMapProps {
    selectedLocation: LocationPoint | null;
    currentLocation: LocationPoint | null;
    sites: AssessmentSite[];
}

function MapViewport({ selectedLocation }: { selectedLocation: LocationPoint | null }) {
    const map = useMap();

    useEffect(() => {
        if (selectedLocation) {
            map.flyTo([selectedLocation.latitude, selectedLocation.longitude], 16, { duration: 1.1 });
        }
    }, [map, selectedLocation]);

    return null;
}

export default function GisMap({ selectedLocation, currentLocation, sites }: GisMapProps) {
    return (
        <div className="map-frame">
            <MapContainer center={INDIA_CENTER} zoom={5} scrollWheelZoom className="gis-map">
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <MapViewport selectedLocation={selectedLocation} />
                {selectedLocation && (
                    <CircleMarker
                        center={[selectedLocation.latitude, selectedLocation.longitude]}
                        radius={10}
                        pathOptions={{
                            color: selectedLocation.source === 'gps' ? '#6b4ea0' : '#2569a9',
                            fillColor: selectedLocation.source === 'gps' ? '#a384ce' : '#73a9d4',
                            fillOpacity: 0.9,
                            weight: 3,
                        }}
                    />
                )}
                {currentLocation && (
                    <CircleMarker
                        center={[currentLocation.latitude, currentLocation.longitude]}
                        radius={15}
                        pathOptions={{ color: '#6b4ea0', fillColor: '#a384ce', fillOpacity: 0.18, weight: 2, dashArray: '5 5' }}
                    />
                )}
                {sites.map((site) => (
                    <CircleMarker
                        key={site.id}
                        center={[site.latitude, site.longitude]}
                        radius={9}
                        pathOptions={{
                            color: site.label === 'Site A' ? '#236b4f' : site.label === 'Site B' ? '#9a6915' : '#9c4848',
                            fillColor: site.label === 'Site A' ? '#5da37e' : site.label === 'Site B' ? '#d5a33d' : '#c86c6c',
                            fillOpacity: 1,
                            weight: 3,
                        }}
                    />
                ))}
            </MapContainer>
            <div className="map-mode-label">
                <Layers3 size={16} />
                <div>
                    <strong>GIS EXPLORATION MODE</strong>
                    <span>Select locations for environmental assessment</span>
                </div>
            </div>
            <div className="map-location-label">India-focused study area</div>
        </div>
    );
}