import {
  Button,
  Checkbox,
  CheckboxProps,
  DatePicker,
  Input,
  InputNumber,
  InputNumberProps,
  Select,
  Switch,
  SwitchProps,
  Table
} from 'antd'
import { InputProps, TextAreaProps } from 'antd/es/input'
import { SelectProps } from 'antd/es/select'
import { DatePickerProps } from 'antd/lib'
import { Eye, EyeOff } from 'lucide-react'
import { HTMLAttributes, memo, useState } from 'react'
import dayjs, { dateFormatter } from '~/utils/date-formatter'
import { cn } from '~/utils/helpers'
import HTMLEditor, { HTMLEditorProps } from '../HTMLEditor'

export type InputType =
  | 'number'
  | 'text'
  | 'select'
  | 'datepicker'
  | 'dateTimePicker'
  | 'textarea'
  | 'checkbox'
  | 'multipleSelect'
  | 'password'
  | 'email'
  | 'switch'
  | 'contentEditor'

export interface EditableStateCellProps extends HTMLAttributes<HTMLElement> {
  isEditing?: boolean
  dataIndex?: string
  value?: any
  defaultValue?: any
  onValueChange?: (value: any, option?: any) => void
  selectProps?: SelectProps
  checkboxProps?: CheckboxProps
  inputNumberProps?: InputNumberProps
  textAreaProps?: TextAreaProps
  inputProps?: InputProps
  switchProps?: SwitchProps
  datePickerProps?: DatePickerProps
  contentEditorProps?: HTMLEditorProps
  inputType?: InputType
  required?: boolean
  allowClear?: boolean
  title?: string
  placeholder?: string
  disabled?: boolean
  subtitle?: string
  readonly?: boolean
  editableRender?: React.ReactNode
}

export type EditableTableProps = Parameters<typeof Table>[0]

