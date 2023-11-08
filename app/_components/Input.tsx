import { ComponentPropsWithoutRef } from "react";

type InputProps = ComponentPropsWithoutRef<"input"> & {
  className?: string;
};

export const Input = ({ className, ...rest }: InputProps) => {
  return (
    <input {...rest} className={`text-black rounded-md px-2 py-1 ${className}`} />
  );
};
