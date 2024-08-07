import { Button, Card, Flex, List, Popconfirm } from 'antd'
import React, { HTMLAttributes } from 'react'
import HTMLReader from '~/components/sky-ui/HTMLReader'
import EditableStateCell from '~/components/sky-ui/SkyTable/EditableStateCell'
import SkyTableTypography from '~/components/sky-ui/SkyTable/SkyTableTypography'
import { JobSector } from '~/typing'
import {
  dateValidatorChange,
  dateValidatorDisplay,
  dateValidatorInit,
  htmlValidatorDisplay,
  isValidString,
  numberValidatorChange,
  numberValidatorDisplay,
  numberValidatorInit,
  textValidatorChange,
  textValidatorDisplay,
  textValidatorInit
} from '~/utils/helpers'
import { RecruitmentPostNewRecord, RecruitmentPostTableDataType } from '../type'

interface Props extends HTMLAttributes<HTMLDivElement> {
  item: RecruitmentPostTableDataType
  isEditing: boolean
  editingKey: string
  jobSectors: JobSector[]
  newRecord: RecruitmentPostNewRecord | null
  setNewRecord: React.Dispatch<React.SetStateAction<RecruitmentPostNewRecord | null>>
  onEdit: () => void
  onSave: () => void
  onDelete: () => void
  onConfirmDelete: () => void
  onConfirmCancelEditing: () => void
  onConfirmCancelDeleting: () => void
}

