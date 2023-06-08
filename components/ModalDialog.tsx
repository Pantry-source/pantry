import { Fragment } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { XMarkIcon } from '@heroicons/react/20/solid';

interface ModalProps {
  onClose: () => void;
  onDone: (e: React.MouseEvent<HTMLButtonElement>) => void;
  title: string,
  subtitle?: string,
  doneAction: string,
  open: boolean;
  children: JSX.Element;
}

export default function ModalDialog({
  children,
  open = false,
  onClose,
  onDone,
  title,
  subtitle,
  doneAction
}: ModalProps) {
  return (
    <Transition.Root show={open} as={Fragment} appear>
      <Dialog as="div" className="relative z-10" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-25 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 overflow-y-auto p-4 sm:p-6 md:p-20">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <Dialog.Panel className="mx-auto max-w-5xl transform overflow-hidden rounded-xl bg-white shadow-2xl ring-1 ring-black ring-opacity-5 transition-all">
              <div className="relative flex flex-col w-full overflow-hidden bg-white shadow-2xl">
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
                <div className="flex-1 overflow-y-scroll">{children}</div>

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
                    onClick={onDone}
                  >
                    {doneAction}
                  </button>
                </div>
              </div>
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  )
}
