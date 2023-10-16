import ReactDOM from "react-dom/client";
import "./styles/index.scss";
import reportWebVitals from "./reportWebVitals";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Main from "./components/main/Main";
import Basket from "./components/basket/Basket";
import store from "./store/store";
import { Provider } from "react-redux";
import Biometric from "./components/biometric/Biometric";
import Payment from "./components/payment/Payment";
import End from "./components/end/End";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <Provider store={store}>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Basket />} />
        <Route path="/face-control" element={<Main />} />
        <Route path="/biometric" element={<Biometric />} />
        <Route path="/payment" element={<Payment />} />
        <Route path="/end" element={<End />} />
      </Routes>
    </BrowserRouter>
  </Provider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
