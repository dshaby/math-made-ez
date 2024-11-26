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
      const regex =
        /(You could instead try:|Things to try instead:)\s*([\s\S]+)/;
      const errResponseArray = regex.exec(errMessage);

      if (errResponseArray?.[2]) {
        const suggestedProblems = errResponseArray[2]
          .split("\n")
          .map((s) => s.trim())
          .filter((s) => s);
        const firstSuggestedProblem = suggestedProblems[0];
        console.log(
          `Retrying with suggested problem: ${firstSuggestedProblem}`,
        );

        if (firstSuggestedProblem)
          return await generateSolution(firstSuggestedProblem, retryCount + 1);
      }
    }

    throw new Error(
      `Could not generate a solution for the problem: ${decodeURIComponent(urlEncodedProblem)}.\nStatus: ${axios.isAxiosError(error) ? error.response?.status : "unknown"}.\n Response data: ${axios.isAxiosError(error) ? JSON.stringify(error.response?.data) : "unknown"}`,
    );
  }
}
