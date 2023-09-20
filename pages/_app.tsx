import Navigation from '../components/Navigation';
import { useState } from 'react';
import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { createBrowserSupabaseClient } from '@supabase/auth-helpers-nextjs';
import { SessionContextProvider, Session } from '@supabase/auth-helpers-react';
import type { Database } from '../types/generated/supabase';

function MyApp({
  Component,
  pageProps
}: AppProps<{
  initialSession: Session;
}>) {
  const [supabaseClient] = useState(() => createBrowserSupabaseClient<Database>());
  return (
    <SessionContextProvider supabaseClient={supabaseClient} initialSession={pageProps.initialSession}>
      <div className='h-screen flex flex-col'>
        <Navigation />
        <div className="py-8 px-10 container flex-1 mx-auto">
          <Component {...pageProps} />
        </div>
      </div>
    </SessionContextProvider>
  );
}

export default MyApp;
