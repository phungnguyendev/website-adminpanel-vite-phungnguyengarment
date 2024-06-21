import type { FormProps } from 'antd'
import { Flex, Form } from 'antd'
import React, { memo } from 'react'
import SkyModal from '~/components/sky-ui/SkyModal'
import EditableFormCell from '~/components/sky-ui/SkyTable/EditableFormCell'
import { RecruitmentPost } from '~/typing'

export interface IndustrySectorAddNewProps extends RecruitmentPost {}

interface Props {
  openModal: boolean
  loading?: boolean
  formProps?: FormProps
  setOpenModal: (enable: boolean) => void
  onAddNew: (recordToAddNew: IndustrySectorAddNewProps) => void
}

const ModalAddNewRecruitment: React.FC<Props> = ({ loading, onAddNew, openModal, setOpenModal, formProps }) => {
  const [form] = Form.useForm()
  async function handleOk() {
    const row = await form.validateFields()
    onAddNew(row)
  }

  return (
    <>
      <SkyModal
        loading={loading}
        open={openModal}
        onOk={handleOk}
        onCancel={() => setOpenModal(false)}
        title='Add Industry Sector'
      >
        <Form {...formProps} labelCol={{ span: 4 }} labelAlign='left' className='w-full' labelWrap form={form}>
          <Flex vertical gap={20} className='w-full'>
            <EditableFormCell
              isEditing={true}
              title='Khối ngành'
              placeholder='Type here..'
              dataIndex='title'
              inputType='text'
              required
            />
          </Flex>
        </Form>
      </SkyModal>
    </>
  )
}

export default memo(ModalAddNewRecruitment)
