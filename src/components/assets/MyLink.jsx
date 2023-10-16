import { Link } from "react-router-dom";
import style from "./MyLink.module.scss";

const MyLink = ({ to, children }) => (
  <Link className={style.link} to={to}>
    {children}
  </Link>
);

export default MyLink;
