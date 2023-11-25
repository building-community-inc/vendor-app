"use client";
import { useMarketImageIdStore } from "@/app/_components/store/fileStore";
import FormTitleDivider from "../../../_components/FormTitleDivider";
import FileInput from "@/app/_components/FileInput";
import FormInput from "../../../_components/FormInput";
import { FieldErrors, UseFormRegister, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSubmitOnEnter } from "@/utils/hooks/useSubmitOnEnter";
import { TVenueFront } from "@/sanity/queries/venues";
import { VenueCard } from "../../../venues/_components/VenueListItem";
import { create } from "zustand";

const zodDaySchema = z.object({
  date: z.string(),
});
const zodMarketFormSchema = z.object({
  name: z.string().min(1, "Name of the Market is required"),
  description: z.string().min(1, "Description of the Market is required"),
  price: z.string().min(1, "Price per day is required"),
  dates: z.array(zodDaySchema).min(1, "At least one day is required"),
});

type TMarketFormSchema = z.infer<typeof zodMarketFormSchema>;

const CreateMarketForm = ({ venues }: { venues: TVenueFront[] }) => {
  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<TMarketFormSchema>({
    resolver: zodResolver(zodMarketFormSchema),
    // defaultValues,
  });

  const onSubmit = (data: TMarketFormSchema) => {
    console.log({ data });
  };

  useSubmitOnEnter(() => handleSubmit(onSubmit));

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
        {errors.name && (
          <span className="text-red-500 text-center">
            {errors.name?.message}
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
        <ul className="flex flex-col gap-2 my-2">
          {venues?.map((venue) => (
            <VenueCard key={venue._id} venue={venue} />
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
  date: Date;
};
type DaysStore = {
  days: Day[];
  addDay: (newDate?: Date) => void;
  removeDay: (index: number) => void;
  changeCurrentDate: (index: number, newDate: Date) => void;
};
export const useDaysStore = create<DaysStore>((set) => ({
  days: [],
  addDay: (newDate?: Date) =>
    set((state) => {
      if (newDate) {
        return { ...state, days: [...state.days, { date: newDate }] };
      }

      if (state.days.length === 0) {
        return { ...state, days: [{ date: new Date() }] };
      }

      const lastDate = new Date(state.days[state.days.length - 1].date);
      const nextDate = new Date(
        lastDate.getFullYear(),
        lastDate.getMonth(),
        lastDate.getDate() + 1
      );
      return { ...state, days: [...state.days, { date: nextDate }] };
    }),
  removeDay: (index: number) =>
    set((state) => ({
      ...state,
      days: state.days.filter((_, i) => i !== index),
    })),
  changeCurrentDate: (index: number, newDate: Date) =>
    set((state) => ({
      ...state,
      days: state.days.map((day, i) => {
        if (i === index) {
          return { ...day, date: newDate };
        }
        return day;
      }),
    })),
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

  const addDayToStore = (event: React.FormEvent) => {
    event.preventDefault();
    addDay();
  };

  const today = new Date();
  const minDate = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
  return (
    <>
      <button className="w-fit" onClick={addDayToStore}>
        + Add Day
      </button>
      {days.map(({ date }, index) => {
        console.log(
          { date },
          `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
            2,
            "0"
          )}-${String(date.getDate()).padStart(2, "0")}`
        );
        return (
          <div className="relative" key={index}>
            {/* {days.length > 1 && ( */}
            <button
              className="absolute -top-1 right-0"
              onClick={(e) => {
                e.preventDefault();
                removeDay(index);
              }}
            >
              - remove day
            </button>
            {/* )} */}
            <FormInput
              key={`${date.getFullYear()}-${String(
                date.getMonth() + 1
              ).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`}
              register={register}
              name="dates"
              placeholder={date.toDateString()}
              className="w-full"
              type="date"
              title={`Day ${index + 1}`}
              minDate={minDate}
              value={`${date.getFullYear()}-${String(
                date.getMonth() + 1
              ).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`}
              onDateChange={(e) => {
                e.preventDefault();
                const [year, month, day] = e.target.value
                  .split("-")
                  .map(Number);
                const newDate = new Date(year, month - 1, day);
                console.log({ newDate });
                changeCurrentDate(index, newDate);
              }}
            />
          </div>
        );
      })}
      {errors && (
        <span className="text-red-500 text-center">
          {/* {errors?.dates?.map((error) => error?.).join(", ")} */}
          {errors.dates?.message}
        </span>
      )}
    </>
  );
};
