import React from 'react'
import { Button } from './Button.component'

export function Page(props: {
  title?: string
  children?: React.ReactNode
  primaryAction?: {
    label: string
    onAction: () => void
  }
}) {
  return (
    <div>
      <div className="flex justify-between">
        {props.title ? <h2 className=" mb-4">{props.title}</h2> : null}
        <Button label="+ Create new app" />
      </div>
      {props.children}
    </div>
  )
}
