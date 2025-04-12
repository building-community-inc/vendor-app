"use client";

import { cn } from "@/utils";
import { useState, useRef, useEffect, HTMLAttributes } from "react";

const Accordion = ({ className, children, initialHeight = 200, closedText = "view more", openedText ="view less" }: {
  children: React.ReactNode;
  initialHeight?: number;
  openedText?: string;
  closedText?: string;
  className?: HTMLAttributes<"button">["className"];
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [contentHeight, setContentHeight] = useState<number | null>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Set the initial height
    if (contentRef.current && !isOpen) {
      contentRef.current.style.height = `${initialHeight}px`;
    } else if (contentRef.current && isOpen && contentHeight !== null) {
      contentRef.current.style.height = `${contentHeight}px`;
    }
  }, [isOpen, initialHeight, contentHeight]);

  const toggle = () => {
    if (!isOpen && contentRef.current) {
      // Measure the full height when opening
      setContentHeight(contentRef.current.scrollHeight);
    }
    setIsOpen(!isOpen);
  };

  return (
    <>
      <div
        ref={contentRef}
        className={`overflow-hidden transition-all duration-200 ease-in-out relative z-10`}
        style={{
          height: isOpen && contentHeight !== null ? `${contentHeight}px` : `${initialHeight}px`,
        }}
      >
        {children}
      </div>
      <button onClick={toggle} className={cn('mx-auto cursor-pointer', className)}>
        {isOpen ? openedText : closedText}
      </button>
    </>
  );
};

export default Accordion;