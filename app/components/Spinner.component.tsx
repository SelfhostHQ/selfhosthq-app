export function Spinner(props: { width: string; height: string }) {
  return (
    <div
      className="spinner"
      style={{ width: props.width, height: props.height }}
    ></div>
  )
}
