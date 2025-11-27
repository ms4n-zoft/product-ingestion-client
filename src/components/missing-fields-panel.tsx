import { useMemo } from "react";
import { AlertCircle, CheckCircle2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { detectMissingFields, groupMissingFields, calculateCompletionPercentage } from "@/lib/missing-fields";
import { Product } from "@/types";

interface MissingFieldsPanelProps {
  product: Product;
}

export default function MissingFieldsPanel({ product }: MissingFieldsPanelProps) {
  const missingFields = useMemo(() => detectMissingFields(product), [product]);
  const groupedMissingFields = useMemo(() => groupMissingFields(missingFields), [missingFields]);
  const completionPercentage = useMemo(() => calculateCompletionPercentage(product), [product]);

  const totalMissingCount = missingFields.length;

  return (
    <div className="h-full flex flex-col bg-muted/30">
      {/* Header */}
      <div className="border-b bg-card px-4 py-3 shrink-0">
        <h2 className="font-semibold text-base flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-amber-600" />
          Missing Fields
        </h2>
        <p className="text-xs text-muted-foreground mt-1">
          {totalMissingCount} field{totalMissingCount !== 1 ? "s" : ""} need attention
        </p>
      </div>

      {/* Completion Stats */}
      <div className="px-4 py-4 border-b bg-card shrink-0">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Data Completion</span>
            <span className="text-sm font-bold">{completionPercentage}%</span>
          </div>
          <Progress value={completionPercentage} className="h-2" />
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            {completionPercentage >= 80 ? (
              <>
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Good coverage</span>
              </>
            ) : completionPercentage >= 50 ? (
              <>
                <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                <span>Needs improvement</span>
              </>
            ) : (
              <>
                <AlertCircle className="w-3.5 h-3.5 text-red-600" />
                <span>Critical gaps</span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Missing Fields List */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-4">
          {totalMissingCount === 0 ? (
            <Card>
              <CardContent className="text-center py-8">
                <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto mb-3" />
                <p className="text-sm font-medium">All fields complete!</p>
                <p className="text-xs text-muted-foreground mt-1">
                  No missing data detected
                </p>
              </CardContent>
            </Card>
          ) : (
            <Accordion type="multiple" defaultValue={Object.keys(groupedMissingFields)} className="space-y-2">
              {Object.entries(groupedMissingFields).map(([category, fields]) => (
                <AccordionItem
                  key={category}
                  value={category}
                  className="border rounded-lg bg-card"
                >
                  <AccordionTrigger className="hover:no-underline px-4">
                    <div className="flex items-center justify-between w-full pr-4">
                      <h3 className="text-sm font-semibold">{category}</h3>
                      <Badge variant="secondary" className="text-xs">
                        {fields.length}
                      </Badge>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="px-4 pb-3 space-y-2">
                      {fields.map((field) => (
                        <div
                          key={field.path}
                          className="flex items-start gap-2 text-xs p-2 rounded bg-muted/50 hover:bg-muted transition-colors"
                        >
                          <AlertCircle className="w-3.5 h-3.5 text-amber-600 mt-0.5 flex-shrink-0" />
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-foreground truncate">
                              {field.label}
                            </p>
                            <p className="text-muted-foreground text-[10px] mt-0.5 font-mono truncate">
                              {field.path}
                            </p>
                          </div>
                          <Badge
                            variant="outline"
                            className="text-[9px] px-1 py-0 h-4 flex-shrink-0"
                          >
                            {field.type}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          )}
        </div>
      </div>
    </div>
  );
}
