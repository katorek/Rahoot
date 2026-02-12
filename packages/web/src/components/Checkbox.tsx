import clsx from "clsx"
import React from "react"

type Props = React.InputHTMLAttributes<HTMLInputElement> & {
    label?: string
}

const Checkbox = ({className, label, ...otherProps}: Props) => (
    <label className="flex cursor-pointer items-center gap-2">
        <input
            type="checkbox"
            className={clsx(
                "h-5 w-5 cursor-pointer rounded border-2 border-gray-300 accent-primary transition-colors hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
                className,
            )}
            checked={otherProps.checked}
            {...otherProps}
        />
        {label && <span className="select-none text-sm">{label}</span>}
    </label>
)

export default Checkbox