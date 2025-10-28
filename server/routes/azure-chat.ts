import { RequestHandler } from "express";
import { z } from "zod";

const ChatRequestSchema = z.object({
  message: z.string().min(1),
  conversationHistory: z
    .array(
      z.object({
        role: z.enum(["user", "assistant"]),
        content: z.string(),
      }),
    )
    .optional(),
});

interface AzureChatMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export const handleAzureChat: RequestHandler = async (req, res) => {
  try {
    const body = ChatRequestSchema.parse(req.body);

    const apiKey = process.env.AZURE_OPENAI_API_KEY;
    const endpoint =
      process.env.ENDPOINT_URL || "https://angilambot-api.openai.azure.com/";
    const deploymentName = process.env.DEPLOYMENT_NAME || "gpt-4o-mini";
    const apiVersion = "2025-01-01-preview";

    if (!apiKey) {
      return res.status(500).json({
        error: "Azure OpenAI API key not configured",
      });
    }

    // Construct the conversation history
    const messages: AzureChatMessage[] = [
      {
        role: "system",
        content:
          "You are a helpful AI tutor. Provide clear, educational responses. Keep responses concise and engaging.",
      },
    ];

    // Add conversation history if provided
    if (body.conversationHistory && body.conversationHistory.length > 0) {
      messages.push(
        ...body.conversationHistory.map((msg) => ({
          role: msg.role as "user" | "assistant",
          content: msg.content,
        })),
      );
    }

    // Add the current user message
    messages.push({
      role: "user",
      content: body.message,
    });

    // Call Azure OpenAI API
    const azureUrl = `${endpoint.replace(/\/$/, "")}/openai/deployments/${deploymentName}/chat/completions?api-version=${apiVersion}`;

    const response = await fetch(azureUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "api-key": apiKey,
      },
      body: JSON.stringify({
        messages,
        max_tokens: 500,
        temperature: 0.7,
        top_p: 0.95,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Azure OpenAI API error:", errorData);
      return res.status(response.status).json({
        error: "Failed to get response from Azure OpenAI",
        details: errorData,
      });
    }

    const data = await response.json();
    const assistantMessage =
      data.choices[0]?.message?.content ||
      "Sorry, I couldn't generate a response.";

    res.json({
      message: assistantMessage.trim(),
    });
  } catch (error) {
    console.error("Chat error:", error);
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: "Invalid request format" });
    }
    res.status(500).json({
      error: "Internal server error",
    });
  }
};
