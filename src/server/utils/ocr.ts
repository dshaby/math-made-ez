import { createWorker } from "tesseract.js";
import fs from "fs";
import path from "path";

export async function applyOCR(image: string): Promise<string> {
  let textResult = "";

  try {
    const worker = await createWorker("eng", 1, {
      logger: (m) => console.log(m),
    });

    const base64Image = image.replace(/^data:image\/\w+;base64,/, "");
    const buffer = Buffer.from(base64Image, "base64");
    const uploadsDir = path.join(process.cwd(), "uploads");

    if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir);

    const imagePath = path.join(uploadsDir, "uploaded_image.jpg");
    fs.writeFileSync(imagePath, buffer);

    const {
      data: { text },
    } = await worker.recognize(imagePath);

    textResult = text;
  } catch (error) {
    console.error("Updated Error with OCR recognizing text:", error);
  }

  return textResult;
}
