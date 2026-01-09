"use client"
import React, { useState, useRef, useEffect } from 'react';
import { FiSidebar, FiShare, FiInfo, FiArrowDown } from 'react-icons/fi';
import Sidebar from './components/Sidebar';
import Message from './components/Message';
import InputComponent from './components/InputComponent';

const AIChatInterface = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  const chatAreaRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const checkScreenSize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (mobile) {
        setIsSidebarOpen(false);
      } else {
        setIsSidebarOpen(true);
      }
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  useEffect(() => {
    const chatArea = chatAreaRef.current;
    if (!chatArea) return;

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = chatArea;
      const isNearBottom = scrollHeight - scrollTop - clientHeight < 100;
      setShowScrollButton(!isNearBottom);
    };

    chatArea.addEventListener('scroll', handleScroll);
    return () => chatArea.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToBottom = () => {
    chatAreaRef.current?.scrollTo({ top: chatAreaRef.current.scrollHeight, behavior: 'smooth' });
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadedFile(null);
    setUploadProgress(0);

    let progress = 0;
    const interval = setInterval(() => {
      progress += 10;
      if (progress >= 100) {
        clearInterval(interval);
        setUploadProgress(100);
        setUploadedFile(file);
      } else {
        setUploadProgress(progress);
      }
    }, 100);
  };

  const removeFile = () => {
    setUploadedFile(null);
    setUploadProgress(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="flex h-screen w-full bg-white text-gray-800 font-sans antialiased overflow-hidden selection:bg-gray-100 relative">

      {isMobile && isSidebarOpen && (
        <div 
          onClick={() => setIsSidebarOpen(false)}
          className="fixed inset-0 bg-black/50 z-40 transition-opacity duration-300 backdrop-blur-sm"
        />
      )}

      <Sidebar
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
        isMobile={isMobile}
      />

      <main className="flex-1 flex flex-col min-w-0 bg-white relative z-0">

        <header className="h-14 border-b border-gray-100 flex items-center justify-between px-4 md:px-6 flex-shrink-0">
          <div className="flex items-center gap-3 overflow-hidden">
            {(!isSidebarOpen || isMobile) && (
              <button 
                onClick={() => setIsSidebarOpen(true)}
                className={`p-2 text-gray-400 hover:text-gray-600 rounded-md hover:bg-gray-100 transition-colors ${isMobile && isSidebarOpen ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
              >
                <FiSidebar className="w-5 h-5" />
              </button>
            )}
            <h1 className="text-base md:text-lg font-semibold text-gray-800 truncate">ZHSF AI Chatbot</h1>
          </div>
          <div className="flex items-center gap-3 md:gap-4 text-gray-400 flex-shrink-0">
            <FiShare className="w-5 h-5 hover:text-gray-600 cursor-pointer" />
            <FiInfo className="w-5 h-5 hover:text-gray-600 cursor-pointer" />
          </div>
        </header>

        <div ref={chatAreaRef} className="flex-1 overflow-y-auto p-4 md:p-8 scrollbar-thin scrollbar-thumb-gray-200">
          <div className="max-w-3xl mx-auto space-y-6 md:space-y-8 pb-4">

            <Message
              type="ai"
              content={`Here is a breakdown of how you might structure the React Sidebar component to handle state persistence and animations.

## Features Supported

- **Bold text** and *italic text*
- \`inline code\` examples
- Code blocks with syntax highlighting:

\`\`\`javascript
const SidebarContext = createContext();
const useSidebar = () => useContext(SidebarContext);
\`\`\`

### Lists
- Ordered lists
- Unordered lists
- Nested lists

### Tables
| Feature | Status |
|---------|--------|
| Bold | ✅ |
| Italic | ✅ |
| Code | ✅ |

> This is a blockquote with **markdown** support.

Horizontal rule below:

---

[Link example](https://example.com)`}
              onCopy={() => handleCopy("Code example...")}
            />

            <Message
              type="user"
              content="That looks good. How do I make sure it remembers the state when I refresh the page?"
            />

            <Message
              type="ai"
              content="To persist the state, you can use `localStorage` inside a `useEffect` hook within your provider."
            />
          </div>
        </div>

        <button
          onClick={scrollToBottom}
          className={`fixed bottom-32 right-4 md:right-8 w-10 h-10 bg-white border border-gray-200 rounded-full shadow-lg flex items-center justify-center hover:bg-gray-50 transition-all ${
            showScrollButton ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
          }`}
        >
          <FiArrowDown className="w-5 h-5 text-gray-600" />
        </button>

        <InputComponent
          uploadProgress={uploadProgress}
          uploadedFile={uploadedFile}
          handleFileSelect={handleFileSelect}
          removeFile={removeFile}
          fileInputRef={fileInputRef}
        />

      </main>
    </div>
  );
};

export default AIChatInterface;
