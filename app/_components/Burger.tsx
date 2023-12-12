
type BurgerProps = {
  onClickHandler?: React.MouseEventHandler<HTMLDivElement>;
  isNavOpen: boolean;
  barColor?: string;
}

const Burger = ({ onClickHandler, isNavOpen, barColor }: BurgerProps) => {
  return (
    <div className="flex justify-center items-center" onClick={onClickHandler}>
      <div className="relative grid place-content-center z-50 gap-2 cursor-pointer ">
        <Bar
          rotateZ={!isNavOpen ? "rotate-0" : "rotate-45 translate-y-3"}
          barColor={barColor}
          width="w-7"
        />
        <Bar
          width={isNavOpen ? "w-0" : "w-7"}
          barColor={barColor}
        />
        <Bar
          rotateZ={!isNavOpen ? "rotate-0" : "-rotate-45 -translate-y-2"}
          barColor={barColor}
          width="w-7"
        />
      </div>
    </div>
  );
};
type BarProps = {
  width?: string;
  rotateZ?:
    | "rotate-45 translate-y-3"
    | "-rotate-45 -translate-y-2"
    | "rotate-0";
  barColor?: string;
}
const Bar = ({
  width = "w-10",
  rotateZ = "rotate-0",
  barColor = "bg-black",
}: BarProps) => {
  return (
    <div
      className={`${width} ${rotateZ} transition-all h-[2px]  ${barColor} rounded-md`}
      style={{ transformOrigin: 'center' }}

    />
  );
};
export default Burger;
