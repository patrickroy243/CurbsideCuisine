import { Routes, Route, Navigate } from 'react-router-dom'
import Navbar from '../component/navbar'
import Home from '../page/home'
import Login from '../page/login'
import Vendor from '../page/vendor'
import TruckMap from '../page/truckmap' 
import Register from '../page/register'
import VendorRegister from '../page/vendorRegister'

export default function RootRoute() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/vendor/:id" element={<Vendor />} />
        <Route path="/map" element={<TruckMap />} />
        <Route path="/signup" element={<Register />} />
        <Route path="/vendor-signup" element={<VendorRegister />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  )
}