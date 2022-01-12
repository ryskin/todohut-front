import { Popover as HeadlessPopover } from "@headlessui/react";
import { useState } from "react";
import { usePopper } from "react-popper";

export const Popover = ({
  children,
  clickComponent,
}: {
  children: JSX.Element;
  clickComponent: JSX.Element;
}) => {
  let [referenceElement, setReferenceElement] = useState<any>();
  let [popperElement, setPopperElement] = useState<any>();
  let { styles, attributes } = usePopper(referenceElement, popperElement);

  return (

    <HeadlessPopover>
      <div ref={setReferenceElement}>
        <HeadlessPopover.Button>
        {clickComponent}
        </HeadlessPopover.Button>
      </div>

      <HeadlessPopover.Panel
        className="absolute bg-white rounded-md shadow-lg p-4 z-50"
        ref={setPopperElement}
        style={styles.popper}
        {...attributes.popper}
      >
        {children}
      </HeadlessPopover.Panel>
    </HeadlessPopover>
  );
};
