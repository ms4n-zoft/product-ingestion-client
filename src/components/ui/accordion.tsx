import * as React from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

const AccordionContext = React.createContext<{
  isItemOpen: (value: string) => boolean;
  handleValueChange: (value: string) => void;
} | null>(null);

interface AccordionProps extends React.HTMLAttributes<HTMLDivElement> {
  type?: "single" | "multiple";
  collapsible?: boolean;
  defaultValue?: string | string[];
  value?: string | string[];
  onValueChange?: (value: string | string[]) => void;
}

const Accordion = React.forwardRef<HTMLDivElement, AccordionProps>(
  ({ children, type = "single", collapsible = false, defaultValue, value, onValueChange, className, ...props }, ref) => {
    const [internalValue, setInternalValue] = React.useState<string | string[]>(
      defaultValue || (type === "multiple" ? [] : "")
    );

    const currentValue = value !== undefined ? value : internalValue;

    const handleValueChange = React.useCallback((itemValue: string) => {
      let newValue: string | string[];

      if (type === "multiple") {
        const currentArray = Array.isArray(currentValue) ? currentValue : [];
        newValue = currentArray.includes(itemValue)
          ? currentArray.filter(v => v !== itemValue)
          : [...currentArray, itemValue];
      } else {
        newValue = currentValue === itemValue && collapsible ? "" : itemValue;
      }

      if (value === undefined) {
        setInternalValue(newValue);
      }
      onValueChange?.(newValue);
    }, [currentValue, type, collapsible, value, onValueChange]);

    const isItemOpen = React.useCallback((itemValue: string) => {
      if (type === "multiple") {
        return Array.isArray(currentValue) && currentValue.includes(itemValue);
      }
      return currentValue === itemValue;
    }, [currentValue, type]);

    return (
      <AccordionContext.Provider value={{ isItemOpen, handleValueChange }}>
        <div ref={ref} className={className} {...props}>
          {children}
        </div>
      </AccordionContext.Provider>
    );
  }
);
Accordion.displayName = "Accordion";

interface AccordionItemProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string;
}

const AccordionItem = React.forwardRef<HTMLDivElement, AccordionItemProps>(
  ({ children, value, className, ...props }, ref) => {
    return (
      <div ref={ref} className={className} data-value={value} {...props}>
        {React.Children.map(children, child => {
          if (React.isValidElement(child)) {
            return React.cloneElement(child as React.ReactElement<{ value?: string }>, { value });
          }
          return child;
        })}
      </div>
    );
  }
);
AccordionItem.displayName = "AccordionItem";

interface AccordionTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  value?: string;
}

const AccordionTrigger = React.forwardRef<HTMLButtonElement, AccordionTriggerProps>(
  ({ children, value, className, ...props }, ref) => {
    const context = React.useContext(AccordionContext);
    if (!context) throw new Error("AccordionTrigger must be used within Accordion");
    
    const { isItemOpen, handleValueChange } = context;
    const isOpen = value ? isItemOpen(value) : false;

    return (
      <button
        ref={ref}
        type="button"
        className={cn(
          "flex w-full items-center justify-between py-3 px-4 font-medium transition-all hover:bg-muted/50 [&[data-state=open]>svg]:rotate-180",
          className
        )}
        data-state={isOpen ? "open" : "closed"}
        onClick={() => value && handleValueChange(value)}
        {...props}
      >
        {children}
        <ChevronDown className="h-4 w-4 shrink-0 transition-transform duration-200" />
      </button>
    );
  }
);
AccordionTrigger.displayName = "AccordionTrigger";

interface AccordionContentProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: string;
}

const AccordionContent = React.forwardRef<HTMLDivElement, AccordionContentProps>(
  ({ children, value, className, ...props }, ref) => {
    const context = React.useContext(AccordionContext);
    if (!context) throw new Error("AccordionContent must be used within Accordion");

    const { isItemOpen } = context;
    const isOpen = value ? isItemOpen(value) : false;

    return (
      <div
        ref={ref}
        className={cn(
          "overflow-hidden transition-all data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down",
          !isOpen && "hidden"
        )}
        data-state={isOpen ? "open" : "closed"}
        {...props}
      >
        <div className={cn("pb-4 pt-0", className)}>
          {children}
        </div>
      </div>
    );
  }
);
AccordionContent.displayName = "AccordionContent";

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent };
