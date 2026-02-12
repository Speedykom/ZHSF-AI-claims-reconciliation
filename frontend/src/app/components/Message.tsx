import React from 'react';
import { FiCopy, FiUser, FiPaperclip } from 'react-icons/fi';
import { BsRobot } from 'react-icons/bs';
import MarkdownRenderer from './MarkdownRenderer';
import { Streamdown } from 'streamdown';

interface MessageProps {
  type: 'ai' | 'user';
  content: string;
  onCopy?: () => void;
  isStreaming?: boolean;
  isMcpMode?: boolean;
  attachment_name?: string;
}

const Message: React.FC<MessageProps> = ({ type, content, onCopy, isStreaming = false, isMcpMode = false, attachment_name }) => {
  if (type === 'ai') {
    return (
      <div className="flex gap-4 group">
        <div className="flex-1 space-y-4 min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-sm text-gray-900">Daktari Hakiki</span>
            {onCopy && (
              <button
                onClick={onCopy}
                className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-gray-100 rounded"
              >
                <FiCopy className="w-4 h-4 text-gray-400 hover:text-gray-600" />
              </button>
            )}
          </div>
          <div className="leading-relaxed text-[15px] break-words text-gray-800">
            {isStreaming ? (
              <Streamdown>{content}</Streamdown>
            ) : (
              <MarkdownRenderer content={content} />
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex gap-4 flex-row-reverse group">
      <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0 mt-1">
        <FiUser className="text-gray-500 text-base" />
      </div>

      <div className="flex flex-col items-end max-w-[85%] md:max-w-[80%] relative">
        {onCopy && (
          <button
            onClick={onCopy}
            className="absolute -top-2 -left-8 opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-gray-100 rounded"
          >
            <FiCopy className="w-4 h-4 text-gray-400 hover:text-gray-600" />
          </button>
        )}
        <div className="px-4 py-3 rounded-2xl rounded-tr-sm text-[15px] leading-relaxed bg-[#F3F4F6] text-gray-800">
          <MarkdownRenderer content={content} />
        </div>
        {attachment_name && attachment_name.trim() !== '' && (
          <div className="flex items-center gap-2 mt-2 px-4 py-2 rounded-lg bg-gray-100 border border-gray-200 text-sm text-gray-700">
            <FiPaperclip className="w-4 h-4 text-gray-500 flex-shrink-0" />
            <span className="truncate">{attachment_name}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default Message;
