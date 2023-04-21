import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'
import { useUser, useSupabaseClient } from '@supabase/auth-helpers-react'

export default function AuthProfile() {
  const user = useUser()
  const supabaseClient = useSupabaseClient()
  if (!user) {
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
    <>
      <p>Signed in: {user.email}</p>
      <button
        type="button"
        className="mb-4 bg-cyan-600 text-white px-8 py-2 rounded-lg"
        onClick={() => supabaseClient.auth.signOut()}
      >Sign out</button>
    </>
  )
}
