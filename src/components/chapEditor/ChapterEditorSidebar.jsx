import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';

const ChapterEditorSidebar = ({ onDelete, onBackToBook, isNew }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Mobile Menu Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className='lg:hidden fixed top-20 left-4 z-50 bg-[#1A5632] text-white p-3 rounded-full shadow-lg hover:bg-[#C0FFB3] hover:text-[#1A5632] transition-all'
      >
        {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className='lg:hidden fixed inset-0 bg-black/50 z-40'
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed lg:sticky
        top-0 lg:top-0
        left-0
        h-screen
        w-[280px] sm:w-[320px]
        bg-[#C0FFB3]
        flex flex-col gap-8 lg:gap-[50px]
        p-6 lg:p-8
        z-50 lg:z-20
        transition-transform duration-300
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        overflow-y-auto
        flex-shrink-0
      `}>
        {/* Close button for mobile */}
        <button
          onClick={() => setIsOpen(false)}
          className='lg:hidden self-end text-2xl font-bold'
        >
          ×
        </button>

        <h1 className='geist text-[24px] lg:text-[32px] font-semibold self-center text-center'>
          {isNew ? 'Create Chapter' : 'Edit Chapter'}
        </h1>

        <div className='self-stretch'>
          <h2 className='geist text-[24px] font-semibold mb-2'>
            Tips
          </h2>
          <ul className='list-disc list-inside text-sm space-y-2 text-gray-700'>
            <li>Write engaging content</li>
            <li>Use proper formatting</li>
            <li>Save frequently</li>
            <li>Preview before publishing</li>
          </ul>
        </div>

        {/* Back to book */}
        <button
          onClick={() => {
            onBackToBook();
            setIsOpen(false);
          }}
          className='self-center text-center font-semibold bg-white w-full py-2 rounded-[15px] shadow-md hover:bg-black hover:text-white transition-all duration-300'
        >
          Back to Book
        </button>

        {/* Delete button - only show for existing chapters */}
        {onDelete && !isNew && (
          <button
            onClick={() => {
              onDelete();
              setIsOpen(false);
            }}
            className='self-center font-semibold text-[#FF0000] bg-[#FFD7DF] w-full py-2 rounded-[15px] shadow-md hover:bg-[#FF0000] hover:text-white transition-all duration-300'
          >
            🗑️ Delete Chapter
          </button>
        )}
      </aside>
    </>
  );
};

export default ChapterEditorSidebar;

