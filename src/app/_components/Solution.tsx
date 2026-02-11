import ReactMarkdown from "react-markdown";
import rehypeKatex from "rehype-katex";
import remarkMath from "remark-math";

export default function Solution({ solution }: { solution: string }) {
  return (
    <div className="mt-2 w-full overflow-x-auto">
      <div className="glass-card rounded-3xl p-6 sm:p-8">
        <h3 className="mb-6 font-serif text-3xl font-semibold text-stone-900">
          Step-by-Step Solution
        </h3>
        <ReactMarkdown
          remarkPlugins={[remarkMath]}
          rehypePlugins={[rehypeKatex]}
          components={{
            h1: ({ node: _node, ...props }) => (
              <h1 className="mb-4 text-3xl font-bold text-stone-900" {...props} />
            ),
            h2: ({ node: _node, ...props }) => (
              <h2 className="mb-3 mt-6 text-2xl font-bold text-stone-900" {...props} />
            ),
            h3: ({ node: _node, ...props }) => (
              <h3 className="mb-2 mt-4 text-xl font-bold text-stone-800" {...props} />
            ),
            p: ({ node: _node, ...props }) => (
              <p className="mb-4 leading-7 text-stone-700" {...props} />
            ),
            li: ({
              node: _node,
              ordered: _ordered,
              index: _index,
              checked: _checked,
              ...props
            }) => (
              <li className="mb-2 text-stone-700" {...props} />
            ),
          }}
        >
          {solution}
        </ReactMarkdown>
      </div>
    </div>
  );
}
