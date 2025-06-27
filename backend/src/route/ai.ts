// backend/src/route/ai.ts

import { Hono } from "hono";
import { verify } from "hono/jwt";
import { HfInference } from "@huggingface/inference";

export const aiRouter = new Hono<{
    Bindings: {
        DATABASE_URL: string;
        JWT_SECRET: string;
        HF_ACCESS_TOKEN: string;
    },
    Variables: {
        userId: string
    }
}>();
aiRouter.use(async (c, next) => {
    const jwt = c.req.header('Authorization');
    if (!jwt) { return c.json({ error: "unauthorized" }, 401); }
    try {
        const payload = await verify(jwt, c.env.JWT_SECRET);
        if (!payload || typeof payload.id !== 'string') { return c.json({ error: "unauthorized" }, 401); }
        c.set('userId', payload.id);
        await next();
    } catch (err) { return c.json({ error: 'Invalid token' }, 401); }
});


const AI_MODEL = "google/flan-t5-large"; 

aiRouter.post("/generate", async (c) => {
    const { prompt } = await c.req.json();
    if (!prompt) return c.json({ message: "Prompt topic is required" }, 400);
    
    const hf = new HfInference(c.env.HF_ACCESS_TOKEN);
    try {
        const blogPrompt = `Write a detailed, engaging, and well-structured blog post about "${prompt}". Use headings, paragraphs, and lists where appropriate. The entire output must be in valid HTML format.`;
        
        const response = await hf.textGeneration({
            model: AI_MODEL,
            inputs: blogPrompt,
            parameters: { max_new_tokens: 768, temperature: 0.75 },
        });

        return c.json({ content: response.generated_text });
    } catch (error) {
        console.error("Error in /generate:", error);
        return c.json({ message: "Failed to generate content from AI" }, 500);
    }
});

aiRouter.post("/improve", async (c) => {
    const { textToImprove, instruction } = await c.req.json();
    if (!textToImprove || !instruction) return c.json({ message: "Text and an instruction are required" }, 400);

    const hf = new HfInference(c.env.HF_ACCESS_TOKEN);
    try {
        const improvePrompt = `Instruction: "${instruction}"\n\nOriginal Text (in HTML):\n---\n${textToImprove}\n---\n\nImproved Text (must be valid HTML):`;
        
        const response = await hf.textGeneration({
            model: AI_MODEL,
            inputs: improvePrompt,
            parameters: { max_new_tokens: 1024, temperature: 0.6 },
        });

        return c.json({ content: response.generated_text });
    } catch (error) {
        console.error("Error in /improve:", error);
        return c.json({ message: "Failed to improve content with AI" }, 500);
    }
});