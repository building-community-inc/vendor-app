import { cn } from "@/utils";
import { ComponentPropsWithoutRef, ReactNode } from "react";

type TOpenCloseDropdownProps = ComponentPropsWithoutRef<"button"> & {
  isOpen: boolean;
};
const OpenCloseDropdown = ({ isOpen, ...rest }: TOpenCloseDropdownProps) => {
  return (
    <button {...rest} className="relative border border-black rounded-full w-6">
      <Bar className={cn("", { "rotate-0": isOpen, "rotate-90": !isOpen })} />
      <Bar className={cn("", { "rotate-0": isOpen, "rotate-360 duration-1000": !isOpen })} />
    </button>
  );
}

export default OpenCloseDropdown;


const Bar = ({ className, ...rest }: ComponentPropsWithoutRef<"div">) => {
  return (
    <div {...rest} className={cn(`origin-center duration-500 absolute top-1/2 -translate-x-1/2 -translate-y-1/2 left-1/2 transform w-2 h-0.5 bg-black transition-all`, className)} />
  )
}