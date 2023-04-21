import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import dynamic from 'next/dynamic'
import "easymde/dist/easymde.min.css"
import supabase from '../../api'
import { stringify } from 'querystring'
import * as pantryApi from '../../modules/supabase/pantry';

const SimpleMDE = dynamic(() => import('react-simplemde-editor'), { ssr: false })

function EditPantry() {
  const [pantry, setPantry] = useState<pantryApi.Pantry>();
  const router = useRouter();
  const { id } = router.query;

  // string[] | string | undefined is the router.query type so its not the best to work with. Convert to string | undefined
  const pantryId = Array.isArray(id) ? id[0] : id;

  useEffect(() => {
    fetchPantry()
    async function fetchPantry() {
      if (!pantryId) return
      const { data } = await pantryApi.fetchById(pantryId);
      if (data) {
        setPantry(data);
      }
    }
  }, [id])
  
  if (!pantry) return null;
  const { title, description } = pantry
  async function updateCurrentPantry() {
    if (!title || !description) return
    await supabase
      .from('pantries')
      .update({ title, description })
      .match({ id })
    router.push('/my-pantries')
  }
  return (
    <div>
      <h1 className="text-3xl font-semibold tracking-wide mt-6 mb-2">Edit pantry</h1>
      <input
        onChange={event => setPantry({ ...pantry, title: event.target.value })}
        name="title"
        placeholder="Title"
        value={pantry.title}
        className="border-b pb-2 text-lg my-4 focus:outline-none w-full font-light text-stone-500 placeholder-gray-500 y-2"
      />
      <SimpleMDE value={pantry?.description || undefined} onChange={value => setPantry({ ...pantry, description: value })} />
      <button
        className="mb-4 bg-blue-600 text-white font-semibold px-8 py-2 rounded-lg"
        onClick={updateCurrentPantry}>Update Pantry</button>
    </div>
  )
}

export default EditPantry
