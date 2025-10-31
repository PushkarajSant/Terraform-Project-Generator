import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, Key } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

interface APIKeyInputProps {
  value: string;
  onChange: (value: string) => void;
  modelName: string;
}

export const APIKeyInput = ({ value, onChange, modelName }: APIKeyInputProps) => {
  const [showKey, setShowKey] = useState(false);

  return (
    <div className="space-y-2">
      <Label htmlFor="apiKey" className="text-sm font-medium flex items-center gap-2">
        <Key className="w-4 h-4 text-accent" />
        {modelName} API Key
      </Label>
      <div className="relative">
        <Input
          id="apiKey"
          type={showKey ? "text" : "password"}
          placeholder="Enter your API key (session only)"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="bg-card border-border pr-10"
        />
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 p-0"
          onClick={() => setShowKey(!showKey)}
        >
          {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
        </Button>
      </div>
      <p className="text-xs text-muted-foreground">
        Your API key is used only for this session and is never stored
      </p>
    </div>
  );
};
