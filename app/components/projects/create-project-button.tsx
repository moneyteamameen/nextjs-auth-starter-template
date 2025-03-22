"use client";

import { Plus } from "lucide-react";
import { useState } from "react";
import { DocumentUploadModal } from "./document-upload-modal";

export function CreateProjectButton() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className="fixed bottom-8 right-8 w-14 h-14 bg-blue-600 text-white rounded-full shadow-lg flex items-center justify-center hover:bg-blue-700 transition-all duration-300 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 z-10"
        aria-label="Create new project"
      >
        <Plus size={24} />
      </button>
      
      {isModalOpen && (
        <DocumentUploadModal onClose={() => setIsModalOpen(false)} />
      )}
    </>
  );
} 