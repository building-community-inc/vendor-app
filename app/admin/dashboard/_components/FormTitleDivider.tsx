const FormTitleDivider = ({ title }: { title: string }) => {
  return (
    <header className="flex w-full items-center gap-2">
      <h2 className={`text-sm whitespace-nowrap font-bold`}>{title}</h2>
      <div className="flex-grow h-0 border-b border-secondary-admin-border" />
    </header>
  );
};

export default FormTitleDivider;
