// components/GoogleMap.tsx
'use client'

import { GoogleMap, LoadScript, MarkerF } from '@react-google-maps/api'

const containerStyle = {
    width: '100%',
    height: '400px'
}

const defaultCenter = {
    lat: 52.441979646798835,
    lng: 6.27221565391332
}

interface MapProps {
    center?: { lat: number; lng: number }
    zoom?: number
}

export default function MapComponent({ center = defaultCenter, zoom = 15 }: MapProps) {
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY

    if (!apiKey) {
        return (
            <div className="bg-gray-200 rounded-lg h-96 flex items-center justify-center">
                <p className="text-gray-500">Google Maps API key not configured</p>
            </div>
        )
    }

    return (
        <LoadScript googleMapsApiKey={apiKey}>
            <GoogleMap
                mapContainerStyle={containerStyle}
                center={center}
                zoom={zoom}
            >
                <MarkerF position={center} />
            </GoogleMap>
        </LoadScript>
    )
}