import { useEffect, useState, useMemo } from "react";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Search, CheckCircle2 } from "lucide-react";
import useFuzzySearch from "../hooks/use-fuzzy-search";

export default function ReviewCommandMenu({
  open,
  onOpenChange,
  fieldsToReview,
  groupedFields,
  reviewed,
  onFieldSelect,
}) {
  const [search, setSearch] = useState("");

  const filteredFields = useFuzzySearch(fieldsToReview, search, {
    keys: ["label", "key"],
    threshold: 0.3,
    limit: 50,
  });

  const groupedResults = useMemo(() => {
    const groups = {};

    filteredFields.forEach((field) => {
      const topLevelKey = field.key.split(/[.\[]/)[0];
      const section = groupedFields.find(g => g.key === topLevelKey);

      if (section) {
        if (!groups[section.name]) {
          groups[section.name] = [];
        }
        groups[section.name].push(field);
      }
    });

    return groups;
  }, [filteredFields, groupedFields]);

  useEffect(() => {
    if (!open) {
      setSearch("");
    }
  }, [open]);

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <CommandInput
        placeholder="Search fields to review..."
        value={search}
        onValueChange={setSearch}
      />
      <CommandList>
        <CommandEmpty>No fields found.</CommandEmpty>

        {Object.entries(groupedResults).map(([sectionName, fields]) => (
          <CommandGroup key={sectionName} heading={sectionName}>
            {fields.map((field) => {
              const index = fieldsToReview.findIndex(f => f.key === field.key);
              const isReviewed = reviewed.includes(field.key);

              return (
                <CommandItem
                  key={field.key}
                  value={field.key}
                  onSelect={() => {
                    onFieldSelect(index);
                    onOpenChange(false);
                  }}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center gap-2">
                    <Search className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm">{field.label}</span>
                  </div>
                  {isReviewed && (
                    <CheckCircle2 className="w-4 h-4 text-green-600" />
                  )}
                </CommandItem>
              );
            })}
          </CommandGroup>
        ))}
      </CommandList>
    </CommandDialog>
  );
}
