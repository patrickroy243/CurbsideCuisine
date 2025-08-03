import React, { useRef, useEffect, useState } from 'react'
import maplibregl from 'maplibre-gl'
import 'maplibre-gl/dist/maplibre-gl.css'

export default function MapApi({
  styleUrl = 'https://tiles.openfreemap.org/styles/liberty',
  center = [168.3538, -46.4132], // fallback coords
  zoom = 12,
  width = '100%',
  height = '600px'
}) {
  const mapContainer = useRef(null)
  const mapRef = useRef(null)
  const markerRef = useRef(null)

  // state for user position & any geo errors
  const [userPos, setUserPos] = useState(center)
  const [geoError, setGeoError] = useState(null)

  // 1. Ask for permission & start watching
  useEffect(() => {
    if (!navigator.geolocation) {
      setGeoError('Geolocation not supported')
      return
    }

    const id = navigator.geolocation.watchPosition(
      ({ coords }) => {
        setUserPos([coords.longitude, coords.latitude])
      },
      (err) => {
        setGeoError(err.message)   // e.g. “User denied Geolocation”
      },
      { enableHighAccuracy: true, timeout: 10000 }
    )

    return () => navigator.geolocation.clearWatch(id)
  }, [])

  // 2. Initialize map once
  useEffect(() => {
    if (mapRef.current || !mapContainer.current) return

    mapRef.current = new maplibregl.Map({
      container: mapContainer.current,
      style: styleUrl,
      center: userPos,
      zoom
    })

    mapRef.current.addControl(new maplibregl.NavigationControl(), 'top-right')

    // add a marker for the user position
    markerRef.current = new maplibregl.Marker({ color: '#1978c8' })
      .setLngLat(userPos)
      .addTo(mapRef.current)
  }, [styleUrl, zoom])

  // 3. On each userPos update, re-center & move marker
  useEffect(() => {
    if (!mapRef.current) return

    mapRef.current.flyTo({
      center: userPos,
      zoom: Math.max(zoom, mapRef.current.getZoom()), 
      essential: true
    })

    if (markerRef.current) {
      markerRef.current.setLngLat(userPos)
    }
  }, [userPos, zoom])

  // 4. Render error prompt + map container
  return (
    <div style={{ position: 'relative', width, height }}>
      {geoError && (
        <div
          style={{
            position: 'absolute',
            top: 8,
            left: 8,
            padding: '6px 10px',
            background: 'rgba(255,255,255,0.9)',
            borderRadius: 4,
            fontSize: 12,
            zIndex: 1
          }}
        >
          Location error: {geoError}
        </div>
      )}
      <div
        ref={mapContainer}
        style={{ width: '100%', height: '100%' }}
      />
    </div>
  )
}