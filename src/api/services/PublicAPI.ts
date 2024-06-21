import { UploadFile } from 'antd'
import client, { ResponseDataType } from '~/api/client'
import { responseFormatter, throwErrorFormatter } from '~/utils/response-formatter'

type UploadType = 'images' | 'videos' | 'files' | 'icons'

const NAMESPACE = 'public'

export default {
  upload: async (
    files: UploadFile[],
    uploadType: UploadType,
    accessToken: string
  ): Promise<ResponseDataType | undefined> => {
    return await client
      .post(
        `${NAMESPACE}/upload/${[uploadType]}`,
        {
          [uploadType]: files
        },
        {
          headers: {
            authorization: accessToken
          }
        }
      )
      .then((res) => {
        return responseFormatter(res)
      })
      .catch(function (error) {
        throwErrorFormatter(error)
      })
  },
  getItem: async (
    fileName: number,
    uploadType: UploadType,
    accessToken: string
  ): Promise<ResponseDataType | undefined> => {
    return client
      .get(`${NAMESPACE}/${[uploadType]}/${fileName}`, {
        headers: {
          authorization: accessToken
        }
      })
      .then((res) => {
        return responseFormatter(res)
      })
      .catch(function (error) {
        throwErrorFormatter(error)
      })
  },
  getItems: async (uploadType: UploadType, accessToken: string): Promise<ResponseDataType | undefined> => {
    return await client
      .get(`${NAMESPACE}/${[uploadType]}`, {
        headers: {
          authorization: accessToken
        }
      })
      .then((res) => {
        return responseFormatter(res)
      })
      .catch(function (error) {
        throwErrorFormatter(error)
      })
  },
  deleteItemByFileName: async (
    fileName: string,
    uploadType: UploadType,
    accessToken: string
  ): Promise<ResponseDataType | undefined> => {
    return client
      .delete(`${NAMESPACE}/${[uploadType]}/${fileName}`, {
        headers: {
          authorization: accessToken
        }
      })
      .then((res) => {
        return responseFormatter(res)
      })
      .catch(function (error) {
        throwErrorFormatter(error)
      })
  }
}
