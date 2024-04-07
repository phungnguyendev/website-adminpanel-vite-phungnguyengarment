import type { DragEndEvent } from '@dnd-kit/core'
import { DndContext } from '@dnd-kit/core'
import { restrictToVerticalAxis } from '@dnd-kit/modifiers'
import { arrayMove, SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import type { TableProps } from 'antd'
import { Table } from 'antd'
import { ColumnsType, ColumnType } from 'antd/es/table'
import { useState } from 'react'
import { defaultRequestBody, ResponseDataType } from '~/api/client'
import ActionRow, { ActionProps } from '../ActionRow'
import SkyTableRow2 from './SkyTableRow2'

export type RequiredDataType = {
  key: string
  id?: number
  createdAt?: string
  updatedAt?: string
  orderNumber?: number | null
}

export interface SkyTable2Props<T extends RequiredDataType> extends TableProps {
  dataSource: T[]
  setDataSource: (dataSource: T[]) => void
  metaData: ResponseDataType | undefined
  onPageChange?: (page: number, pageSize: number) => void
  actionProps?: ActionProps<T>
  isShowDeleted?: boolean
  editingKey?: string
  deletingKey?: string
  pageSize?: number
  onDraggableChange?: (oldData?: T[], newData?: T[]) => void
}

const SkyTable2 = <T extends RequiredDataType>({ ...props }: SkyTable2Props<T>) => {
  const [editKey, setEditKey] = useState<string>('-1')
  const isEditing = (key: string): boolean => {
    return props.editingKey === key
  }

  const actionsCol: ColumnType<T> = {
    title: 'Operation',
    width: '1%',
    dataIndex: 'operation',
    render: (_value: any, record: T) => {
      return (
        <ActionRow
          isEditing={isEditing(record.key)}
          onAdd={{
            ...props.actionProps?.onAdd,
            onClick: (e) => props.actionProps?.onAdd?.onClick?.(e, record),
            disabled: props.actionProps?.onAdd?.disabled ?? isEditing(editKey),
            isShow: props.actionProps?.onAdd ? props.actionProps.onAdd.isShow ?? true : false
          }}
          onSave={{
            ...props.actionProps?.onSave,
            onClick: (e) => props.actionProps?.onSave?.onClick?.(e, record),
            disabled: props.actionProps?.onSave?.disabled ?? isEditing(editKey),
            isShow: props.actionProps?.onSave ? props.actionProps.onSave.isShow ?? true : false
          }}
          onEdit={{
            ...props.actionProps?.onEdit,
            onClick: (e) => {
              setEditKey(record.key!)
              props.actionProps?.onEdit?.onClick?.(e, record)
            },
            disabled: props.actionProps?.onEdit?.disabled ?? isEditing(editKey),
            isShow: props.actionProps?.onEdit ? props.actionProps.onEdit.isShow ?? true : false
          }}
          onDelete={{
            ...props.actionProps?.onDelete,
            onClick: (e) => {
              // setDeleteKey(record.key!)
              props.actionProps?.onDelete?.onClick?.(e, record)
            },
            disabled: props.actionProps?.onDelete?.disabled ?? isEditing(editKey),
            isShow: props.actionProps?.onDelete ? props.actionProps.onDelete.isShow ?? true : false
          }}
          onRestore={{
            ...props.actionProps?.onRestore,
            onClick: (e) => {
              // setDeleteKey(record.key!)
              props.actionProps?.onRestore?.onClick?.(e, record)
            },
            disabled: props.actionProps?.onRestore?.disabled ?? isEditing(editKey),
            isShow: props.actionProps?.onRestore ? props.actionProps.onRestore.isShow ?? true : false
          }}
          onConfirmCancelEditing={(e) => props.actionProps?.onConfirmCancelEditing?.(e)}
          onConfirmCancelDeleting={props.actionProps?.onConfirmCancelDeleting}
          onConfirmDelete={() => props.actionProps?.onConfirmDelete?.(record)}
          onConfirmRestore={() => props.actionProps?.onConfirmRestore?.(record)}
        />
      )
    }
  }

  const getColumn = (showAction: boolean): ColumnsType<T> => {
    return showAction ? [...props.columns!, actionsCol] : [...props.columns!]
  }

  const onDragEnd = ({ active, over }: DragEndEvent) => {
    if (active.id !== over?.id) {
      const activeIndex = props.dataSource.findIndex((i) => i.key === active.id)
      const overIndex = props.dataSource.findIndex((i) => i.key === over?.id)
      const newData = arrayMove(props.dataSource, activeIndex, overIndex)
      props.onDraggableChange?.(props.dataSource, newData)
      props.setDataSource(newData)
    }
  }

  return (
    <DndContext modifiers={[restrictToVerticalAxis]} onDragEnd={onDragEnd}>
      <SortableContext
        // rowKey array
        items={props.dataSource.map((i) => `${i.key}`)}
        strategy={verticalListSortingStrategy}
      >
        <Table
          {...props}
          columns={getColumn(props.actionProps?.isShow ?? false)}
          components={{
            body: {
              row: SkyTableRow2
            }
          }}
          rowKey='key'
          dataSource={props.dataSource}
          pagination={
            props.pagination ?? {
              onChange: props.onPageChange,
              current: props.metaData?.page,
              pageSize: props.pageSize ?? defaultRequestBody.paginator?.pageSize,
              total: props.metaData?.total
            }
          }
        />
      </SortableContext>
    </DndContext>
  )
}

export default SkyTable2
