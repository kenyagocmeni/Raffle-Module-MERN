import { configureStore } from '@reduxjs/toolkit';
import raffleReducer from './slices/raffleSlice';

const store = configureStore({
  reducer: {
    raffle: raffleReducer,
  },
});

export default store;