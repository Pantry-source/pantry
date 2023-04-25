import { PlusIcon } from '@heroicons/react/20/solid';

type EmptyStateProps = {
  primaryAction: string;
  onPrimaryActionClick: () => void;
  header: string;
  subheading: string;
};

export default function EmptyState({ primaryAction, onPrimaryActionClick, header, subheading }: EmptyStateProps) {
  return (
    <div className="text-center">
      <svg
        className="mx-auto h-12 w-12 text-stone-400"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        aria-hidden="true"
      >
        <path
          vectorEffect="non-scaling-stroke"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z"
        />
      </svg>
      <h3 className="mt-2 text-sm font-semibold text-stone-900">{header}</h3>
      <p className="mt-1 text-sm text-stone-500">{subheading}</p>
      <div className="mt-6">
        <button
          type="button"
          onClick={onPrimaryActionClick}
          className="inline-flex items-center rounded-md bg-cyan-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-cyan-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-600"
        >
          <PlusIcon className="-ml-0.5 mr-1.5 h-5 w-5" aria-hidden="true" />
          {primaryAction}
        </button>
      </div>
    </div>
  );
}
