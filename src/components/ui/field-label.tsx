import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

/**
 * Label with an explicit required (*) or optional hint, so users can tell at a
 * glance which fields they must fill in.
 */
export function FieldLabel({
  htmlFor,
  children,
  required,
  optional,
  className,
}: {
  htmlFor?: string;
  children: React.ReactNode;
  required?: boolean;
  optional?: boolean;
  className?: string;
}) {
  return (
    <Label htmlFor={htmlFor} className={cn("flex items-center gap-1", className)}>
      <span>{children}</span>
      {required && (
        <span aria-hidden className="text-destructive">
          *
        </span>
      )}
      {optional && (
        <span className="text-xs font-normal text-muted-foreground">
          (optional)
        </span>
      )}
    </Label>
  );
}
