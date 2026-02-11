import ReactMarkdown from "react-markdown";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";

interface Props {
  mathProblem: string;
}

const MathProblemDisplay = ({ mathProblem }: Props) => (
  <div className="glass-card mt-2 w-full overflow-x-auto overflow-y-hidden rounded-3xl p-6 sm:p-8">
    <h3 className="mb-4 font-serif text-3xl font-semibold text-stone-900">
      Recognized Problem
    </h3>
    <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>
      {mathProblem}
    </ReactMarkdown>
  </div>
);

export default MathProblemDisplay;
