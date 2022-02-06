import { useState, useEffect } from 'react'
import Link from 'next/link'
import { supabase } from '../api'

export default function MyPantries() {
  const [pantries, setPantries] = useState([])
  useEffect(() => {
    fetchPantries()
  }, [])

  async function fetchPantries() {
    const user = supabase.auth.user()
    const { data } = await supabase
      .from('pantries')
      .select('*')
      .filter('user_id', 'eq', user.id)
    setPantries(data)
  }
  async function deletePantry(id) {
    await supabase
      .from('pantries')
      .delete()
      .match({ id })
    fetchPantries()
  }
  return (
    <div>
      <h1 className="text-3xl font-semibold tracking-wide mt-6 mb-2">My Pantries</h1>
      {
        pantries.map((pantry, index) => (
          <div key={index} className="border-b border-gray-300	mt-8 pb-4">
            <h2 className="text-xl font-semibold">{pantry.title}</h2>
            <p className="text-gray-500 mt-2 mb-2">Author: {pantry.user_email}</p>
            <Link href={`/edit-pantry/${pantry.id}`}><a className="text-sm mr-4 text-blue-500">Edit Pantry</a></Link>
            <Link href={`/pantries/${pantry.id}`}><a className="text-sm mr-4 text-blue-500">View Pantry</a></Link>
            <button
              className="text-sm mr-4 text-red-500"
              onClick={() => deletePantry(pantry.id)}
            >Delete Pantry</button>
          </div>
        ))
      }
    </div>
  )
}