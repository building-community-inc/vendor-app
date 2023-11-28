const TableView = ({
  amount,
  title,
  type = "available",
}: {
  amount: number;
  title: string;
  type?: "available" | "applied" | "confirmed";
}) => {
  const colors = {
    confirmed: "#26AE05",
    available: "#03628D",
    applied: "#DBE20E",
  };
  return (
    <div
      className={`flex flex-col font-roboto items-center p-2 py-4 border-4 w-fit rounded-[20px]`}
      style={{ borderColor: colors[type] }}
    >
      <strong className="text-xs font-extrabold">{title}</strong>
      <p className="font-extrabold text-2xl">{amount}</p>
    </div>
  );
};

export default TableView;