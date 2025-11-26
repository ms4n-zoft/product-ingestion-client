import * as React from "react";
import { cn } from "@/lib/utils";

const ReviewCard = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "rounded-lg border bg-card text-card-foreground",
          className
        )}
        {...props}
      />
    );
  }
);
ReviewCard.displayName = "ReviewCard";

function ReviewCardHeader({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("flex flex-col space-y-1.5 p-3", className)}
      {...props}
    />
  );
}

function ReviewCardTitle({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3
      className={cn("font-semibold leading-none tracking-tight", className)}
      {...props}
    />
  );
}

function ReviewCardDescription({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p
      className={cn("text-sm text-muted-foreground", className)}
      {...props}
    />
  );
}

function ReviewCardContent({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("p-3 pt-0", className)} {...props} />;
}

function ReviewCardFooter({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("flex items-center p-3 pt-0", className)}
      {...props}
    />
  );
}

export {
  ReviewCard,
  ReviewCardHeader,
  ReviewCardFooter,
  ReviewCardTitle,
  ReviewCardDescription,
  ReviewCardContent,
};
