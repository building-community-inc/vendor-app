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
        'px-3',
        'flex',
        'items-center',
        'border',
        'rounded-md',
        'bg-secondary',
        'text-black',
        'capitalize',
        "text-sm",
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
