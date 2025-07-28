import React, { useEffect, useState } from 'react'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import Loader from './loader'

export default function MapApi({ trucks }) {
  const [ready, setReady] = useState(false)

  useEffect(() => {
    setReady(true)
  }, [])

  if (!ready) return <Loader />

  return (
    <MapContainer
      center={[37.7749, -122.4194]} 
      zoom={13}
      style={{ height: '75vh', width: '100%' }}
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      {trucks.map((truck) => (
        <Marker key={truck.id} position={[truck.lat, truck.lng]}>
          <Popup>
            <strong>{truck.name}</strong><br />
            {truck.cuisine}
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  )
}