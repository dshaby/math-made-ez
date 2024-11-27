import { openai } from "./openAISetup";

const prompt = `
You are an AI that extracts math problems from images and formats them appropriately for the Wolfram Alpha API. Analyze the provided image carefully and ensure the output meets these guidelines:

1. **Output only the mathematical expressions needed to solve the problem.**
2. Use precise LaTeX formatting for all mathematical symbols and operations.
   - For example, integrals should use \\int, fractions with \\frac{}, and exponents with ^{}.
3. **Do not include any math delimiters** like $$, \\[, \\], \\(, or \\). Output only the raw LaTeX expressions **without any enclosing delimiters**.
   - **Correct Example:** x + 0.2x = 60000
   - **Incorrect Example:** \\( x + 0.2x = 60000 \\)
4. Do not use \\left and \\right for grouping. Use regular parentheses () instead.
5. When representing absolute value, do not use \\left\\| and \\right\\| but use | | instead.
6. Include all integral limits, variables, and differential terms (e.g., dx) explicitly and clearly.
7. Use only single-letter variable names, possibly with integer subscripts (e.g., n, n1, n_1).
8. Always use exponent notation like '6*10^14', never '6e14'.
9. Use named physical constants (e.g., 'speed of light') without numerical substitution.
10. Include a space between compound units (e.g., "Ω m" for "ohm*meter").
11. To solve for a variable in an equation with units, consider sending the math problem as a corresponding equation without units; exclude counting units (e.g., books), include genuine units (e.g., kg).
12. The output should be a single-line string suitable for the 'input' parameter of the Wolfram Alpha API.
13. Do not solve the problem. Do not include any explanations, comments, or additional text in the output.

**Note:** Your output should be a single-line string containing only the raw LaTeX expression(s) needed to solve the problem, without any additional formatting or text.
`;

export async function applyOCR(image: string): Promise<string> {
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

    return completion?.choices?.[0]?.message?.content?.trim() ?? "";
  } catch (error) {
    throw new Error(`OCR processing failed", ${JSON.stringify(error)}`);
  }
}
