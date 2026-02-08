type Props = {
  className?: string
  fill?: string
}

const TriangleReversed = ({ className, fill = "#FFF" }: Props) => (
  <svg
    className={className}
    fill={fill}
    viewBox="0 0 512 512"
    xmlns="http://www.w3.org/2000/svg"
  >
    <polygon points="256 464 20 32 492 32 256 464"/>
  </svg>
)

export default TriangleReversed
