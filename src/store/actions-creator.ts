import { createAction } from '@reduxjs/toolkit'
import { User } from '~/typing'

export const setUserAction = createAction<User>('user/setUser')

export const setUserResetPasswordAction = createAction<{ user: User; isResetPassword: boolean }>('user/isResetPassword')
