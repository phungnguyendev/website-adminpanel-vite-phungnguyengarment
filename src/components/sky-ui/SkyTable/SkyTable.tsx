import type { DragCancelEvent, DragEndEvent, DragMoveEvent, DragOverEvent, DragStartEvent } from '@dnd-kit/core'
import { DndContext } from '@dnd-kit/core'
import { restrictToVerticalAxis } from '@dnd-kit/modifiers'
import { arrayMove, SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import type { TableProps } from 'antd'
import { Table } from 'antd'
import type { ColumnsType, ColumnType } from 'antd/es/table'
import { cn } from '~/utils/helpers'
import SkyTableRow from './SkyTableRow'

export type SkyTableRequiredDataType = {
  key: string
}

export interface SkyTableProps<T extends SkyTableRequiredDataType> extends TableProps {
  dataSource: T[]
  setDataSource: React.Dispatch<React.SetStateAction<T[]>>
  tableColumns: {
    columns: ColumnsType<T>
    actionColumn?: ColumnType<T>
    showAction?: boolean
  }
  onPageChange?: (page: number, pageSize: number) => void
  onDragStart?(event: DragStartEvent): void
  onDragMove?(event: DragMoveEvent): void
  onDragOver?(event: DragOverEvent): void
  onDragEnd?(newArray: T[]): void
  onDragCancel?(event: DragCancelEvent): void
}

const SkyTable = <T extends SkyTableRequiredDataType>({ ...props }: SkyTableProps<T>) => {
  const handleDragEnd = ({ active, over }: DragEndEvent) => {
    if (active.id !== over?.id) {
      const prevDataSource = props.dataSource
      const activeIndex = prevDataSource.findIndex((record) => record.key === active?.id)
      const overIndex = prevDataSource.findIndex((record) => record.key === over?.id)
      const newDataSource = arrayMove(prevDataSource, activeIndex, overIndex)
      props.setDataSource(newDataSource)
      props.onDragEnd?.(newDataSource)
    }
  }

  return (
    <DndContext
      modifiers={[restrictToVerticalAxis]}
      {...props}
      onDragEnd={handleDragEnd}
      onDragCancel={props.onDragCancel}
      onDragOver={props.onDragOver}
      onDragMove={props.onDragMove}
      onDragStart={props.onDragStart}
    >
      <SortableContext items={props.dataSource.map((i) => i.key)} strategy={verticalListSortingStrategy}>
        <Table
          {...props}
          columns={
            props.tableColumns.showAction ?? true
              ? props.tableColumns.actionColumn
                ? [...props.tableColumns.columns, props.tableColumns.actionColumn]
                : props.tableColumns.columns
              : props.tableColumns.columns
          }
          components={{
            body: {
              row: SkyTableRow
            }
          }}
          bordered
          pagination={
            props.pagination ?? {
              pageSize: 10,
              onChange: props.onPageChange
            }
          }
          rowClassName='editable-row'
          className={cn('z-0 rounded-lg bg-white', props.className)}
          rowKey='key'
          dataSource={props.dataSource}
        />
      </SortableContext>
    </DndContext>
  )
}

export default SkyTable
