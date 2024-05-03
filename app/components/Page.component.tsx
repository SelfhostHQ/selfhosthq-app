import React from 'react'

export function Page(props: { title?: string; children: React.ReactNode }) {
  return (
    <div>
      {props.title ? <h2 className=" mb-4">{props.title}</h2> : null}
      {props.children}
    </div>
  )
}
