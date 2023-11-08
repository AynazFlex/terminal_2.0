import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "./api";

export const getCategories = createAsyncThunk(
  "data/categories",
  async (_, thunkAPI) => {
    try {
      const { products } = thunkAPI.getState().data;
      const results = await Promise.allSettled(
        products.map(
          ({ title }) =>
            api.post(
              "/get_category/",
              JSON.stringify({ name: title }),
              "application/json"
            )
          // fetch("http://51.250.97.147/api/v1/get_category/", {
          //   method: "POST",
          //   headers: {
          //     "Content-Type": "application/json",
          //   },
          //   body: JSON.stringify({ name: title }),
          // }).then((response) => response.json())
        )
      );
      return results.reduce((arr, res, i) => {
        if (res.status !== "fulfilled") return [...arr, products[i]];
        return [...arr, { ...products[i], category: res.value.name }];
      }, []);
    } catch ({ response }) {
      return thunkAPI.rejectWithValue(response.data.detail || "Error :/");
    }
  }
);

const initialState = {
  products: [
    {
      title: "Средство для мытья посуды",
      amount: 1,
      total_price: 120.45,
      category: null,
    },
    {
      title: "Огурчики соленые",
      amount: 1,
      total_price: 128.32,
      category: null,
    },
    {
      title: "Йогурт с шоколадной крошкой",
      amount: 3,
      total_price: 64.99,
      category: null,
    },
    {
      title: "Молоко пастеризованное",
      amount: 1,
      total_price: 65.49,
      category: null,
    },
    {
      title: "Носки хлопковые",
      amount: 1,
      total_price: 76.23,
      category: null,
    },
  ],
  cards: null,
  isDone: false,
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
        if (item.title !== payload) return;
        item.amount += 1;
      });
    },
    setDelete: (state, { payload }) => {
      state.products.forEach((item, index) => {
        if (item.title !== payload) return;
        if (item.amount > 1) return (item.amount -= 1);
        state.products = [
          ...state.products.slice(0, index),
          ...state.products.slice(index + 1),
        ];
      });
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getCategories.fulfilled, (state, { payload }) => {
      console.log(payload);
      state.products = payload;
      state.isDone = true;
    });
    builder.addCase(getCategories.pending, (state) => {
      state.isDone = false;
    });
    builder.addCase(getCategories.rejected, (state) => {
      state.isDone = true;
    });
  },
});

const { reducer, actions } = dataSlice;
export const { setCards, setEnd, setPlus, setDelete } = actions;
export default reducer;
