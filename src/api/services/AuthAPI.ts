import client, { ResponseDataType } from '~/api/client'
import { User } from '~/typing'
import { responseFormatter, throwErrorFormatter } from '~/utils/response-formatter'

const NAMESPACE = 'auth'

export default {
  login: async (user: User): Promise<ResponseDataType | undefined> => {
    return await client
      .post(`${NAMESPACE}/login`, user)
      .then((res) => {
        return responseFormatter(res)
      })
      .catch(function (error) {
        throwErrorFormatter(error)
      })
  },
  sendEmail: async (emailToSend: string): Promise<ResponseDataType | undefined> => {
    return await client
      .post(`${NAMESPACE}/send-email/${emailToSend}`)
      .then((res) => {
        return responseFormatter(res)
      })
      .catch(function (error) {
        throwErrorFormatter(error)
      })
  },
  verifyOTP: async (user: { email: string; otp: string }): Promise<ResponseDataType | undefined> => {
    return await client
      .post(`${NAMESPACE}/verify-otp/${user.email}`, { otp: user.otp })
      .then((res) => {
        return responseFormatter(res)
      })
      .catch(function (error) {
        throwErrorFormatter(error)
      })
  }
}
