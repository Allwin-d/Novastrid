import { useParams, useNavigate } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getUserById, updateUser } from "./user.api";
import { useState, useEffect } from "react";
import type { User } from "./user.types";

const UpdateUser = () => {
  const { id } = useParams({ from: "/update/$id" }); 
  const navigate = useNavigate({ from: "/update/$id" }); 
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState<Omit<User, "id">>({
    fname: "",
    lname: "",
    email: "",
    mobile: "",
  });

  const { data, isLoading, isError } = useQuery({
    queryKey: ["user", id],
    queryFn: () => getUserById(id),
    enabled: !!id,
  });

  useEffect(() => {
    if (data) {
      const { fname, lname, email, mobile } = data;
      setFormData({ fname, lname, email, mobile });
    }
  }, [data]);

  const mutation = useMutation({
    mutationFn: (updatedUser: User) => updateUser(updatedUser),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      alert("User updated successfully");
      navigate({ to: "/" }); 
    },
    onError: () => {
      alert("Failed to update user");
    },
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;
    mutation.mutate({ id, ...formData });
  };

  if (isLoading) {
    return (
      <h2 className="text-center text-blue-500 font-semibold min-h-screen">
        Loading user...
      </h2>
    );
  }

  if (isError) {
    return (
      <h2 className="text-center text-red-600 font-semibold min-h-screen">
        Error fetching user
      </h2>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md border rounded p-6 space-y-4 shadow-md"
      >
        <h2 className="text-xl font-bold">Update Employee</h2>

        <input
          type="text"
          name="fname"
          placeholder="First Name"
          value={formData.fname}
          onChange={handleChange}
          className="w-full border px-4 py-2 rounded"
        />
        <input
          type="text"
          name="lname"
          placeholder="Last Name"
          value={formData.lname}
          onChange={handleChange}
          className="w-full border px-4 py-2 rounded"
        />
        <input
          type="text"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          className="w-full border px-4 py-2 rounded"
        />
        <input
          type="text"
          name="mobile"
          placeholder="Mobile"
          value={formData.mobile}
          onChange={handleChange}
          className="w-full border px-4 py-2 rounded"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
        >
          {mutation.isLoading ? "Updating..." : "Update"}
        </button>
      </form>
    </div>
  );
};

export default UpdateUser;