function EditableStateCell({
  isEditing,
  dataIndex,
  title,
  placeholder,
  allowClear,
  value,
  datePickerProps,
  checkboxProps,
  inputNumberProps,
  contentEditorProps,
  textAreaProps,
  selectProps,
  switchProps,
  inputProps,
  defaultValue,
  onValueChange,
  required,
  inputType,
  disabled,
  readonly,
  editableRender,
  ...restProps
}: EditableStateCellProps) {
  const [visible, setVisible] = useState<boolean>(false)

  const inputNode = ((): React.ReactNode => {
    switch (inputType) {
      case 'switch':
        return <Switch {...switchProps} />
      case 'checkbox':
        return (
          <Checkbox
            {...checkboxProps}
            required={required}
            title={title}
            name={dataIndex}
            // defaultChecked={defaultValue ?? checkboxProps?.defaultChecked ?? undefined}
            checked={value ?? checkboxProps?.value ?? defaultValue ?? checkboxProps?.defaultChecked ?? undefined}
            disabled={disabled}
            onChange={(val) => onValueChange?.(val.target.checked)}
            className={cn('w-full', restProps.className)}
          />
        )
      case 'contentEditor':
        return <HTMLEditor {...contentEditorProps!} />
      case 'number':
        return (
          <InputNumber
            {...inputNumberProps}
            name={dataIndex}
            title={title}
            type='number'
            required={required}
            placeholder={placeholder}
            value={value ?? inputNumberProps?.value ?? ''}
            disabled={disabled}
            readOnly={readonly}
            onChange={(val) => onValueChange?.(val)}
            defaultValue={defaultValue ?? inputNumberProps?.defaultValue ?? ''}
            className={cn('w-full', restProps.className)}
          />
        )
      case 'textarea':
        return (
          <Input.TextArea
            {...textAreaProps}
            title={title}
            placeholder={`${placeholder}`}
            name={dataIndex}
            value={value ?? textAreaProps?.value ?? ''}
            disabled={disabled}
            readOnly={readonly}
            required={required}
            onChange={(val) => onValueChange?.(val.target.value)}
            defaultValue={defaultValue ?? textAreaProps?.defaultValue ?? ''}
            className={cn('w-full', restProps.className)}
          />
        )
      case 'select':
        return (
          <Select
            {...selectProps}
            title={title}
            placeholder={placeholder ?? 'Select item'}
            defaultValue={defaultValue ?? selectProps?.defaultValue}
            value={value ?? selectProps?.value}
            onChange={(val, option) => onValueChange?.(val, option)}
            disabled={disabled}
            virtual={false}
            className={cn('w-full', restProps.className)}
          />
        )
      case 'multipleSelect':
        return (
          <Select
            {...selectProps}
            title={title}
            placeholder={placeholder ?? 'Select item'}
            mode='multiple'
            virtual={false}
            defaultValue={defaultValue ?? selectProps?.defaultValue}
            value={value ?? selectProps?.value}
            disabled={disabled}
            onChange={(val: number[], option) => onValueChange?.(val, option)}
            className={cn('w-full', restProps.className)}
          />
        )
      case 'datepicker':
        return (
          <DatePicker
            {...datePickerProps}
            title={title}
            placeholder={placeholder ?? `Ví dụ: ${dateFormatter(Date.now())}`}
            name={dataIndex}
            required={required}
            onChange={(val) => val && onValueChange?.(val)}
            disabled={disabled}
            defaultValue={defaultValue}
            format={datePickerProps?.format ?? 'DD/MM/YYYY'}
            className={cn('w-full', restProps.className)}
          />
        )
      case 'dateTimePicker':
        return (
          <DatePicker
            {...datePickerProps}
            title={title}
            placeholder={placeholder ?? `Ví dụ: ${dateFormatter(Date.now())}`}
            name={dataIndex}
            required={required}
            onChange={(val) => val && onValueChange?.(val)}
            disabled={disabled}
            showTime={{ defaultOpenValue: dayjs('00:00:00', 'HH:mm:ss') }}
            defaultValue={defaultValue}
            format={datePickerProps?.format ?? 'DD/MM/YYYY - HH:mm A'}
            className={cn('w-full', restProps.className)}
          />
        )
      case 'password':
        return (
          <Input
            {...inputProps}
            required
            placeholder={placeholder ?? 'Ví dụ: Abc@@123??'}
            name={dataIndex}
            type={visible ? 'text' : 'password'}
            onChange={(event) => onValueChange?.(event.target.value)}
            defaultValue={defaultValue ?? inputProps?.defaultValue ?? ''}
            value={value ?? inputProps?.value ?? ''}
            disabled={disabled}
            readOnly={readonly}
            autoComplete='give-text'
            allowClear={allowClear}
            suffix={
              <Button onClick={() => setVisible((prev) => !prev)} type='link' className='p-2'>
                {visible ? <Eye color='var(--foreground)' size={16} /> : <EyeOff size={16} color='var(--foreground)' />}
              </Button>
            }
            className={cn('w-full', restProps.className)}
          />
        )

      case 'email':
        return (
          <Input
            {...inputProps}
            required
            title={title}
            placeholder={placeholder ?? 'Ví dụ: nguyenvana@gmail.com'}
            name={dataIndex}
            type='email'
            autoComplete='give-text'
            allowClear={allowClear}
            onChange={(event) => onValueChange?.(event.target.value)}
            defaultValue={defaultValue ?? inputProps?.defaultValue ?? ''}
            value={value ?? inputProps?.value ?? ''}
            disabled={disabled}
            readOnly={readonly}
            className={cn('w-full', restProps.className)}
          />
        )
      default:
        return (
          <Input
            {...inputProps}
            required={required}
            title={title}
            placeholder={placeholder}
            name={dataIndex}
            autoComplete='give-text'
            allowClear={allowClear}
            onChange={(event) => onValueChange?.(event.target.value)}
            defaultValue={defaultValue ?? inputProps?.defaultValue ?? ''}
            value={value ?? inputProps?.value ?? ''}
            disabled={disabled}
            readOnly={readonly}
            className={cn('w-full', restProps.className)}
          />
        )
    }
  })()

  return <>{isEditing ? (editableRender ? editableRender : inputNode) : restProps.children}</>
}

export default memo(EditableStateCell)
