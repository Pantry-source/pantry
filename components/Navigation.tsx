import Link from 'next/link';
import { useUser } from '@supabase/auth-helpers-react';

export default function Navigation() {
    const user = useUser();
    return (
        <nav className="p-6 border-b border-gray-300">
        <Link href="/">
          <span className="mr-6 cursor-pointer">Home</span>
        </Link>
        <Link href="/profile">
          <span className="mr-6 cursor-pointer">Profile</span>
        </Link>
        {
          user && (
            <Link href="/create-pantry">
              <span className="mr-6 cursor-pointer">Create Pantry</span>
            </Link>
          )
        }
      </nav>
    )
}