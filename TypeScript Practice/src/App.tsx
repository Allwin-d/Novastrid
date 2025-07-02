import { Route, Routes } from "react-router-dom";
import CreateM from "./Components/axiii/CreateM";
import Header from "./Components/axiii/component/Header";
import UpdateM from "./Components/axiii/UpdateM";
import ReadM from "./Components/axiii/ReadM";

const App = () => {
  return (
    <div>
      <Header />
      <Routes>
        <Route path="/" element={<CreateM />} />
        <Route path="/create" element={<CreateM />} />
        <Route path="/update/:id" element={<UpdateM />} />
        <Route path="/read" element={<ReadM />} />
      </Routes>
    </div>
  );
};

export default App;
