import { ButtonProps } from "@/app/_components/Button";

const ContinueButton = ({ children, ...rest }: ButtonProps) => {
  return (
    <button
      className="uppercase bg-[#E8CA4D] w-fit py-4 px-4 rounded-full mx-auto text-black font-extrabold text-lg font-roboto"
      {...rest}
    >
      {children}
    </button>
  );
};

export default ContinueButton;
