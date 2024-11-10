import { openai } from "./openAISetup";

export async function formatSolution(
  wolframAlphaOutput: string
): Promise<string> {
  console.log("wolframAlphaOutput:", wolframAlphaOutput);
  const prompt = `Considering this solution to a math problem, format the solution in a way that is easy for a student to understand.`;

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

    const { choices } = completion;

    if (choices[0]?.message?.content) {
      return choices[0]?.message?.content;
    } else {
      throw new Error("No content found in completion");
    }
  } catch (error) {
    console.error("Error formatting problem:", error);
    throw new Error("Failed to format problem");
  }
}
