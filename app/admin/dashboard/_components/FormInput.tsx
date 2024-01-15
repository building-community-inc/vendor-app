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
  value?: string | Date;
};

type TInputProps<TFormValues extends FieldValues> = TCommonProps<TFormValues> &
  (
    | {
        type?: "input" | "textarea" | "price";
        onDateChange?: never;
        minDate?: never;
      }
    | {
        type: "date";
        // value: Date;
        onDateChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
        minDate?: string;
        // name: string;
        // name: `dates[${number}]`
        name: FormInputName<TFormValues>;
      }
  );
const FormInput = <TFormValues extends FieldValues>({
  // key = "",
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
  // const [inputValue, setInputValue] = useState<string | Date>(() => {
  //   if (value instanceof Date) {
  //     return value.toISOString().substring(0, 10);
  //   } else if (typeof value === "string") {
  //     return value;
  //   } else {
  //     return "";
  //   }
  // });

  // useEffect(() => {
  //   console.log({ value }, "useEffect");
  //   if (type === "date") {
  //     // const newValue =
  //       // value instanceof Date ? value.toISOString().substring(0, 10) : value;
  //     setInputValue(value);
  //   }
  // }, [value]);

  // if (type === "date") {
  //   return (
  //     <InputSection title={title}>
  //       <label htmlFor={name} className="relative">
  //         <input
  //           // key={key}
  //           {...register(name)}
  //           onChange={(e) => {
  //             setInputValue(e.target.value);
  //             if (onDateChange) {
  //               onDateChange(e);
  //             }
  //             // onDateChange(e);
  //           }}
  //           type="date"
  //           name={name}
  //           placeholder={placeholder}
  //           value={inputValue}
  //           min={minDate}
  //           className={`pl-5 border text-black border-secondary-admin-border rounded-[20px] py-2 px-3 ${className}`}
  //         />
  //         {/* <div className="absolute top-1/2 -translate-y-1/2 translate-x-4 bg-white h-2/5 place-content-center grid">
  //           {value}
  //         </div> */}
  //       </label>
  //     </InputSection>
  //   );
  // }

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
    // console.log({ value }, "controlled");
    return (
      <InputSection title={title}>
        <input
          {...register(name)}
          type="input"
          name={name}
          placeholder={placeholder}
          value={value as string}
          onChange={onChange}
          // contentEditable="false"
          // hidden
          // className="hidden"
        />
        <div
          className={`border border-secondary-admin-border rounded-[20px] py-2 px-3 w-1/2 ${className}`}
          //  className=""
        >
          {value as string}
        </div>
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
