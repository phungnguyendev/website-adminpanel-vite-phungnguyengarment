import { App, Flex, Form, Typography } from 'antd'
import { useState } from 'react'
import HTMLEditor from '~/components/sky-ui/HTMLEditor'
import HTMLReader from '~/components/sky-ui/HTMLReader'
import LazyImage from '~/components/sky-ui/LazyImage'
import SkyModal, { SkyModalProps } from '~/components/sky-ui/SkyModal'
import EditableFormCell from '~/components/sky-ui/SkyTable/EditableFormCell'
import { Post } from '~/typing'
import {
  dateTimeValidatorDisplay,
  dateValidatorInit,
  htmlValidatorDisplay,
  textValidatorDisplay,
  textValidatorInit
} from '~/utils/helpers'
import { PostTableDataType } from '../../type'

interface ModalReviewPostDetailsProps extends SkyModalProps {
  item: Post
  onEdit?: (e?: React.MouseEvent<HTMLButtonElement>) => void
  onCancelEdit?: () => void
  onSave?: (data: PostTableDataType) => void
  onCancelSave?: () => void
}

const ModalReviewPostDetails: React.FC<ModalReviewPostDetailsProps> = ({
  item,
  onSave,
  onEdit,
  onCancelSave,
  onCancelEdit,
  ...props
}) => {
  const { message } = App.useApp()
  const [editing, setEditing] = useState<boolean>(false)
  const [model, setModel] = useState<string>('')
  const [form] = Form.useForm()

  const handleSave = async () => {
    await form
      .validateFields()
      .then((row) => {
        onSave?.({ ...item, ...row, content: model })
      })
      .catch((e) => {
        message.error(`${e.message}`)
      })
  }

  const handleCancelSave = async () => {
    onCancelSave?.()
  }

  const handleEdit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    onEdit?.(e)
    setEditing(!editing)
    setModel(`${item.content}`)
  }

  const handleCancelEdit = async () => {
    setEditing(false)
    onCancelEdit?.()
  }

  const handleChangeHTMLEditor = async (data: string) => {
    setModel(data)
  }

  return (
    <>
      <SkyModal
        {...props}
        title='Post details'
        onOk={editing ? handleSave : handleEdit}
        onCancel={editing ? handleCancelSave : handleCancelEdit}
        okText={editing ? 'Save' : 'Edit'}
      >
        <Flex vertical gap={20}>
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
                defaultValue={textValidatorInit(item.imageUrl)}
              >
                <LazyImage src={textValidatorDisplay(item.imageUrl)} width={150} height={150} />
              </EditableFormCell>
              <EditableFormCell
                isEditing={editing}
                title='Title'
                placeholder='Title...'
                dataIndex='title'
                inputType='text'
                required
                allowClear
                defaultValue={textValidatorInit(item.title)}
              >
                <Typography.Title level={4}>{textValidatorDisplay(item.title)}</Typography.Title>
              </EditableFormCell>
              <EditableFormCell
                isEditing={editing}
                title='Published at'
                placeholder='Published at..'
                dataIndex='publishedAt'
                inputType='dateTimePicker'
                required
                defaultValue={dateValidatorInit(item.publishedAt)}
              >
                <Typography.Text type='secondary' className='text-sm italic'>
                  {dateTimeValidatorDisplay(item.publishedAt)}
                </Typography.Text>
              </EditableFormCell>
              {editing ? (
                <HTMLEditor
                  value={model}
                  defaultValue={textValidatorInit(item.content)}
                  onChange={handleChangeHTMLEditor}
                />
              ) : (
                <HTMLReader htmlString={htmlValidatorDisplay(item.content)} />
              )}
            </Flex>
          </Form>
        </Flex>
      </SkyModal>
    </>
  )
}

export default ModalReviewPostDetails
