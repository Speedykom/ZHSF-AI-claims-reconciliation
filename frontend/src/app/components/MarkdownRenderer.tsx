import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import rehypeRaw from 'rehype-raw';
import { FiCopy, FiCheck } from 'react-icons/fi';
import 'highlight.js/styles/github.css';

interface MarkdownRendererProps {
  content: string;
}

const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content }) => {
  const [copiedBlocks, setCopiedBlocks] = React.useState<Set<number>>(new Set());

  const handleCopyCode = async (text: string, index: number) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedBlocks(prev => new Set(prev).add(index));
      setTimeout(() => {
        setCopiedBlocks(prev => {
          const newSet = new Set(prev);
          newSet.delete(index);
          return newSet;
        });
      }, 2000);
    } catch (err) {
      console.error('Failed to copy code:', err);
    }
  };

  const components = {
    h1: ({ children }: any) => (
      <h1 className="text-2xl font-bold text-gray-900 mb-4 mt-6 first:mt-0">{children}</h1>
    ),
    h2: ({ children }: any) => (
      <h2 className="text-xl font-bold text-gray-900 mb-3 mt-5 first:mt-0">{children}</h2>
    ),
    h3: ({ children }: any) => (
      <h3 className="text-lg font-semibold text-gray-900 mb-2 mt-4 first:mt-0">{children}</h3>
    ),
    h4: ({ children }: any) => (
      <h4 className="text-base font-semibold text-gray-900 mb-2 mt-3 first:mt-0">{children}</h4>
    ),
    h5: ({ children }: any) => (
      <h5 className="text-sm font-semibold text-gray-900 mb-1 mt-3 first:mt-0">{children}</h5>
    ),
    h6: ({ children }: any) => (
      <h6 className="text-sm font-semibold text-gray-700 mb-1 mt-3 first:mt-0">{children}</h6>
    ),

    p: ({ children }: any) => (
      <div className="mb-4 last:mb-0 leading-relaxed">{children}</div>
    ),

    ul: ({ children }: any) => (
      <ul className="mb-4 last:mb-0 pl-6 space-y-1 list-disc">{children}</ul>
    ),
    ol: ({ children }: any) => (
      <ol className="mb-4 last:mb-0 pl-6 space-y-1 list-decimal">{children}</ol>
    ),
    li: ({ children }: any) => (
      <li className="text-gray-800 leading-relaxed">{children}</li>
    ),

    a: ({ href, children }: any) => (
      <a
        href={href}
        className="text-blue-600 hover:text-blue-800 underline decoration-blue-300 hover:decoration-blue-500 transition-colors"
        target="_blank"
        rel="noopener noreferrer"
      >
        {children}
      </a>
    ),

    code: ({ node, inline, className, children, ...props }: any) => {
      const match = /language-(\w+)/.exec(className || '');
      const language = match ? match[1] : '';
      const codeContent = String(children).replace(/\n$/, '');

      if (!inline) {
        const blockIndex = Math.random();

        return (
          <div className="relative group mb-4">
            <div className="bg-[#FAFAFA] border border-gray-200 rounded-lg overflow-hidden">
              {language && (
                <div className="flex items-center justify-between px-3 py-2 bg-gray-50 border-b border-gray-200">
                  <span className="text-xs font-medium text-gray-600 uppercase tracking-wide">
                    {language}
                  </span>
                  <button
                    onClick={() => handleCopyCode(codeContent, blockIndex)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-gray-200 rounded text-gray-500 hover:text-gray-700"
                    title="Copy code"
                  >
                    {copiedBlocks.has(blockIndex) ? (
                      <FiCheck className="w-4 h-4 text-green-600" />
                    ) : (
                      <FiCopy className="w-4 h-4" />
                    )}
                  </button>
                </div>
              )}
              <pre className="p-3 md:p-4 overflow-x-auto text-xs md:text-sm">
                <code className={className} {...props}>
                  {children}
                </code>
              </pre>
            </div>
          </div>
        );
      }

      return (
        <code
          className="bg-gray-100 border border-gray-200 px-1.5 py-0.5 rounded text-xs font-mono text-gray-800"
          {...props}
        >
          {children}
        </code>
      );
    },

    blockquote: ({ children }: any) => (
      <blockquote className="border-l-4 border-gray-300 pl-4 py-2 my-4 bg-gray-50 rounded-r-md italic text-gray-700">
        {children}
      </blockquote>
    ),

    table: ({ children }: any) => (
      <div className="overflow-x-auto mb-4">
        <table className="min-w-full border border-gray-200 rounded-lg overflow-hidden">
          {children}
        </table>
      </div>
    ),
    thead: ({ children }: any) => (
      <thead className="bg-gray-50">{children}</thead>
    ),
    tbody: ({ children }: any) => (
      <tbody className="divide-y divide-gray-200">{children}</tbody>
    ),
    tr: ({ children }: any) => (
      <tr className="hover:bg-gray-50">{children}</tr>
    ),
    th: ({ children }: any) => (
      <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider border-b border-gray-200">
        {children}
      </th>
    ),
    td: ({ children }: any) => (
      <td className="px-4 py-3 text-sm text-gray-800 border-b border-gray-200">
        {children}
      </td>
    ),

    img: ({ src, alt }: any) => (
      <img
        src={src}
        alt={alt}
        className="max-w-full h-auto rounded-lg shadow-sm border border-gray-200 my-4"
      />
    ),

    hr: () => (
      <hr className="border-gray-300 my-6" />
    ),

    input: ({ type, checked }: any) => {
      if (type === 'checkbox') {
        return (
          <input
            type="checkbox"
            checked={checked}
            readOnly
            className="mr-2 accent-blue-600"
          />
        );
      }
      return <input type={type} />;
    },

    strong: ({ children }: any) => (
      <strong className="font-semibold text-gray-900">{children}</strong>
    ),
    em: ({ children }: any) => (
      <em className="italic text-gray-800">{children}</em>
    ),

    del: ({ children }: any) => (
      <del className="line-through text-gray-500">{children}</del>
    ),
  };

  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      rehypePlugins={[rehypeHighlight, rehypeRaw]}
      components={components}
    >
      {content}
    </ReactMarkdown>
  );
};

export default MarkdownRenderer;
