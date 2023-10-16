import { useNavigate } from "react-router-dom";
import style from "./Main.module.scss";
import { useRef, useState, useEffect } from "react";
import * as faceapi from "face-api.js";
import { useDispatch } from "react-redux";
import { setCards } from "../../store/dataReducer";

const Main = () => {
  const [status, setStatus] = useState("turning");
  const [ModelsIsLoad, setModalIsLoad] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const statusText = {
    turning: "Включения...",
    identification: "Идентификация...",
  };

  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  let stream = null;

  useEffect(() => {
    return () => {
      setStatus("start");
      setModalIsLoad(false);
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

    loadModels();
  }, []);

  const handleStart = async () => {
    setStatus("turning");
    const video = videoRef.current;
    let isDecected = false;

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

      const tick = async () => {
        console.log("tick");
        canvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height);
        const detection = await faceapi
          .detectSingleFace(video, new faceapi.TinyFaceDetectorOptions())
          .withFaceLandmarks();

        if (detection) {
          const dims = faceapi.matchDimensions(canvas, video, true);
          const resizedDetection = faceapi.resizeResults(detection, dims);
          // faceapi.draw.drawDetections(canvas, resizedDetection);
          faceapi.draw.drawFaceLandmarks(canvas, resizedDetection);
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
          // const faceCanvas = document.createElement("canvas");
          // faceCanvas.width = video.videoWidth;
          // faceCanvas.height = video.videoHeight;
          // const context = faceCanvas.getContext("2d");
          // if (!context) return;
          // context.drawImage(video, 0, 0, faceCanvas.width, faceCanvas.height);

          const imageBlob = await new Promise((resolve) =>
            faceCanvas.toBlob(resolve, "image/jpeg", 0.9)
          );
          if (!isDecected) {
            const formData = new FormData();
            formData.append("file_in", imageBlob);
            const res = await fetch("http://151.248.126.126/api/v1/terminal", {
              method: "POST",
              body: formData,
            });
            if (res.ok) {
              const cards = await res.json();
              dispatch(setCards(cards));
              isDecected = true;
              stream.getTracks().forEach((track) => track.stop());
              stream = null;
              navigate("/payment");
            } else {
              setTimeout(tick, 500);
            }
          } else {
            setTimeout(tick, 500);
          }
        } else {
          setTimeout(tick, 500);
        }
      };
      setTimeout(tick, 500);
    };

    await startVideo(video);
    detectFaces(video);
  };

  useEffect(() => {
    ModelsIsLoad && handleStart();
  }, [ModelsIsLoad]);

  return (
    <div className={style.main}>
      {ModelsIsLoad || (
        <div className={style.main__model_loading}>Загрузка моделей...</div>
      )}
      <div className={style.main__container}>
        <video ref={videoRef} className={style.main__web_camera} />
        <canvas className={style.main__canvas} ref={canvasRef} />
        <div className={style.main__start}>{statusText[status]}</div>
      </div>
    </div>
  );
};

export default Main;
