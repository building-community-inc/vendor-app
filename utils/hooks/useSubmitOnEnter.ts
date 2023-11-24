import { useEffect } from "react";
import { SubmitHandler, useForm, FieldValues } from "react-hook-form";

export function useSubmitOnEnter<T extends FieldValues>(
  onSubmit: SubmitHandler<T>
) {
  const { handleSubmit } = useForm<T>();

  useEffect(() => {
    const submitForm = (e: KeyboardEvent) => {
      if (e.key === "Enter") {
        handleSubmit(onSubmit)();
      }
    };

    document.addEventListener("keydown", submitForm);

    // Cleanup function to remove the event listener
    return () => {
      document.removeEventListener("keydown", submitForm);
    };
  }, [handleSubmit, onSubmit]);
}
