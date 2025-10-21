import clsx from "clsx";
import { useState } from "react";
import * as C from "@radix-ui/react-collapsible";
import { ChevronDownIcon, ChevronRightIcon } from "src/icons";

export const FieldList = ({ children }: { children: React.ReactNode }) => {
  return <div className="flex flex-col gap-y-1">{children}</div>;
};

export const InlineField = ({
  name,
  layout = "fixed-label",
  labelSize = "sm",
  align = "center",
  children,
}: {
  name: string;
  layout?: "fixed-label" | "half-split" | "label-flex-none";
  labelSize?: "sm" | "md";
  align?: "start" | "center";
  children: React.ReactNode;
}) => {
  const labelClasses = clsx("text-sm text-gray-500", {
    "max-w-[67px] w-full flex-shrink-0":
      layout === "fixed-label" && labelSize === "sm",
    "w-[120px] flex-shrink-0": layout === "fixed-label" && labelSize === "md",
    "w-1/2": layout === "half-split",
    "flex-none": layout === "label-flex-none",
  });
  const inputWrapperClasses = clsx({
    "flex-1": layout === "fixed-label",
    "w-1/2": layout === "half-split",
    "w-3/4": layout === "label-flex-none",
  });

  const spacingClass = labelSize === "md" ? "gap-1" : "space-x-4";

  return (
    <div
      className={clsx("flex", spacingClass, {
        "items-start": align === "start",
        "items-center": align === "center",
      })}
    >
      <label className={labelClasses} aria-label={`label: ${name}`}>
        {name}
      </label>

      <div className={inputWrapperClasses}>{children}</div>
    </div>
  );
};

export const VerticalField = ({
  name,
  children,
}: {
  name: string;
  children: React.ReactNode;
}) => (
  <div className="flex flex-col gap-y-2 w-full">
    <span className="text-sm text-gray-500">{name}</span>
    {children}
  </div>
);

export const Section = ({
  title,
  button,
  variant = "primary",
  children,
}: {
  title: string;
  button?: React.ReactNode;
  variant?: "primary" | "secondary";
  children: React.ReactNode;
}) => {
  return (
    <div className="flex flex-col">
      <div
        className={clsx(
          "flex items-start justify-between text-sm font-semibold pb-2",
          {
            "text-gray-500": variant === "secondary",
          },
        )}
      >
        {title}
        {button && button}
      </div>
      <div className="flex flex-col gap-1">{children}</div>
    </div>
  );
};

export const SectionList = ({
  children,
  gap = 5,
  padding = 4,
  overflow = true,
}: {
  children: React.ReactNode;
  gap?: 1 | 2 | 3 | 4 | 5 | 6;
  padding?: 0 | 1 | 2 | 3 | 4 | 5 | 6;
  overflow?: boolean;
}) => {
  return (
    <div
      className={clsx(
        overflow ? "flex-auto overflow-y-auto placemark-scrollbar" : "",
      )}
    >
      <div
        className={clsx("flex flex-col", {
          "gap-1": gap === 1,
          "gap-2": gap === 2,
          "gap-3": gap === 3,
          "gap-4": gap === 4,
          "gap-5": gap === 5,
          "gap-6": gap === 6,
          "p-0": padding === 0,
          "p-1": padding === 1,
          "p-2": padding === 2,
          "p-3": padding === 3,
          "p-4": padding === 4,
          "p-5": padding === 5,
          "p-6": padding === 6,
        })}
      >
        {children}
      </div>
    </div>
  );
};

export const CollapsibleSection = ({
  title,
  variant = "primary",
  defaultOpen = true,
  open: controlledOpen,
  onOpenChange,
  className,
  children,
}: {
  title: string;
  variant?: "primary" | "secondary";
  defaultOpen?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  className?: string;
  children: React.ReactNode;
}) => {
  const [uncontrolledOpen, setUncontrolledOpen] = useState(defaultOpen);

  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : uncontrolledOpen;
  const handleOpenChange = isControlled ? onOpenChange! : setUncontrolledOpen;

  return (
    <C.Root open={open} onOpenChange={handleOpenChange}>
      <div className={clsx("flex flex-col", className)}>
        <C.Trigger
          className={clsx(
            "flex items-center text-sm font-semibold cursor-pointer hover:text-gray-700 dark:hover:text-gray-100",
            {
              "text-gray-500": variant === "secondary",
              "pb-2": open,
            },
          )}
        >
          <span>{title}</span>
          <div className="flex-1 border-b border-gray-200 mx-3 mb-1" />
          {open ? <ChevronDownIcon /> : <ChevronRightIcon />}
        </C.Trigger>
        <C.Content className="flex flex-col gap-1">{children}</C.Content>
      </div>
    </C.Root>
  );
};
