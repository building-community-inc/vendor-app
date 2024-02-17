"use client";
import Image from "next/image";
import { useEffect, useRef } from "react";

const VenueMap = ({ src, alt, width, height }: {
  src: string;
  alt: string;
  width: number;
  height: number;
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      container.scrollLeft = (container.scrollWidth - container.clientWidth) / 2;
    }
  }, []);
  return (
    <div className="overflow-x-scroll max-w-full md:max-w-auto w-fit rounded-lg " ref={containerRef}>
      <div className="h-[271px] w-[727px]">
        <Image
          src={src}
          alt={alt}
          width={width}
          height={height}
          className="h-[271px] w-[727px] object-cover"
        />
      </div>
    </div>
  );
}

export default VenueMap;