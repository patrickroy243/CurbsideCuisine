import React from 'react'
import MapApi from '../component/mapApi'

export default function TruckMap() {
  return (
    <div style={{ height: '100vh' }}>
      <MapApi
        styleUrl="https://tiles.openfreemap.org/styles/liberty"
        center={[168.3538, -46.4132]}
        zoom={12}
        width="100%"
        height="90%"
      />
    </div>
  )
}