const RecruitmentListItem: React.FC<Props> = ({
  item,
  isEditing,
  editingKey,
  jobSectors,
  newRecord,
  setNewRecord,
  onEdit,
  onSave,
  onDelete,
  onConfirmDelete,
  onConfirmCancelEditing,
  onConfirmCancelDeleting,
  ...props
}) => {
  return (
    <List.Item {...props}>
      <Card
        title={<SkyTableTypography className='w-fit'>#{item.id}</SkyTableTypography>}
        extra={
          <Flex gap={10}>
            {isEditing ? (
              <Button onClick={onSave} type='primary'>
                Save
              </Button>
            ) : (
              <Button disabled={isValidString(editingKey) && editingKey !== item.key} onClick={onEdit} type='primary'>
                Edit
              </Button>
            )}

            {isEditing ? (
              <Popconfirm title='Sure to cancel?' onConfirm={onConfirmCancelEditing}>
                <Button type='dashed'>Cancel</Button>
              </Popconfirm>
            ) : (
              <Popconfirm title='Sure to delete?' onConfirm={onConfirmDelete} onCancel={onConfirmCancelDeleting}>
                <Button
                  disabled={isValidString(editingKey) && editingKey !== item.key}
                  onClick={onDelete}
                  type='dashed'
                >
                  Delete
                </Button>
              </Popconfirm>
            )}
          </Flex>
        }
        className='w-full'
      >
        <Flex vertical gap={10}>
          <EditableStateCell
            isEditing={isEditing}
            dataIndex='vacancies'
            title='Vị trí tuyển dụng'
            required
            inputType='select'
            onValueChange={(val: number) =>
              setNewRecord((prev) => {
                return { ...prev, jobSectorID: numberValidatorChange(val) }
              })
            }
            defaultValue={numberValidatorInit(item.jobSectorID)}
            selectProps={{
              options: jobSectors.map((item, index) => {
                return { label: item.title, value: item.id, key: index }
              })
            }}
          >
            <Flex gap={20} className='my-2'>
              <SkyTableTypography className='w-[150px] font-bold'>Vị trí công việc: </SkyTableTypography>
              <SkyTableTypography className='w-fit'>{textValidatorDisplay(item.jobSector?.title)}</SkyTableTypography>
            </Flex>
          </EditableStateCell>
          <EditableStateCell
            isEditing={isEditing}
            inputType='number'
            title='Số lượng'
            defaultValue={numberValidatorInit(item.quantity)}
            value={newRecord?.quantity}
            onValueChange={(val: number) =>
              setNewRecord((prev) => {
                return { ...prev, quantity: numberValidatorChange(val) }
              })
            }
          >
            <Flex gap={20} className='my-2'>
              <SkyTableTypography className='w-[150px] font-bold'>Số lượng: </SkyTableTypography>
              <SkyTableTypography>{numberValidatorDisplay(item.quantity)}</SkyTableTypography>
            </Flex>
          </EditableStateCell>
          <EditableStateCell
            isEditing={isEditing}
            inputType='text'
            title='Mức lương'
            defaultValue={textValidatorInit(item.wage)}
            value={newRecord?.wage}
            onValueChange={(val: string) =>
              setNewRecord((prev) => {
                return { ...prev, wage: textValidatorChange(val) }
              })
            }
          >
            <Flex gap={20} className='my-2'>
              <SkyTableTypography className='w-[150px] font-bold'>Mức lương: </SkyTableTypography>
              <SkyTableTypography>{textValidatorDisplay(item.wage)}</SkyTableTypography>
            </Flex>
          </EditableStateCell>
          <EditableStateCell
            isEditing={isEditing}
            inputType='text'
            title='Độ tuổi'
            defaultValue={textValidatorInit(item.age)}
            value={newRecord?.age}
            onValueChange={(val: string) =>
              setNewRecord((prev) => {
                return { ...prev, age: textValidatorChange(val) }
              })
            }
          >
            <Flex gap={20} className='my-2'>
              <SkyTableTypography className='w-[150px] font-bold'>Độ tuổi: </SkyTableTypography>
              <SkyTableTypography>{textValidatorDisplay(item.age)}</SkyTableTypography>
            </Flex>
          </EditableStateCell>
          <EditableStateCell
            isEditing={isEditing}
            inputType='text'
            title='Giới tính'
            defaultValue={textValidatorInit(item.sex)}
            value={newRecord?.sex}
            onValueChange={(val: string) =>
              setNewRecord((prev) => {
                return { ...prev, sex: textValidatorChange(val) }
              })
            }
          >
            <Flex gap={20} className='my-2'>
              <SkyTableTypography className='w-[150px] font-bold'>Giới tính: </SkyTableTypography>
              <SkyTableTypography>{textValidatorDisplay(item.sex)}</SkyTableTypography>
            </Flex>
          </EditableStateCell>
          <EditableStateCell
            isEditing={isEditing}
            inputType='text'
            title='Trình độ học vấn'
            defaultValue={textValidatorInit(item.academicLevel)}
            value={newRecord?.academicLevel}
            onValueChange={(val: string) =>
              setNewRecord((prev) => {
                return { ...prev, academicLevel: textValidatorChange(val) }
              })
            }
          >
            <Flex gap={20} className='my-2'>
              <SkyTableTypography className='w-[150px] font-bold'>Trình độ học vấn: </SkyTableTypography>
              <SkyTableTypography>{textValidatorDisplay(item.academicLevel)}</SkyTableTypography>
            </Flex>
          </EditableStateCell>
          <EditableStateCell
            isEditing={isEditing}
            inputType='text'
            title='Title router'
            defaultValue={textValidatorInit(item.routeTitle)}
            value={newRecord?.routeTitle}
            onValueChange={(val: string) =>
              setNewRecord((prev) => {
                return { ...prev, routeTitle: textValidatorChange(val) }
              })
            }
          >
            <Flex gap={20} className='my-2'>
              <SkyTableTypography className='w-[150px] font-bold'>Title router: </SkyTableTypography>
              <SkyTableTypography>{textValidatorDisplay(item.routeTitle)}</SkyTableTypography>
            </Flex>
          </EditableStateCell>
          <EditableStateCell
            isEditing={isEditing}
            inputType='text'
            title='Thời gian làm việc'
            defaultValue={textValidatorInit(item.workingTime)}
            value={newRecord?.workingTime}
            onValueChange={(val: string) =>
              setNewRecord((prev) => {
                return { ...prev, workingTime: textValidatorChange(val) }
              })
            }
          >
            <Flex gap={20} className='my-2'>
              <SkyTableTypography className='w-[150px] font-bold'>Thời gian làm việc: </SkyTableTypography>
              <SkyTableTypography>{textValidatorDisplay(item.workingTime)}</SkyTableTypography>
            </Flex>
          </EditableStateCell>
          <EditableStateCell
            isEditing={isEditing}
            inputType='text'
            title='Địa điểm làm việc'
            defaultValue={textValidatorInit(item.workingPlace)}
            value={newRecord?.workingPlace}
            onValueChange={(val: string) =>
              setNewRecord((prev) => {
                return { ...prev, workingPlace: textValidatorChange(val) }
              })
            }
          >
            <Flex gap={20} className='my-2'>
              <SkyTableTypography className='w-[150px] font-bold'>Địa điểm làm việc: </SkyTableTypography>
              <SkyTableTypography>{textValidatorDisplay(item.workingPlace)}</SkyTableTypography>
            </Flex>
          </EditableStateCell>
          <EditableStateCell
            isEditing={isEditing}
            inputType='datepicker'
            title='Hết hạn'
            defaultValue={dateValidatorInit(item.expirationDate)}
            value={newRecord?.expirationDate}
            onValueChange={(val: string) =>
              setNewRecord((prev) => {
                return { ...prev, expirationDate: dateValidatorChange(val) }
              })
            }
          >
            <Flex gap={20} className='my-2'>
              <SkyTableTypography className='w-[150px] font-bold'>Hết hạn: </SkyTableTypography>
              <SkyTableTypography>{dateValidatorDisplay(item.expirationDate)}</SkyTableTypography>
            </Flex>
          </EditableStateCell>
          <EditableStateCell
            isEditing={isEditing}
            inputType='contentEditor'
            title='Mô tả công việc'
            defaultValue={textValidatorInit(item.jobDescription)}
            value={newRecord?.jobDescription}
            onValueChange={(val: string) => {
              setNewRecord((prev) => {
                return { ...prev, jobDescription: textValidatorChange(val) }
              })
            }}
          >
            <Flex gap={20} className='my-2'>
              <SkyTableTypography className='w-[150px] font-bold'>Mô tả công việc: </SkyTableTypography>
              <HTMLReader htmlString={htmlValidatorDisplay(item.jobDescription)} />
            </Flex>
          </EditableStateCell>
          <EditableStateCell
            isEditing={isEditing}
            inputType='contentEditor'
            title='Yêu cầu công việc'
            defaultValue={textValidatorInit(item.required)}
            value={newRecord?.required}
            onValueChange={(val: string) => {
              setNewRecord((prev) => {
                return { ...prev, required: textValidatorChange(val) }
              })
            }}
          >
            <Flex gap={20} className='my-2'>
              <SkyTableTypography className='w-[150px] font-bold'>Yêu cầu ứng viên: </SkyTableTypography>
              <HTMLReader htmlString={htmlValidatorDisplay(item.required)} />
            </Flex>
          </EditableStateCell>
          <EditableStateCell
            isEditing={isEditing}
            inputType='contentEditor'
            title='Quyền lợi được hưởng'
            defaultValue={textValidatorInit(item.benefits)}
            value={newRecord?.benefits}
            onValueChange={(val: string) => {
              setNewRecord((prev) => {
                return { ...prev, benefits: textValidatorChange(val) }
              })
            }}
          >
            <Flex gap={20} className='my-2'>
              <SkyTableTypography className='w-[150px] font-bold'>Quyền lợi được hưởng: </SkyTableTypography>
              <HTMLReader htmlString={htmlValidatorDisplay(item.benefits)} />
            </Flex>
          </EditableStateCell>
        </Flex>
      </Card>
    </List.Item>
  )
}

export default RecruitmentListItem
