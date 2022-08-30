import { createSlice } from '@reduxjs/toolkit'

export const titleSlice = createSlice({
  name: 'title',
  initialState: {
    title: '',
  },
  reducers: {
    incrementByAmount: (state, action) => {
      state.title = action.payload;
    },
  },
})

// Action creators are generated for each case reducer function
export const { incrementByAmount } = titleSlice.actions;

export default titleSlice.reducer;