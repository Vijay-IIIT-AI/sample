"use client";

import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const countries = [
  { value: "+1", label: "United States", code: "US" },
  { value: "+44", label: "United Kingdom", code: "GB" },
  { value: "+91", label: "India", code: "IN" },
  { value: "+86", label: "China", code: "CN" },
  { value: "+81", label: "Japan", code: "JP" },
  { value: "+49", label: "Germany", code: "DE" },
  { value: "+33", label: "France", code: "FR" },
  { value: "+39", label: "Italy", code: "IT" },
  { value: "+7", label: "Russia", code: "RU" },
  { value: "+55", label: "Brazil", code: "BR" },
  { value: "+52", label: "Mexico", code: "MX" },
  { value: "+61", label: "Australia", code: "AU" },
  { value: "+64", label: "New Zealand", code: "NZ" },
  { value: "+27", label: "South Africa", code: "ZA" },
  { value: "+82", label: "South Korea", code: "KR" },
  { value: "+34", label: "Spain", code: "ES" },
  { value: "+31", label: "Netherlands", code: "NL" },
  { value: "+46", label: "Sweden", code: "SE" },
  { value: "+47", label: "Norway", code: "NO" },
  { value: "+45", label: "Denmark", code: "DK" },
];

interface CountrySelectProps {
  value?: string;
  onValueChange: (value: string) => void;
}

export function CountrySelect({ value, onValueChange }: CountrySelectProps) {
  const [open, setOpen] = React.useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          {value
            ? countries.find((country) => country.value === value)?.label
            : "Select country..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command>
          <CommandInput placeholder="Search country..." />
          <CommandEmpty>No country found.</CommandEmpty>
          <CommandGroup>
            {countries.map((country) => (
              <CommandItem
                key={country.value}
                value={country.value}
                onSelect={(currentValue) => {
                  onValueChange(currentValue === value ? "" : currentValue);
                  setOpen(false);
                }}
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    value === country.value ? "opacity-100" : "opacity-0"
                  )}
                />
                {country.label} ({country.value})
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
} 