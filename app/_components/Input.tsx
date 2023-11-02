import { ComponentPropsWithoutRef } from "react";

type InputProps = ComponentPropsWithoutRef<"input">;

export const Input = ({ ...rest }: InputProps) => {
  return (
    <input {...rest} className="text-black rounded-md px-2 py-1" />
  );
};
