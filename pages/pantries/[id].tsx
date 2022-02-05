import { useRouter } from 'next/router'
import ReactMarkdown from 'react-markdown'
import { supabase } from '../../api'

export default function Pantry({ pantry }) {
  const router = useRouter()
  if (router.isFallback) {
    return <div>Loading...</div>
  }
  return (
    <div>
      <h1 className="text-5xl mt-4 font-semibold tracking-wide">{pantry.title}</h1>
      <p className="text-sm font-light my-4">by {pantry.user_email}</p>
      <div className="mt-8">
        <ReactMarkdown className='prose' children={pantry.description} />
      </div>
    </div>
  )
}

export async function getStaticPaths() {
  const { data, error } = await supabase
    .from('pantries')
    .select('id')
  const paths = data.map(pantry => ({ params: { id: JSON.stringify(pantry.id) }}))
  return {
    paths,
    fallback: true
  }
}

export async function getStaticProps ({ params }) {
  const { id } = params
  const { data } = await supabase
    .from('pantries')
    .select()
    .filter('id', 'eq', id)
    .single()
  return {
    props: {
      pantry: data
    }
  }
}