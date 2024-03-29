import { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';

interface SlideOverProps {
  doneAction: string;
  title: string;
  subtitle?: string;
  onClose: () => void;
  onSubmit: (e: React.MouseEvent<HTMLButtonElement>) => void;
  open: boolean;
  children: JSX.Element;
}

export default function SlideOver({
  children,
  open = false,
  onClose,
  onSubmit,
  title,
  subtitle = '',
  doneAction
}: SlideOverProps) {
  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={onClose}>
        <div className="fixed inset-0" />

        <div className="fixed inset-0 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10 sm:pl-16">
              <Transition.Child
                as={Fragment}
                enter="transform transition ease-in-out duration-500 sm:duration-700"
                enterFrom="translate-x-full"
                enterTo="translate-x-0"
                leave="transform transition ease-in-out duration-500 sm:duration-700"
                leaveFrom="translate-x-0"
                leaveTo="translate-x-full"
              >
                <Dialog.Panel className="pointer-events-auto w-screen max-w-xl">
                  <div className="flex h-full flex-col overflow-y-scroll bg-white shadow-xl">
                    {/* Header */}
                    <div className="bg-gray-50 py-6 px-4 sm:px-6 flex-shrink-0">
                      <div className="flex items-start justify-between space-x-3">
                        <div className="space-y-1">
                          <Dialog.Title className="text-lg font-medium text-stone-900">{title}</Dialog.Title>
                          {subtitle ? <p className="text-sm text-stone-500">{subtitle}</p> : null}
                        </div>
                        <div className="flex h-7 items-center">
                          <button type="button" className="text-stone-400 hover:text-stone-500" onClick={onClose}>
                            <span className="sr-only">Close panel</span>
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Main Content */}
                    <div className="flex min-h-0 flex-1 flex-col overflow-y-scroll">{children}</div>

                    {/* Footer */}
                    <div className="flex flex-shrink-0 justify-end space-x-3 border-t border-gray-200 px-4 py-5 sm:px-6">
                      <button
                        type="button"
                        className="rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-stone-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2"
                        onClick={onClose}
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="ml-4 inline-flex justify-center rounded-md border border-transparent bg-cyan-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2"
                        onClick={onSubmit}
                      >
                        {doneAction}
                      </button>
                    </div>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
