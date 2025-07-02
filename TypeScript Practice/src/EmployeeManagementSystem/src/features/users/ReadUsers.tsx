import { useState, useMemo } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getUsers, deleteUser } from "./user.api";
import type { User } from "./user.types";

const ITEMS_PER_PAGE = 5;

const ReadUsers = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [filterText, setFilterText] = useState("");
  const [page, setPage] = useState(1);

  const {
    data: users = [],
    isLoading,
    isError,
    error,
  } = useQuery<User[]>({
    queryKey: ["users"],
    queryFn: getUsers,
  });

  const mutation = useMutation({
    mutationFn: deleteUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this user?")) {
      mutation.mutate(id);
    }
  };

  const filteredUsers = useMemo(() => {
    return users.filter(
      (user) =>
        user.fname.toLowerCase().includes(filterText.toLowerCase()) ||
        user.lname.toLowerCase().includes(filterText.toLowerCase())
    );
  }, [users, filterText]);

  const totalPages = Math.ceil(filteredUsers.length / ITEMS_PER_PAGE);
  const paginatedUsers = filteredUsers.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  );

  return (
    <div className="flex flex-col items-center min-h-screen space-y-6">
      <input
        type="text"
        placeholder="Search by name..."
        className="border px-3 py-2 rounded"
        value={filterText}
        onChange={(e) => {
          setFilterText(e.target.value);
          setPage(1); 
        }}
      />

      {isLoading ? (
        <p className="text-blue-500 font-bold">Loading...</p>
      ) : isError ? (
        <p className="text-red-600 font-bold">{(error as Error).message}</p>
      ) : paginatedUsers.length === 0 ? (
        <p className="text-red-700 font-bold">No Users Found</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 w-full max-w-5xl">
          {paginatedUsers.map((user) => (
            <div key={user.id} className="bg-white p-4 rounded shadow-md">
              <p>
                <strong>Name:</strong> {user.fname} {user.lname}
              </p>
              <p>
                <strong>Email:</strong> {user.email}
              </p>
              <p>
                <strong>Mobile:</strong> {user.mobile}
              </p>
              <div className="flex space-x-2 mt-4">
                <button
                  onClick={() => handleDelete(user.id)}
                  className="bg-red-600 px-4 py-2 rounded text-white"
                >
                  Delete
                </button>
                <button
                  onClick={() => navigate({ to: `/update/${user.id}` })}
                  className="bg-gray-600 px-4 py-2 rounded text-white"
                >
                  Update
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination Controls */}
      <div className="flex space-x-4 mt-4">
        <button
          onClick={() => setPage((p) => Math.max(p - 1, 1))}
          disabled={page === 1}
          className="bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50"
        >
          Prev
        </button>
        <span>
          Page {page} of {totalPages}
        </span>
        <button
          onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
          disabled={page === totalPages}
          className="bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default ReadUsers;
