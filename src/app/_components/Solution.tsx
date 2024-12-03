import ReactMarkdown from "react-markdown";
import rehypeKatex from "rehype-katex";
import remarkMath from "remark-math";

export default function Solution({ solution }: { solution: string }) {
  return (
    <div className="mt-4 w-full max-w-4xl overflow-x-auto">
      <div className="rounded-xl border border-gray-300 bg-white p-6 shadow-2xl">
        <ReactMarkdown
          remarkPlugins={[remarkMath]}
          rehypePlugins={[rehypeKatex]}
          components={{
            h1: (props) => (
              <h1 className="mb-4 text-2xl font-bold" {...props} />
            ),
            h2: (props) => <h2 className="mb-3 text-xl font-bold" {...props} />,
            h3: (props) => <h3 className="mb-2 text-lg font-bold" {...props} />,
            p: (props) => <p className="mb-4 text-gray-800" {...props} />,
            li: (props) => <li className="mb-2 text-gray-800" {...props} />,
          }}
        >
          {solution}
        </ReactMarkdown>
      </div>
    </div>
  );
}
