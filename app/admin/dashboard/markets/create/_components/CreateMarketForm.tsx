"use client";
import { useMarketImageIdStore } from "@/app/_components/store/fileStore";
import FileInput from "@/app/_components/FileInput";
import { useState } from "react";

const CreateMarketForm = () => {
  return (
    <form className="pt-3 flex flex-col gap-10">
      <FormSection className="flex flex-col gap-3">
        <FormInput name="name" placeholder="Market Name" />
        <FormInput
          type="textarea"
          name="description"
          placeholder="Market Description"
          className="h-[85px]"
        />
        <Days />
        <FormInput
          name="price"
          title="Table Price per Day"
          placeholder="$200"
          type="price"
        />
      </FormSection>
      <FormSection>
        <h3>Market Cover</h3>
        <div className="p-2 w-fit mx-auto">
          <FileInput
            useStore={useMarketImageIdStore}
            title={"Browse"}
            classNames="bg-black text-white px-[66px] py-[14px]"
          />
        </div>
      </FormSection>
    </form>
  );
};

export default CreateMarketForm;

const FormSection = ({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <section
      className={`w-full border border-primary-admin-border rounded-[20px] p-2 ${className}`}
    >
      {children}
    </section>
  );
};

type TCommonProps = {
  name: string;
  placeholder: string;
  className?: string;
  title?: string;
};

type TInputProps = TCommonProps &
  (
    | {
        type?: "input" | "textarea" | "price";
        value?: string;
        onDateChange?: never;
      }
    | {
        type: "date";
        value: string;
        onDateChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
      }
  );

const FormInput = ({
  name,
  placeholder,
  className = "",
  type = "input",
  value = "",
  onDateChange,
  title,
}: TInputProps) => {
  if (type === "date") {
    return (
      <InputSection title={title}>
        <input
          onChange={onDateChange}
          type="date"
          name={name}
          placeholder={placeholder}
          value={value}
          className={`border border-secondary-admin-border rounded-[20px] py-2 px-3 ${className}`}
        />
      </InputSection>
    );
  }

  if (type === "textarea") {
    return (
      <InputSection title={title}>
        <textarea
          name={name}
          placeholder={placeholder}
          className={`border border-secondary-admin-border rounded-[20px] py-2 px-3 ${className}`}
        />
      </InputSection>
    );
  }

  return (
    <InputSection title={title}>
      <input
        type="text"
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
      {title && <h3 className="text-sm">{title}</h3>}
      {children}
    </>
  );
};

const Days = () => {
  const [days, setDays] = useState([
    {
      date: new Date("2023-12-10"),
    },
  ]);

  const addDay = (event: React.FormEvent) => {
    event.preventDefault();
    setDays((days) => {
      const lastDate = new Date(days[days.length - 1].date);
      lastDate.setDate(lastDate.getDate() + 1);
      return [...days, { date: new Date(lastDate) }];
    });
  };
  return (
    <>
      <button className="w-fit" onClick={addDay}>
        + Add Day
      </button>
      {days.map(({ date }, index) => (
        <FormInput
          key={date.toDateString()}
          name="date"
          placeholder={date.toDateString()}
          className="w-full"
          type="date"
          title={`Day ${index + 1}`}
          value={`${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
            2,
            "0"
          )}-${String(date.getDate()).padStart(2, "0")}`}
          onDateChange={(e) => {
            e.preventDefault();
            const newDate = new Date(e.target.value);
            setDays((prevDays) =>
              prevDays.map((day, i) => (i === index ? { date: newDate } : day))
            );
          }}
        />
      ))}
    </>
  );
};
