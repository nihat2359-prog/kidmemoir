"use client";

import { parseDate, type CalendarDate } from "@internationalized/date";
import { CalendarDays, ChevronLeft, ChevronRight } from "lucide-react";
import {
  Button as AriaButton,
  Calendar,
  CalendarCell,
  CalendarGrid,
  CalendarGridBody,
  CalendarGridHeader,
  CalendarHeaderCell,
  DateInput,
  DatePicker as AriaDatePicker,
  DateSegment,
  Dialog,
  Group,
  Heading,
  I18nProvider,
  Popover,
} from "react-aria-components";
import { cn } from "@/lib/utils";

type DatePickerProps = Readonly<{
  "aria-describedby"?: string;
  "aria-label": string;
  calendarLabel: string;
  className?: string;
  isDisabled?: boolean;
  isInvalid?: boolean;
  locale: string;
  maxValue?: string;
  minValue?: string;
  name?: string;
  nextMonthLabel: string;
  onBlur?: () => void;
  onValueChange: (value: string | undefined) => void;
  openCalendarLabel: string;
  previousMonthLabel: string;
  value?: string;
}>;

function toCalendarDate(value?: string): CalendarDate | undefined {
  if (!value) return undefined;
  try {
    return parseDate(value);
  } catch {
    return undefined;
  }
}

export function DatePicker({
  calendarLabel,
  className,
  isDisabled,
  isInvalid,
  locale,
  maxValue,
  minValue,
  nextMonthLabel,
  onValueChange,
  openCalendarLabel,
  previousMonthLabel,
  value,
  ...props
}: DatePickerProps) {
  return (
    <I18nProvider locale={locale}>
      <AriaDatePicker
        {...props}
        isDisabled={isDisabled}
        isInvalid={isInvalid}
        maxValue={toCalendarDate(maxValue)}
        minValue={toCalendarDate(minValue)}
        onChange={(date) => onValueChange(date?.toString())}
        value={toCalendarDate(value) ?? null}
      >
        <Group
          className={cn(
            "border-input bg-background/70 focus-within:border-ring focus-within:ring-ring/30 data-[invalid]:border-danger data-[invalid]:focus-within:ring-danger/20 flex min-h-12 w-full items-center rounded-xl border shadow-sm backdrop-blur-sm transition-[border-color,box-shadow] focus-within:ring-2 data-[disabled]:cursor-not-allowed data-[disabled]:opacity-50",
            className,
          )}
        >
          <DateInput className="flex min-w-0 flex-1 px-3 py-2 text-sm">
            {(segment) => (
              <DateSegment
                className="data-[focused]:bg-primary data-[focused]:text-primary-foreground data-[placeholder]:text-muted-foreground rounded-sm px-0.5 tabular-nums outline-none"
                segment={segment}
              />
            )}
          </DateInput>
          <AriaButton
            aria-label={openCalendarLabel}
            className="text-muted-foreground hover:bg-accent hover:text-foreground focus-visible:ring-ring mr-1 grid size-10 shrink-0 place-items-center rounded-lg transition-colors outline-none focus-visible:ring-2"
          >
            <CalendarDays aria-hidden className="size-4" />
          </AriaButton>
        </Group>
        <Popover
          className="bg-popover text-popover-foreground data-[entering]:animate-in data-[exiting]:animate-out data-[entering]:fade-in-0 data-[exiting]:fade-out-0 z-(--z-dropdown) w-[min(20rem,calc(100vw-2rem))] rounded-2xl border p-4 shadow-lg outline-none"
          placement="bottom end"
        >
          <Dialog className="outline-none">
            <Calendar aria-label={calendarLabel}>
              <header className="mb-3 flex items-center justify-between gap-2">
                <AriaButton
                  aria-label={previousMonthLabel}
                  className="hover:bg-accent focus-visible:ring-ring grid size-9 place-items-center rounded-lg outline-none focus-visible:ring-2"
                  slot="previous"
                >
                  <ChevronLeft aria-hidden className="size-4" />
                </AriaButton>
                <Heading className="text-sm font-semibold" />
                <AriaButton
                  aria-label={nextMonthLabel}
                  className="hover:bg-accent focus-visible:ring-ring grid size-9 place-items-center rounded-lg outline-none focus-visible:ring-2"
                  slot="next"
                >
                  <ChevronRight aria-hidden className="size-4" />
                </AriaButton>
              </header>
              <CalendarGrid className="w-full border-separate border-spacing-1">
                <CalendarGridHeader>
                  {(day) => (
                    <CalendarHeaderCell className="text-muted-foreground pb-1 text-xs font-medium">
                      {day}
                    </CalendarHeaderCell>
                  )}
                </CalendarGridHeader>
                <CalendarGridBody>
                  {(date) => (
                    <CalendarCell
                      className="hover:bg-accent focus-visible:ring-ring data-[outside-month]:text-muted-foreground/40 data-[selected]:bg-primary data-[selected]:text-primary-foreground grid size-9 cursor-default place-items-center rounded-lg text-sm outline-none focus-visible:ring-2 data-[disabled]:opacity-35"
                      date={date}
                    />
                  )}
                </CalendarGridBody>
              </CalendarGrid>
            </Calendar>
          </Dialog>
        </Popover>
      </AriaDatePicker>
    </I18nProvider>
  );
}
