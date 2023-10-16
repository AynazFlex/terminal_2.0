import { useSelector } from "react-redux";
import BackLink from "../assets/BackLink";
import Chack from "../assets/Chak";
import style from "./Biometric.module.scss";
import MyLink from "../assets/MyLink";

const Biometric = () => {
  const { products } = useSelector(({ data }) => data);
  return (
    <div className={style.biometric}>
      <BackLink to="/" />
      <Chack products={products} />
      <div className={style.biometric__link}>
        <MyLink to="/face-control">Оплатить биометрией</MyLink>
      </div>
    </div>
  );
};

export default Biometric;
