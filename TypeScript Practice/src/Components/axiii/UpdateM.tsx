// UpdateM.tsx
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Api_Url } from "./api";
import type { obj1 } from "./types";

const UpdateM = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [details, setDetails] = useState<obj1>({
    id: "",
    fname: "",
    lname: "",
    email: "",
    mobile: "",
  });

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get<obj1>(`${Api_Url}/${id}`); //here we dont even need to convert it to a json format 
        setDetails(response.data);
      } catch (err) {
        console.error("Failed to fetch user for update", err);
        alert("User not found");
        navigate("/read");
      }
    };

    if (id) {
      fetchUser();
    }
  }, [id, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setDetails((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.put(`${Api_Url}/${id}`, details);
      alert("User updated successfully");
      navigate("/read");
    } catch (err) {
      console.error("Error updating user", err);
      alert("Failed to update user");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <form
        onSubmit={handleUpdate}
        className="w-full max-w-md border rounded p-6 space-y-4 shadow-md"
      >
        <h2 className="text-xl font-bold">Update Employee</h2>

        <input
          type="text"
          name="fname"
          placeholder="First Name"
          value={details.fname}
          onChange={handleChange}
          className="w-full border px-4 py-2 rounded"
        />
        <input
          type="text"
          name="lname"
          placeholder="Last Name"
          value={details.lname}
          onChange={handleChange}
          className="w-full border px-4 py-2 rounded"
        />
        <input
          type="text"
          name="email"
          placeholder="Email"
          value={details.email}
          onChange={handleChange}
          className="w-full border px-4 py-2 rounded"
        />
        <input
          type="text"
          name="mobile"
          placeholder="Mobile"
          value={details.mobile}
          onChange={handleChange}
          className="w-full border px-4 py-2 rounded"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
        >
          Update
        </button>
      </form>
    </div>
  );
};

export default UpdateM;
