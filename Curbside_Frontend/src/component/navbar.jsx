import { NavLink } from 'react-router-dom'

export default function Navbar() {
    return (
        <nav
            className="bg-sky-500 text-white h-16"
        >
            <div
                className="max-w-7xl mx-auto flex items-center px-6 h-full"
            >
                <div className="flex items-center space-x-3">
                    <img
                        src="/Images/animated_logo.gif"
                        alt="Curbside Cuisine Logo"
                        className="h-10 w-auto /* tweak logo height */"
                    />
                    <NavLink
                        to="/"
                        className={({ isActive }) =>
                            `text-xl font-semibold ${isActive ? 'opacity-100' : 'opacity-80'
                            } hover:opacity-100`
                        }
                    >
                        Curbside Cuisine
                    </NavLink>
                </div>

                <div className="ml-auto flex items-center gap-6">
                    <NavLink
                        to="/map"
                        className={({ isActive }) =>
                            `font-medium ${isActive ? 'opacity-100' : 'opacity-80'
                            } hover:opacity-100`
                        }
                    >
                        Map
                    </NavLink>

                    <NavLink
                        to="/vendor/123"
                        className={({ isActive }) =>
                            `font-medium ${isActive ? 'opacity-100' : 'opacity-80'
                            } hover:opacity-100`
                        }
                    >
                        FoodTrucks
                    </NavLink>

                    <NavLink
                        to="/login"
                        className="bg-white text-sky-500 px-4 py-2 rounded hover:bg-gray-100 font-medium"
                    >
                        Login
                    </NavLink>
                </div>
            </div>
        </nav>
    )
}