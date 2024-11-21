import axios from "axios";

export async function generateSolution(urlEncodedProblem: string): Promise<string> {
  try {
    const response = await axios.get(
      `https://www.wolframalpha.com/api/v1/llm-api?input=${urlEncodedProblem}&output=json&appid=${process.env.WOLFRAM_APP_ID}`
    );

    return response.data ? JSON.stringify(response.data) : "";
  } catch (error) {
    throw new Error(
      `Could not properly generate a solution with this (url encoded) mathProblem: ${urlEncodedProblem}. Error: ${JSON.stringify(error)}`
    );
  }
}
