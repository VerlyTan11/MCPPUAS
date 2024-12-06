import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import searchReducer from './searchSlice';
import itemsReducer from './itemsSlice';
import categoryReducer from './categorySlice';

const store = configureStore({
    reducer: {
        auth: authReducer,
        search: searchReducer,
        items: itemsReducer,
        category: categoryReducer,
    },
});

export default store;