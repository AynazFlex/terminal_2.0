import { useNavigate } from "react-router-dom";
import style from "./Main.module.scss";
import { useRef, useState, useEffect, useCallback } from "react";
import { useDispatch } from "react-redux";
import { setCards } from "../../store/dataReducer";

const Main = ({ faceapi }) => {
  const [status, setStatus] = useState("turning");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const statusText = {
    turning: "Улыбнитесь))",
    identification: "Идентификация...",
  };

  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    return () => {
      setStatus("start");
    };
  }, []);

  const handleStart = useCallback(async () => {
    setStatus("turning");
    const video = videoRef.current;
    const canvas = canvasRef.current;
    let isDecected = false;
    let stream = null;

    const startVideo = async (video) => {
      const constraints = {
        video: {
          height: video.getBoundingClientRect().height,
        },
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

    const detectFaces = async (video, canvas) => {
      const displaySize = {
        width: video.videoWidth,
        height: video.videoHeight,
      };
      faceapi.matchDimensions(canvas, displaySize);

      const tick = async () => {
        canvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height);
        const detection = await faceapi
          .detectSingleFace(video, new faceapi.TinyFaceDetectorOptions())
          .withFaceLandmarks();

        if (!detection) return setTimeout(tick, 200);

        const dims = faceapi.matchDimensions(canvas, video, true);
        const resizedDetection = faceapi.resizeResults(detection, dims);
        // faceapi.draw.drawDetections(canvas, resizedDetection);
        faceapi.draw.drawFaceLandmarks(canvas, resizedDetection);
        const box = resizedDetection.detection.box;
        let drawBox = new faceapi.draw.DrawBox(box, {
          label: "",
          lineWidth: 3,
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

        if (isDecected) return setTimeout(tick, 200);

        const formData = new FormData();
        formData.append("file_in", imageBlob);
        const res = await fetch("http://51.250.97.147/api/v1/terminal", {
          method: "POST",
          body: formData,
        });

        if (!res.ok) return setTimeout(tick, 200);

        const cards = await res.json();
        dispatch(setCards(cards));
        isDecected = true;
        stream.getTracks().forEach((track) => track.stop());
        stream = null;
        navigate("/payment");
      };
      setTimeout(tick, 200);
    };

    await startVideo(video);
    await detectFaces(video, canvas);
  }, [videoRef, canvasRef, dispatch, faceapi, navigate]);

  useEffect(() => {
    videoRef.current && canvasRef.current && handleStart();
  }, [videoRef, canvasRef, handleStart]);

  return (
    <div className={style.main}>
      <div>
        <div className={style.main__web_camera_wrapper}>
          <video ref={videoRef} className={style.main__web_camera} />
          <canvas className={style.main__canvas} ref={canvasRef} />
        </div>
        <div className={style.main__start}>{statusText[status]}</div>
      </div>
    </div>
  );
};

export default Main;
