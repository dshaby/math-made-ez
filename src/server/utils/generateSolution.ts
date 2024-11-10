import axios from "axios";

export async function generateSolution(
  formattedProblem: string
): Promise<string> {
  try {
    const response = await axios.get(
      "https://www.wolframalpha.com/api/v1/llm-api",
      {
        params: {
          input: formattedProblem,
          output: "json",
          appid: process.env.WOLFRAM_APP_ID,
        },
      }
    );

    if (response.data) return JSON.stringify(response.data);

    throw new Error("Error with Wolfram Alpha generating a solution");
  } catch (error) {
    throw new Error(
      `Could not properly generate a solution with this mathProblems: ${formattedProblem}. Error: ${JSON.stringify(error)}`
    );
  }
}
