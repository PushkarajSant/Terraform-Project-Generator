import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileViewer } from "./FileViewer";
import { FileCode2, Settings2, AlertCircle, RefreshCw } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

export interface TerraformFile {
  name: string;
  content: string;
}

export interface TerraformVariable {
  name: string;
  type: string;
  description: string;
  default?: string;
}

export interface Diagnostic {
  type: "info" | "warning" | "success";
  message: string;
}

export interface Correction {
  original: string;
  corrected: string;
  reason: string;
}

interface ResultsViewProps {
  files: TerraformFile[];
  variables: TerraformVariable[];
  diagnostics: Diagnostic[];
  corrections: Correction[];
}

export const ResultsView = ({ files, variables, diagnostics, corrections }: ResultsViewProps) => {
  return (
    <Tabs defaultValue="files" className="w-full">
      <TabsList className="grid w-full grid-cols-4 bg-card border border-border">
        <TabsTrigger value="files" className="flex items-center gap-2">
          <FileCode2 className="w-4 h-4" />
          Files ({files.length})
        </TabsTrigger>
        <TabsTrigger value="variables" className="flex items-center gap-2">
          <Settings2 className="w-4 h-4" />
          Variables ({variables.length})
        </TabsTrigger>
        <TabsTrigger value="diagnostics" className="flex items-center gap-2">
          <AlertCircle className="w-4 h-4" />
          Diagnostics ({diagnostics.length})
        </TabsTrigger>
        <TabsTrigger value="corrections" className="flex items-center gap-2">
          <RefreshCw className="w-4 h-4" />
          Corrections ({corrections.length})
        </TabsTrigger>
      </TabsList>

      <TabsContent value="files" className="space-y-4 mt-6">
        {files.map((file) => (
          <FileViewer key={file.name} fileName={file.name} content={file.content} />
        ))}
      </TabsContent>

      <TabsContent value="variables" className="space-y-3 mt-6">
        {variables.map((variable) => (
          <Card key={variable.name} className="p-4 bg-card border-border">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 space-y-1">
                <div className="flex items-center gap-2">
                  <code className="text-sm font-mono text-primary">{variable.name}</code>
                  <Badge variant="outline" className="text-xs">{variable.type}</Badge>
                </div>
                <p className="text-sm text-muted-foreground">{variable.description}</p>
                {variable.default && (
                  <p className="text-xs text-accent">Default: {variable.default}</p>
                )}
              </div>
            </div>
          </Card>
        ))}
      </TabsContent>

      <TabsContent value="diagnostics" className="space-y-3 mt-6">
        {diagnostics.map((diagnostic, index) => (
          <Card key={index} className="p-4 bg-card border-border">
            <div className="flex items-start gap-3">
              <AlertCircle className={`w-5 h-5 mt-0.5 flex-shrink-0 ${
                diagnostic.type === "success" ? "text-success" :
                diagnostic.type === "warning" ? "text-warning" :
                "text-accent"
              }`} />
              <p className="text-sm">{diagnostic.message}</p>
            </div>
          </Card>
        ))}
      </TabsContent>

      <TabsContent value="corrections" className="space-y-3 mt-6">
        {corrections.length === 0 ? (
          <Card className="p-6 bg-card border-border text-center">
            <p className="text-muted-foreground">No corrections needed - your requirements were clear!</p>
          </Card>
        ) : (
          corrections.map((correction, index) => (
            <Card key={index} className="p-4 bg-card border-border">
              <div className="space-y-3">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Original:</p>
                  <code className="text-sm font-mono text-destructive">{correction.original}</code>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Corrected to:</p>
                  <code className="text-sm font-mono text-success">{correction.corrected}</code>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Reason:</p>
                  <p className="text-sm">{correction.reason}</p>
                </div>
              </div>
            </Card>
          ))
        )}
      </TabsContent>
    </Tabs>
  );
};
