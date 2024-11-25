import { openai } from "./openAISetup";

const prompt = `Reformat the following solution to a math problem into a clear, step-by-step explanation suitable for students.

  - Output the solution in **Markdown format**.
  - Use appropriate headings, lists, and ensure all mathematical expressions are properly enclosed in LaTeX delimiters.
  - **Ensure that all mathematical expressions use \`$...$\` for inline math and \`$$...$$\` for display math. Do not use \\\\( ... \\\\) or \\\\[ ... \\\\] delimiters or any other delimiters.**
  - **Do not include any code block fences or backticks (e.g., \`\`\`, \`\`\`markdown).**
  - **Only output the Markdown content.**
  - Do not include any additional text outside of the solution.`;

export async function formatSolution(wolframAlphaOutput: string): Promise<string> {
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
