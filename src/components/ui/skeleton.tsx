import { cn } from "@/lib/utils"

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-md bg-muted skeleton-shimmer",
        className
      )}
      {...props}
    >
      <span className="skeleton-shimmer-bar" />
    </div>
  )
}

export { Skeleton }
