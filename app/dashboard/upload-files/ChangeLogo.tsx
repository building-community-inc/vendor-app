"use client";
import Button from "@/app/_components/Button";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

const ChangeLogo = ({ defaultLogoUrl, defaultFileName, logoFile, setLogoFile, onChange, setRemovedSanityIds, defaultLogoId, removedSanityIds }: {
  defaultLogoUrl?: string | null;
  defaultFileName?: string | null;
  defaultLogoId?: string | null;
  logoFile: File | null;
  setLogoFile: (file: File | null) => void;
  onChange?: (value: boolean) => void;
  removedSanityIds?: string[];
  setRemovedSanityIds: (ids: string[]) => void;
}) => {

  const [currentLogo, setCurrentLogo] = useState<{
    url?: string | null;
    fileName?: string | null;
  } | null>({ url: defaultLogoUrl, fileName: defaultFileName });



  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (currentLogo?.fileName !== defaultFileName) {
      onChange && onChange(true);
    } else {
      onChange && onChange(false);
    }
  }, [currentLogo, logoFile]);
  return (
    <section className="flex flex-col items-center gap-2">
      <h2>Logo (PNG Only)</h2>
      {currentLogo?.url && currentLogo.fileName && (
        <>
          <Image src={currentLogo?.url} alt={currentLogo.fileName} width={200} height={200} className="object-cover" />
          <span>{currentLogo.fileName}</span>
        </>
      )}
      <footer className="flex justify-evenly gap-5 ">
        <Button type="button" onClick={() => {
          inputRef.current?.click();
        }}
          className="font-darker-grotesque font-semibold"

        >
          Change your Logo
        </Button>
        {currentLogo?.fileName !== defaultFileName && (
          <Button type="button" onClick={() => {
            setCurrentLogo({ url: defaultLogoUrl, fileName: defaultFileName })
            setLogoFile(null);
          }}
            className="font-darker-grotesque font-semibold"
          >
            Reset
          </Button>

        )}
        <input
          ref={inputRef}
          type="file"
          name="logo"
          accept=".png"
          hidden
          onChange={(e) => {
            if (!e.target.files) return;
            setLogoFile(e.target.files[0]);
            setCurrentLogo({
              url: URL.createObjectURL(e.target.files[0]),
              fileName: e.target.files[0].name
            })
            if (removedSanityIds && defaultLogoId) {
              setRemovedSanityIds([...removedSanityIds, defaultLogoId]);
            }
          }}
        />
      </footer>

    </section>
  );
}

export default ChangeLogo;