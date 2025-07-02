import { Link } from "react-router-dom";

const Header = () => {
  return (
    <div className=" w-full h-12  bg-blue-600 text-white font-bold  ">
      <div className="flex flex-row justify-between mx-6 pt-2">
        <h1>Employee Details</h1>
        <Link to="/read">User Details</Link>
      </div>
    </div>
  );
};

export default Header;
