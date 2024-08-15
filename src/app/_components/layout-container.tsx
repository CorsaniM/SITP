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
        ` ml-56 mt-10 max-w-[1500px] space-y-5 overflow-visible`,
        className
      )}
    >
      {children}
    </div>
  );
}
