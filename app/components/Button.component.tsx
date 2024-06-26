import { Spinner } from './Spinner.component'

export function Button(props: {
  label: string
  type?: 'submit' | 'reset' | 'button'
  loading?: boolean
  disabled?: boolean
  fullWidth?: boolean
}) {
  return (
    <button
      type={props.type || 'button'}
      className={` styled relative ${props.fullWidth ? 'w-full' : ''}`}
      disabled={props.disabled || props.loading}
    >
      {props.loading ? (
        <div className="absolute flex justify-center items-center top-0 left-0 w-full h-full bg-[var(--color-primary)]">
          <Spinner width="20px" height="20px" />
        </div>
      ) : null}
      <span className={props.loading ? 'invisible' : ''}>{props.label}</span>
    </button>
  )
}
