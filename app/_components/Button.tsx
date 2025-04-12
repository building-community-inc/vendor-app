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
        'font-darker-grotesque',
        'font-semibold',
        'hover:bg-[#e7e0da]',
        'transition-all',
        'disabled:bg-gray-300',
        'disabled:text-gray-500',
        'cursor-pointer',
        className,
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
