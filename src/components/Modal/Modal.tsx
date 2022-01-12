import { Dialog, Transition } from "@headlessui/react";
import { useEffect } from "react";
import { cloneElement, Fragment, useState } from "react";

export const Modal = ({
  title,
  children,
  clickComponent,
  closeFromParent,
}: {
  title: string;
  children: JSX.Element;
  clickComponent?: any;
  closeFromParent?: boolean;
}) => {
  let [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    closeModal();
  }, [closeFromParent])

  function closeModal() {
    setIsOpen(false);
  }

  function openModal() {
    setIsOpen(true);
  }

  const handleOpen = () => {
    openModal();
  };

  return (
    <div>
      {clickComponent ? (
        <div onClick={handleOpen}>{clickComponent}</div>
      ) : (
        <button
          type="button"
          onClick={handleOpen}
          className="px-4 py-2 text-sm font-medium text-white bg-black rounded-md bg-opacity-20 hover:bg-opacity-30 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75"
        >
          Open dialog
        </button>
      )}
      <Transition appear show={isOpen} as={Fragment}>
        <div className="fixed inset-0 flex items-center justify-center backdrop-blur-sm">
          <Dialog
            as="div"
            className="fixed inset-0 overflow-y-auto"
            onClose={closeModal}
          >
            <div className="min-h-screen px-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <Dialog.Overlay className="fixed inset-0" />
              </Transition.Child>

              {/* This element is to trick the browser into centering the modal contents. */}
              <span
                className="inline-block h-screen align-middle"
                aria-hidden="true"
              >
                &#8203;
              </span>
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <div className="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900"
                  >
                    {title}
                  </Dialog.Title>
                  <div className="mt-2">
                    {cloneElement(children, { closeModal  })}
                  </div>
                </div>
              </Transition.Child>
            </div>
          </Dialog>
        </div>
      </Transition>
    </div>
  );
};
