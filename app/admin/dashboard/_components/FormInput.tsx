import { Path, FieldValues, UseFormRegister } from "react-hook-form";
type FormInputName<TFormValues extends FieldValues> =
  | keyof TFormValues
  | `${"dates"}.${string}`;
type TCommonProps<TFormValues extends FieldValues> = {
  name: Path<TFormValues>;
  placeholder: string;
  className?: string;
  title?: string;
  register: UseFormRegister<TFormValues>;
  key?: string;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  minDate?: string | undefined;
  controlled?: boolean;
};

type TInputProps<TFormValues extends FieldValues> = TCommonProps<TFormValues> &
  (
    | {
        type?: "input" | "textarea" | "price";
        value?: string;
        onDateChange?: never;
        minDate?: never;
      }
    | {
        type: "date";
        value: string;
        onDateChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
        minDate?: string;
        // name: string;
        // name: `dates[${number}]`
        name: FormInputName<TFormValues>;
      }
  );
const FormInput = <TFormValues extends FieldValues>({
  key = "",
  name,
  placeholder,
  className = "",
  type = "input",
  value = "",
  onDateChange,
  title,
  register,
  onChange,
  minDate = undefined,
  controlled,
}: TInputProps<TFormValues>) => {
  if (type === "date") {
    return (
      <InputSection title={title}>
        <label htmlFor={name} className="relative">
          <input
            key={key}
            {...register(name)}
            onChange={onDateChange}
            type="date"
            name={name}
            placeholder={placeholder}
            value={value}
            min={minDate}
            className={`pl-5 border text-white border-secondary-admin-border rounded-[20px] py-2 px-3 ${className}`}
          />
          <div className="absolute top-1/2 -translate-y-1/2 translate-x-4 bg-white h-2/5 place-content-center grid">
            {value}
          </div>
        </label>
      </InputSection>
    );
  }

  if (type === "textarea") {
    return (
      <InputSection title={title}>
        <textarea
          {...register(name)}
          name={name}
          placeholder={placeholder}
          className={`border border-secondary-admin-border rounded-[20px] py-2 px-3 ${className}`}
        />
      </InputSection>
    );
  }

  if (controlled) {
    return (
      <InputSection title={title}>
        <input
          {...register(name)}
          type="input"
          name={name}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className={`border border-secondary-admin-border rounded-[20px] py-2 px-3 ${className}`}
        />
      </InputSection>
    );
  }
  return (
    <InputSection title={title}>
      <input
        {...register(name)}
        type="input"
        name={name}
        placeholder={placeholder}
        className={`border border-secondary-admin-border rounded-[20px] py-2 px-3 ${className}`}
      />
    </InputSection>
  );
};

const InputSection = ({
  children,
  title,
}: {
  children: React.ReactNode;
  title?: string;
}) => {
  return (
    <>
      {title && <h3 className="text-sm relative">{title}</h3>}
      {children}
    </>
  );
};

export default FormInput;