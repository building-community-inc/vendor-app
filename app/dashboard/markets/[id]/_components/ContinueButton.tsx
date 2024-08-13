import { ButtonProps } from "@/app/_components/Button";
import { cn } from "@/utils";

const ContinueButton = ({ children, className, ...rest }: ButtonProps) => {
  return (
    <button
      className={cn("uppercase bg-title-color w-full shadow-md shadow-gray-400 py-4 px-4 rounded-lg border border-primary mx-auto text-white text-lg font-roboto", className)}
      {...rest}
    >
      {children}
    </button>
  );
};

export default ContinueButton;
