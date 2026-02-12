import type { PropsWithChildren, ReactNode } from "react"
import { useId, useState } from "react"

type ExpandableProps = PropsWithChildren & {
  /**
   * Header/title shown in the clickable bar.
   * If not provided, `collapsedText` is used when collapsed.
   */
  title?: ReactNode
  /**
   * Text shown when collapsed (and no `title` is provided).
   */
  collapsedText?: string
  /**
   * Initial expanded state.
   */
  defaultExpanded?: boolean
  className?: string
}

const ChevronIcon = ({isExpanded}: { isExpanded: boolean }) => (
    <svg
        className={`h-5 w-5 transition-transform duration-200 ${isExpanded ? "rotate-180" : "rotate-0"}`}
        viewBox="0 0 20 20"
        fill="currentColor"
        aria-hidden="true"
    >
        <path
            fillRule="evenodd"
            d="M5.23 7.21a.75.75 0 0 1 1.06.02L10 11.168l3.71-3.94a.75.75 0 1 1 1.08 1.04l-4.24 4.5a.75.75 0 0 1-1.08 0l-4.24-4.5a.75.75 0 0 1 .02-1.06Z"
            clipRule="evenodd"
        />
    </svg>
)



const Expandable = ({
  children,
  title,
  collapsedText = "Expand",
  defaultExpanded = true,
  className,
}: ExpandableProps) => {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded)
  const contentId = useId()

  const headerText = title ?? ((isExpanded) ? "Zwiń":"Rozwiń")

  const toggleExpanded = () => setIsExpanded((v) => !v)

  return (
    <section
      className={[
        "overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm",
        "transition-shadow hover:shadow-md",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <button
        type="button"
        onClick={toggleExpanded}
        aria-expanded={isExpanded}
        aria-controls={contentId}
        className={[
          "flex w-full items-center justify-between gap-3",
          "px-4 py-3 text-left",
          "bg-slate-50 hover:bg-slate-100",
          "border-b border-slate-200",
          "focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-400/60",
        ].join(" ")}
      >
        <div className="w-full">
          <div className="truncate text-sm font-semibold text-slate-900">
            {headerText}
          </div>
        </div>

        <span className="inline-flex items-center text-slate-600">
          <ChevronIcon isExpanded={isExpanded} />
        </span>
      </button>

      <div
        id={contentId}
        className={[
          "grid transition-[grid-template-rows] duration-200 ease-out",
          isExpanded ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
        ].join(" ")}
      >
        <div className="min-h-0 overflow-hidden">
          <div className="p-4">{children}</div>
        </div>
      </div>
    </section>
  )
}

export default Expandable