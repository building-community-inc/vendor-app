import { cn } from "@/utils";
import { ComponentPropsWithoutRef } from "react";

const RedDot = ({ className }: ComponentPropsWithoutRef<"div"> & {
  className?: string;
}) => {
  return (
    <div className={cn("rounded-full w-3 h-3 bg-red-600 absolute top-1/2 -translate-y-1/2 -left-5", className)}>
    </div>
  );
}

export default RedDot;