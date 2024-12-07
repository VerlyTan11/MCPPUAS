import { createSlice } from '@reduxjs/toolkit';

const itemsSlice = createSlice({
    name: 'items',
    initialState: {
        items: [],
        loading: false,
    },
    reducers: {
        setItems(state, action) {
            state.items = action.payload;
        },
        addItem(state, action) {
            state.items.push({
            ...action.payload,
            timestamp: new Date(action.payload.timestamp).toISOString(),
        });
        },
        setLoading(state, action) {
            state.loading = action.payload;
        },
    },
});

export const { setItems, addItem, setLoading } = itemsSlice.actions;
export default itemsSlice.reducer;