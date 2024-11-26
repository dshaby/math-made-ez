import axios from "axios";

export async function generateSolution(
  urlEncodedProblem: string,
  retryCount = 0,
): Promise<string> {
  const MAX_RETRIES = 2;

  if (retryCount > MAX_RETRIES) {
    throw new Error(
      `Maximum retries exceeded for problem: ${decodeURIComponent(
        urlEncodedProblem,
      )}`,
    );
  }

  try {
    const response = await axios.get(
      `https://www.wolframalpha.com/api/v1/llm-api?input=${urlEncodedProblem}&output=json&appid=${process.env.WOLFRAM_APP_ID}`,
    );

    return response.data ? JSON.stringify(response.data) : "";
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      const errMessage = error.response?.data as string;
      const regex = /You could instead try:\s*(.+)/;
      const errResponseArray = regex.exec(errMessage);

      if (errResponseArray?.[1]) {
        const suggestedProblem = errResponseArray[1].trim();
        console.log(`Retrying with suggested problem: ${suggestedProblem}`);

        return await generateSolution(suggestedProblem, retryCount + 1);
      }
    }

    throw new Error(
      `Could not properly generate a solution with this mathProblem: ${decodeURIComponent(urlEncodedProblem)}. Error: ${JSON.stringify(error)}`,
    );
  }
}
