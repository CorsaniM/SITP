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
        `my-6 space-y-5 w-full px-10 md:px-16 lg:px-44 xl:px-52 `,
        className
      )}
    >
      {children}
    </div>
  );
}
