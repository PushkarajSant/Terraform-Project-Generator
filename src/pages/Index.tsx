import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ModelSelector, AIModel } from "@/components/ModelSelector";
import { APIKeyInput } from "@/components/APIKeyInput";
import { CloudProviderSelector, CloudProvider } from "@/components/CloudProviderSelector";
import { InfrastructureForm } from "@/components/InfrastructureForm";
import { ResultsView, TerraformFile, TerraformVariable, Diagnostic, Correction } from "@/components/ResultsView";
import { DownloadButton } from "@/components/DownloadButton";
import { Loader2, Sparkles } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const Index = () => {
  const [model, setModel] = useState<AIModel>("gemini");
  const [apiKey, setApiKey] = useState("");
  const [provider, setProvider] = useState<CloudProvider>("aws");
  const [description, setDescription] = useState("");
  const [projectName, setProjectName] = useState("");
  const [region, setRegion] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [results, setResults] = useState<{
    files: TerraformFile[];
    variables: TerraformVariable[];
    diagnostics: Diagnostic[];
    corrections: Correction[];
  } | null>(null);

  const modelNames = {
    gemini: "Google Gemini",
    gpt: "OpenAI GPT",
    claude: "Anthropic Claude",
  };

  const handleGenerate = async () => {
    if (!description.trim()) {
      toast.error("Please describe your infrastructure requirements");
      return;
    }

    if (!apiKey.trim()) {
      toast.error("Please enter your API key");
      return;
    }

    if (!projectName.trim()) {
      toast.error("Please enter a project name");
      return;
    }

    setIsGenerating(true);

    try {
      const { data, error } = await supabase.functions.invoke("generate-terraform", {
        body: {
          model,
          apiKey,
          provider,
          description,
          projectName,
          region: region || "us-east-1",
        },
      });

      if (error) throw error;

      setResults(data);
      toast.success("Terraform project generated successfully!");
    } catch (error) {
      console.error("Generation error:", error);
      toast.error("Failed to generate Terraform project. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section with Gradient */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-glow opacity-50" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <div className="text-center space-y-6">
            <div className="inline-flex items-center justify-center p-2 bg-primary/10 rounded-full mb-4">
              <Sparkles className="w-6 h-6 text-primary" />
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight">
              Terraform Project Generator
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Describe your infrastructure, get enterprise-grade Terraform code instantly
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="space-y-8">
          {/* Configuration Card */}
          <Card className="p-6 sm:p-8 bg-card border-border shadow-lg">
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <ModelSelector value={model} onChange={setModel} />
                <CloudProviderSelector value={provider} onChange={setProvider} />
              </div>

              <APIKeyInput
                value={apiKey}
                onChange={setApiKey}
                modelName={modelNames[model]}
              />

              <InfrastructureForm
                description={description}
                projectName={projectName}
                region={region}
                onDescriptionChange={setDescription}
                onProjectNameChange={setProjectName}
                onRegionChange={setRegion}
              />

              <Button
                onClick={handleGenerate}
                disabled={isGenerating}
                size="lg"
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground shadow-glow"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5 mr-2" />
                    Generate Project
                  </>
                )}
              </Button>
            </div>
          </Card>

          {/* Results Section */}
          {results && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">Generated Project</h2>
                <DownloadButton files={results.files} projectName={projectName} />
              </div>

              <Card className="p-6 bg-card border-border shadow-lg">
                <ResultsView
                  files={results.files}
                  variables={results.variables}
                  diagnostics={results.diagnostics}
                  corrections={results.corrections}
                />
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Index;
