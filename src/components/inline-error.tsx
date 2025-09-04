import { InfoIcon } from "src/icons";

/**
 * Used generally in forms, this formats
 * an error message with a (i) icon.
 */
export function InlineError({ children }: React.PropsWithChildren<unknown>) {
  return (
    <div
      role="alert"
      className="pt-1 text-sm flex items-start gap-x-1 text-red-700 dark:text-red-300"
    >
      <InfoIcon style={{ marginTop: 2 }} />
      {Array.isArray(children) ? children.join(", ") : children}
    </div>
  );
}
