import { cn } from "@/utils";
import { ComponentPropsWithoutRef, ReactNode } from "react";

type TOpenCloseDropdownProps = ComponentPropsWithoutRef<"button"> & {
  isOpen: boolean;
  theme: "light" | "dark";
};
const OpenCloseDropdown = ({ isOpen, theme, ...rest }: TOpenCloseDropdownProps) => {
  return (
    <button {...rest} className={cn(
      "relative border rounded-full w-6",
      { "border-black": theme === 'light' },
      { "border-white": theme === 'dark' },
    )}>
      <Bar className={cn("", { "rotate-0": isOpen, "rotate-90": !isOpen })} theme={theme}/>
      <Bar className={cn("", { "rotate-0": isOpen, "rotate-360 duration-1000": !isOpen })} theme={theme}/>
    </button>
  );
}

export default OpenCloseDropdown;


const Bar = ({ className, theme = "light", ...rest }: ComponentPropsWithoutRef<"div"> & {
  theme?: "light" | "dark";
}) => {
  return (
    <div {...rest} className={cn(
      `origin-center duration-500 absolute top-1/2 -translate-x-1/2 -translate-y-1/2 left-1/2 transform w-2 h-0.5 transition-all`,
      { "bg-white": theme === 'dark' },
      { "bg-black": theme === 'light' },
      className
    )} />
  )
}