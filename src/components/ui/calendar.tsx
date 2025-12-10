"use client";

import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { DayPicker } from "react-day-picker";
import { cn } from "@/lib/utils";

export type CalendarProps = React.ComponentProps<typeof DayPicker>;

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: CalendarProps) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("p-3 bg-[#252520]", className)}
      classNames={{
        months: "flex flex-col sm:flex-row gap-2",
        month: "flex flex-col gap-4",
        month_caption: "flex justify-center pt-1 relative items-center h-10",
        caption_label: "text-sm font-medium text-[#faf9f7]",
        nav: "flex items-center gap-1",
        button_previous: cn(
          "absolute left-1 h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100",
          "inline-flex items-center justify-center rounded-lg border border-[#3a3935] text-[#faf9f7] hover:bg-[#3a3935]"
        ),
        button_next: cn(
          "absolute right-1 h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100",
          "inline-flex items-center justify-center rounded-lg border border-[#3a3935] text-[#faf9f7] hover:bg-[#3a3935]"
        ),
        month_grid: "w-full border-collapse",
        weekdays: "flex",
        weekday: "text-[#6a6965] rounded-md w-9 font-normal text-[0.8rem] text-center",
        week: "flex w-full mt-2",
        day: cn(
          "relative p-0 text-center text-sm",
          "focus-within:relative focus-within:z-20",
          "[&:has([aria-selected])]:bg-[#4a5d4a] [&:has([aria-selected])]:rounded-lg"
        ),
        day_button: cn(
          "h-9 w-9 p-0 font-normal rounded-lg text-[#faf9f7]",
          "hover:bg-[#3a3935] focus:bg-[#3a3935]",
          "aria-selected:bg-[#4a5d4a] aria-selected:text-white aria-selected:hover:bg-[#5a6d5a]"
        ),
        range_end: "day-range-end",
        selected: "bg-[#4a5d4a] text-white rounded-lg",
        today: "bg-[#3a3935] text-[#faf9f7] rounded-lg",
        outside: "text-[#4a4945] opacity-50 aria-selected:bg-[#4a5d4a]/50",
        disabled: "text-[#4a4945] opacity-50",
        range_middle: "aria-selected:bg-[#4a5d4a]/20 aria-selected:text-[#faf9f7]",
        hidden: "invisible",
        // Dropdown styles for captionLayout="dropdown"
        dropdowns: "flex gap-2 justify-center",
        dropdown: cn(
          "appearance-none bg-[#1a1915] border border-[#3a3935] rounded-lg px-2 py-1 text-sm text-[#faf9f7]",
          "focus:outline-none focus:ring-2 focus:ring-[#4a5d4a] cursor-pointer"
        ),
        dropdown_root: "relative inline-flex items-center",
        years_dropdown: "bg-[#1a1915] border border-[#3a3935] rounded-lg",
        months_dropdown: "bg-[#1a1915] border border-[#3a3935] rounded-lg",
        ...classNames,
      }}
      components={{
        Chevron: ({ orientation }) => {
          const Icon = orientation === "left" ? ChevronLeft : ChevronRight;
          return <Icon className="h-4 w-4" />;
        },
      }}
      {...props}
    />
  );
}
Calendar.displayName = "Calendar";

export { Calendar };
