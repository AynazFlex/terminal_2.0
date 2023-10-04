import { useNavigate } from "react-router-dom";
import style from "./Main.module.scss";
import { useRef, useState, useEffect } from "react";
import * as faceapi from "face-api.js";

const Main = () => {
  const [status, setStatus] = useState("start");
  const [ModelsIsLoad, setModalIsLoad] = useState(false);
  const navigate = useNavigate();
  const statusText = {
    start: "Начать",
    turning: "Включения...",
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
      await faceapi.loadSsdMobilenetv1Model(MODEL_URL);
      await faceapi.loadFaceLandmarkModel(MODEL_URL);
      await faceapi.loadFaceRecognitionModel(MODEL_URL);
      setModalIsLoad(true);
    };

    loadModels();
  }, []);

  const handleStart = async () => {
    setStatus("turning");
    const video = videoRef.current;

    const startVideo = async (video) => {
      const constraints = {
        audio: false,
        video: { width: 320, height: 480, facingMode: "user" },
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
        const detections = await faceapi
          .detectAllFaces(video)
          .withFaceLandmarks()
          .withFaceDescriptors();
        const resizedDetections = faceapi.resizeResults(
          detections,
          displaySize
        );
        canvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height);
        // faceapi.draw.drawDetections(canvas, resizedDetections);
        faceapi.draw.drawFaceLandmarks(canvas, resizedDetections);
        resizedDetections.forEach((detection) => {
          const box = detection.detection.box;
          let drawBox = new faceapi.draw.DrawBox(box, {
            label: "",
            lineWidth: 4,
            boxColor: "blue",
          });
          drawBox.draw(canvas);
        });
        if (detections[0]) {
          const faceCanvas = faceapi.createCanvasFromMedia(video);
          faceCanvas.width = detections[0].detection.box.width;
          faceCanvas.height = detections[0].detection.box.height;
          const faceContext = faceCanvas.getContext("2d");
          faceContext.drawImage(
            video,
            detections[0].detection.box.x,
            detections[0].detection.box.y,
            detections[0].detection.box.width,
            detections[0].detection.box.height,
            0,
            0,
            detections[0].detection.box.width,
            detections[0].detection.box.height
          );

          const imageBlob = await new Promise((resolve) =>
            faceCanvas.toBlob(resolve, "image/jpeg", 0.9)
          );
          imgRef.current.src = URL.createObjectURL(imageBlob);
        }
      }, 100);
    };

    await startVideo(video);
    detectFaces(video);
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
