"use client"
import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiSidebar, FiShare, FiInfo, FiArrowDown, FiAlertTriangle } from 'react-icons/fi';
import Sidebar from './components/Sidebar';
import Message from './components/Message';
import InputComponent from './components/InputComponent';
import NewChatWelcome from './components/NewChatWelcome';
import { Message as MessageType } from './types';
import { useAuth } from '../context/AuthContext';

const AIChatInterface = () => {
  const { keycloak, user } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [showWelcome, setShowWelcome] = useState(false);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [selectedThreadId, setSelectedThreadId] = useState<string | null>(null);
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [isNewChatMode, setIsNewChatMode] = useState(false);
  const [messageText, setMessageText] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [refreshThreadsTrigger, setRefreshThreadsTrigger] = useState(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [streamingMessageIndex, setStreamingMessageIndex] = useState<number | null>(null);
  const [isMcpMode, setIsMcpMode] = useState(false);

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
    if (user && !selectedThreadId && !isNewChatMode) {
      setShowWelcome(true);
      const timer = setTimeout(() => {
        setShowWelcome(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [user, selectedThreadId, isNewChatMode]);

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
        const headers: HeadersInit = {};
        if (keycloak.token) {
          headers['Authorization'] = `Bearer ${keycloak.token}`;
        }
        const response = await fetch(`/api/messages?thread_id=${encodeURIComponent(selectedThreadId)}`, { headers });
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

  const sendMessage = async () => {
    if (!messageText.trim() && !uploadedFile) return;

    setIsSending(true);
    try {
      const formData = new FormData();
      formData.append('message', messageText);
      if (selectedThreadId) {
        formData.append('thread_id', selectedThreadId);
      }
      if (isMcpMode) {
        formData.append('mcp_is_on', 'true');
      }
      if (uploadedFile) {
        formData.append('file', uploadedFile);
        formData.append('attachmentName', uploadedFile.name);
      }

      const headers: HeadersInit = {};
      if (keycloak.token) {
        headers['Authorization'] = `Bearer ${keycloak.token}`;
      }
      const response = await fetch('/api/webhook', {
        method: 'POST',
        headers,
        body: formData,
      });

      if (response.ok) {
        const result = await response.json();
        const newThreadId = result.thread_id;

        if (isNewChatMode && newThreadId) {
          setSelectedThreadId(newThreadId);
          setIsNewChatMode(false);
          setRefreshThreadsTrigger(prev => prev + 1);
        }

        setMessageText('');
        setUploadedFile(null);
        setUploadProgress(null);
        if (fileInputRef.current) fileInputRef.current.value = '';

        setErrorMessage(null);

        if (selectedThreadId || newThreadId) {
          const threadIdToFetch = selectedThreadId || newThreadId;
          const messagesResponse = await fetch(`/api/messages?thread_id=${encodeURIComponent(threadIdToFetch)}`);
          if (messagesResponse.ok) {
            const data = await messagesResponse.json();
            setMessages(data);

            const latestAssistantIndex = data.findLastIndex((msg: MessageType) => msg.role === 'assistant');
            if (latestAssistantIndex !== -1) {
              setStreamingMessageIndex(latestAssistantIndex);
              const streamingDuration = Math.max(1000, data[latestAssistantIndex].content.length * 20);
              setTimeout(() => {
                setStreamingMessageIndex(null);
              }, streamingDuration);
            }

            setTimeout(scrollToBottom, 100);
          }
        }
      } else {
        const errorText = await response.text();
        setErrorMessage(`Failed to send message: ${errorText || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setIsSending(false);
    }
  };

  const refreshThreadsWithRetry = async (retries = 3) => {
    for (let i = 0; i < retries; i++) {
      try {
        const headers: HeadersInit = {};
        if (keycloak.token) {
          headers['Authorization'] = `Bearer ${keycloak.token}`;
        }
        const response = await fetch('/api/threads', { headers });
        if (response.ok) {
          const data = await response.json();
          const threadsArray = Array.isArray(data) ? data : [data];
          const hasNewThread = threadsArray.some((thread: { thread_id: string }) => thread.thread_id === selectedThreadId);
          if (hasNewThread || i === retries - 1) {
            setRefreshThreadsTrigger(prev => prev + 1);
            break;
          }
        }
      } catch (error) {
        console.error('Error refreshing threads:', error);
      }
      if (i < retries - 1) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }
  };

  const fetchMessagesWithRetry = async (threadId: string, retries = 5) => {
    for (let i = 0; i < retries; i++) {
      try {
        const headers: HeadersInit = {};
        if (keycloak.token) {
          headers['Authorization'] = `Bearer ${keycloak.token}`;
        }
        const messagesResponse = await fetch(`/api/messages?thread_id=${encodeURIComponent(threadId)}`, { headers });
        if (messagesResponse.ok) {
          const data = await messagesResponse.json();
          if (data && data.length > 0) {
            setMessages(data);
            setTimeout(scrollToBottom, 100);
            break;
          }
        }
      } catch (error) {
        console.error('Error fetching messages:', error);
      }
      if (i < retries - 1) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }
  };

  const handleLogout = () => {
    keycloak.logout({ redirectUri: window.location.origin });
  };

  return (
    <>
      {showWelcome && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 flex items-center justify-center">
          <motion.div
            className="bg-white rounded-lg shadow-xl p-6 max-w-md mx-4 text-center"
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              Welcome {user?.name ? `, ${user.name}` : ''}!
            </h2>
            <p className="text-gray-600 mb-4">
              Ready to continue your conversation? Choose a thread or start a new chat.
            </p>
            <div className="flex justify-center space-x-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
            </div>
          </motion.div>
        </div>
      )}

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
        refreshTrigger={refreshThreadsTrigger}
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

        <header className="border-b border-gray-100 flex items-center justify-between px-4 md:px-6 flex-shrink-0 min-h-14">
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
          
          <div className="flex items-center gap-3">
            {user && (
              <div className="flex items-center gap-2">
                <div className="hidden md:flex flex-col items-end leading-tight">
                  <span className="text-sm font-medium text-gray-800 truncate max-w-xs">
                    {user.name || user.preferred_username || user.email || 'User'}
                  </span>
                  <span className="text-xs text-gray-500 truncate max-w-xs">
                    {user.email || 'User Account'}
                  </span>
                </div>
                <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white text-xs font-semibold">
                  {user.name 
                    ? user.name.charAt(0).toUpperCase() 
                    : user.preferred_username 
                      ? user.preferred_username.charAt(0).toUpperCase()
                      : user.email
                        ? user.email.charAt(0).toUpperCase()
                        : '?'}
                </div>
                
                <button
                  onClick={handleLogout}
                  className="ml-2 px-3 py-1.5 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-50 rounded-md transition-colors flex items-center gap-1.5"
                  title="Sign out"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                    <polyline points="16 17 21 12 16 7"/>
                    <line x1="21" x2="9" y1="12" y2="12"/>
                  </svg>
                  <span className="hidden sm:inline">Sign out</span>
                </button>
              </div>
            )}
            {isMcpMode && (
              <div className="flex items-center gap-2 px-3 py-2 bg-blue-50 border border-blue-200 rounded-lg text-blue-800 text-sm">
                <img src="/mcp-icon.svg" alt="MCP" className="w-4 h-4 flex-shrink-0" />
                <span className="hidden md:inline">Using MCP server with AI reconciliation tools; File attachment, RAG, OCR, and rules engine {" "} <span className="text-red-700 font-bold">are disabled.</span></span>
                <span className="md:hidden">MCP: AI tools active</span>
              </div>
            )}
          </div>
        </header>

        <div ref={chatAreaRef} className={`flex-1 overflow-y-auto p-4 md:p-8 scrollbar-thin scrollbar-thumb-gray-200 ${isMcpMode ? 'bg-yellow-100' : ''} transition-colors duration-500 ease-in-out`}>
          <div className="max-w-3xl mx-auto space-y-6 md:space-y-8 pb-4">
            {isNewChatMode ? (
              <NewChatWelcome />
            ) : !selectedThreadId ? (
              <div className="flex items-center justify-center min-h-[calc(100vh-12rem)] text-gray-500">
                <div className="text-center">
                  <p className="text-lg mb-2">Choose a thread to view messages</p>
                  <p className="text-sm text-gray-400">Or press "New Chat" to start a conversation</p>
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
                  isMcpMode={isMcpMode}
                  attachment_name={message.attachment_name}
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

        {errorMessage && (
          <div className="p-3 md:p-4 bg-red-50 border border-red-200 rounded-lg mx-4 md:mx-8 mb-2">
            <p className="text-red-800 text-sm">{errorMessage}</p>
          </div>
        )}

        {(selectedThreadId || isNewChatMode) && (
          <div className={`${isMcpMode ? 'bg-yellow-100' : ''} transition-colors duration-500 ease-in-out`}>
            <InputComponent
              messageText={messageText}
              setMessageText={setMessageText}
              onSend={sendMessage}
              isSending={isSending}
              uploadProgress={uploadProgress}
              uploadedFile={uploadedFile}
              handleFileSelect={handleFileSelect}
              removeFile={removeFile}
              fileInputRef={fileInputRef}
              isMcpMode={isMcpMode}
              setIsMcpMode={setIsMcpMode}
            />
          </div>
        )}

      </main>
    </div>
    </>
  );
};

export default AIChatInterface;