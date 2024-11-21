import { openai } from "./openAISetup";

const prompt = `You are an AI that converts images of math problems into URL-encoded LaTeX format for Wolfram Alpha. Analyze the provided math problem carefully and ensure the output meets these guidelines:

1. Use precise LaTeX formatting for all mathematical symbols and operations.
   - For example, integrals should use \\int, fractions with \\frac{}, and exponents with ^{}.
2. Do not use \\left and \\right for grouping. Use regular parentheses () instead.
3. When representing absolute value, do not use \\left\\| and \\right\\| but use | | instead.
4. Encode all special characters (e.g., backslash as %5C, space as %20) strictly and avoid redundant or misplaced encodings.
5. Include all integral limits, variables, and differential terms (e.g., dx) explicitly and clearly.

The output should contain only the URL-encoded math expression problem, with no additional text or explanations.`;

export async function applyOCR(image: string): Promise<string> {
  let textResult = "";

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
          content: [
            {
              type: "image_url",
              image_url: {
                url: image,
              },
            },
          ],
        },
      ],
    });

    const { choices } = completion;

    if (choices[0]?.message?.content) {
      textResult = choices[0]?.message?.content;
    }
  } catch (error) {
    console.error("Error with OCR recognizing text:", error);
  }

  return textResult;
}
