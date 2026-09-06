export interface LocationPoint {
    name: string;
    latitude: number;
    longitude: number;
    source: 'search' | 'coordinates' | 'gps';
}

export interface AssessmentSite {
    id: string;
    label: string;
    name: string;
    latitude: number;
    longitude: number;
}

// Used for informational study-area messaging only; global coordinates remain valid.
export const INDIA_BOUNDS = {
    minLatitude: 6.0,
    maxLatitude: 37.5,
    minLongitude: 68.0,
    maxLongitude: 97.5,
};

export function isWithinIndiaFocus(latitude: number, longitude: number) {
    return latitude >= INDIA_BOUNDS.minLatitude
        && latitude <= INDIA_BOUNDS.maxLatitude
        && longitude >= INDIA_BOUNDS.minLongitude
        && longitude <= INDIA_BOUNDS.maxLongitude;
}