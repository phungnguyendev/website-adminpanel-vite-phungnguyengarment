import client, { ResponseDataType } from '~/api/client'
import { User } from '~/typing'
import { responseFormatter, throwErrorFormatter } from '~/utils/response-formatter'

const NAMESPACE = 'auth'

export default {
  login: async (user: User): Promise<ResponseDataType | undefined> => {
    return await client
      .post(`${NAMESPACE}/login`, {
        email: user.email,
        password: user.password
      })
      .then((res) => {
        return responseFormatter(res)
      })
      .catch(function (error) {
        throwErrorFormatter(error)
      })
  },
  register: async (user: User): Promise<ResponseDataType | undefined> => {
    return await client
      .post(`${NAMESPACE}/register`, {
        email: user.email,
        password: user.password
      })
      .then((res) => {
        return responseFormatter(res)
      })
      .catch(function (error) {
        throwErrorFormatter(error)
      })
  }
}
