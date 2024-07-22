"use client";
import Button from "@/app/_components/Button";
import { Input } from "@/app/_components/Input";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  FieldErrors,
  SubmitHandler,
  UseFormRegister,
  useForm,
} from "react-hook-form";
import { z } from "zod";
import { TUserInTerms } from "../page";
import { useRouter } from "next/navigation";
import { ArrowRightIcon } from "@sanity/icons";
const zodTermsSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  acceptance: z.literal(true, {
    errorMap: () => ({ message: "You must accept Terms and Conditions" }),
  }),
  // user: zodUserWithOptionalBusinessRef,
});

type TTerms = z.infer<typeof zodTermsSchema>;

type TFormProps = {
  user: { data: TUserInTerms | null; success: boolean };
};
const Form = ({ user }: TFormProps) => {
  const {
    register,
    handleSubmit,
    reset,
    // control,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<TTerms>({ resolver: zodResolver(zodTermsSchema) });

  const router = useRouter();
  const onSubmit: SubmitHandler<TTerms> = async (data) => {
    if (!user.success || !user.data) {
      return;
    }
    const fullName = user.data?.firstName + " " + user.data.lastName;

    if (data.name !== fullName) {
      setError("name", {
        type: "custom",
        message: "Name must match your user first and last name",
      });
      return;
    }

    const body = {
      _id: user.data.id,
      acceptedTerms: { accepted: true },
    };
    await fetch("/create-business/accept-terms/api/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    }).then(async (res) => {
      const body = await res.json();
      if (body._id) {
        reset();
        router.push("/dashboard");
      }
    });
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="mt-10 flex flex-col items-center pb-10 gap-5"
    >
      <label
        htmlFor="acceptance"
        className={`flex items-center gap-2 py-1 ml-2 mb-2 text-2xl font-bold font-darker-grotesque ${errors.acceptance ? "text-red-500" : "text-gray-700"
          }`}
      >
        <input type="checkbox" id="terms" {...register("acceptance")} />
        I agree to the terms of service of the Vendor App
      </label>
      {errors.acceptance && (
        <p className="text-base text-red-500 mb-2">
          {errors.acceptance?.message}
        </p>
      )}
      <input
        {...register("name")}
        id={"name"}
        type={"text"}
        name={"name"}
        placeholder="name"
        className="text-black border border-button-border-color rounded-md px-2 py-1 mb-2 max-w-md mx-auto"
      />
      {errors.name && (
        <p className="text-base text-red-500 mb-2">{errors.name?.message}</p>
      )}
      <Button type="submit" disabled={isSubmitting}
        className="disabled:bg-slate-200 disabled:text-slate-300 w-fit mx-auto border text-6xl px-3 rounded-3xl"
      >
        <ArrowRightIcon />
      </Button>
    </form>
  );
};

export default Form;

type TInputProps = {
  register: UseFormRegister<TTerms>;
  errors: FieldErrors<TTerms>;
  name: keyof TTerms; // Use keyof to specify that it's a key of TBusiness
  title?: string;
  hidden?: boolean;
  placeholder?: string;
};

const InputSection = ({
  name,
  hidden,
  title,
  register,
  errors,
  placeholder,
}: TInputProps) => {
  return (
    <section className="flex flex-col gap-1 my-2 w-full min-w-[75vw] items-center">
      {name === "acceptance" ? (
        <label
          htmlFor={name}
          hidden={hidden}
          className="flex gap-2 items-center"
        >
          <Input
            {...register(name)}
            id={name}
            type={"checkbox"}
            // name={name}
            // hidden={hidden}
            className="text-black rounded-md px-2 py-1 mb-2 max-w-md mx-auto"
          />
          {title}
        </label>
      ) : (
        <label
          htmlFor={name}
          hidden={hidden}
          className="flex gap-2 items-center"
        >
          {title}
          <Input
            {...register(name)}
            id={name}
            type={"text"}
            name={name}
            hidden={hidden}
            className="text-black rounded-md px-2 py-1 mb-2 max-w-md mx-auto"
            placeholder={placeholder ? placeholder : undefined}
          />
        </label>
      )}

      {errors[name] && (
        <span className="text-red-500">{errors[name]?.message}</span>
      )}
    </section>
  );
};
