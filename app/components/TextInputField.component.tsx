import { HTMLInputAutoCompleteAttribute } from 'react'

export function TextInputField(props: {
  label: string
  id: string
  name: string
  type?: 'email' | 'text' | 'password' | 'textarea'
  placeholder?: string
  disabled?: boolean
  autocomplete?: HTMLInputAutoCompleteAttribute
  required?: boolean
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

      <div className="my-2">
        <input
          id={props.id}
          placeholder={props.placeholder}
          name={props.name}
          disabled={props.disabled}
          type={props.type || 'text'}
          autoComplete={props.autocomplete || 'off'}
          required={props.required}
          className="block w-full rounded-md border-0 p-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
        />
      </div>
      {props.helpText ? (
        <span className=" text-sm text-gray-500 ">{props.helpText}</span>
      ) : null}
    </div>
  )
}
