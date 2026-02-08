import clsx from "clsx"
import { ButtonHTMLAttributes, ElementType, PropsWithChildren } from "react"

type Props = PropsWithChildren &
  ButtonHTMLAttributes<HTMLButtonElement> & {
    icon: ElementType
    checked?: boolean
  }

const MultiAnswerButton = ({
  className,
  icon: Icon,
  children,
  checked = false,
  ...otherProps
}: Props) => (
  <button
    className={clsx(
      "shadow-inset flex items-center gap-3 rounded px-4 py-6 text-left",
      className,
    )}
    aria-pressed={checked}
    {...otherProps}
  >
    <Icon className="h-6 w-6" />
    <span className="drop-shadow-md">{children}</span>
    <span className="ml-auto" aria-hidden="true">
      <span
        className={clsx(
          "grid h-6 w-6 place-items-center rounded border-2 transition-colors",
          checked ? "border-primary bg-primary" : "border-white/40 bg-white/10",
        )}
      >
        <span
          className={clsx(
            "h-3 w-3 rounded-sm bg-white transition-opacity",
            checked ? "opacity-100" : "opacity-0",
          )}
        />
      </span>
    </span>
  </button>
)

export default MultiAnswerButton
