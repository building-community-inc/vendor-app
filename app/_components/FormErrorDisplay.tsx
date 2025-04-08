import { ZodError } from "zod";

interface FormErrorDisplayProps {
  errors: string[] | ZodError<string>;
}

const FormErrorDisplay: React.FC<FormErrorDisplayProps> = ({ errors }) => {
  if (!errors) {
    return null; // Don't display anything if there are no errors
  }

  if (Array.isArray(errors)) {
    return (
      <>
        {errors.map((error, index) => (
          <p key={index} className="text-red-500">{error}</p>
        ))}
      </>
    );
  } else if (errors instanceof ZodError) {
    return (
      <>
        {errors.issues.map((issue, index) => (
          <p key={index} className="text-red-500">{issue.message}</p>
        ))}
      </>
    );
  }

  return null; // Fallback in case of unexpected error type
};

export default FormErrorDisplay;
