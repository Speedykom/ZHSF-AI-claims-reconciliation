"use client"
import React, { useState, useRef, useEffect } from 'react';
import { FiSidebar, FiShare, FiInfo, FiArrowDown } from 'react-icons/fi';
import Sidebar from './components/Sidebar';
import Message from './components/Message';
import InputComponent from './components/InputComponent';
import NewChatWelcome from './components/NewChatWelcome';
import { Message as MessageType } from './types';

const AIChatInterface = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [selectedThreadId, setSelectedThreadId] = useState<string | null>(null);
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [isNewChatMode, setIsNewChatMode] = useState(false);

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

  useEffect(() => {
    const fetchMessages = async () => {
      if (!selectedThreadId) {
        setMessages([]);
        return;
      }

      setLoadingMessages(true);
      try {
        const response = await fetch(`/api/messages?thread_id=${encodeURIComponent(selectedThreadId)}`);
        if (response.ok) {
          const data = await response.json();
          setMessages(data);
        } else {
          setMessages([]);
        }
      } catch (error) {
        setMessages([]);
      } finally {
        setLoadingMessages(false);
      }
    };

    fetchMessages();
  }, [selectedThreadId]);

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
        selectedThreadId={selectedThreadId}
        onThreadSelect={(threadId) => {
          setSelectedThreadId(threadId);
          setIsNewChatMode(false);
        }}
        onNewChat={() => {
          setSelectedThreadId(null);
          setIsNewChatMode(true);
        }}
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
            {isNewChatMode ? (
              <NewChatWelcome />
            ) : !selectedThreadId ? (
              <div className="flex items-center justify-center h-full text-gray-500">
                <div className="text-center">
                  <p className="text-lg mb-2">Select a conversation from the sidebar</p>
                  <p className="text-sm">Choose a thread to view messages</p>
                </div>
              </div>
            ) : loadingMessages ? (
              <>
                <div className="flex gap-4 group">
                  <div className="flex-1 space-y-4 min-w-0">
                    <div className="flex items-center gap-2">
                      <div className="h-4 bg-gray-200 rounded animate-pulse w-20"></div>
                    </div>
                    <div className="space-y-2">
                      <div className="h-4 bg-gray-200 rounded animate-pulse w-full"></div>
                      <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4"></div>
                      <div className="h-4 bg-gray-200 rounded animate-pulse w-1/2"></div>
                    </div>
                  </div>
                </div>
                <div className="flex gap-4 flex-row-reverse group">
                  <div className="w-8 h-8 rounded-full bg-gray-200 animate-pulse flex-shrink-0 mt-1"></div>
                  <div className="flex flex-col items-end max-w-[85%] md:max-w-[80%]">
                    <div className="bg-gray-200 text-gray-800 px-4 py-3 rounded-2xl rounded-tr-sm animate-pulse">
                      <div className="h-4 bg-gray-300 rounded w-32"></div>
                    </div>
                  </div>
                </div>
                <div className="flex gap-4 group">
                  <div className="flex-1 space-y-4 min-w-0">
                    <div className="flex items-center gap-2">
                      <div className="h-4 bg-gray-200 rounded animate-pulse w-20"></div>
                    </div>
                    <div className="space-y-2">
                      <div className="h-4 bg-gray-200 rounded animate-pulse w-full"></div>
                      <div className="h-4 bg-gray-200 rounded animate-pulse w-2/3"></div>
                    </div>
                  </div>
                </div>
              </>
            ) : messages.length === 0 ? (
              <div className="flex items-center justify-center h-full text-gray-500">
                <div className="text-center">
                  <p className="text-lg mb-2">No messages yet</p>
                  <p className="text-sm">Start a conversation to see messages here</p>
                </div>
              </div>
            ) : (
              messages.map((message, index) => (
                <Message
                  key={index}
                  type={message.role === 'assistant' ? 'ai' : 'user'}
                  content={message.content}
                  onCopy={() => handleCopy(message.content)}
                />
              ))
            )}
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
