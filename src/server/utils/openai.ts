import OpenAI from "openai";
import { env } from "~/env";

const openai = new OpenAI({ apiKey: env.OPENAI_API_KEY });

export async function generateSolution(mathProblems: string): Promise<string> {
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: "You are a helpful assistant." },
        {
          role: "user",
          content: `Solve the following math problems step-by-step:\n\n${mathProblems}`,
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
