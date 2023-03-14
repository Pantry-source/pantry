import { useState, useEffect } from 'react'
import Link from 'next/link'
import { supabase } from '../api'

export default function Home() {
  const [pantries, setPantries] = useState([])
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    fetchPantries()
  }, [])
  async function fetchPantries() {
    const { data, error } = await supabase
      .from('pantries')
      .select()
    setPantries(data)
    setLoading(false)
  }
  if (loading) return <p className="text-2xl">Loading ...</p>
  if (!pantries || !pantries.length) return <p className="text-2xl">No pantries.</p>
  return (
    <div>
      <h1 className="text-3xl font-semibold tracking-wide mt-6 mb-2">Pantries</h1>
      {
        pantries.map(pantry => (
          <Link key={pantry.id} href={`/pantries/${pantry.id}`}>
            <div className="cursor-pointer border-b border-gray-300	mt-8 pb-4">
              <h2 className="text-xl font-semibold">{pantry.title}</h2>
            </div>
          </Link>)
        )
      }
    </div>
  )
}
