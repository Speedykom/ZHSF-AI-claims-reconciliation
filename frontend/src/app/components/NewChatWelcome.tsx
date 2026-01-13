import React, { useEffect, useState } from 'react';

const NewChatWelcome: React.FC = () => {
  const [visibleLines, setVisibleLines] = useState<number[]>([]);

  useEffect(() => {
    const lines = [0, 1, 2, 3, 4, 5];
    lines.forEach((lineIndex, index) => {
      setTimeout(() => {
        setVisibleLines(prev => [...prev, lineIndex]);
      }, index * 300);
    });
  }, []);

  const lines = [
    "Automated claims reconciliation and healthcare intelligence powered by AI",
    "Extract structured, searchable data from handwritten and scanned claim documents using advanced OCR",
    "Validate and reconcile claims using a configurable rules engine and policy logic",
    "Apply context-aware AI with RAG, MCP, and agentic workflows for accurate decisions",
    "Attach files or start a conversation to analyze, validate, and optimize claims"
  ];

  return (
    <div className="flex items-center justify-start h-full">
      <div className="text-left max-w-2xl ml-8 md:ml-16">
        {lines.map((line, index) => (
          <div
            key={index}
            className={`transition-all duration-700 ease-out mb-4 ${
              visibleLines.includes(index)
                ? 'opacity-100 translate-x-0'
                : 'opacity-0 -translate-x-4'
            }`}
            style={{
              transitionDelay: `${index * 150}ms`
            }}
          >
            <p className={`leading-relaxed tracking-wide ${
              index === 0
                ? 'text-black text-base md:text-lg'
                : 'text-gray-700 text-sm md:text-base font-light'
            }`}>
              {line}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NewChatWelcome;
