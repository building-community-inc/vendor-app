import { ComponentPropsWithoutRef, ReactNode } from "react";
type ButtonProps = ComponentPropsWithoutRef<"button"> & {
  children: ReactNode;
  onClick?: () => void;
  className?: string;
}
const Button = ({children, className = ""}: ButtonProps) => {
  return (
    <button className={`px-3 py-1.5 border rounded-md bg-secondary text-black ${className} disabled:bg-red-500`}>
      {children}
    </button>
  );
}

export default Button;