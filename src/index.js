import ReactDOM from "react-dom/client";
import "./styles/index.scss";
import reportWebVitals from "./reportWebVitals";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Main from "./components/main/Main";
import Basket from "./components/basket/Basket";
import store from "./store/store";
import { useEffect, useState } from "react";
import { Provider } from "react-redux";
import Biometric from "./components/biometric/Biometric";
import Payment from "./components/payment/Payment";
import End from "./components/end/End";
import * as faceapi from "face-api.js";

const App = () => {
  const [isDone, setDone] = useState(false);

  useEffect(() => {
    const loadModels = async () => {
      const MODEL_URL = "/models";
      await Promise.all([
        faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
        faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
        faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL),
      ]);
      setDone(true);
    };

    loadModels().finally();
  }, []);

  if (!isDone) return <div className="model_loading">Ожидайте...</div>;

  return (
    <Provider store={store}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Basket />} />
          <Route path="/face-control" element={<Main faceapi={faceapi} />} />
          <Route path="/biometric" element={<Biometric />} />
          <Route path="/payment" element={<Payment />} />
          <Route path="/end" element={<End />} />
        </Routes>
      </BrowserRouter>
    </Provider>
  );
};

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);

reportWebVitals();
