import client, { ResponseDataType } from '~/api/client'
import { responseFormatter, throwErrorFormatter } from '~/utils/response-formatter'

const NAMESPACE = 'google/drive'

export default {
  uploadFile: async (data: any): Promise<ResponseDataType | undefined> => {
    return await client
      .post(`${NAMESPACE}/upload`, data)
      .then((res) => {
        return responseFormatter(res)
      })
      .catch(function (error) {
        throwErrorFormatter(error)
      })
  },
  generatePublicUrl: async (fileId: string): Promise<ResponseDataType | undefined> => {
    return await client
      .post(`${NAMESPACE}/${fileId}`)
      .then((res) => {
        return responseFormatter(res)
      })
      .catch(function (error) {
        throwErrorFormatter(error)
      })
  },
  deleteFile: async (fileId: string): Promise<ResponseDataType | undefined> => {
    return await client
      .delete(`${NAMESPACE}/${fileId}`)
      .then((res) => {
        return responseFormatter(res)
      })
      .catch(function (error) {
        throwErrorFormatter(error)
      })
  }
}
