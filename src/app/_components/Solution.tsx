import { MathJax, MathJaxContext } from "better-react-mathjax";

interface FormattedSolution {
  type: string;
  content: string;
}

const parseFormattedSolution = (solution: string): FormattedSolution[] => {
  let cleanedSolution = solution.trim();

  if (cleanedSolution.startsWith("```json"))
    cleanedSolution = cleanedSolution.slice(7).trim();

  if (cleanedSolution.endsWith("```"))
    cleanedSolution = cleanedSolution.slice(0, -3).trim();

  try {
    return JSON.parse(cleanedSolution) as FormattedSolution[];
  } catch (error) {
    console.error("Error parsing solution JSON:", error);
    console.error("Solution content:", solution);
    throw new Error("Failed to parse solution JSON");
  }
};

export default function Solution({ solution }: { solution: string }) {
  const elements = parseFormattedSolution(solution);

  return (
    <div className="p-6 bg-white rounded-xl shadow-2xl border border-gray-300">
      <MathJaxContext>
        {elements.map((element, index: number) => {
          if (element.type === "paragraph") {
            return (
              <p key={index} className="mb-4 text-gray-800">
                <MathJax inline dynamic>
                  {element.content}
                </MathJax>
              </p>
            );
          } else if (element.type === "heading") {
            return (
              <h3 key={index} className="text-xl font-bold mb-2">
                <MathJax inline dynamic>
                  {element.content}
                </MathJax>
              </h3>
            );
          } else if (element.type === "math") {
            return (
              <MathJax
                key={index}
                className="my-4 text-center"
              >{`\\[${element.content}\\]`}</MathJax>
            );
          } else {
            return null;
          }
        })}
      </MathJaxContext>
    </div>
  );
}
