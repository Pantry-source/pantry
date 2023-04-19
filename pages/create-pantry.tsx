import { useState } from 'react';
import { v4 as uuid } from 'uuid';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';
import 'easymde/dist/easymde.min.css';
import { useUser } from '@supabase/auth-helpers-react';
import * as pantryApi from '../modules/supabase/pantry';

const SimpleMDE = dynamic(() => import('react-simplemde-editor'), { ssr: false });
const initialState = { id: '', title: '', description: '' };

function CreatePantry() {
  const [pantry, setPantry] = useState(initialState);
  const { title, description } = pantry;
  const router = useRouter();
  const user = useUser();
  function onChange(e: React.ChangeEvent<HTMLInputElement>) {
    setPantry(() => ({ ...pantry, [e.target.name]: e.target.value }));
  }
  async function createNewPantry() {
    if (!title || !description || !user) return;
    const { id } = user;
    const newPantryId = uuid();
    pantry.id = newPantryId;
    const { data } = await pantryApi.create(title, description, id);
    if (data) {
      router.push(`/pantries/${data.id}`);
    }
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
      <SimpleMDE value={pantry.description} onChange={(value) => setPantry({ ...pantry, description: value })} />
      <button
        type="button"
        className="mb-4 bg-green-600 text-white font-semibold px-8 py-2 rounded-lg"
        onClick={createNewPantry}
      >
        Create Pantry
      </button>
    </div>
  );
}

export default CreatePantry;
