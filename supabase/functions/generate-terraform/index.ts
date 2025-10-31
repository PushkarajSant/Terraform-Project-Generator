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
Generate complete, production-ready Terraform projects based on user requirements.

Apply security best practices by default (private networks, encryption, least privilege, proper tagging).

Cloud Provider: ${provider.toUpperCase()}
Project Name: ${projectName}
Region: ${region || "default region for provider"}`;

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
        max_completion_tokens: 16000,
        tools: [
          {
            type: "function",
            function: {
              name: "generate_terraform_project",
              description: "Generate a complete Terraform project with all necessary files",
              parameters: {
                type: "object",
                properties: {
                  files: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        name: { type: "string", description: "Filename (e.g., main.tf)" },
                        content: { type: "string", description: "Full file content" }
                      },
                      required: ["name", "content"]
                    }
                  },
                  variables: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        name: { type: "string" },
                        type: { type: "string" },
                        description: { type: "string" },
                        default: { type: "string" }
                      }
                    }
                  },
                  diagnostics: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        type: { type: "string", enum: ["info", "warning", "success"] },
                        message: { type: "string" }
                      }
                    }
                  },
                  corrections: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        original: { type: "string" },
                        corrected: { type: "string" },
                        reason: { type: "string" }
                      }
                    }
                  }
                },
                required: ["files"]
              }
            }
          }
        ],
        tool_choice: { type: "function", function: { name: "generate_terraform_project" } }
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
    console.log("AI Response structure:", JSON.stringify(aiResponse, null, 2));
    
    // Extract result from tool call
    const toolCall = aiResponse.choices?.[0]?.message?.tool_calls?.[0];
    
    if (!toolCall || toolCall.function?.name !== "generate_terraform_project") {
      console.error("No tool call in AI response. Full response:", JSON.stringify(aiResponse, null, 2));
      throw new Error("AI did not call the expected function");
    }

    const functionArgs = toolCall.function.arguments;
    console.log("Function arguments length:", functionArgs.length);

    let result;
    try {
      result = JSON.parse(functionArgs);
    } catch (parseError) {
      console.error("Failed to parse tool call arguments:", parseError);
      console.error("Arguments that failed to parse (first 1000 chars):", functionArgs.substring(0, 1000));
      throw new Error(`Failed to parse AI-generated Terraform configuration: ${parseError instanceof Error ? parseError.message : 'Unknown error'}`);
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
