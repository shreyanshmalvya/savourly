import { createSlice } from '@reduxjs/toolkit'

export const userDataSlice = createSlice({
  name: 'userData',
  initialState: {
    userData: {username: ''},
  },
  reducers: {
    incrementByAmount: (state, action) => {
      state.userData = action.payload;
    },
  },
})

// Action creators are generated for each case reducer function
export const { incrementByAmount } = userDataSlice.actions;

export default userDataSlice.reducer;