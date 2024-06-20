import { forwardRef } from "react";

type Props = {
  children: React.ReactNode;
  toggleDialog: () => void;
};

const Dialog = forwardRef<HTMLDialogElement, Props>(
  ({ children, toggleDialog }, ref) => {
    return (
      <dialog
        ref={ref}
        onClick={(e) => {
          if (e.currentTarget === e.target) {
            toggleDialog();
          }
        }}
        className="p-5"
      >
        {children}
      </dialog>
    );
  }
);

Dialog.displayName = "Dialog";

export default Dialog;