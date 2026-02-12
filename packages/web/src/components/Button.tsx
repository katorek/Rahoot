import clsx from "clsx"
import { ButtonHTMLAttributes, PropsWithChildren } from "react"

type Props = ButtonHTMLAttributes<HTMLButtonElement> & PropsWithChildren

const Button = ({children, className, disabled = false, ...otherProps}: Props) => (
    <button
        className={clsx(
            "bg-primary rounded-md p-2 text-lg font-semibold text-white",
            !disabled && "btn-shadow",
            disabled && "opacity-50 cursor-not-allowed",
            className,
        )}
        disabled={disabled}
        {...otherProps}
  >
    <span>{children}</span>
  </button>
)

export default Button
