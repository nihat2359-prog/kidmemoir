"use client";

import { Minus, Plus } from "lucide-react";
import {
  Button as AriaButton,
  Group,
  I18nProvider,
  Input as AriaInput,
  NumberField,
} from "react-aria-components";
import { cn } from "@/lib/utils";

type NumberInputProps = Readonly<{
  "aria-describedby"?: string;
  "aria-label": string;
  className?: string;
  decrementLabel: string;
  formatOptions?: Intl.NumberFormatOptions;
  incrementLabel: string;
  isDisabled?: boolean;
  isInvalid?: boolean;
  locale: string;
  maxValue?: number;
  minValue?: number;
  name?: string;
  onBlur?: () => void;
  onValueChange: (value: number | undefined) => void;
  placeholder?: string;
  step?: number;
  value?: number;
}>;

export function NumberInput({
  className,
  decrementLabel,
  incrementLabel,
  locale,
  onValueChange,
  value,
  ...props
}: NumberInputProps) {
  return (
    <I18nProvider locale={locale}>
      <NumberField
        {...props}
        onChange={(number) =>
          onValueChange(Number.isNaN(number) ? undefined : number)
        }
        value={value ?? Number.NaN}
      >
        <Group
          className={cn(
            "border-input bg-background/70 focus-within:border-ring focus-within:ring-ring/30 data-[invalid]:border-danger data-[invalid]:focus-within:ring-danger/20 flex min-h-12 w-full items-center rounded-xl border shadow-sm backdrop-blur-sm transition-[border-color,box-shadow] focus-within:ring-2 data-[disabled]:cursor-not-allowed data-[disabled]:opacity-50",
            className,
          )}
        >
          <AriaButton
            aria-label={decrementLabel}
            className="text-muted-foreground hover:bg-accent hover:text-foreground focus-visible:ring-ring ml-1 grid size-9 shrink-0 place-items-center rounded-lg outline-none focus-visible:ring-2 disabled:opacity-40"
            slot="decrement"
          >
            <Minus aria-hidden className="size-3.5" />
          </AriaButton>
          <AriaInput className="placeholder:text-muted-foreground min-w-0 flex-1 bg-transparent px-2 py-2 text-center text-sm tabular-nums outline-none" />
          <AriaButton
            aria-label={incrementLabel}
            className="text-muted-foreground hover:bg-accent hover:text-foreground focus-visible:ring-ring mr-1 grid size-9 shrink-0 place-items-center rounded-lg outline-none focus-visible:ring-2 disabled:opacity-40"
            slot="increment"
          >
            <Plus aria-hidden className="size-3.5" />
          </AriaButton>
        </Group>
      </NumberField>
    </I18nProvider>
  );
}
