const ContinueButton = ({ children }: { children: React.ReactNode }) => {
  return (
    <button
      type="button"
      className="uppercase bg-[#E8CA4D] w-fit py-4 px-4 rounded-full mx-auto text-black font-extrabold text-lg font-roboto"
    >
      {children}
    </button>
  );
};

export default ContinueButton;
