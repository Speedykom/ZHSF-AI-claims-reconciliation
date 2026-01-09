import React from 'react';
import {
  FiSidebar, FiPlus, FiSearch, FiMessageSquare,
  FiSettings
} from 'react-icons/fi';
import { BsPinAngleFill, BsRobot } from 'react-icons/bs';
import Image from 'next/image';

interface SidebarProps {
  isSidebarOpen: boolean;
  setIsSidebarOpen: (open: boolean) => void;
  isMobile: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ isSidebarOpen, setIsSidebarOpen, isMobile }) => {
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
          <button className="w-full flex items-center gap-2 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 px-3 py-2.5 rounded-lg shadow-sm transition-all text-sm font-medium">
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
              className="w-full bg-[#EDEDF0] text-sm py-2 pl-9 pr-8 rounded-lg outline-none focus:ring-1 focus:ring-gray-300 placeholder-gray-500"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-3 py-2 space-y-6 scrollbar-hide">

          <div>
            <h3 className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2 px-2">Pinned</h3>
            <div className="group flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-[#EDEDF0] cursor-pointer text-sm text-gray-700">
              <BsPinAngleFill className="w-4 h-4 text-orange-400 flex-shrink-0" />
              <span className="truncate">Project Delta Plan</span>
            </div>
          </div>

          <div>
            <h3 className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2 px-2">Chat History</h3>

            <div className="relative flex items-center gap-3 px-2 py-2 rounded-lg bg-white shadow-sm border border-gray-100 cursor-pointer text-sm text-gray-900 group mb-1">
              <FiMessageSquare className="w-4 h-4 text-blue-500 flex-shrink-0" />
              <span className="truncate flex-1 font-medium">test converstation</span>
            </div>

            <div className="flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-[#EDEDF0] cursor-pointer text-sm text-gray-600">
              <FiMessageSquare className="w-4 h-4 text-gray-400 flex-shrink-0" />
              <span className="truncate">test second conversation</span>
            </div>
          </div>

        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
