import { openai } from "./openAISetup";
import fs from "fs";
import path from "path";

export async function applyOCR(image: string): Promise<string> {
  let textResult = "";

  try {
    const base64Image = image.replace(/^data:image\/\w+;base64,/, "");
    const buffer = Buffer.from(base64Image, "base64");
    const uploadsDir = path.join(process.cwd(), "uploads");

    if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir);

    const imagePath = path.join(uploadsDir, "uploaded_image.jpg");
    fs.writeFileSync(imagePath, buffer);

    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content:
            "I will provide an image of a math problem. Please analyze the image, identify any mathematical information, including operators, fractions, exponents, and text labels if any, and convert the entire problem accurately into readable text format or as LaTeX if the format is complex. Ensure all symbols, equations, and formatting are preserved as closely as possible to the original.",
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
    console.error("Updated Error with OCR recognizing text:", error);
  }

  return textResult;
}
