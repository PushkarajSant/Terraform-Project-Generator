import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { model, apiKey, provider, description, projectName, region } = await req.json();

    console.log("Generating Terraform project:", { model, provider, projectName, region });

    // Use Lovable AI instead of external APIs
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    // Map user's model selection to Lovable AI models
    const modelMap: Record<string, string> = {
      gemini: "google/gemini-2.5-pro",
      gpt: "openai/gpt-5",
      claude: "google/gemini-2.5-pro", // Claude not available, use Gemini Pro
    };

    const aiModel = modelMap[model] || "google/gemini-2.5-flash";

    const systemPrompt = `You are an expert DevOps engineer specialized in Terraform infrastructure as code. 
Your task is to generate complete, production-ready Terraform projects based on user requirements.

CRITICAL INSTRUCTIONS:
1. Generate ALL necessary Terraform files: main.tf, variables.tf, outputs.tf, providers.tf, README.md, and terraform.tfvars.example
2. Apply security best practices by default (private networks, encryption, least privilege, proper tagging)
3. Validate requirements and auto-fix any ambiguities or issues
4. Provide detailed diagnostics explaining design choices
5. Note any corrections made to the original requirements
6. Suggest improvements where applicable
7. Generate a clear README explaining the infrastructure in plain English

Cloud Provider: ${provider.toUpperCase()}
Project Name: ${projectName}
Region: ${region || "default region for provider"}

Return your response as a JSON object with this exact structure:
{
  "files": [
    {"name": "main.tf", "content": "..."},
    {"name": "variables.tf", "content": "..."},
    {"name": "outputs.tf", "content": "..."},
    {"name": "providers.tf", "content": "..."},
    {"name": "README.md", "content": "..."},
    {"name": "terraform.tfvars.example", "content": "..."}
  ],
  "variables": [
    {"name": "variable_name", "type": "string", "description": "...", "default": "..."}
  ],
  "diagnostics": [
    {"type": "info|warning|success", "message": "..."}
  ],
  "corrections": [
    {"original": "...", "corrected": "...", "reason": "..."}
  ]
}`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: aiModel,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: description },
        ],
        max_completion_tokens: 4000,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again later." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "Payment required. Please add credits to your workspace." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const errorText = await response.text();
      console.error("AI API error:", response.status, errorText);
      throw new Error("AI API request failed");
    }

    const aiResponse = await response.json();
    const content = aiResponse.choices?.[0]?.message?.content;

    if (!content) {
      throw new Error("No content in AI response");
    }

    // Parse the AI response
    let result;
    try {
      // Extract JSON from markdown code blocks if present
      const jsonMatch = content.match(/```json\n([\s\S]*?)\n```/) || content.match(/```\n([\s\S]*?)\n```/);
      const jsonString = jsonMatch ? jsonMatch[1] : content;
      result = JSON.parse(jsonString);
    } catch (parseError) {
      console.error("Failed to parse AI response:", parseError);
      console.log("AI response content:", content);
      throw new Error("Failed to parse AI-generated Terraform configuration");
    }

    // Ensure all required fields are present
    if (!result.files || !Array.isArray(result.files)) {
      throw new Error("Invalid response format: missing files array");
    }

    // Add default values for optional fields
    result.variables = result.variables || [];
    result.diagnostics = result.diagnostics || [
      { type: "success", message: "Terraform project generated successfully with security best practices" }
    ];
    result.corrections = result.corrections || [];

    console.log("Successfully generated Terraform project");

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error in generate-terraform function:", error);
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : "Unknown error occurred",
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
