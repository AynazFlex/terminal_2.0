import { useNavigate } from "react-router-dom";
import style from "./Main.module.scss";
import { useRef, useState, useEffect } from "react";
import * as faceapi from "face-api.js";

const Main = () => {
  const [status, setStatus] = useState("start");
  const [ModelsIsLoad, setModalIsLoad] = useState(false);
  const navigate = useNavigate();

  const statusText = {
    start: "Начать скан лица",
    turning: "Включениe...",
    identification: "Идентификация...",
  };

  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const imgRef = useRef(null);

  let stream = null;

  useEffect(() => {
    return () => {
      setStatus("start");
      stream.getTracks().forEach((track) => track.stop());
      stream = null;
    };
  }, []);

  useEffect(() => {
    const loadModels = async () => {
      const MODEL_URL = "/models";
      await Promise.all([
        faceapi.nets.tinyFaceDetector.loadFromUri("/models"),
        faceapi.nets.faceLandmark68Net.loadFromUri("/models"),
        faceapi.nets.faceRecognitionNet.loadFromUri("/models"),
      ]);
      setModalIsLoad(true);
    };

    loadModels().finally();
  }, []);

  const handleStart = async () => {
    setStatus("turning");
    const video = videoRef.current;

    const startVideo = async (video) => {
      const constraints = {
        audio: false,
        video: { width: 320 },
      };
      stream = await navigator.mediaDevices.getUserMedia(constraints);
      video.srcObject = stream;
      await new Promise((resolve) => {
        video.onloadedmetadata = () => {
          setStatus("identification");
          video.play();
          resolve();
        };
      });
    };

    const detectFaces = async (video) => {
      const displaySize = {
        width: video.videoWidth,
        height: video.videoHeight,
      };
      const canvas = canvasRef.current;
      faceapi.matchDimensions(canvas, displaySize);

      setInterval(async () => {
        canvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height);
        const detection = await faceapi
          .detectSingleFace(video, new faceapi.TinyFaceDetectorOptions())
          .withFaceLandmarks();

        if (!detection) return;
        const dims = faceapi.matchDimensions(canvas, video, true);
        const resizedDetection = faceapi.resizeResults(detection, dims);
        const box = resizedDetection.detection.box;
        let drawBox = new faceapi.draw.DrawBox(box, {
          label: "",
          lineWidth: 1,
          boxColor: "blue",
        });
        drawBox.draw(canvas);
        const faceCanvas = faceapi.createCanvasFromMedia(video);
        faceCanvas.width = box.width;
        faceCanvas.height = box.height;
        const faceContext = faceCanvas.getContext("2d");
        faceContext.drawImage(
          video,
          box.x,
          box.y,
          box.width,
          box.height,
          0,
          0,
          box.width,
          box.height
        );

        const imageBlob = await new Promise((resolve) =>
          faceCanvas.toBlob(resolve, "image/jpeg", 0.9)
        );
        imgRef.current.src = URL.createObjectURL(imageBlob);
      }, 100);
    };

    await startVideo(video);
    await detectFaces(video);
  };

  return (
    <div className={style.main}>
      {ModelsIsLoad || (
        <div className={style.main__model_loading}>Загрузка моделей...</div>
      )}
      <div className={style.main__container}>
        <video ref={videoRef} className={style.main__web_camera} />
        <button
          disabled={status === "identification" || status === "turning"}
          onClick={handleStart}
          className={style.main__start}
        >
          {statusText[status]}
        </button>
        <canvas className={style.main__canvas} ref={canvasRef} />
        <img src="" ref={imgRef} className={style.main__img_res} />
      </div>
    </div>
  );
};

export default Main;
