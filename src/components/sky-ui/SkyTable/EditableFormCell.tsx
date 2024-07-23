import { EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons'
import { Checkbox, DatePicker, Flex, Form, Input, InputNumber, Select, Switch, Table, Typography } from 'antd'
import dayjs from 'dayjs'
import { memo } from 'react'
import ReactQuill from 'react-quill'
import { cn } from '~/utils/helpers'
import { EditableStateCellProps } from './EditableStateCell'

export type EditableCellRequiredType = { key: string; name?: string; id?: number }

export interface EditableFormCellProps extends EditableStateCellProps {}

export type EditableTableProps = Parameters<typeof Table>[0]

function EditableFormCell({
  isEditing,
  dataIndex,
  title,
  subtitle,
  placeholder,
  allowClear,
  value,
  checkboxProps,
  inputNumberProps,
  contentEditorProps,
  textAreaProps,
  inputProps,
  switchProps,
  selectProps,
  defaultValue,
  onValueChange,
  required,
  inputType,
  readonly,
  disabled,
  ...restProps
}: EditableFormCellProps) {
  const inputNode = ((): React.ReactNode => {
    switch (inputType) {
      case 'number':
        return (
          <InputNumber
            {...inputNumberProps}
            name={dataIndex}
            title={title}
            required={required}
            placeholder={placeholder}
            value={value}
            disabled={disabled}
            className={cn('w-full', restProps.className)}
          />
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
      case 'switch':
        return <Switch {...switchProps} />
      case 'checkbox':
        return (
          <Checkbox
            {...checkboxProps}
            required={required}
            title={title}
            name={dataIndex}
            checked={value}
            disabled={disabled}
            className={cn('w-full', restProps.className)}
          />
        )
      case 'select':
        return (
          <Select
            {...selectProps}
            title={title}
            placeholder={placeholder}
            disabled={disabled}
            optionRender={
              selectProps
                ? selectProps.optionRender
                : (ori, info) => {
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
                  }
            }
            className={cn('w-full', restProps.className)}
          />
        )
      case 'textarea':
        return (
          <Input.TextArea
            {...textAreaProps}
            name={dataIndex}
            title={title}
            placeholder={`${placeholder}`}
            value={value}
            readOnly={readonly}
            required={required}
            disabled={disabled}
            className={cn('w-full', restProps.className)}
          />
        )
      case 'multipleSelect':
        return (
          <Select
            {...selectProps}
            title={title}
            placeholder={placeholder}
            mode='multiple'
            virtual={false}
            disabled={disabled}
            value={value}
            className='w-full'
          />
        )
      case 'datepicker':
        return (
          <DatePicker
            name={dataIndex}
            title={title}
            placeholder={placeholder}
            value={value}
            required={required}
            onChange={(_val, dateString) => onValueChange?.(dateString)}
            disabled={disabled}
            format={'DD/MM/YYYY'}
            className={cn('w-full', restProps.className)}
          />
        )
      case 'dateTimePicker':
        return (
          <DatePicker
            name={dataIndex}
            title={title}
            placeholder={placeholder}
            value={value}
            required={required}
            onChange={(_val, dateString) => onValueChange?.(dateString)}
            disabled={disabled}
            showTime={{ defaultOpenValue: dayjs('00:00:00', 'HH:mm:ss') }}
            format='DD/MM/YYYY - HH:mm A'
            className={cn('w-full', restProps.className)}
          />
        )
      case 'password':
        return (
          <Input.Password
            {...inputProps}
            placeholder={placeholder}
            type='password'
            title={title}
            required={required}
            readOnly={readonly}
            allowClear={allowClear}
            iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
          />
        )
      default:
        return (
          <Input
            {...inputProps}
            title={title}
            required={required}
            placeholder={placeholder}
            name={dataIndex}
            value={value}
            autoComplete='give-text'
            allowClear={allowClear}
            disabled={disabled}
            readOnly={readonly}
            className={cn('w-full', restProps.className)}
          />
        )
    }
  })()

  return (
    <>
      {isEditing ? (
        <Form.Item
          name={dataIndex}
          className={cn('w-full', restProps.className)}
          initialValue={defaultValue}
          required={required}
          label={title}
          validateTrigger='onBlur'
          rules={[
            {
              required: required,
              message: `Vui lòng nhập "${subtitle ?? title}"`
            }
          ]}
        >
          {inputNode}
        </Form.Item>
      ) : (
        restProps.children
      )}
    </>
  )
}

export default memo(EditableFormCell)
