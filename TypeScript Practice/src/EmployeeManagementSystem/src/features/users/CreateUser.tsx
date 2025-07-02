import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { createUser } from "@/features/users/user.api";
import type { User } from "@/features/users/user.types";

const schema = z.object({
  fname: z.string().min(1, "First name is required"),
  lname: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email"),
  mobile: z.string().min(10, "Mobile must be at least 10 digits"),
});

type FormData = z.infer<typeof schema>;

const CreateUser = () => {
  const navigate = useNavigate({ from: "/create" });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const mutation = useMutation({
    mutationFn: createUser,
    onSuccess: () => {
      alert("User created successfully!");
      reset();
      navigate({ to: "/" });
    },
    onError: (error) => {
      alert("Error creating user.");
      console.error(error);
    },
  });

  const onSubmit = (data: FormData) => {
    mutation.mutate(data);
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-md p-6 space-y-4 border rounded-md shadow-lg"
      >
        <h1 className="text-xl font-bold text-center">Employee Registration</h1>

        {["fname", "lname", "email", "mobile"].map((field) => (
          <div key={field}>
            <input
              {...register(field as keyof FormData)}
              placeholder={`Enter ${field}`}
              className="w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors[field as keyof FormData] && (
              <p className="text-red-500 text-sm">
                {errors[field as keyof FormData]?.message}
              </p>
            )}
          </div>
        ))}

        <button
          type="submit"
          disabled={mutation.isLoading}
          className="w-full px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700"
        >
          {mutation.isLoading ? "Submitting..." : "Submit"}
        </button>
      </form>
    </div>
  );
};

export default CreateUser;
