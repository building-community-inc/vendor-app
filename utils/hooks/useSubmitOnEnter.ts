import { useEffect } from "react";

export function useSubmitOnEnter(onSubmit: () => void) {
  useEffect(() => {
    const submitForm = (e: KeyboardEvent) => {
      if (e.key === "Enter") {
        onSubmit();
      }
    };

    document.addEventListener("keydown", submitForm);

    // Cleanup function to remove the event listener
    return () => {
      document.removeEventListener("keydown", submitForm);
    };
  }, [onSubmit]);
}