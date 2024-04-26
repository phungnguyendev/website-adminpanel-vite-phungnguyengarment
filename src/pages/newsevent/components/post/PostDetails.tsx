import { Button, Flex, Form, Skeleton } from 'antd'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import PostAPI from '~/api/services/PostAPI'
import BaseLayout from '~/components/layout/BaseLayout'
import ImageUploader from '~/components/sky-ui/ImageUploader'
import EditableFormCell from '~/components/sky-ui/SkyTable/EditableFormCell'
import useAPIService from '~/hooks/useAPIService'
import { Post } from '~/typing'

const PostDetails = () => {
  const params = useParams()
  const postService = useAPIService<Post>(PostAPI)
  const [loading, setLoading] = useState<boolean>(false)
  const [post, setPost] = useState<Post>()
  const [form] = Form.useForm()

  useEffect(() => {
    const postID = params['postID']
    if (postID) {
      postService.getItemByPk(Number(postID), setLoading, (meta) => {
        if (meta?.success) {
          setPost(meta.data as Post)
        }
      })
    }
  }, [])

  return (
    <>
      <BaseLayout onLoading={setLoading}>
        <Flex vertical gap={20}>
          <Flex justify='end'>
            <Button type='primary'>Updated</Button>
          </Flex>
          <Form form={form} labelCol={{ span: 4 }} labelAlign='left' className='w-full' labelWrap>
            <Flex vertical gap={16}>
              {loading ? (
                <Skeleton.Input active size='default' block />
              ) : (
                <EditableFormCell
                  isEditing={true}
                  title='Title'
                  placeholder='title...'
                  dataIndex='title'
                  inputType='text'
                  required
                  initialValue={123}
                />
              )}
              {loading ? (
                <Skeleton.Avatar active size='default' />
              ) : (
                <Form.Item name='thumbID' required label='Thumb image' validateTrigger='onBlur' style={{ margin: 0 }}>
                  <ImageUploader />
                </Form.Item>
              )}
            </Flex>
          </Form>
        </Flex>
      </BaseLayout>
    </>
  )
}

export default PostDetails
