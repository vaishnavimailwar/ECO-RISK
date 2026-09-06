export interface GeocodingResult {
    name: string;
    latitude: number;
    longitude: number;
}

interface NominatimResult {
    display_name: string;
    lat: string;
    lon: string;
}

export async function searchLocation(query: string, signal?: AbortSignal): Promise<GeocodingResult[]> {
    const params = new URLSearchParams({
        q: query,
        format: 'jsonv2',
        limit: '5',
        addressdetails: '1',
        countrycodes: 'in',
    });
    const response = await fetch(`https://nominatim.openstreetmap.org/search?${params.toString()}`, {
        signal,
        headers: { Accept: 'application/json' },
    });

    if (!response.ok) {
        throw new Error('Location search is temporarily unavailable.');
    }

    const results = await response.json() as NominatimResult[];
    return results
        .map((result) => ({
            name: result.display_name,
            latitude: Number(result.lat),
            longitude: Number(result.lon),
        }))
        .filter((result) => Number.isFinite(result.latitude) && Number.isFinite(result.longitude));
}
