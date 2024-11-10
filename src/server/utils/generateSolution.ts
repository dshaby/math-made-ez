import { openai } from "./openAISetup";

export async function generateSolution(mathProblems: string): Promise<string> {
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content:
            "Using the following math problem, solve it step-by-step. Provide a solution formatted in LaTeX, including all steps with mathematical symbols and equations represented in LaTeX syntax.",
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
