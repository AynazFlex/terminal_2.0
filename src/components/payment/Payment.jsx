import style from "./Payment.module.scss";
import { useState } from "react";
import { useSelector } from "react-redux";
import Chack from "../assets/Chak";
import MyLink from "../assets/MyLink";
import CashbackIcon from "../assets/CashbackIcon";

const calculateCash = (products, cards) => {
  return cards
    .reduce((res, card) => {
      if (card.cashbacks.length === 0)
        return [...res, { ...card, totalCash: -1 }];
      const totalCash = card.cashbacks.reduce((sum, cashback) => {
        const findProduct = products.find(
          ({ category }) => category === cashback.product_type
        );
        if (findProduct)
          return (
            sum +
            (findProduct.total_price * findProduct.amount * cashback.value) /
              100
          );
        return sum;
      }, 0);

      return [...res, { ...card, totalCash }];
    }, [])
    .sort((a, b) => b.totalCash - a.totalCash);
};

const Payment = () => {
  const {
    products,
    cards: { cards },
  } = useSelector(({ data }) => data);
  const data = calculateCash(products, cards);
  console.log(data);
  const [select, setSelect] = useState(
    `${data[0].bank}${data[0].last_four_digits}`
  );

  return (
    <div className={style.payment}>
      <h3 className={style.payment__title}>Карты для оплаты</h3>
      <div className={style.payment__container}>
        {data.map(({ bank, cashbacks, last_four_digits, totalCash }) => (
          <div
            onClick={() => setSelect(`${bank}${last_four_digits}`)}
            className={style.payment__item}
            key={`${bank}${last_four_digits}`}
          >
            <div>
              <div className={style.payment__bank}>
                <span className={style.payment__bank_icon}>
                  {bank === "Центр-инвест" ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="28"
                      height="28"
                      viewBox="0 0 28 28"
                      fill="none"
                    >
                      <path
                        d="M14.4523 4V8.97537L18.5083 4H14.4523Z"
                        fill="#50B848"
                      />
                      <path
                        d="M21.4012 4.68448L14.4523 13.2221V15.3491C14.4597 15.2903 14.4744 15.2314 14.4818 15.1725L14.5701 14.7971C14.7394 14.2451 14.9602 13.7667 15.3136 13.2883L15.5491 13.0087C15.8215 12.729 16.0865 12.5155 16.4251 12.3168C16.6018 12.2211 16.7711 12.1475 16.9551 12.0813C17.3673 11.9635 17.7133 11.912 18.1476 11.9267L18.5451 11.9856C18.8764 12.0666 19.1561 12.1623 19.4505 12.3242C19.6198 12.4199 19.767 12.5229 19.9216 12.6333C20.378 13.016 20.6872 13.4208 20.9669 13.9213L21.1215 14.2599C21.2466 14.5837 21.335 15.0547 21.4012 15.3712V4.68448Z"
                        fill="#50B848"
                      />
                      <path
                        d="M17.9415 12.6995C16.4251 12.6995 15.1884 14.2599 15.1884 16.1661C15.1884 18.0723 16.4251 19.6327 17.9415 19.6327C19.4579 19.6327 20.7019 18.0723 20.7019 16.1661C20.7019 14.2599 19.4652 12.6995 17.9415 12.6995ZM17.9415 18.5066C17.0287 18.5066 16.2852 17.4541 16.2852 16.1661C16.2852 14.8781 17.0287 13.8183 17.9415 13.8183C18.8543 13.8183 19.6051 14.8707 19.6051 16.1661C19.6051 17.4615 18.8543 18.5066 17.9415 18.5066Z"
                        fill="#50B848"
                      />
                      <path
                        d="M14.5775 17.5351L14.4891 17.1597C14.4744 17.1008 14.4671 17.0419 14.4597 16.9831V21.1415H21.4086V17.0051C21.3202 17.4467 21.1877 17.9914 20.9743 18.4183L20.7902 18.7421C20.5105 19.169 20.2087 19.5002 19.7891 19.8167L19.4652 20.0154C19.1634 20.17 18.8911 20.273 18.5598 20.354C18.3537 20.3908 18.1623 20.4055 17.9562 20.4128C17.6765 20.4055 17.4336 20.376 17.1612 20.3098C16.9698 20.2509 16.7932 20.1847 16.6165 20.1111C16.2043 19.8976 15.8877 19.6547 15.5712 19.3309L15.3283 19.0439C14.9823 18.5655 14.7541 18.0944 14.5848 17.5351H14.5775Z"
                        fill="#50B848"
                      />
                      <path
                        d="M5.11108 20.457L12.06 11.9194V9.79233C12.06 9.85121 12.0379 9.91009 12.0305 9.96897L11.9422 10.3443C11.7802 10.8963 11.5521 11.3747 11.1987 11.8531L10.9632 12.1328C10.6908 12.4125 10.4332 12.6186 10.0872 12.8247C9.91052 12.9203 9.74122 12.9939 9.55719 13.0602C9.14497 13.1779 8.799 13.2295 8.36469 13.2147L7.96719 13.1632C7.62858 13.0823 7.35622 12.9792 7.06178 12.8247C6.89247 12.729 6.74525 12.6259 6.59067 12.5155C6.14164 12.1328 5.82511 11.728 5.55275 11.2275L5.39081 10.889C5.26567 10.5725 5.17733 10.1015 5.11108 9.78497V20.4643V20.457Z"
                        fill="#50B848"
                      />
                      <path
                        d="M8.57081 12.4419C10.0872 12.4419 11.3312 10.889 11.3312 8.97537C11.3312 7.06177 10.0946 5.5088 8.57081 5.5088C7.04706 5.5088 5.81039 7.06177 5.81039 8.97537C5.81039 10.8816 7.04706 12.4419 8.57081 12.4419ZM8.57081 6.62752C9.49094 6.62752 10.2344 7.68001 10.2344 8.97537C10.2344 10.2707 9.49094 11.3159 8.57081 11.3159C7.65067 11.3159 6.90719 10.2634 6.90719 8.97537C6.90719 7.68737 7.65067 6.62752 8.57081 6.62752Z"
                        fill="#50B848"
                      />
                      <path
                        d="M11.9422 7.60641L12.0305 7.98177C12.0379 8.04065 12.0526 8.09953 12.06 8.15841V4H5.11108V8.14369C5.19942 7.70209 5.33928 7.15745 5.54539 6.73057L5.72942 6.40672C6.00914 5.97984 6.31094 5.64864 6.73053 5.33216L7.04706 5.12608C7.34886 4.97152 7.62122 4.86848 7.95247 4.79488C8.15858 4.75808 8.34997 4.74336 8.55608 4.736C8.8358 4.74336 9.07872 4.7728 9.35108 4.83904C9.54247 4.89792 9.71914 4.96416 9.8958 5.03776C10.308 5.25856 10.6246 5.49408 10.9411 5.81792L11.184 6.0976C11.53 6.576 11.7582 7.05441 11.9275 7.60641H11.9422Z"
                        fill="#50B848"
                      />
                      <path
                        d="M12.06 16.1661L8.004 21.1415H12.06V16.1661Z"
                        fill="#50B848"
                      />
                      <path
                        d="M19.4358 4L5.51594 21.1415H7.05441L21.0037 4H19.4358Z"
                        fill="#50B848"
                      />
                      <path
                        d="M13.8266 19.9639H12.6489V21.1415H13.8266V19.9639Z"
                        fill="#50B848"
                      />
                      <path
                        d="M22.0932 19.9639V21.1415C22.9102 21.1415 23.477 21.9143 23.477 22.7165C23.477 23.5188 22.8145 24.2916 21.9975 24.2916C21.3939 24.2916 20.8491 24.1591 19.7155 23.8794C17.5072 23.3421 14.7983 22.6724 12.6194 22.1424C8.71067 21.1783 5.12581 22.2676 5.11108 24.8068H6.30358C6.30358 23.8647 8.12914 23.2391 12.0452 24.1959C15.4314 25.0276 16.7048 25.3367 19.2591 25.9623C20.9448 26.3744 22.3213 26.2788 23.3151 25.8004C24.3088 25.322 24.9861 24.1591 24.9861 22.9962C24.9861 21.3623 23.742 19.9639 22.0858 19.9639H22.0932Z"
                        fill="#50B848"
                      />
                    </svg>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                    >
                      <text
                        x="12"
                        y="17"
                        font-size="16"
                        font-family="Arial"
                        text-anchor="middle"
                        fill="#FFFFFF"
                      >
                        💰
                      </text>
                    </svg>
                  )}
                </span>
                <span>
                  {bank} ***{last_four_digits}
                </span>
              </div>
              <div className={style.payment__cashbacks}>
                {!!cashbacks.length &&
                  cashbacks.map(({ product_type, value }) => (
                    <div className={style.payment__cashback} key={product_type}>
                      <CashbackIcon size={24} name={product_type} />
                      <span>
                        {product_type} {value}%
                      </span>
                    </div>
                  ))}
                {!!cashbacks.length && (
                  <div className={style.payment__total_cash}>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 16 16"
                      fill="none"
                    >
                      <g clipPath="url(#clip0_54500_37051)">
                        <path
                          d="M6.00004 5.99998H6.00671M10 9.99998H10.0067M10.6667 5.33331L5.33337 10.6666M4.88922 2.54578C5.42511 2.50301 5.93385 2.29228 6.34302 1.94359C7.29786 1.12989 8.70222 1.12989 9.65706 1.94359C10.0662 2.29228 10.575 2.50301 11.1109 2.54578C12.3614 2.64557 13.3544 3.63861 13.4542 4.88916C13.497 5.42505 13.7077 5.93379 14.0564 6.34296C14.8701 7.2978 14.8701 8.70216 14.0564 9.657C13.7077 10.0662 13.497 10.5749 13.4542 11.1108C13.3544 12.3614 12.3614 13.3544 11.1109 13.4542C10.575 13.4969 10.0662 13.7077 9.65706 14.0564C8.70222 14.8701 7.29786 14.8701 6.34302 14.0564C5.93385 13.7077 5.42511 13.4969 4.88922 13.4542C3.63867 13.3544 2.64563 12.3614 2.54584 11.1108C2.50307 10.5749 2.29235 10.0662 1.94365 9.657C1.12995 8.70216 1.12995 7.2978 1.94365 6.34296C2.29235 5.93379 2.50307 5.42505 2.54584 4.88916C2.64563 3.63861 3.63867 2.64557 4.88922 2.54578ZM6.33337 5.99998C6.33337 6.18407 6.18414 6.33331 6.00004 6.33331C5.81595 6.33331 5.66671 6.18407 5.66671 5.99998C5.66671 5.81588 5.81595 5.66665 6.00004 5.66665C6.18414 5.66665 6.33337 5.81588 6.33337 5.99998ZM10.3334 9.99998C10.3334 10.1841 10.1841 10.3333 10 10.3333C9.81595 10.3333 9.66671 10.1841 9.66671 9.99998C9.66671 9.81588 9.81595 9.66665 10 9.66665C10.1841 9.66665 10.3334 9.81588 10.3334 9.99998Z"
                          stroke="#201C00"
                          strokeWidth="1.33"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </g>
                    </svg>
                    {totalCash.toFixed(2)} ₽
                  </div>
                )}
                {!cashbacks.length && (
                  <span className={style.payment__no_cashback}>
                    Категории кешбека не выбраны
                  </span>
                )}
              </div>
            </div>
            {select === `${bank}${last_four_digits}` || (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="32"
                height="32"
                viewBox="0 0 32 32"
                fill="none"
              >
                <path
                  d="M16 2.66675C8.63996 2.66675 2.66663 8.64008 2.66663 16.0001C2.66663 23.3601 8.63996 29.3334 16 29.3334C23.36 29.3334 29.3333 23.3601 29.3333 16.0001C29.3333 8.64008 23.36 2.66675 16 2.66675ZM16 26.6667C10.1066 26.6667 5.33329 21.8934 5.33329 16.0001C5.33329 10.1067 10.1066 5.33341 16 5.33341C21.8933 5.33341 26.6666 10.1067 26.6666 16.0001C26.6666 21.8934 21.8933 26.6667 16 26.6667Z"
                  fill="#44474F"
                />
              </svg>
            )}
            {select === `${bank}${last_four_digits}` && (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="32"
                height="32"
                viewBox="0 0 32 32"
                fill="none"
              >
                <path
                  d="M16 2.66675C8.63996 2.66675 2.66663 8.64008 2.66663 16.0001C2.66663 23.3601 8.63996 29.3334 16 29.3334C23.36 29.3334 29.3333 23.3601 29.3333 16.0001C29.3333 8.64008 23.36 2.66675 16 2.66675ZM16 26.6667C10.1066 26.6667 5.33329 21.8934 5.33329 16.0001C5.33329 10.1067 10.1066 5.33341 16 5.33341C21.8933 5.33341 26.6666 10.1067 26.6666 16.0001C26.6666 21.8934 21.8933 26.6667 16 26.6667Z"
                  fill="#006E0D"
                />
                <path
                  d="M16 22.6667C19.6819 22.6667 22.6666 19.682 22.6666 16.0001C22.6666 12.3182 19.6819 9.33342 16 9.33342C12.3181 9.33342 9.33329 12.3182 9.33329 16.0001C9.33329 19.682 12.3181 22.6667 16 22.6667Z"
                  fill="#006E0D"
                />
              </svg>
            )}
          </div>
        ))}
      </div>
      <Chack products={products} />
      <div className={style.payment__link}>
        <MyLink to="/end">Оплатить</MyLink>
      </div>
    </div>
  );
};

export default Payment;
