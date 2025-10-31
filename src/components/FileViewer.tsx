import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Copy, Check } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface FileViewerProps {
  fileName: string;
  content: string;
}

export const FileViewer = ({ fileName, content }: FileViewerProps) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(content);
    setCopied(true);
    toast.success("Code copied to clipboard");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Card className="overflow-hidden bg-code-bg border-code-border">
      <div className="flex items-center justify-between px-4 py-3 border-b border-code-border bg-card">
        <code className="text-sm font-mono text-foreground">{fileName}</code>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleCopy}
          className="h-8 px-3 hover:bg-secondary"
        >
          {copied ? (
            <>
              <Check className="w-4 h-4 mr-2" />
              Copied
            </>
          ) : (
            <>
              <Copy className="w-4 h-4 mr-2" />
              Copy Code
            </>
          )}
        </Button>
      </div>
      <pre className="p-4 overflow-x-auto text-sm">
        <code className="font-mono text-foreground whitespace-pre">{content}</code>
      </pre>
    </Card>
  );
};
