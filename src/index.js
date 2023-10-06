import ReactDOM from "react-dom/client";
import "./styles/index.scss";
import reportWebVitals from "./reportWebVitals";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Main from "./components/main/Main";
import Basket from "./components/basket/Basket";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Basket />} />
      <Route path="/face-control" element={<Main />} />
    </Routes>
  </BrowserRouter>
);

reportWebVitals();
