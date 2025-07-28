import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import SearchBar from '../component/searchbar'
import Footer from '../component/footer'

export default function Home() {
    const [query, setQuery] = useState('')
    const handleSearch = e => setQuery(e.target.value)

    return (
        <div className="overflow-x-hidden">
            <div
                className="text-center px-6 py-46 
                bg-[url('../Images/homedivimg.jpg')] bg-cover bg-center bg-no-repeat"
            >
                <h1 className="text-5xl md:text-6xl font-bold text-zinc-800">
                    Welcome to Curbside Cuisine
                </h1>

                
                <p className="mt-6 text-gray-100 text-lg md:text-xl">
                    Find your favorite food trucks, live.
                </p>

                <div className="mt-10">
                    <SearchBar
                        value={query}
                        onChange={handleSearch}
                        placeholder="Search cuisine, truck name or location..."
                    />
                </div>

                <Link to="/map">
                    <button className="mt-8 bg-sky-500 hover:bg-sky-600 text-white font-semibold px-8 py-3 rounded shadow text-lg">
                        View Map
                    </button>
                </Link>
            </div>

            <div className=" -mx-6 bg-sky-300 py-36">
                <div className="max-w-5xl mx-auto flex flex-col-reverse md:flex-row items-center justify-between gap-y-8 md:gap-x-16">
                    <div className="md:w-1/2 text-left md:pl-9">
                        <h2 className="text-2xl md:text-4xl font-bold text-black">
                            Food Truck Finder – Foodies
                        </h2>
                        <p className="mt-4 text-gray-700 text-base md:text-2xl">
                            Not sure where to go for lunch? Which trucks are at your
                            favorite brewery? Curbside Cuisine has you covered! With
                            Curbside Cuisine you can:
                        </p>
                        <ul className="list-disc list-inside space-y-2 mt-4 text-gray-700 text-base">
                            <li>Find trucks on our interactive map</li>
                            <li>View menus</li>
                            <li>Read & leave reviews</li>
                            <li>View & post food pics</li>
                            <li>Stay connected to upcoming events</li>
                        </ul>
                    </div>
                    <div className="md:w-1/2 flex justify-end md:pr-9">
                        <img
                            src="../Images/promoImg.gif"
                            alt="Food Truck"
                            className="max-w-xs h-auto"
                        />
                    </div>
                </div>
            </div>

            <div className="mt-0 -mx-6 bg-zinc-200 py-36">
                <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-y-8 md:gap-x-16">
                    <div className="md:w-1/2 flex justify-start md:pl-9">
                        <img
                            src="../Images/promo2divImg.gif"
                            alt="Vendor App"
                            className="max-w-xs h-auto"
                        />
                    </div>
                    <div className="md:w-1/2 text-left md:pr-9">
                        <h2 className="text-2xl md:text-4xl font-bold text-black">
                            Food Truck Owners
                        </h2>
                        <p className="mt-10 text-gray-700 text-base md:text-2xl">
                            If you own and operate a food truck, Curbside Cuisine will be
                            your best friend! Curbside Cuisine is passionate about food
                            trucks and wants to help you succeed with yours. With
                            Curbside Cuisine you can: Show your location so more customers can
                            find you
                        </p>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    )
}