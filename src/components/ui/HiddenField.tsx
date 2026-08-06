import type { ComponentProps } from "react";

type HiddenFieldProps = Omit<ComponentProps<"input">, "type">;

export function HiddenField(props: HiddenFieldProps) {
  return <input {...props} type="hidden" />;
}
