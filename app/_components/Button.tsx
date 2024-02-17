import { ComponentPropsWithoutRef, ReactNode } from "react";
export type ButtonProps = ComponentPropsWithoutRef<"button"> & {
  children: ReactNode;
  onClick?: () => void;
  className?: string;
};
const Button = ({ children, className = "", ...rest }: ButtonProps) => {
  return (
    <button
      className={`px-3 py-1.5 border rounded-md bg-secondary text-black capitalize ${className} disabled:bg-slate-400`}
      {...rest}
    >
      {children}
    </button>
  );
};

export default Button;
