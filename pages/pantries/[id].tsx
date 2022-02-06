import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import ReactMarkdown from 'react-markdown'
import { supabase } from '../../api'

export default function Pantry() {
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
  return (
    <div>
      <h1 className="text-5xl mt-4 font-semibold tracking-wide">{pantry.title}</h1>
      <p className="text-sm font-light my-4">by {pantry.user_email}</p>
      <div className="mt-8">
        <ReactMarkdown className='prose'>
          { pantry.description }
        </ReactMarkdown>
      </div>
    </div>
  )
}
