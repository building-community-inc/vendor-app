import { cn } from "@/utils";
import { ComponentPropsWithoutRef, ReactNode } from "react";
export type ButtonProps = ComponentPropsWithoutRef<"button"> & {
  children: ReactNode;
  onClick?: () => void;
  className?: string;
};
const Button = ({ children, className = "", ...rest }: ButtonProps) => {
  return (
    <button
      className={cn(
        'px-10',
        'py-3',
        'flex',
        'items-center',
        'border',
        'rounded-[18px]',
        'bg-button-primary',
        "border-button-border-color",
        'text-black',
        "text-base",
        'shadow-lg',
        className,
        { 'disabled:bg-slate-400': rest.disabled }
      )}
      {...rest}
    >
      <span>
        {children}
      </span>
    </button>
  );
};

export default Button;
