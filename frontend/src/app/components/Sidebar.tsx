import React, { useState, useEffect } from 'react';
import {
  FiSidebar, FiPlus, FiSearch, FiMessageSquare,
  FiSettings, FiInbox
} from 'react-icons/fi';
import { BsPinAngleFill, BsRobot } from 'react-icons/bs';
import Image from 'next/image';
import { Thread } from '../types';

interface SidebarProps {
  isSidebarOpen: boolean;
  setIsSidebarOpen: (open: boolean) => void;
  isMobile: boolean;
  selectedThreadId: string | null;
  refreshTrigger: number;
  onThreadSelect: (threadId: string) => void;
  onNewChat: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isSidebarOpen, setIsSidebarOpen, isMobile, selectedThreadId, refreshTrigger, onThreadSelect, onNewChat }) => {
  const [threads, setThreads] = useState<Thread[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchLoading, setSearchLoading] = useState(false);

  useEffect(() => {
    const fetchThreads = async () => {
      try {
        const response = await fetch('/api/threads');
        if (response.ok) {
          const data = await response.json();
          const threadsArray = Array.isArray(data) ? data : [data];
          setThreads(threadsArray);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchThreads();
  }, [refreshTrigger]);

  useEffect(() => {
    if (searchQuery) {
      setSearchLoading(true);
      const timer = setTimeout(() => {
        setSearchLoading(false);
      }, 1500);
      return () => clearTimeout(timer);
    } else {
      setSearchLoading(false);
    }
  }, [searchQuery]);

  const filteredThreads = threads.filter(thread =>
    thread.title.toLowerCase().includes(searchQuery.toLowerCase())
  );
  return (
    <aside
      className={`
        fixed md:relative z-50 h-full bg-[#F9F9FA] flex flex-col border-r border-gray-200
        transition-all duration-300 ease-in-out
        ${isSidebarOpen ? 'translate-x-0 w-[260px]' : '-translate-x-full md:translate-x-0 md:w-0'}
        flex-shrink-0 overflow-hidden
      `}
    >

      <div className="p-3 flex items-center justify-between mt-1 min-w-[260px]">
        <div className="flex items-center gap-3 px-2">
          <div className="w-14 h-14 rounded-lg flex items-center justify-center flex-shrink-0">
            <Image src="/smz.png" alt="Logo" width={56} height={56} className="object-contain" />
          </div>
          <div className="flex flex-col gap-0.5">
            <span className="text-xs font-bold text-gray-900 leading-none">ZANZIBAR HEALTH</span>
            <span className="text-xs font-bold text-gray-900 leading-none">SERVICES FUND</span>
          </div>
        </div>
        <button
          onClick={() => setIsSidebarOpen(false)}
          className="p-2 text-gray-400 hover:text-gray-600 rounded-md hover:bg-gray-200 transition-colors flex-shrink-0"
        >
          <FiSidebar className="w-5 h-5" />
        </button>
      </div>

      <div className="flex flex-col flex-1 w-[260px] overflow-hidden">

        <div className="px-3 py-2">
          <button
            onClick={onNewChat}
            className="w-full flex items-center gap-2 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 px-3 py-2.5 rounded-lg shadow-sm transition-all text-sm font-medium"
          >
            <FiPlus className="w-4 h-4 text-gray-400" />
            New Chat
          </button>
        </div>

        <div className="px-3 pb-2">
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search history..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#EDEDF0] text-sm py-2 pl-9 pr-8 rounded-lg outline-none focus:ring-1 focus:ring-gray-300 placeholder-gray-500"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-3 py-2 space-y-6 scrollbar-hide">

          <div>
            <h3 className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2 px-2">Chat History</h3>

            {loading || searchLoading ? (
              <>
                <div className="flex items-center gap-3 px-2 py-2 mb-1">
                  <div className="w-4 h-4 bg-gray-200 rounded animate-pulse flex-shrink-0"></div>
                  <div className="flex-1 h-4 bg-gray-200 rounded animate-pulse"></div>
                </div>
                <div className="flex items-center gap-3 px-2 py-2 mb-1">
                  <div className="w-4 h-4 bg-gray-200 rounded animate-pulse flex-shrink-0"></div>
                  <div className="flex-1 h-4 bg-gray-200 rounded animate-pulse"></div>
                </div>
                <div className="flex items-center gap-3 px-2 py-2">
                  <div className="w-4 h-4 bg-gray-200 rounded animate-pulse flex-shrink-0"></div>
                  <div className="flex-1 h-4 bg-gray-200 rounded animate-pulse"></div>
                </div>
              </>
            ) : (
              <>
                {filteredThreads.length > 0 ? (
                  filteredThreads.map((thread) => (
                    <div
                      key={thread.thread_id}
                      onClick={() => onThreadSelect(thread.thread_id)}
                      className={`flex items-center gap-3 px-2 py-2 rounded-lg cursor-pointer text-sm mb-1 transition-colors ${
                        selectedThreadId === thread.thread_id
                          ? 'bg-white shadow-sm border border-gray-100 text-gray-900 font-medium'
                          : 'hover:bg-[#EDEDF0] text-gray-600'
                      }`}
                    >
                      <FiMessageSquare
                        className={`w-4 h-4 flex-shrink-0 ${
                          selectedThreadId === thread.thread_id ? 'text-blue-500' : 'text-gray-400'
                        }`}
                      />
                      <span className="truncate flex-1">{thread.title}</span>
                    </div>
                  ))
                ) : searchQuery ? (
                  <div className="flex items-center gap-3 px-2 py-4 text-gray-500 text-sm">
                    <FiInbox className="w-4 h-4 flex-shrink-0" />
                    <span>No chats found</span>
                  </div>
                ) : null}
              </>
            )}
          </div>

        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
