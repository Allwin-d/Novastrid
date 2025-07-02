import { useState, useEffect } from "react";

// Define TypeScript interfaces for our data
interface Mission {
  name: string;
  flight: number;
}

interface Capsule {
  capsule_serial: string;
  capsule_id: string;
  status: string;
  original_launch: string;
  original_launch_unix: number;
  missions: Mission[];
  landings: number;
  type: string;
  details: string;
  reuse_count: number;
}

export default function SpaceX() {
  const [capsules, setCapsules] = useState<Capsule[]>([]);
  const [filteredCapsules, setFilteredCapsules] = useState<Capsule[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [sortConfig, setSortConfig] = useState<{
    key: keyof Capsule | "";
    direction: "ascending" | "descending";
  }>({
    key: "",
    direction: "ascending",
  });

  useEffect(() => {
    const fetchCapsules = async () => {
      try {
        setLoading(true);
        const response = await fetch("https://api.spacexdata.com/v3/capsules");

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        setCapsules(data);
        setFilteredCapsules(data);
      } catch (err: any) {
        setError(err.message || "Failed to fetch capsules data");
      } finally {
        setLoading(false);
      }
    };

    fetchCapsules();
  }, []);

  // Search function that searches across all fields
  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredCapsules(capsules);
      return;
    }

    const lowercasedSearch = searchTerm.toLowerCase();

    const filtered = capsules.filter((capsule) => {
      // Search in string fields
      if (
        capsule.capsule_serial.toLowerCase().includes(lowercasedSearch) ||
        capsule.capsule_id.toLowerCase().includes(lowercasedSearch) ||
        capsule.status.toLowerCase().includes(lowercasedSearch) ||
        capsule.type.toLowerCase().includes(lowercasedSearch) ||
        (capsule.details &&
          capsule.details.toLowerCase().includes(lowercasedSearch))
      ) {
        return true;
      }

      // Search in date
      if (
        capsule.original_launch &&
        new Date(capsule.original_launch)
          .toLocaleDateString()
          .includes(lowercasedSearch)
      ) {
        return true;
      }

      // Search in numbers
      if (
        capsule.landings.toString().includes(lowercasedSearch) ||
        capsule.reuse_count.toString().includes(lowercasedSearch)
      ) {
        return true;
      }

      // Search in missions array
      if (
        capsule.missions.some(
          (mission) =>
            mission.name.toLowerCase().includes(lowercasedSearch) ||
            mission.flight.toString().includes(lowercasedSearch)
        )
      ) {
        return true;
      }

      return false;
    });

    setFilteredCapsules(filtered);
  }, [searchTerm, capsules]);

  // Sorting logic
  const requestSort = (key: keyof Capsule) => {
    let direction: "ascending" | "descending" = "ascending";

    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }

    setSortConfig({ key, direction });

    const sortedData = [...filteredCapsules].sort((a, b) => {
      // Handle special cases
      if (key === "missions") {
        return direction === "ascending"
          ? a.missions.length - b.missions.length
          : b.missions.length - a.missions.length;
      }

      if (key === "original_launch") {
        const dateA = a[key] ? new Date(a[key]).getTime() : 0;
        const dateB = b[key] ? new Date(b[key]).getTime() : 0;
        return direction === "ascending" ? dateA - dateB : dateB - dateA;
      }

      // Handle regular string and number fields
      if (a[key] < b[key]) {
        return direction === "ascending" ? -1 : 1;
      }
      if (a[key] > b[key]) {
        return direction === "ascending" ? 1 : -1;
      }
      return 0;
    });

    setFilteredCapsules(sortedData);
  };

  // Format date for display
  const formatDate = (dateString: string | null): string => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Get sort indicator
  const getSortDirectionIndicator = (key: keyof Capsule): string => {
    if (sortConfig.key !== key) return "";
    return sortConfig.direction === "ascending" ? " ▲" : " ▼";
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-700">Loading SpaceX capsules data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
        role="alert"
      >
        <strong className="font-bold">Error!</strong>
        <span className="block sm:inline"> {error}</span>
        <p className="mt-2">Please check your connection and try again.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">
        SpaceX Capsules Data
      </h1>

      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <svg
              className="w-4 h-4 text-gray-500"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 20 20"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
              />
            </svg>
          </div>
          <input
            type="text"
            className="block w-full p-3 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Search across all fields (serial, status, missions, etc.)"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="mt-2 text-sm text-gray-600">
          Found {filteredCapsules.length} of {capsules.length} capsules
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto shadow-md rounded-lg">
        <table className="w-full text-sm text-left text-gray-500">
          <thead className="text-xs text-white uppercase bg-blue-600">
            <tr>
              <th
                className="px-6 py-3 cursor-pointer"
                onClick={() => requestSort("capsule_serial")}
              >
                Serial{getSortDirectionIndicator("capsule_serial")}
              </th>
              <th
                className="px-6 py-3 cursor-pointer"
                onClick={() => requestSort("type")}
              >
                Type{getSortDirectionIndicator("type")}
              </th>
              <th
                className="px-6 py-3 cursor-pointer"
                onClick={() => requestSort("status")}
              >
                Status{getSortDirectionIndicator("status")}
              </th>
              <th
                className="px-6 py-3 cursor-pointer"
                onClick={() => requestSort("original_launch")}
              >
                Launch Date{getSortDirectionIndicator("original_launch")}
              </th>
              <th
                className="px-6 py-3 cursor-pointer"
                onClick={() => requestSort("missions")}
              >
                Missions{getSortDirectionIndicator("missions")}
              </th>
              <th
                className="px-6 py-3 cursor-pointer"
                onClick={() => requestSort("landings")}
              >
                Landings{getSortDirectionIndicator("landings")}
              </th>
              <th
                className="px-6 py-3 cursor-pointer"
                onClick={() => requestSort("reuse_count")}
              >
                Reuses{getSortDirectionIndicator("reuse_count")}
              </th>
              <th className="px-6 py-3">Details</th>
            </tr>
          </thead>
          <tbody>
            {filteredCapsules.length > 0 ? (
              filteredCapsules.map((capsule, index) => (
                <tr
                  key={capsule.capsule_serial}
                  className={`bg-white border-b hover:bg-gray-50 ${
                    index % 2 === 1 ? "bg-gray-50" : ""
                  }`}
                >
                  <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                    {capsule.capsule_serial}
                  </td>
                  <td className="px-6 py-4">{capsule.type}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        capsule.status === "active"
                          ? "bg-green-100 text-green-800"
                          : capsule.status === "retired"
                          ? "bg-gray-100 text-gray-800"
                          : capsule.status === "destroyed"
                          ? "bg-red-100 text-red-800"
                          : capsule.status === "unknown"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-blue-100 text-blue-800"
                      }`}
                    >
                      {capsule.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {formatDate(capsule.original_launch)}
                  </td>
                  <td className="px-6 py-4">
                    {capsule.missions.length > 0 ? (
                      <div className="flex flex-col gap-1">
                        {capsule.missions.map((mission, idx) => (
                          <div key={idx} className="text-xs">
                            <span className="font-medium">{mission.name}</span>
                            <span className="text-gray-500">
                              {" "}
                              (Flight #{mission.flight})
                            </span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <span className="text-gray-400">None</span>
                    )}
                  </td>
                  <td className="px-6 py-4">{capsule.landings}</td>
                  <td className="px-6 py-4">{capsule.reuse_count}</td>
                  <td className="px-6 py-4">
                    <div className="max-w-xs truncate">
                      {capsule.details || (
                        <span className="text-gray-400">
                          No details available
                        </span>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr className="bg-white border-b">
                <td colSpan={8} className="px-6 py-4 text-center text-gray-500">
                  No capsules found matching your search criteria
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
