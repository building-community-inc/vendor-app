"use client";
import FileInput from "@/app/_components/FileInput";
import FormInput from "../../../_components/FormInput";
import { useVenueImageIdStore } from "@/app/_components/store/fileStore";
import { FieldErrors, UseFormRegister, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { camelCaseToTitleCase } from "@/utils/helpers";
import { useRouter } from "next/navigation";
import { TVenue, zodVenueFormSchema, zodVenueSchema } from "@/zod/venues";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useSubmitOnEnter } from "@/utils/hooks/useSubmitOnEnter";
import { create } from "zustand";

// type TVenueDefaultFormValues = Omit<TVenueFront, 'venueMap'> & { venueMap: string };
const CreateVenueForm = ({
  defaultValues,
  defaultImage,
}: {
  defaultValues?: any;
  defaultImage?: {
    _id: string;
    url: string;
  };
}) => {
  const [isFileInputOpen, setIsFileInputOpen] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<TVenue>({
    resolver: zodResolver(zodVenueSchema),
    defaultValues,
  });
  const router = useRouter();

  const fileId = useVenueImageIdStore((state) => state.fileId);
  const tables = useTableStore((state) => state.tables);

  const formInputs = Object.keys(zodVenueSchema.shape)
    .filter((key) => key !== "venueMap")
    .map((key) => {
      return {
        name: key,
        title: camelCaseToTitleCase(key),
      };
    }) as { name: keyof TVenue; title: string }[];

  const onSubmit = async (data: TVenue) => {
    if (fileId.length === 0 && !defaultImage) {
      setError("venueMap", {
        type: "manual",
        message: "Venue Map is required",
      });
      return;
    }
    const venueObj = {
      ...data,
      _type: "venue",
      venueMap: defaultImage ? defaultImage._id : fileId,
      _id: defaultValues ? defaultValues._id : undefined,
      tables,
    };

    const parsedVenueObj = zodVenueFormSchema.safeParse(venueObj);

    if (!parsedVenueObj.success) {
      let errorMessage = parsedVenueObj.error.message;
      if (typeof errorMessage === "string") {
        try {
          let errorObj = JSON.parse(errorMessage);
          if (
            Array.isArray(errorObj) &&
            errorObj.length > 0 &&
            "message" in errorObj[0]
          ) {
            errorMessage = errorObj[0].message;
          }
        } catch (e) {
          console.error("Error parsing error message:", e);
        }
      }

      setError("root", { type: "manual", message: errorMessage });
    }
    else {
      try {
        const res = await fetch(
          `/admin/dashboard/venues/${defaultValues ? "update" : "create"}/api/`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(parsedVenueObj.data),
          }
        );

        const body = await res.json();
        if (body._id) {
          reset();
          router.push("/admin/dashboard/venues");
        }
      } catch (error) {
        console.error(error);
      }
    }
  };

  useSubmitOnEnter(() => handleSubmit(onSubmit));

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-2 pb-10"
    >
      {formInputs
        // .filter(({ name }) => name !== "tables")
        .map(({ name, title }) => {
          return (
            <VenueFormInputComp
              key={name as string}
              register={register}
              errors={errors}
              name={name}
              title={title}
            />
          );
        })}
      {defaultImage && !isFileInputOpen ? (
        <div className="flex flex-col gap-1 my-2 max-w-full w-[75vw] mx-auto xs:w-full  sm:w-[75vw]">
          <label
            htmlFor="venueMap"
            className="flex flex-col w-full items-center"
          >
            Venue Map
            <div className="flex items-center justify-evenly w-full">
              <Image
                src={defaultImage.url}
                alt={defaultValues.title}
                // className="w-full"
                width={300}
                height={300}
              />
              <button
                type="button"
                className="bg-black text-white px-[66px] py-[14px] w-fit h-fit"
                onClick={() => setIsFileInputOpen(true)}
              >
                Update Map
              </button>
            </div>
          </label>
        </div>
      ) : (
        <>
          <div className="mx-auto">
            <FileInput
              title="Upload Venue Image"
              useStore={useVenueImageIdStore}
            />
          </div>
        </>
      )}
      {errors.venueMap && (
        <span className="text-red-500 text-center">
          {errors.venueMap?.message}
        </span>
      )}

      {/* {!!fileId ||
        (!!defaultImage && (
          ))} */}

      <Tables register={register} defaultTables={defaultValues?.tables || []} />
      {errors && errors.root && (
        <span className="text-red-500 text-center">{errors.root.message}</span>
      )}
      <button
        type="submit"
        disabled={isSubmitting}
        className="bg-black text-white px-[66px] py-[14px] w-fit mx-auto disabled:bg-slate-600"
      >
        {defaultValues ? "Update Venue" : "Create Venue"}
      </button>
    </form>
  );
};

