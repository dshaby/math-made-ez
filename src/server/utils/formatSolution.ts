import { openai } from "./openAISetup";

export async function formatSolution(
  wolframAlphaOutput: string
): Promise<string> {
  const prompt = `Reformat the following solution to a math problem into a step-by-step explanation suitable for students. Output the solution as a JSON array where each element is an object with a "type" (e.g., "paragraph", "heading", "math") and a "content" field. Enclose all mathematical expressions in the "math" type with LaTeX code. **Do not include any additional text outside of the JSON array. Do not include any code block fences or Markdown formatting in your output.**`;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: prompt,
        },
        {
          role: "user",
          content: wolframAlphaOutput,
        },
      ],
    });

    const result = completion.choices[0]?.message?.content;

    return result ? result : "";
  } catch (error) {
    console.error("Error formatting problem:", error);
    throw new Error("Failed to format problem");
  }
}
