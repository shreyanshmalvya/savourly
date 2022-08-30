import { configureStore } from '@reduxjs/toolkit'
import titleReducer from './title'
import userDataReducer from './userData'

export default configureStore({
  reducer: {
    title: titleReducer,
    userData: userDataReducer,
  },
})