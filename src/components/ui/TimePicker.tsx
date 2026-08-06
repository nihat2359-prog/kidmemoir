"use client";

import { parseTime, type Time } from "@internationalized/date";
import { Clock } from "lucide-react";
import {
  DateInput,
  DateSegment,
  Group,
  I18nProvider,
  TimeField,
} from "react-aria-components";
import { cn } from "@/lib/utils";

type TimePickerProps = Readonly<{
  "aria-describedby"?: string;
  "aria-label": string;
  className?: string;
  isDisabled?: boolean;
  isInvalid?: boolean;
  locale: string;
  name?: string;
  onBlur?: () => void;
  onValueChange: (value: string | undefined) => void;
  value?: string;
}>;

function toTime(value?: string): Time | undefined {
  if (!value) return undefined;
  try {
    return parseTime(value);
  } catch {
    return undefined;
  }
}

export function TimePicker({
  className,
  locale,
  onValueChange,
  value,
  ...props
}: TimePickerProps) {
  return (
    <I18nProvider locale={locale}>
      <TimeField
        {...props}
        granularity="minute"
        hourCycle={24}
        onChange={(time) => onValueChange(time?.toString().slice(0, 5))}
        value={toTime(value) ?? null}
      >
        <Group
          className={cn(
            "border-input bg-background/70 focus-within:border-ring focus-within:ring-ring/30 data-[invalid]:border-danger data-[invalid]:focus-within:ring-danger/20 flex min-h-12 w-full items-center rounded-xl border px-3 shadow-sm backdrop-blur-sm transition-[border-color,box-shadow] focus-within:ring-2 data-[disabled]:cursor-not-allowed data-[disabled]:opacity-50",
            className,
          )}
        >
          <Clock aria-hidden className="text-muted-foreground mr-2 size-4" />
          <DateInput className="flex min-w-0 flex-1 py-2 text-sm">
            {(segment) => (
              <DateSegment
                className="data-[focused]:bg-primary data-[focused]:text-primary-foreground data-[placeholder]:text-muted-foreground rounded-sm px-0.5 tabular-nums outline-none"
                segment={segment}
              />
            )}
          </DateInput>
        </Group>
      </TimeField>
    </I18nProvider>
  );
}
