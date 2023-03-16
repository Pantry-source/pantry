import { useState, useEffect } from 'react'
import Link from 'next/link'
import * as pantryApi from '../modules/supabase/pantry';
import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'
import { useUser, useSessionContext, useSupabaseClient } from '@supabase/auth-helpers-react';

export default function Home() {
  const supabaseClient = useSupabaseClient();
  const { isLoading, session, error } = useSessionContext();
  const [pantries, setPantries] = useState<pantryApi.Pantry[]>([]);
  const user = useUser();
  useEffect(() => {
    if (user) {
      fetchPantries();
    }
  }, [user]);

  async function fetchPantries() {
    const { data } = await pantryApi.fetchAll();
    if (data) {
      setPantries(data);
    }
  }
  async function deleteById(id: number) {
    await pantryApi.deleteById(id);
    fetchPantries();
  }
  if (!session) {
    return (
      <Auth
        redirectTo="http://localhost:3000/"
        appearance={{ theme: ThemeSupa }}
        supabaseClient={supabaseClient}
        providers={['google', 'github']}
        socialLayout="horizontal"
      />
    )
  }
  return (
    <div>
      <h1 className="text-3xl font-semibold tracking-wide mt-6 mb-2">My Pantries</h1>
      {
        pantries.map((pantry, index) => (
          <div key={index} className="border-b border-gray-300	mt-8 pb-4">
            <h2 className="text-xl font-semibold">{pantry.title}</h2>
            <Link href={`/edit-pantry/${pantry.id}`}><a className="text-sm mr-4 text-blue-500">Edit Pantry</a></Link>
            <Link href={`/pantries/${pantry.id}`}><a className="text-sm mr-4 text-blue-500">View Pantry</a></Link>
            <button
              className="text-sm mr-4 text-red-500"
              onClick={() => deleteById(pantry.id)}
            >Delete Pantry</button>
          </div>
        ))
      }
    </div>
  )
}
