import client, { RequestBodyType, ResponseDataType } from '~/api/client'
import { Category } from '~/typing'
import { responseFormatter, throwErrorFormatter } from '~/utils/response-formatter'

const NAMESPACE = 'categories'

export default {
  createItem: async (newItem: Category, accessToken: string): Promise<ResponseDataType> => {
    return await client
      .post(`${NAMESPACE}`, newItem, {
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
  getItemByPk: async (id: number, accessToken: string): Promise<ResponseDataType> => {
    return client
      .get(`${NAMESPACE}/${id}`, {
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
  getItems: async (bodyRequest: RequestBodyType, accessToken: string): Promise<ResponseDataType> => {
    return await client
      .post(`${NAMESPACE}/find`, bodyRequest, {
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
  updateItemByPk: async (id: number, itemToUpdate: Category, accessToken: string): Promise<ResponseDataType> => {
    return client
      .patch(`${NAMESPACE}/${id}`, itemToUpdate, {
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
  updateItems: async (itemsToUpdate: Category[], accessToken: string): Promise<ResponseDataType> => {
    return client
      .put(`${NAMESPACE}`, itemsToUpdate, {
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
  deleteItemByPk: async (id: number, accessToken: string): Promise<ResponseDataType> => {
    return client
      .delete(`${NAMESPACE}/${id}`, {
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
