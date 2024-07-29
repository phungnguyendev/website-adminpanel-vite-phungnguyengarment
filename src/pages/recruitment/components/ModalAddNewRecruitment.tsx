import { App, Form, Spin } from 'antd'
import React, { memo, useEffect, useState } from 'react'
import JobSectorAPI from '~/api/services/JobSectorAPI'
import SkyModal, { SkyModalProps } from '~/components/sky-ui/SkyModal'
import EditableFormCell from '~/components/sky-ui/SkyTable/EditableFormCell'
import define from '~/constants/define'
import useAPIService from '~/hooks/useAPIService'
import { JobSector } from '~/typing'
import { dateFormatter } from '~/utils/date-formatter'
import { RecruitmentPostNewRecord } from '../type'

interface Props extends SkyModalProps {
  onCreate: (data: RecruitmentPostNewRecord) => void
}

const ModalAddNewRecruitment: React.FC<Props> = ({ onCreate, ...props }) => {
  const { message } = App.useApp()
  const [form] = Form.useForm()
  const [loading, setLoading] = useState<boolean>(false)

  const jobSectorService = useAPIService<JobSector>(JobSectorAPI)

  const [jobSectors, setJobSectors] = useState<JobSector[]>([])

  useEffect(() => {
    initialize()
  }, [])

  const initialize = async () => {
    try {
      await jobSectorService.getItemsSync(
        { paginator: { page: 1, pageSize: -1 }, sorting: { column: 'orderNumber', direction: 'desc' } },
        setLoading,
        (res) => {
          if (!res.success) throw new Error(define('dataLoad_failed'))
          setJobSectors(res.data as JobSector[])
        }
      )
    } catch (err: any) {
      message.error(`${err.message}`)
    } finally {
      setLoading(false)
    }
  }

  async function handleOk() {
    await form
      .validateFields()
      .then((values) => {
        onCreate({ ...values, expirationDate: dateFormatter(values.expirationDate, 'iso8601') })
      })
      .catch(() => {
        message.error('Error validate form!')
      })
  }

  return (
    <>
      <SkyModal {...props} title='Add new recruitment' okText='Create' onOk={handleOk}>
        <Form form={form} labelCol={{ span: 4 }}>
          {loading ? (
            <Spin />
          ) : (
            <EditableFormCell
              isEditing
              required
              dataIndex='jobSectorID'
              title='Vị trí công việc'
              inputType='select'
              selectProps={{
                options: jobSectors.map((item, index) => {
                  return {
                    label: item.title,
                    value: item.id,
                    key: index
                  }
                })
              }}
            />
          )}
          <EditableFormCell
            isEditing
            required
            dataIndex='quantity'
            title='Số lượng'
            defaultValue={5}
            placeholder='Ví dụ: 5'
            inputType='text'
          />
          <EditableFormCell
            isEditing
            required
            dataIndex='wage'
            title='Mức lương'
            placeholder='4tr5 (cơ bản)'
            defaultValue='4tr5 (cơ bản)'
            inputType='text'
          />
          <EditableFormCell
            isEditing
            required
            dataIndex='workingTime'
            title='Thời gian làm việc'
            placeholder='Từ thứ 2 đến thứ 7 (7h30 - 16h30)'
            defaultValue='Từ thứ 2 đến thứ 7 (7h30 - 16h30)'
            inputType='text'
          />
          <EditableFormCell
            isEditing
            required
            dataIndex='workingPlace'
            title='Nơi làm việc'
            placeholder='Phụng Nguyên / Phụng Tình'
            inputType='select'
            defaultValue='Phụng Nguyên'
            selectProps={{
              options: [
                {
                  label: 'Phụng Nguyên',
                  value: 'Phụng Nguyên'
                },
                {
                  label: 'Phụng Tình',
                  value: 'Phụng Tình'
                }
              ]
            }}
          />
          <EditableFormCell isEditing required dataIndex='expirationDate' title='Ngày hết hạn' inputType='datepicker' />
        </Form>
      </SkyModal>
    </>
  )
}

export default memo(ModalAddNewRecruitment)
