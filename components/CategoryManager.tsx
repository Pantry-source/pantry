import { PlusIcon } from '@heroicons/react/20/solid'
import * as categoryApi from '../modules/supabase/category';
import classNames from '../modules/classnames';

type CategoryManagerProps = {
    categories: categoryApi.Category[]
}

export default function CategoryManager({ categories }: CategoryManagerProps) {

    function renderCustomCategory(category: categoryApi.Category) {
        return (
            <li className="flex items-center justify-between py-3" key={category.id}>
                <div className="flex items-start gap-x-3">
                    <p className="text-sm font-semibold leading-6 text-gray-900">{ category.name }</p>
                </div>
                <button
                    type="button"
                    className="ml-6 rounded-md bg-white text-sm font-medium text-cyan-600 hover:text-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2"
                >
                    Remove<span className="sr-only"> { category.name }</span>
                </button>
            </li>
        );
    }

    function renderDefaultCategory(category: categoryApi.Category) {
        return (
            <li className="flex items-center justify-between py-3" key={category.id}>
                <div className="flex items-start gap-x-3">
                    <p className="text-sm font-semibold leading-6 text-gray-900">{ category.name }</p>
                    <p className="text-yellow-600 bg-yellow-50 ring-yellow-500/10 rounded-md whitespace-nowrap mt-0.5 px-1.5 py-0.5 text-xs font-medium ring-1 ring-inset">
                        Predefined
                    </p>
                </div>
            </li>
        );
    }

    return (
        <ul role="list" className="mt-2 divide-y divide-gray-200">
          { categories.map(category => category.user_id ? renderCustomCategory(category) : renderDefaultCategory(category)) }
        </ul>
    );
}
