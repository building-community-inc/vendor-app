import { cn } from "@/utils"
import { ComponentPropsWithoutRef } from "react"

const Box = ({ children, className = "" }: ComponentPropsWithoutRef<"section"> & {
  children: React.ReactNode,
  className?: string
}) => {
  return (
    <section className={cn("shadow-lg w-[544px] shadow-[#00000029] border border-[#C5B5A4] rounded-lg p-10 flex flex-col items-center", className)}>
      {children}
    </section>
  )
}

export default Box