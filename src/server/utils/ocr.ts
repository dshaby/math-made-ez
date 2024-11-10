import { openai } from "./openAISetup";

export async function applyOCR(image: string): Promise<string> {
  let textResult = "";

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content:
            "I will provide an image of a math problem. Please analyze the image, identify any mathematical information, including operators, fractions, exponents, and text labels if any, and convert the entire problem into a text format of one-line that makes it easy for the Wolfram Alpha API to injest and understand. Avoid using any special characters or symbols that may not be recognized by the API.",
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
