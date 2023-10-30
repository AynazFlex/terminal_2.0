import { useDispatch, useSelector } from "react-redux";
import style from "./Basket.module.scss";
import MyLink from "../assets/MyLink";
import { setPlus, setDelete } from "../../store/dataReducer";

const Basket = () => {
  const { products } = useSelector(({ data }) => data);
  const dispatch = useDispatch();
  return (
    <div className={style.basket}>
      <header className={style.basket__header}>
        <h1>Ваши покупки</h1>
        <button>Отмена</button>
      </header>
      <div className={style.basket__colums}>
        <span>Наименование</span>
        <span>Количество</span>
        <span>Цена</span>
      </div>
      <div className={style.basket__wrapper}>
        {products.map(({ title, amount, total_price }) => (
          <div key={title} className={style.basket__item}>
            <span className={style.basket__item_title}>{title}</span>
            <span className={style.basket__item_amount}>
              <span
                onClick={() => dispatch(setDelete(title))}
                className={style.basket__icon_wrapper}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <path
                    d="M9 3H15M3 6H21M19 6L18.2987 16.5193C18.1935 18.0975 18.1409 18.8867 17.8 19.485C17.4999 20.0118 17.0472 20.4353 16.5017 20.6997C15.882 21 15.0911 21 13.5093 21H10.4907C8.90891 21 8.11803 21 7.49834 20.6997C6.95276 20.4353 6.50009 20.0118 6.19998 19.485C5.85911 18.8867 5.8065 18.0975 5.70129 16.5193L5 6M10 10.5V15.5M14 10.5V15.5"
                    stroke="#1B1B1F"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
              <span>{amount} шт</span>
              <span
                onClick={() => dispatch(setPlus(title))}
                className={style.basket__icon_wrapper}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <path
                    d="M12 5V19M5 12H19"
                    stroke="#1B1B1F"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
            </span>
            <span className={style.basket__item_price}>
              {(total_price * amount).toFixed(2)} ₽
            </span>
          </div>
        ))}
      </div>
      <div className={style.basket__total}>
        <span>Итого</span>
        <span>
          {products
            .reduce(
              (sum, { total_price, amount }) => sum + amount * total_price,
              0
            )
            .toFixed(2)}{" "}
          ₽
        </span>
      </div>
      <MyLink to="/biometric">Перейти к оплате</MyLink>
    </div>
  );
};

export default Basket;
