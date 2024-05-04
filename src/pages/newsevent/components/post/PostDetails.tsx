import { App as AntApp, Flex, Form, Typography } from 'antd'
import { useState } from 'react'
import FroalaEditorView from 'react-froala-wysiwyg/FroalaEditorView'
import 'react-quill/dist/quill.snow.css'
import PostAPI from '~/api/services/PostAPI'
import LazyImage from '~/components/sky-ui/LazyImage'
import SkyModalWrapper from '~/components/sky-ui/SkyModalWrapper'
import EditableFormCell from '~/components/sky-ui/SkyTable/EditableFormCell'
import useAPIService from '~/hooks/useAPIService'
import { Post } from '~/typing'
import { dateValidatorInit, textValidatorDisplay, textValidatorInit } from '~/utils/helpers'

interface Props {
  openModal: boolean
  setOpenModal: (enable: boolean) => void
  post: Post
}

const PostDetails: React.FC<Props> = ({ post, openModal, setOpenModal, ...props }) => {
  const { message } = AntApp.useApp()
  const postService = useAPIService<Post>(PostAPI)
  const [loading, setLoading] = useState<boolean>(false)
  const [editing, setEditing] = useState<boolean>(false)
  const [model, setModel] = useState<string>('')
  const [form] = Form.useForm()

  const handleSave = async () => {
    if (editing) {
      const row = await form.validateFields()
      await postService.updateItemByPk(post.id!, { ...row, content: model }, setLoading, (meta) => {
        if (!meta?.success) message.error(`${meta?.message}`)
        setEditing(false)
        setOpenModal(false)
        message.success(`${meta?.message}`)
      })
    }
  }

  const handleEdit = async () => {
    setEditing(!editing)
    setModel(`${post.content}`)
  }

  const handleCancel = async () => {
    setEditing(false)
    setOpenModal(false)
  }

  return (
    <>
      <SkyModalWrapper
        title='Post details'
        loading={loading}
        open={openModal}
        onOk={editing ? handleSave : handleEdit}
        onCancel={handleCancel}
        okText={editing ? 'Save' : 'Edit'}
      >
        <Flex {...props} vertical gap={20}>
          <Form form={form} labelCol={{ span: 4 }} labelAlign='left' className='w-full' labelWrap>
            <Flex vertical gap={16}>
              <EditableFormCell
                isEditing={editing}
                title='Image thumb'
                placeholder='Paste your image link..'
                dataIndex='imageUrl'
                inputType='text'
                required
                allowClear
                initialValue={textValidatorInit(post.imageUrl)}
              >
                <LazyImage src={textValidatorDisplay(post.imageUrl)} />
              </EditableFormCell>
              <EditableFormCell
                isEditing={editing}
                title='Title'
                placeholder='Title...'
                dataIndex='title'
                inputType='text'
                required
                allowClear
                initialValue={textValidatorInit(post.title)}
              >
                <Typography.Title level={4}>{textValidatorDisplay(post.title)}</Typography.Title>
              </EditableFormCell>
              <EditableFormCell
                isEditing={editing}
                title='Published at'
                placeholder='Published at..'
                dataIndex='publishedAt'
                inputType='dateTimePicker'
                required
                initialValue={dateValidatorInit(post.publishedAt)}
              >
                <Typography.Text type='secondary' className='text-sm italic'>
                  {textValidatorDisplay(post.publishedAt)}
                </Typography.Text>
              </EditableFormCell>
              <EditableFormCell
                isEditing={editing}
                title='Content'
                dataIndex='content'
                htmlEditorProps={{
                  value: model,
                  onChange: setModel
                }}
                initialValue={textValidatorDisplay(post.content)}
                inputType='htmlEditor'
                required
              >
                <FroalaEditorView model={textValidatorDisplay(post.content)} />
              </EditableFormCell>
            </Flex>
          </Form>
        </Flex>
      </SkyModalWrapper>
    </>
  )
}

export default PostDetails
