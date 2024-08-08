import { cn } from "~/lib/utils";
interface LayoutContainerProps {
  children: React.ReactNode;
  className?: string;
}
export default function LayoutContainer({
  children,
  className,
}: LayoutContainerProps) {
  return (
    <div
      className={cn(
        `w-1/2 h-5/6 ml-56 mt-10 max-w-[1000px] space-y-5 overflow-visible`,
        className
      )}
    >
      {children}
    </div>
  );
}
