import { NavLink } from 'react-router-dom'

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="bg-sky-500 text-white py-8">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between">
        <div className="text-sm">© {year} Curbside Cuisine. All rights reserved.</div>

        <nav className="mt-4 md:mt-0 flex flex-col sm:flex-row gap-2 sm:gap-6 text-sm">
          <NavLink to="/" className="hover:underline">Home</NavLink>
          <NavLink to="/map" className="hover:underline">Map</NavLink>
          <NavLink to="/vendor/123" className="hover:underline">Foodtrucks</NavLink>
          <NavLink to="/login" className="hover:underline">Login</NavLink>
        </nav>
      </div>
    </footer>
  )
}