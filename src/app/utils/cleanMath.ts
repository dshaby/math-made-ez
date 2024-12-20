export const cleanSolution = (formattedSolution: string): string => {
  let cleanedSolution = formattedSolution.trim();

  // Remove leading/trailing code fences
  // 3 backticks
  cleanedSolution = cleanedSolution
    .replace(/^```[\s\S]*?\n/, "")
    .replace(/```$/, "");

  // 4 backticks
  cleanedSolution = cleanedSolution
    .replace(/^````[\s\S]*?\n/, "")
    .replace(/````$/, "");

  // Replace all instances of \( ... \) with $...$
  cleanedSolution = cleanedSolution.replace(
    /\\\((.+?)\\\)/g,
    (_, p1) => `$${p1}$`,
  );

  // Replace all instances of \[ ... \] with $$...$$
  cleanedSolution = cleanedSolution.replace(
    /\\\[(.+?)\\\]/g,
    (_, p1) => `$$${p1}$$`,
  );

  return cleanedSolution;
};

export const removeDelimiters = (expression: string): string => {
  return expression.replace(/(\$\$|\$|\\\[|\\\]|\\\(|\\\))/g, "").trim();
};

export const prepareMathProblemForRendering = (mathProblem: string): string => {
  return mathProblem
    .split("\n")
    .map((line) => {
      const trimmedLine = line.trim();
      if (!trimmedLine) return "";

      const containsBackslashes = trimmedLine.includes("\\");
      const containsMathSymbols = /[=+\-*/^<>]/.test(trimmedLine);

      if (containsBackslashes || containsMathSymbols) {
        return `$$${trimmedLine}$$`;
      } else {
        return trimmedLine;
      }
    })
    .join("\n\n");
};