import { Fragment, ReactElement, ReactNode } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { Title } from "components/Title/Title";

const CustomModal = ({
  showing,
  children,
  title,
  toggle,
}: CustomModalProps): ReactElement => (
  <Transition.Root show={showing} as={Fragment}>
    <Dialog
      as="div"
      className="fixed z-50 inset-0 overflow-y-auto font-body"
      onClose={toggle}
    >
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center md:block md:p-0">
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <Dialog.Overlay className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity cursor-pointer" />
        </Transition.Child>

        <span
          className="hidden md:inline-block md:align-middle md:h-screen"
          aria-hidden="true"
        >
          &#8203;
        </span>

        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0 translate-y-4 md:translate-y-0 md:scale-95"
          enterTo="opacity-100 translate-y-0 md:scale-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100 translate-y-0 md:scale-100"
          leaveTo="opacity-0 translate-y-4 md:translate-y-0 md:scale-95"
        >
          <div className="inline-block align-bottom bg-white rounded-xl text-left overflow-hidden transform transition-all w-full md:my-8 md:align-middle md:max-w-lg md:w-full">
            <div className="px-4 pt-5 pb-4 md:p-7 bg-primary">
              <Title>{title}</Title>

              {children}
            </div>
          </div>
        </Transition.Child>
      </div>
    </Dialog>
  </Transition.Root>
);

type CustomModalProps = {
  showing: boolean;
  toggle: () => void;
  title: string;
  children: ReactNode;
};

export default CustomModal;
