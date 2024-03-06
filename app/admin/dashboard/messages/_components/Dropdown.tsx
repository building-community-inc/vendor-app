"use client";
import { ReactNode, useEffect, useRef, useState } from "react";
import OpenCloseDropdown from "./OpenCloseDropdown";

const Dropdown = ({ children, title, theme = "light", onClick }: {
  children: ReactNode;
  title: string;
  theme?: "light" | "dark";
  onClick?: () => void;
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (contentRef.current) {
      contentRef.current.style.maxHeight = isDropdownOpen ? `${contentRef.current.scrollHeight}px` : '0';
    }
  }, [isDropdownOpen]);

  const handleClick = () => {
    setIsDropdownOpen(!isDropdownOpen);
    if (onClick) onClick();
  }

  return (
    <div className="pb-4">
      <div className="flex justify-between">

        <span className="font-bold">
          {title}
        </span>

        <OpenCloseDropdown theme={theme} isOpen={isDropdownOpen} onClick={handleClick} />
      </div>
      <div
        ref={contentRef}
        className="overflow-hidden transition-max-height duration-500 ease-in-out max-h-0"
      >
        {children}
      </div>
    </div>
  );
}

export default Dropdown;