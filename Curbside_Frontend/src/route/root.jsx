import { Routes, Route, Navigate } from 'react-router-dom'
import Navbar from '../component/navbar'
import Home from '../page/home'
import Login from '../page/login'
import Vendor from '../page/vendor'

export default function RootRoute() {
  return (
    <>
      <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/vendor/:id" element={<Vendor />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    </>
  )
}