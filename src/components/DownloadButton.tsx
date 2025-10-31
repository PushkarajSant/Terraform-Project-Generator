import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { TerraformFile } from "./ResultsView";
import JSZip from "jszip";
import { toast } from "sonner";

interface DownloadButtonProps {
  files: TerraformFile[];
  projectName: string;
}

export const DownloadButton = ({ files, projectName }: DownloadButtonProps) => {
  const handleDownload = async () => {
    try {
      const zip = new JSZip();
      
      files.forEach((file) => {
        zip.file(file.name, file.content);
      });

      const blob = await zip.generateAsync({ type: "blob" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${projectName || "terraform-project"}.zip`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast.success("Terraform project downloaded successfully");
    } catch (error) {
      console.error("Error creating zip:", error);
      toast.error("Failed to download project");
    }
  };

  return (
    <Button
      onClick={handleDownload}
      size="lg"
      className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-primary-foreground"
    >
      <Download className="w-5 h-5 mr-2" />
      Download ZIP
    </Button>
  );
};
