import axios from "axios";
import { useState } from "react";
import { Api_Url } from "./api";
import type { obj1 } from "./types";
import { useNavigate } from "react-router-dom";

const CreateM = () => {
  const [details, setDetails] = useState<obj1>({
    id: "",
    fname: "",
    lname: "",
    email: "",
    mobile: "",
  });

  const navigate = useNavigate();

  async function handleSubmit(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    if (!details.email.trim() && !details.fname.trim() && !details.lname.trim())
      return alert("please provide some values");
    console.log("details", details);
    const response = await axios.post<obj1>(Api_Url, details);
    console.log(response);
    setDetails({
      id: "",
      fname: "",
      lname: "",
      email: "",
      mobile: "",
    });
    navigate("read");
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setDetails((prev) => ({ ...prev, [name]: value }));
  };

  const detailsMap = [
    {
      name: "fname",
      type: "text",
      value: details.fname,
      placeholder: "Enter Fname",
      required: "required",
    },
    {
      name: "lname",
      type: "text",
      value: details.lname,
      placeholder: "Enter Lname",
      required: "required",
    },
    {
      name: "email",
      type: "text",
      value: details.email,
      placeholder: "Enter Email",
      required: "required",
    },
    {
      name: "mobile",
      type: "number",
      value: details.mobile,
      placeholder: "Enter mobile",
      required: "required",
    },
  ];

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <div>
        <form className="w-full flex flex-col items-center justify-center space-y-3 rounded-md border border-gray-400 px-4 py-3 ">
          <h1>Employee Registration </h1>
          {detailsMap.map((item, index) => (
            <div key={index}>
              <input
                className="w-full border border-gray-400 rounded-md shadow-md px-4 py-2 font-semibold text-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition duration 300 ease-in-out"
                name={item.name}
                placeholder={item.placeholder}
                type={item.type}
                value={item.value}
                onChange={handleChange}
                required={true}
              />
            </div>
          ))}
          <br />
          <button type="submit" onClick={handleSubmit}>
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateM;
