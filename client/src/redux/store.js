import { configureStore } from '@reduxjs/toolkit'
import titleReducer from './title'
import userDataReducer from './userData'
import loginReducer from './login'

export default configureStore({
  reducer: {
    title: titleReducer,
    userData: userDataReducer,
    login: loginReducer,
  },
})