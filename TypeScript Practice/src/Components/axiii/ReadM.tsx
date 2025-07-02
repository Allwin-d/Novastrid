import { useEffect, useState } from "react";
import { Api_Url } from "./api";
import axios from "axios";
import type { obj1 } from "./types";
import { useNavigate } from "react-router-dom";

const ReadM = () => {
  const [users, setUsers] = useState<obj1[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await axios.get<obj1[]>(Api_Url);
      console.log("this is the response from read page ", response);
      setUsers(response.data);
    } catch (err) {
      console.log("Error fetching data ", err);
      setError("Failed to Fetch User Details..");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDelete = async (id: string) => {
    try {
      console.log("Deleting user with ID:", id);
      await axios.delete(`${Api_Url}/${id}`);
      fetchUsers();
    } catch (error) {
      console.error("Error deleting user:", error);
      alert("Failed to delete user");
    }
  };

  if (loading) {
    return (
      <h2 className="flex items-center justify-center text-red-600 font-bold min-h-screen w-full">
        Loading.....
      </h2>
    );
  }

  if (error) {
    return (
      <h2 className="flex items-center justify-center text-red-600 font-bold min-h-screen w-full">
        {error}....
      </h2>
    );
  }

  return (
    <div className="min-h-screen w-full flex flex-col space-y-4 items-center justify-center">
      {users && users.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 pl-5 py-5 bg-gray-100 font-semibold text-black rounded-lg w-3/4 ">
          {users.map((item, index) => (
            <div key={index}>
              <p>Id : {index}</p>
              <p>First Name : {item.fname}</p>
              <p>Last Name : {item.lname}</p>
              <p>Email : {item.email}</p>
              <p>Mobile : {item.mobile}</p>
              <div className="flex space-x-4 mt-4">
                <button
                  onClick={() => handleDelete(item.id)}
                  className="px-4 py-2 rounded-lg cursor-pointer bg-red-600 text-white font-semibold hover:bg-red-700 transition-all duration-300"
                >
                  Delete{" "}
                </button>
                <button
                  onClick={() => navigate(`/update/${item.id}`)}
                  className="px-4 py-2 rounded-lg cursor-pointer bg-gray-600 text-white font-semibold hover:bg-gray-700 transition-all duration-300"
                >
                  Update
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <h2 className="flex items-center justify-center text-red-700 font-bold">
          No Users Added
        </h2>
      )}
    </div>
  );
};

export default ReadM;
