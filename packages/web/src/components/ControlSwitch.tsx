import clsx from "clsx"
import { InputHTMLAttributes } from "react"

type Props = Omit<InputHTMLAttributes<HTMLInputElement>, "type"> & {
  label?: string
}

const ControlSwitch = ({
  className,
  label,
  id,
  disabled,
  checked,
  ...otherProps
}: Props) => {
  const inputId = id ?? (label ? `switch-${label.replace(/\s+/g, "-").toLowerCase()}` : undefined)

  return (
    <label
      htmlFor={inputId}
      className={clsx(
        "inline-flex items-center gap-2 select-none",
        disabled ? "cursor-not-allowed opacity-60" : "cursor-pointer",
        className,
      )}
    >
      <span className="relative inline-flex items-center">
        <input
          id={inputId}
          type="checkbox"
          className="peer sr-only"
          disabled={disabled}
          checked={checked}
          {...otherProps}
        />

        <span
          className={clsx(
            "h-7 w-12 rounded-full transition-colors",
            "bg-slate-300 peer-checked:bg-primary",
            "peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-primary",
          )}
        />

        <span
          className={clsx(
            "pointer-events-none absolute left-1 top-1 h-5 w-5 rounded-full bg-white",
            "transition-transform peer-checked:translate-x-5",
          )}
        />
      </span>

      {label ? <span className="text-sm font-medium">{label}</span> : null}
    </label>
  )
}

export default ControlSwitch