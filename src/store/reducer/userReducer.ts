import { createReducer } from '@reduxjs/toolkit'
import { User } from '~/typing'
import { setUserAction, setUserResetPasswordAction } from '../actions-creator'

interface AppUser {
  user: User
  userTemp: { user: User; isResetPassword: boolean }
}

const initialState: AppUser = {
  user: {},
  userTemp: { user: {}, isResetPassword: false }
}

const userReducer = createReducer(initialState, (builder) => {
  builder.addCase(setUserAction, (state, action) => {
    state.user = action.payload
  })
  builder.addCase(setUserResetPasswordAction, (state, action) => {
    state.userTemp = action.payload
  })
})

export default userReducer
