import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  products: [
    {
      title: "Шоколад Вкусный 85 г.",
      amount: 1,
      total_price: 87.99,
    },
    {
      title: "Бананы фасованые",
      amount: 1,
      total_price: 128.32,
    },
    {
      title: "Йогурт с шоколадной крошкой",
      amount: 3,
      total_price: 64.99,
    },
    {
      title: "Молоко паст. 3%",
      amount: 1,
      total_price: 65.49,
    },
  ],
  cards: null,
};

const dataSlice = createSlice({
  name: "data",
  initialState,
  reducers: {
    setCards: (state, { payload }) => {
      state.cards = payload;
    },
    setEnd: (state) => {
      state.products = initialState.products;
      state.cards = null;
    },
    setPlus: (state, { payload }) => {
      state.products.forEach((item) => {
        if (item.title === payload) {
          item.amount += 1;
        }
      });
    },
    setDelete: (state, { payload }) => {
      state.products = state.products.filter(({ title }) => title !== payload);
    },
  },
});

const { reducer, actions } = dataSlice;
export const { setCards, setEnd, setPlus, setDelete } = actions;
export default reducer;
