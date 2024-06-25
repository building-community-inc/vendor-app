"use client"
import { forwardRef } from "react";
import "./Dialog.css";
import { cn } from "@/utils";

type Props = {
  children: React.ReactNode;
  toggleDialog: () => void;
  className?: string;
};

const Dialog = forwardRef<HTMLDialogElement, Props>(
  ({ children, toggleDialog, className = "" }, ref) => {
    return (
      <dialog
        ref={ref}
        onClick={(e) => {
          if (e.currentTarget === e.target) {
            toggleDialog();
          }
        }}
        className={cn("p-5", className)}
      >
        {children}
      </dialog>
    );
  }
);

Dialog.displayName = "Dialog";

export default Dialog;