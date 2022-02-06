import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import dynamic from 'next/dynamic'
import "easymde/dist/easymde.min.css"
import { supabase } from '../../api'

const SimpleMDE = dynamic(() => import('react-simplemde-editor'), { ssr: false })

function EditPantry() {
  const [pantry, setPantry] = useState(null)
  const router = useRouter()
  const { id } = router.query

  useEffect(() => {
    fetchPantry()
    async function fetchPantry() {
      if (!id) return
      const { data } = await supabase
        .from('pantries')
        .select()
        .filter('id', 'eq', id)
        .single()
      setPantry(data)
    }
  }, [id])
  if (!pantry) return null
  function onChange(e) {
    setPantry(() => ({ ...pantry, [e.target.name]: e.target.value }))
  }
  const { title, description } = pantry
  async function updateCurrentPantry() {
    if (!title || !description) return
    await supabase
      .from('pantries')
      .update([
          { title, description }
      ])
      .match({ id })
    router.push('/my-pantries')
  }
  return (
    <div>
      <h1 className="text-3xl font-semibold tracking-wide mt-6 mb-2">Edit pantry</h1>
      <input
        onChange={onChange}
        name="title"
        placeholder="Title"
        value={pantry.title}
        className="border-b pb-2 text-lg my-4 focus:outline-none w-full font-light text-gray-500 placeholder-gray-500 y-2"
      /> 
      <SimpleMDE value={pantry.description} onChange={value => setPantry({ ...pantry, description: value })} />
      <button
        className="mb-4 bg-blue-600 text-white font-semibold px-8 py-2 rounded-lg"
        onClick={updateCurrentPantry}>Update Pantry</button>
    </div>
  )
}

export default EditPantry
