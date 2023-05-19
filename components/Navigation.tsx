import Link from 'next/link';
import { useUser } from '@supabase/auth-helpers-react';

export default function Navigation() {
  const user = useUser();
  return (
    <nav className="p-6 border-b border-gray-300">
      <Link href="/">
        <span className="mr-6 cursor-pointer">Pantries</span>
      </Link>
      {user && (
        <>
          <Link href="/recipes">
            <span className="mr-6 cursor-pointer">Recipes</span>
          </Link>
          <Link href="/profile">
            <span className="mr-6 cursor-pointer">Profile</span>
          </Link>
          <Link href="/create-pantry">
            <span className="mr-6 cursor-pointer">Create Pantry</span>
          </Link>
        </>
      )}
    </nav>
  );
}
