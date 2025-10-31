import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FileCode2, MapPin, FolderOpen } from "lucide-react";

interface InfrastructureFormProps {
  description: string;
  projectName: string;
  region: string;
  onDescriptionChange: (value: string) => void;
  onProjectNameChange: (value: string) => void;
  onRegionChange: (value: string) => void;
}

export const InfrastructureForm = ({
  description,
  projectName,
  region,
  onDescriptionChange,
  onProjectNameChange,
  onRegionChange,
}: InfrastructureFormProps) => {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="description" className="text-sm font-medium flex items-center gap-2">
          <FileCode2 className="w-4 h-4 text-accent" />
          Infrastructure Requirements
        </Label>
        <Textarea
          id="description"
          placeholder='Example: "Create a secure VPC with 2 private subnets, a managed Postgres instance, and a private S3 bucket for logs in AWS."'
          value={description}
          onChange={(e) => onDescriptionChange(e.target.value)}
          className="min-h-[150px] bg-card border-border resize-none font-mono text-sm"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="projectName" className="text-sm font-medium flex items-center gap-2">
            <FolderOpen className="w-4 h-4 text-accent" />
            Project Name
          </Label>
          <Input
            id="projectName"
            placeholder="my-terraform-project"
            value={projectName}
            onChange={(e) => onProjectNameChange(e.target.value)}
            className="bg-card border-border"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="region" className="text-sm font-medium flex items-center gap-2">
            <MapPin className="w-4 h-4 text-accent" />
            Region
          </Label>
          <Input
            id="region"
            placeholder="us-east-1"
            value={region}
            onChange={(e) => onRegionChange(e.target.value)}
            className="bg-card border-border"
          />
        </div>
      </div>
    </div>
  );
};
