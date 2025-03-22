"use client";

import { useState } from "react";
import { Search, SlidersHorizontal, ChevronDown } from "lucide-react";

export function ProjectsHeader() {
  const [sortOption, setSortOption] = useState("newest");
  const [filterOpen, setFilterOpen] = useState(false);

  return (
    <div className="mb-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <h1 className="text-3xl font-bold mb-4 sm:mb-0">Projects</h1>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:flex-initial">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input 
              type="text" 
              placeholder="Search projects..." 
              className="pl-10 pr-4 py-2 border rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <button 
            onClick={() => setFilterOpen(!filterOpen)}
            className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-gray-50 transition-colors"
          >
            <SlidersHorizontal className="h-4 w-4" />
            <span>Filter</span>
          </button>
          <div className="relative">
            <button 
              className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-gray-50 transition-colors"
            >
              <span>Sort: {sortOption.charAt(0).toUpperCase() + sortOption.slice(1)}</span>
              <ChevronDown className="h-4 w-4" />
            </button>
            {/* Sort dropdown would go here */}
          </div>
        </div>
      </div>
      
      {filterOpen && (
        <div className="bg-white p-4 rounded-lg shadow-md mb-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 animate-fadeIn">
          <div>
            <label className="block text-sm font-medium mb-1">Status</label>
            <select className="w-full p-2 border rounded-lg">
              <option value="all">All Statuses</option>
              <option value="active">Active</option>
              <option value="completed">Completed</option>
              <option value="archived">Archived</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Date Range</label>
            <select className="w-full p-2 border rounded-lg">
              <option value="all">All Time</option>
              <option value="week">Past Week</option>
              <option value="month">Past Month</option>
              <option value="year">Past Year</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Progress</label>
            <select className="w-full p-2 border rounded-lg">
              <option value="all">All Progress</option>
              <option value="not-started">Not Started</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
          </div>
        </div>
      )}
    </div>
  );
} 