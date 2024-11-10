import { openai } from "./openAISetup";

export async function generateSolution(mathProblems: string): Promise<string> {
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content:
            "Provide a detailed step-by-step solution to the provided math problem. For each step, use Markdown formatting with LaTeX syntax that will be compatible with MathJax rendering. Use (...) for inline math expressions. Use [...] for block equations. Begin each major step with a heading like ### Step 1: [Description] and format calculations or equations in LaTeX where appropriate. Ensure all mathematical symbols and equations are fully enclosed in delimiters so that they will be compatible with MathJax",
        },
        {
          role: "user",
          content: `${mathProblems}`,
        },
      ],
    });

    const { choices } = completion;

    if (choices[0]?.message?.content) {
      return choices[0]?.message?.content;
    }

    throw new Error("Error with OpenAI generating a completion");
  } catch (error) {
    throw new Error(
      `Could not properly generate a solution with this mathProblems: ${mathProblems}. Error: ${JSON.stringify(error)}`
    );
  }
}
