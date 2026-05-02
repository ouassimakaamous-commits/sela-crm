import { Dialog, DialogPanel, Transition, TransitionChild } from '@headlessui/react'
import { Fragment } from 'react'
import { X } from 'lucide-react'

export default function SlidePanel({ open, onClose, title, children }) {
  return (
    <Transition show={open} as={Fragment}>
      <Dialog onClose={onClose} className="relative z-50">
        <TransitionChild
          as={Fragment}
          enter="ease-in-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in-out duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/25 backdrop-blur-sm" />
        </TransitionChild>

        <div className="fixed inset-0 flex justify-end">
          <TransitionChild
            as={Fragment}
            enter="transform transition ease-in-out duration-300"
            enterFrom="translate-x-full"
            enterTo="translate-x-0"
            leave="transform transition ease-in-out duration-200"
            leaveFrom="translate-x-0"
            leaveTo="translate-x-full"
          >
            <DialogPanel className="w-full max-w-lg bg-white shadow-2xl flex flex-col">
              <div className="flex items-center justify-between px-6 py-4 border-b border-border flex-shrink-0">
                <span className="text-lg font-bold text-text1">{title}</span>
                <button
                  onClick={onClose}
                  className="w-8 h-8 rounded-xl bg-bg hover:bg-border flex items-center justify-center transition-colors"
                >
                  <X size={16} className="text-text2" />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-6">{children}</div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </Dialog>
    </Transition>
  )
}
