import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import Loader from '../component/loader'

export default function Vendor() {
    const { id } = useParams()
    const [vendor, setVendor] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetch(`/api/vendors/${id}`)
            .then((res) => res.json())
            .then((data) => {
                setVendor(data)
                setLoading(false)
            })
            .catch(() => setLoading(false))
    }, [id])

    if (loading) return <Loader />
    if (!vendor)
        return <p className="text-center text-gray-600 mt-8">Foodtruck not found</p>

    return (
        <div className="max-w-lg mx-auto mt-8 bg-white p-6 rounded shadow">
            <h2 className="text-2xl font-bold text-sky-500 mb-4">{vendor.name}</h2>
            <p className="mb-2">
                <span className="font-semibold">Cuisine:</span> {vendor.cuisine}
            </p>
            <p className="mb-2">
                <span className="font-semibold">Location:</span> {vendor.locationDescription}
            </p>
        </div>
    )
}