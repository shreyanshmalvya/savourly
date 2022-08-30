import { createSlice } from '@reduxjs/toolkit'

export const loginSlice = createSlice({
  name: 'login',
  initialState: {
    login: false,
  },
  reducers: {
    setLogin: (state, action) => {
      state.login = action.payload;
    },
  },
})

// Action creators are generated for each case reducer function
export const { setLogin } = loginSlice.actions;

export default loginSlice.reducer;