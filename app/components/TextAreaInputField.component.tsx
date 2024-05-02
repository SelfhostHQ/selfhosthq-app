import { HTMLInputAutoCompleteAttribute } from 'react'

export function TextAreaInputField(props: {
  label: string
  id: string
  name: string
  rows?: number
  placeholder?: string
  autocomplete?: HTMLInputAutoCompleteAttribute
  required?: boolean
  disabled?: boolean
  action?: {
    label: string
    link: string
  }
  helpText?: string
}) {
  return (
    <div>
      <div className="flex items-center justify-between">
        <label
          htmlFor={props.id}
          className="block text-sm font-medium leading-6 text-gray-900"
        >
          {props.label}
        </label>
        {props.action ? (
          <div className="text-sm">
            <a href={props.action.link} className="font-semibold ">
              {props.action.label}
            </a>
          </div>
        ) : null}
      </div>

      <div className="mt-2">
        <textarea
          id={props.id}
          placeholder={props.placeholder}
          name={props.name}
          rows={props.rows || 2}
          disabled={props.disabled}
          autoComplete={props.autocomplete || 'off'}
          required={props.required}
          className="block w-full rounded-md border-0 p-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
        />
      </div>
      {props.helpText ? <span>{props.helpText}</span> : null}
    </div>
  )
}
