"use client"

import * as React from "react"
import { CalendarIcon } from "lucide-react"
import { addDays, format } from "date-fns"
import type { DateRange } from "react-day-picker"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

interface DateRangePickerProps extends React.HTMLAttributes<HTMLDivElement> {
  onUpdate?: (values: { range: DateRange; rangeCompare?: DateRange }) => void;
  initialDateFrom?: Date | string;
  initialDateTo?: Date | string;
  align?: "start" | "center" | "end";
  locale?: string;
  showCompare?: boolean;
}


export function DateRangePicker({
  className,
  onUpdate, // This prop is not used in the current mock implementation
  initialDateFrom = addDays(new Date(), -30),
  initialDateTo = new Date(),
  align = "end",
  // locale = "en-US", // Not used in ShadCN Calendar by default
  // showCompare = true, // Not implemented in this mock
}: DateRangePickerProps) {
  const [date, setDate] = React.useState<DateRange | undefined>({
    from: new Date(initialDateFrom),
    to: new Date(initialDateTo),
  })

  // The onUpdate prop would be called here if we were truly updating state elsewhere
  // React.useEffect(() => {
  //   if (date && onUpdate) {
  //     onUpdate({ range: date });
  //   }
  // }, [date, onUpdate]);

  return (
    <div className={cn("grid gap-2", className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"outline"}
            className={cn(
              "w-[300px] justify-start text-left font-normal",
              !date && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date?.from ? (
              date.to ? (
                <>
                  {format(date.from, "LLL dd, y")} -{" "}
                  {format(date.to, "LLL dd, y")}
                </>
              ) : (
                format(date.from, "LLL dd, y")
              )
            ) : (
              <span>Pick a date</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align={align}>
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={date?.from}
            selected={date}
            onSelect={setDate}
            numberOfMonths={2}
          />
        </PopoverContent>
      </Popover>
    </div>
  )
}
