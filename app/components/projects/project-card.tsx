"use client";

import { Calendar, MoreVertical } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";

interface ProjectCardProps {
  project: {
    id: string;
    name: string;
    created_at: string;
    status: string;
    progress: number;
  };
}

export function ProjectCard({ project }: ProjectCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const router = useRouter();
  
  // Format date
  const formattedDate = new Date(project.created_at).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
  
  // Determine status color
  const statusColor = {
    active: "bg-green-100 text-green-800",
    completed: "bg-blue-100 text-blue-800",
    archived: "bg-gray-100 text-gray-800",
  }[project.status] || "bg-gray-100 text-gray-800";

  const openProject = () => {
    router.push(`/projects/${project.id}`);
  };

  return (
    <div 
      className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-md hover:translate-y-[-2px]"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setShowMenu(false);
      }}
    >
      <div className="p-5">
        <div className="flex justify-between items-start mb-3">
          <h3 className="font-semibold text-lg line-clamp-2">{project.name}</h3>
          <div className="relative">
            <button 
              className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100 transition-colors"
              onClick={() => setShowMenu(!showMenu)}
            >
              <MoreVertical size={18} />
            </button>
            
            {showMenu && (
              <div className="absolute right-0 mt-1 w-48 bg-white rounded-md shadow-lg z-10 border border-gray-100">
                <ul className="py-1">
                  <li>
                    <button 
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={openProject}
                    >
                      View Details
                    </button>
                  </li>
                  <li>
                    <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      Edit Project
                    </button>
                  </li>
                  <li>
                    <button className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100">
                      Archive Project
                    </button>
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>
        
        <div className="flex items-center text-sm text-gray-500 mb-4">
          <Calendar size={14} className="mr-1" />
          <span>Created {formattedDate}</span>
        </div>
        
        <div className="flex justify-between items-center mb-3">
          <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${statusColor}`}>
            {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
          </span>
          <span className="text-sm font-medium">{project.progress}% Complete</span>
        </div>
        
        <div className="w-full bg-gray-200 rounded-full h-2 mb-1">
          <div 
            className="bg-blue-500 h-2 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${project.progress}%` }}
          ></div>
        </div>
      </div>
      
      <div 
        className={`border-t border-gray-100 p-3 bg-gray-50 flex justify-end transition-opacity duration-300 ${
          isHovered ? "opacity-100" : "opacity-70"
        }`}
      >
        <button 
          className="text-sm text-blue-600 font-medium hover:text-blue-800 transition-colors"
          onClick={openProject}
        >
          Open Project
        </button>
      </div>
    </div>
  );
} 