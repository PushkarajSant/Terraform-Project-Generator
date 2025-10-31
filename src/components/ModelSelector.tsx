import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";

export type AIModel = "gemini" | "gpt" | "claude";

interface ModelSelectorProps {
  value: AIModel;
  onChange: (value: AIModel) => void;
}

export const ModelSelector = ({ value, onChange }: ModelSelectorProps) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="model" className="text-sm font-medium">
        AI Model
      </Label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger id="model" className="bg-card border-border">
          <SelectValue placeholder="Select AI model" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="gemini">Google Gemini Pro</SelectItem>
          <SelectItem value="gpt">OpenAI GPT-5</SelectItem>
          <SelectItem value="claude">Anthropic Claude</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};
