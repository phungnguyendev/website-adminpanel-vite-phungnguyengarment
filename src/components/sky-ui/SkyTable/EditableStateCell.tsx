import {
  Checkbox,
  CheckboxProps,
  Col,
  ColorPicker,
  ColorPickerProps,
  DatePicker,
  Flex,
  Input,
  InputNumber,
  InputNumberProps,
  Row,
  Select,
  Table,
  Typography
} from 'antd'
import { InputProps, TextAreaProps } from 'antd/es/input'
import { SelectProps } from 'antd/es/select'
import { DatePickerProps } from 'antd/lib'
import { HTMLAttributes, memo } from 'react'
import ReactQuill, { ReactQuillProps } from 'react-quill'
import Uploader2, { Uploader2Props } from '../Uploader2'

export type InputType =
  | 'number'
  | 'text'
  | 'colorPicker'
  | 'select'
  | 'datePicker'
  | 'dateTimePicker'
  | 'colorSelector'
  | 'textArea'
  | 'checkbox'
  | 'multipleSelects'
  | 'upload'
  | 'contentEditor'

export interface EditableStateCellProps extends HTMLAttributes<HTMLElement> {
  isEditing: boolean
  inputType?: InputType
  defaultValue?: any
  value?: any
  onValueChange?: (value?: any, option?: any) => void
  label?: string
  selectProps?: SelectProps
  uploadProps?: Uploader2Props
  colorPickerProps?: ColorPickerProps
  checkboxProps?: CheckboxProps
  inputNumberProps?: InputNumberProps
  textAreaProps?: TextAreaProps
  inputProps?: InputProps
  datePickerProps?: DatePickerProps
  contentEditorProps?: ReactQuillProps
}

export type EditableTableProps = Parameters<typeof Table>[0]

const EditableStateCell: React.FC<EditableStateCellProps> = ({
  label,
  isEditing,
  inputType,
  defaultValue,
  value,
  onValueChange,
  uploadProps,
  contentEditorProps,
  colorPickerProps,
  datePickerProps,
  checkboxProps,
  inputNumberProps,
  textAreaProps,
  selectProps,
  inputProps,
  ...props
}) => {
  const inputNode = ((): React.ReactNode => {
    switch (inputType) {
      case 'upload':
        return (
          <Uploader2 {...uploadProps} defaultFileList={defaultValue} fileList={value} onValueChange={onValueChange} />
        )
      case 'contentEditor':
        return (
          <ReactQuill
            {...contentEditorProps}
            defaultValue={defaultValue}
            value={value}
            onChange={(value: string, delta, source, editor) =>
              onValueChange?.(value, {
                delta,
                source,
                editor
              })
            }
            modules={{
              toolbar: [
                ['bold', 'italic', 'underline', 'strike'], // toggled buttons
                ['blockquote', 'code-block'],
                ['link', 'image', 'video', 'formula'],

                [{ header: 1 }, { header: 2 }], // custom button values
                [{ list: 'ordered' }, { list: 'bullet' }, { list: 'check' }],
                [{ script: 'sub' }, { script: 'super' }], // superscript/subscript
                [{ indent: '-1' }, { indent: '+1' }], // outdent/indent
                [{ direction: 'rtl' }], // text direction

                [{ size: ['small', false, 'large', 'huge'] }], // custom dropdown
                [{ header: [1, 2, 3, 4, 5, 6, false] }],

                [{ color: [] }, { background: [] }], // dropdown with defaults from theme
                [{ font: [] }],
                [{ align: [] }],

                ['clean'] // remove formatting button
              ]
            }}
            theme='snow'
          />
        )
      case 'colorPicker':
        return (
          <ColorPicker
            {...colorPickerProps}
            showText
            defaultFormat='hex'
            defaultValue={defaultValue}
            value={value}
            onChange={(val, hex) => onValueChange?.(val, hex)}
          />
        )
      case 'checkbox':
        return (
          <Checkbox
            {...checkboxProps}
            defaultChecked={defaultValue}
            checked={value}
            onChange={(val) => onValueChange?.(val.target.checked)}
          />
        )
      case 'number':
        return (
          <InputNumber
            {...inputNumberProps}
            defaultValue={defaultValue}
            value={value}
            onChange={(val) => onValueChange?.(val)}
          />
        )
      case 'textArea':
        return (
          <Input.TextArea
            {...textAreaProps}
            defaultValue={defaultValue}
            value={value}
            onChange={(val) => onValueChange?.(val.target.value)}
          />
        )
      case 'select':
        return (
          <Select
            {...selectProps}
            defaultValue={defaultValue}
            value={value}
            onChange={(val, option) => onValueChange?.(val, option)}
            virtual={false}
          />
        )
      case 'multipleSelects':
        return (
          <Select
            {...selectProps}
            defaultValue={defaultValue ?? selectProps?.defaultValue}
            value={value ?? selectProps?.value ?? ''}
            onChange={(val: number[], option) => onValueChange?.(val, option)}
          />
        )
      case 'colorSelector':
        return (
          <Select
            {...selectProps}
            defaultValue={defaultValue}
            value={value}
            onChange={(val, option) => onValueChange?.(val, option)}
            optionRender={(ori, info) => {
              return (
                <>
                  <Flex justify='space-between' align='center' key={info.index}>
                    <Typography.Text>{ori.label}</Typography.Text>
                    <div
                      className='h-6 w-6 rounded-sm'
                      style={{
                        backgroundColor: `${ori.key}`
                      }}
                    />
                  </Flex>
                </>
              )
            }}
          />
        )
      case 'datePicker':
        return (
          <DatePicker
            {...datePickerProps}
            defaultValue={defaultValue}
            value={value}
            onChange={(date, dateString) => onValueChange?.(date, dateString)}
            format={datePickerProps?.format ?? 'DD/MM/YYYY'}
          />
        )
      case 'dateTimePicker':
        return (
          <DatePicker
            {...datePickerProps}
            showTime
            defaultValue={defaultValue}
            value={value}
            onChange={(date, dateString) => onValueChange?.(date, dateString)}
          />
        )
      default:
        return (
          <Input
            {...inputProps}
            autoComplete='give-text'
            onChange={(event) => onValueChange?.(event.target.value)}
            defaultValue={defaultValue}
            value={value}
            className='w-full'
          />
        )
    }
  })()

  return (
    <>
      {isEditing ? (
        <>
          {label ? (
            <Row gutter={[10, 10]} className='flex-col lg:flex-row'>
              <Col xs={24} lg={4}>
                <Typography.Text className='w-full'>{label}</Typography.Text>
              </Col>
              <Col xs={24} lg={20}>
                {inputNode}
              </Col>
            </Row>
          ) : (
            inputNode
          )}
        </>
      ) : (
        props.children
      )}
    </>
  )
}

export default memo(EditableStateCell)
