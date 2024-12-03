import ReactMarkdown from "react-markdown";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";

interface Props {
  mathProblem: string;
}

const MathProblemDisplay = ({ mathProblem }: Props) => (
  <div className="mt-6 w-full max-w-md overflow-x-auto overflow-y-hidden rounded-lg border border-gray-300 bg-white p-4 shadow-md">
    <h3 className="mb-2 text-xl font-semibold">Math Problem:</h3>
    <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>
      {mathProblem}
    </ReactMarkdown>
  </div>
);

export default MathProblemDisplay;
