"use client";
import { useMarketImageIdStore } from "@/app/_components/store/fileStore";
import FormTitleDivider from "../../../_components/FormTitleDivider";
import FileInput from "@/app/_components/FileInput";
import FormInput from "../../../_components/FormInput";
import { FieldErrors, UseFormRegister, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { TVenueFront } from "@/sanity/queries/admin/venues";
import { VenueCard } from "../../../venues/_components/VenueListItem";
import { create } from "zustand";
import { useState } from "react";
import { TMarketFormSchema, zodMarketFormSchema } from "@/zod/markets";
import { useRouter } from "next/navigation";
import { createDateString } from "@/utils/helpers";
import { nanoid } from 'nanoid';

const CreateMarketForm = ({ venues }: { venues: TVenueFront[] }) => {
  const [selectedVenue, setSelectedVenue] = useState<TVenueFront | null>(null);
  const {
    register,
    handleSubmit,
    reset,
    control,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<TMarketFormSchema>({
    resolver: zodResolver(zodMarketFormSchema),
    // defaultValues,
  });

  const { days, removeAllDays } = useDaysStore((state) => state);
  const router = useRouter();
  const fileId = useMarketImageIdStore((state) => state.fileId);

  const onSubmit = async (data: TMarketFormSchema) => {
    // console.log({ data, fileId, selectedVenue });

    if (!fileId) {
      setError("marketCover", {
        type: "manual",
        message: "Market Cover is required",
      });
      return;
    }

    if (!selectedVenue) {
      setError("venue", {
        type: "manual",
        message: "Venue is required",
      });
      return;
    }
    const marketObj = {
      ...data,
      _type: "market",
      marketCover: fileId,
      venue: { _ref: selectedVenue._id },
      dates: days.map((day) => day.date),
      daysWithTables: days.map((day) => ({
        date: day.date,
        _key: nanoid(),
        tables: selectedVenue.tableInfo?.map((table) => ({
          table,
          _key: nanoid(),
        })),
      })),
    };

    try {
      await fetch(`/admin/dashboard/markets/create/api`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(marketObj),
      }).then(async (res) => {
        const body = await res.json();
        if (body._id) {
          reset();
          router.push("/admin/dashboard/markets");
          removeAllDays();
        }
      });
    } catch (error) {
      console.error(error);
    }
  };

  // useSubmitOnEnter(() => handleSubmit(onSubmit));

  // console.log({ errors });

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="pt-3 flex flex-col gap-10"
    >
      <FormTitleDivider title="Market Info" />
      <FormSection className="flex flex-col gap-3">
        <FormInput register={register} name="name" placeholder="Market Name" />
        {errors.name && (
          <span className="text-red-500 text-center">
            {errors.name?.message}
          </span>
        )}
        <FormInput
          register={register}
          type="textarea"
          name="description"
          placeholder="Market Description"
          className="h-[85px]"
        />
        {errors.description && (
          <span className="text-red-500 text-center">
            {errors.description?.message}
          </span>
        )}
        <FormInput
          register={register}
          type="textarea"
          name="vendorInstructions"
          placeholder="Market Vendor Instructions"
          className="h-[85px]"
        />
        {errors.description && (
          <span className="text-red-500 text-center">
            {errors.description?.message}
          </span>
        )}
        <Days register={register} errors={errors} />
        <FormInput
          register={register}
          name="price"
          title="Table Price per Day"
          placeholder="$200"
          type="price"
        />
      </FormSection>
      <FormSection>
        <h3>Market Cover</h3>
        <div className="p-2 w-fit mx-auto mb-2 flex flex-col">
          <FileInput
            useStore={useMarketImageIdStore}
            title={"Browse"}
            classNames="bg-black text-white px-[66px] py-[14px]"
          />
          {errors.marketCover && (
            <span className="text-red-500 text-center">
              {errors.marketCover?.message}
            </span>
          )}
        </div>
      </FormSection>
      <FormTitleDivider title="Venue" />
      <FormSection>
        <h3>Select Venue</h3>
        <ul className="flex flex-col gap-2 my-2">
          {venues?.map((venue) => (
            <button
              type="button"
              onClick={() =>
                selectedVenue && selectedVenue._id === venue._id
                  ? setSelectedVenue(null)
                  : setSelectedVenue(venue)
              }
              className={`border p-2 ${
                venue._id === selectedVenue?._id
                  ? "border-black"
                  : "border-slate-200"
              }`}
              key={venue._id}
            >
              <VenueCard venue={venue} withAvailableTables />
            </button>
          ))}
        </ul>
      </FormSection>
      <button
        className="bg-black text-white px-[66px] py-[14px] w-fit mx-auto"
        type="submit"
      >
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

type Day = {
  date: string;
};
type DaysStore = {
  days: Day[];
  addDay: (newDate?: Date) => void;
  removeDay: (index: number) => void;
  changeCurrentDate: (index: number, newDate: Date) => void;
  removeAllDays: () => void;
};
export const useDaysStore = create<DaysStore>((set) => ({
  days: [],
  addDay: () =>
    set((state) => {
      const offset = -5; // Offset for EST timezone
      if (state.days.length === 0) {
        const today = new Date();
        const estToday = new Date(
          today.getUTCFullYear(),
          today.getUTCMonth(),
          today.getUTCDate(),
          offset
        );
        return { ...state, days: [{ date: createDateString(estToday) }] };
      }

      const lastDate = new Date(state.days[state.days.length - 1].date);
      const nextDate = new Date(
        lastDate.getUTCFullYear(),
        lastDate.getUTCMonth(),
        lastDate.getUTCDate() + 2,
        offset
      );
      return {
        ...state,
        days: [...state.days, { date: createDateString(nextDate) }],
      };
    }),
  removeDay: (index: number) =>
    set((state) => ({
      ...state,
      days: state.days.filter((_, i) => i !== index),
    })),
  changeCurrentDate: (index: number, newDate: Date) =>
    set((state) => {
      const newDays = [...state.days];

      newDays[index] = { date: createDateString(newDate) };

      return {
        ...state,
        days: newDays,
      };
    }),
  removeAllDays: () => set((state) => ({ ...state, days: [] })),
}));

const Days = ({
  register,
  errors,
}: {
  register: UseFormRegister<TMarketFormSchema>;
  errors: FieldErrors<TMarketFormSchema>;
}) => {
  const { days, addDay, removeDay, changeCurrentDate } = useDaysStore(
    (state) => ({
      days: state.days,
      addDay: state.addDay,
      removeDay: state.removeDay,
      changeCurrentDate: state.changeCurrentDate,
    })
  );

  const addDayToStore = () => {
    // event.preventDefault();
    addDay();
  };

  return (
    <ul className="flex flex-col gap-2">
      <button type="button" className="w-fit" onClick={addDayToStore}>
        + Add Day
      </button>
      {days.map(({ date }, index) => {
        // const dateString = createDateString(date);
        return (
          <li className="relative" key={index}>
            {/* {days.length > 1 && ( */}
            <button
              className="absolute -top-1 right-0 z-10"
              type="button"
              onClick={() => {
                removeDay(index);
              }}
            >
              - remove day
            </button>

            <label htmlFor={`dates[${index}]`} className="relative">
              <input
                // key={key}
                {...register(`dates[${index}]` as any)}
                onChange={(e) => {
                  // setInputValue(e.target.value);
                  // if (onDateChange) {
                  const [year, month, day] = e.target.value
                    .split("-")
                    .map(Number);
                  const newDate = new Date(year, month - 1, day);
                  // console.log({ newDate });
                  changeCurrentDate(index, newDate); // }
                  // onDateChange(e);
                }}
                type="date"
                name={`dates[${index}]`}
                placeholder={date}
                value={new Date(date).toISOString().slice(0, 10)}
                // min={minDate}
                className={`pl-5 border text-black border-secondary-admin-border rounded-[20px] py-2 px-3 `}
              />
              {/* <>{date.toDateString()}</> */}
              {/* <div className="absolute top-1/2 -translate-y-1/2 translate-x-4 bg-white h-2/5 place-content-center grid">
            {value}
          </div> */}
            </label>
          </li>
        );
      })}
      {errors && (
        <span className="text-red-500 text-center">
          {/* {errors?.dates?.map((error) => error?.).join(", ")} */}
          {errors.dates?.message}
        </span>
      )}
    </ul>
  );
};
