import { useState } from 'react'
import { v4 as uuid } from 'uuid'
import { useRouter } from 'next/router'
import dynamic from 'next/dynamic'
import "easymde/dist/easymde.min.css"
import { supabase } from '../api'

const SimpleMDE = dynamic(() => import('react-simplemde-editor'), { ssr: false })
const initialState = { title: '', description: '' }

function CreatePantry() {
  const [pantry, setPantry] = useState(initialState)
  const { title, description } = pantry
  const router = useRouter()
  function onChange(e) {
    setPantry(() => ({ ...pantry, [e.target.name]: e.target.value }))
  }
  async function createNewPantry() {
    if (!title || !description) return
    const user = supabase.auth.user()
    const id = uuid()
    pantry.id = id
    const { data } = await supabase
      .from('pantries')
      .insert([
          { title, description, user_id: user.id, user_email: user.email }
      ])
      .single()
    router.push(`/pantries/${data.id}`)
  }
  return (
    <div>
      <h1 className="text-3xl font-semibold tracking-wide mt-6">Create new pantry</h1>
      <input
        onChange={onChange}
        name="title"
        placeholder="Title"
        value={pantry.title}
        className="border-b pb-2 text-lg my-4 focus:outline-none w-full font-light text-gray-500 placeholder-gray-500 y-2"
      /> 
      <SimpleMDE
        value={pantry.description}
        onChange={value => setPantry({ ...pantry, description: value })}
      />
      <button
        type="button"
        className="mb-4 bg-green-600 text-white font-semibold px-8 py-2 rounded-lg"
        onClick={createNewPantry}
      >Create Pantry</button>
    </div>
  )
}

export default CreatePantry