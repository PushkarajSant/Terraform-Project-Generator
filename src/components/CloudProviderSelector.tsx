import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Cloud } from "lucide-react";

export type CloudProvider = "aws" | "gcp" | "azure";

interface CloudProviderSelectorProps {
  value: CloudProvider;
  onChange: (value: CloudProvider) => void;
}

export const CloudProviderSelector = ({ value, onChange }: CloudProviderSelectorProps) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="provider" className="text-sm font-medium flex items-center gap-2">
        <Cloud className="w-4 h-4 text-accent" />
        Cloud Provider
      </Label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger id="provider" className="bg-card border-border">
          <SelectValue placeholder="Select cloud provider" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="aws">Amazon Web Services (AWS)</SelectItem>
          <SelectItem value="gcp">Google Cloud Platform (GCP)</SelectItem>
          <SelectItem value="azure">Microsoft Azure</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};
