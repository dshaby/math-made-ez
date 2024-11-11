import { openai } from "./openAISetup";

export async function* formatSolution(
  wolframAlphaOutput: string
): AsyncGenerator<string, void, unknown> {
  const prompt = `Considering this solution to a math problem, format the solution in a way that is easy for a student to understand.`;

  try {
    const stream = await openai.chat.completions.create({
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
      stream: true,
    });

    for await (const chunk of stream) {
      let content = chunk.choices[0]?.delta?.content;
      if (!content) content = "";
      yield content;
    }
  } catch (error) {
    console.error("Error formatting problem:", error);
    throw new Error("Failed to format problem");
  }
}
