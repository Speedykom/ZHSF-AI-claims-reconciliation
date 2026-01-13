import React, { RefObject } from 'react';
import { FiArrowUp, FiPaperclip, FiX } from 'react-icons/fi';
import { Tooltip } from 'react-tooltip';
import McpIcon from '../../../public/mcp-icon.svg';

interface InputComponentProps {
  messageText: string;
  setMessageText: (text: string) => void;
  onSend: () => void;
  isSending: boolean;
  uploadProgress: number | null;
  uploadedFile: File | null;
  handleFileSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
  removeFile: () => void;
  fileInputRef: RefObject<HTMLInputElement | null>;
  isMcpMode: boolean;
  setIsMcpMode: (isMcpMode: boolean) => void;
}

const InputComponent: React.FC<InputComponentProps> = ({
  messageText,
  setMessageText,
  onSend,
  isSending,
  uploadProgress,
  uploadedFile,
  handleFileSelect,
  removeFile,
  fileInputRef,
  isMcpMode,
  setIsMcpMode
}) => {
  return (
    <div className="p-3 md:p-4 pb-4 md:pb-6">
      <div className="max-w-3xl mx-auto">
      {isSending && uploadedFile ? (
          <div className="mb-3 bg-gray-50 border border-gray-200 rounded-lg p-3 flex items-center justify-center">
            <span className="text-sm text-gray-400 italic animate-pulse">
              We're analyzing your file; it usually takes a minute or so ...
            </span>
          </div>
        ) : (uploadProgress !== null || uploadedFile) && (
          <div className="mb-3 bg-gray-50 border border-gray-200 rounded-lg p-3 flex items-center gap-3">
            <FiPaperclip className="w-4 h-4 text-gray-500" />
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm text-gray-700 truncate">{uploadedFile?.name || 'Uploading...'}</span>
                <button onClick={removeFile} className="p-1 hover:bg-gray-200 rounded">
                  <FiX className="w-4 h-4 text-gray-500" />
                </button>
              </div>
              {uploadProgress !== null && uploadProgress < 100 && (
                <div className="w-full bg-gray-200 rounded-full h-1.5">
                  <div
                    className="bg-blue-500 h-1.5 rounded-full transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                </div>
              )}
            </div>
          </div>
        )}

        <div className="relative group">
          <input
            ref={fileInputRef}
            type="file"
            onChange={handleFileSelect}
            className="hidden"
          />
          <div className="absolute left-3 md:left-3 top-1/2 -translate-y-1/2">
            {isMcpMode ? (
              <button
                onClick={() => setIsMcpMode(!isMcpMode)}
                className="w-8 h-8 md:w-6 md:h-6 rounded-full bg-yellow-200 text-yellow-800 flex items-center justify-center cursor-pointer transition-colors"
                data-tooltip-id="mcp-tooltip"
                data-tooltip-content="Enable chat interaction with MCP tools for AI reconciliation (disables rules engine, OCR operations, and file attachment)"
              >
                <img src="/mcp-icon.svg" alt="MCP" className="w-5 h-5 md:w-4 md:h-4" />
              </button>
            ) : (
              <div className="flex items-center gap-1 md:gap-2">
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="w-8 h-8 md:w-6 md:h-6 rounded-full bg-transparent md:bg-gray-200 text-gray-500 hover:text-gray-700 flex items-center justify-center cursor-pointer hover:bg-gray-100 md:hover:bg-gray-300 transition-colors"
                  data-tooltip-id="file-attachment-tooltip"
                  data-tooltip-content="Upload claim documents and images currently supported"
                >
                  <FiPaperclip className="w-5 h-5 md:w-4 md:h-4" />
                </button>
                <button
                  onClick={() => setIsMcpMode(!isMcpMode)}
                  className="w-8 h-8 md:w-6 md:h-6 rounded-full bg-transparent md:bg-gray-200 text-gray-500 hover:text-gray-700 flex items-center justify-center cursor-pointer hover:bg-gray-100 md:hover:bg-gray-300 transition-colors"
                  data-tooltip-id="mcp-tooltip"
                  data-tooltip-content="Enable chat interaction with MCP tools for AI reconciliation (disables rules engine, OCR operations, and file attachment)"
                >
                  <img src="/mcp-icon.svg" alt="MCP" className="w-5 h-5 md:w-4 md:h-4" />
                </button>
              </div>
            )}
          </div>

          <input
            type="text"
            placeholder="Message AI..."
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                onSend();
              }
            }}
            disabled={isSending}
            className={`w-full bg-white border border-gray-200 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] text-gray-700 rounded-2xl py-3 md:py-3.5 pr-12 outline-none focus:border-gray-300 focus:ring-0 text-sm md:text-[15px] placeholder-gray-400 disabled:opacity-50 disabled:cursor-not-allowed ${
              isMcpMode ? 'pl-12 md:pl-12' : 'pl-20 md:pl-20'
            }`}
          />

          <div className="absolute right-2 md:right-3 top-1/2 -translate-y-1/2">
            <button
              onClick={onSend}
              disabled={isSending || (!messageText.trim() && !uploadedFile)}
              className="w-8 h-8 rounded-lg bg-black hover:bg-gray-800 flex items-center justify-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FiArrowUp className="text-white w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="text-center mt-3">
          <p className="text-[10px] md:text-[11px] text-gray-400">AI can make mistakes. Please verify important information.</p>
        </div>
        <Tooltip id="file-attachment-tooltip" />
        <Tooltip id="mcp-tooltip" />
      </div>
    </div>
  );
};

export default InputComponent;
