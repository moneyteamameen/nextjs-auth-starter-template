"use client";

import { useState, useEffect } from "react";
import { ProjectCard } from "./project-card";
import { supabase } from "../../lib/supabase";
import { useAuth } from "../../context/auth-context";

interface Project {
  id: string;
  name: string;
  created_at: string;
  status: string;
  progress: number;
}

export function ProjectsGrid() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    async function fetchProjects() {
      if (!user) return;
      
      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from('projects')
          .select('*')
          .order('created_at', { ascending: false });
          
        if (error) throw error;
        
        setProjects(data || []);
      } catch (error) {
        console.error('Error fetching projects:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchProjects();
  }, [user]);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 h-48 animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
            <div className="h-3 bg-gray-200 rounded w-1/2 mb-6"></div>
            <div className="h-3 bg-gray-200 rounded w-full mb-2"></div>
            <div className="h-2 bg-gray-200 rounded w-full"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {projects.length === 0 ? (
        <div className="col-span-full text-center py-12">
          <p className="text-gray-500">No projects found. Create your first project!</p>
        </div>
      ) : (
        projects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))
      )}
    </div>
  );
} 