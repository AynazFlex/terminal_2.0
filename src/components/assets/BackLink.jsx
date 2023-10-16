import { Link } from "react-router-dom";
import style from "./MyLink.module.scss";

const BackLink = ({ to }) => (
  <Link className={style.back} to={to}>
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
    >
      <path
        d="M15 18L9 12L15 6"
        stroke="#1B1B1F"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
    <span>Назад</span>
  </Link>
);

export default BackLink;