export default CreateVenueForm;
type TInputProps = {
  register: UseFormRegister<TVenue>;
  errors: FieldErrors<TVenue>;
  name: keyof TVenue; // Use keyof to specify that it's a key of TBusiness
  title: string;
  hidden?: boolean;
};

const VenueFormInputComp = ({
  register,
  errors,
  name,
  title,
  hidden = false,
}: TInputProps) => {
  return (
    <section className="flex flex-col gap-1 my-2 max-w-full w-[75vw] mx-auto xs:w-full  sm:w-[75vw]">
      <label htmlFor={name} hidden={hidden} className="flex flex-col w-full">
        {title}
        <FormInput
          register={register}
          placeholder={camelCaseToTitleCase(name)}
          name={name}
        />
      </label>
      {errors[name] && (
        <span className="text-red-500">{errors[name]?.message}</span>
      )}
    </section>
  );
};

type TableStore = {
  tables: string[];
  addTable: (table: string) => void;
  removeTable: (table: string) => void;
  resetTables: () => void;
  changeTableValue: (index: number, value: string) => void;
};

const useTableStore = create<TableStore>((set) => ({
  tables: [],
  addTable: (table) =>
    set((state) => {
      if (state.tables.length > 0) {
        const lastTableItem = +state.tables[state.tables.length - 1];
        const newTableItem = lastTableItem + 1;
        const newTables = [...state.tables, newTableItem.toString()];
        return { tables: newTables };
      }
      return { tables: [...state.tables, table] };
    }),
  removeTable: (table) =>
    set((state) => ({ tables: state.tables.filter((t) => t !== table) })),
  resetTables: () => set({ tables: [] }),
  changeTableValue: (index, value) => {
    set((state) => {
      const newTables = [...state.tables];
      newTables[index] = value;
      return {
        tables: newTables,
      };
    });
  },
}));

const Tables = ({
  register,
  defaultTables,
}: {
  register: UseFormRegister<TVenue>;
  defaultTables?: string[];
}) => {
  const { tables, addTable, removeTable, resetTables, changeTableValue } =
    useTableStore();

  useEffect(() => {
    if (defaultTables) {
      resetTables();
      defaultTables.forEach((table) => addTable(table));
    }
  }, []);
  return (
    <div>
      <h4 className="font-bold text-lg text-center">Tables</h4>
      <button type="button" onClick={() => addTable("1")}>
        + add Table
      </button>
      <ul className="flex flex-col gap-2">
        {tables.map((table, i) => (
          <li key={i} className="flex justify-between">
            {/* <FormInput
              name={`tables[${i}]` as any}
              register={register}
              placeholder="table number"
              type="input"
              value={table}
              onChange={(e) => {
                // e.preventDefault();
                changeTableValue(i, e.target.value);
              }}
              controlled
            /> */}

            <div
              className={`border border-secondary-admin-border rounded-[20px] py-2 px-3 w-1/2`}
            >
              {table}
            </div>
            <button type="button" onClick={() => removeTable(table)}>
              - remove table
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};
