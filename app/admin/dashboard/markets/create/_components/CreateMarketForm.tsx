"use client";
import { useMarketImageIdStore } from "@/app/_components/store/fileStore";
import { useState } from "react";
import FormTitleDivider from "../../../_components/FormTitleDivider";
import FormInput from "../../../_components/FormInput";
import FileInput from "@/app/_components/FileInput";

const CreateMarketForm = () => {
  return (
    <form className="pt-3 flex flex-col gap-10">
      <FormTitleDivider title="Market Info" />
      <FormSection className="flex flex-col gap-3">
        {/* <FormInput name="name" placeholder="Market Name" />
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
        /> */}
      </FormSection>
      <FormSection>
        <h3>Market Cover</h3>
        <div className="p-2 w-fit mx-auto mb-2">
          <FileInput
            useStore={useMarketImageIdStore}
            title={"Browse"}
            classNames="bg-black text-white px-[66px] py-[14px]"
          />
        </div>
      </FormSection>
      <FormTitleDivider title="Venue" />
      <FormSection>
        <h3>Select Venue</h3>
      </FormSection>
      <button className="bg-black text-white px-[66px] py-[14px] w-fit mx-auto">
        Create Market
      </button>
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
        <div className="relative" key={date.toDateString()}>
          {days.length > 1 && (
            <button
              className="absolute -top-1 right-0"
              onClick={(e) => {
                e.preventDefault();
                setDays((prevDays) => prevDays.filter((_, i) => i !== index));
              }}
            >
              remove day
            </button>
          )}
            {/* <FormInput
              name="date"
              placeholder={date.toDateString()}
              className="w-full"
              type="date"
              title={`Day ${index + 1}`}
              value={`${date.getFullYear()}-${String(
                date.getMonth() + 1
              ).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`}
              onDateChange={(e) => {
                e.preventDefault();
                const newDate = new Date(e.target.value);
                setDays((prevDays) =>
                  prevDays.map((day, i) =>
                    i === index ? { date: newDate } : day
                  )
                );
              }}
            /> */}
        </div>
      ))}
    </>
  );
};
