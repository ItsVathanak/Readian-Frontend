import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { bookApi, chapterApi } from '../../services/api';
import { handleApiError, showSuccessToast } from '../../services/utils/errorHandler';

// Sortable Chapter Item Component
function SortableChapterItem({ chapter, index, onEdit, onDelete }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: chapter.id || chapter._id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`bg-gray-50 border-2 rounded-lg p-4 transition-all ${
        isDragging
          ? 'border-[#1A5632] shadow-lg bg-white'
          : 'border-gray-200 hover:border-gray-300'
      }`}
    >
      <div className='flex items-center gap-4'>
        {/* Drag Handle */}
        <div
          {...attributes}
          {...listeners}
          className='cursor-grab active:cursor-grabbing text-gray-400 hover:text-gray-600'
        >
          <svg className='w-6 h-6' fill='currentColor' viewBox='0 0 20 20'>
            <path d='M7 2a2 2 0 1 0 .001 4.001A2 2 0 0 0 7 2zm0 6a2 2 0 1 0 .001 4.001A2 2 0 0 0 7 8zm0 6a2 2 0 1 0 .001 4.001A2 2 0 0 0 7 14zm6-8a2 2 0 1 0-.001-4.001A2 2 0 0 0 13 6zm0 2a2 2 0 1 0 .001 4.001A2 2 0 0 0 13 8zm0 6a2 2 0 1 0 .001 4.001A2 2 0 0 0 13 14z' />
          </svg>
        </div>

        {/* Chapter Info */}
        <div className='flex-1 min-w-0'>
          <div className='flex items-center gap-2 mb-1'>
            <span className='font-bold text-[#1A5632]'>
              Chapter {chapter.chapterNumber || index + 1}
            </span>
          </div>
          <h3 className='font-semibold text-lg truncate'>
            {chapter.title || 'Untitled Chapter'}
          </h3>
        </div>

        {/* Actions */}
        <div className='flex gap-2'>
          <button
            onClick={() => onEdit(chapter.chapterNumber || index + 1)}
            className='px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all text-sm font-semibold'
          >
            Edit
          </button>
          <button
            onClick={() => onDelete(chapter.chapterNumber || index + 1)}
            className='px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all text-sm font-semibold'
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

// Main Component
const BookEditChapters = ({ bookId }) => {
  const [chapters, setChapters] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    fetchChapters();
  }, [bookId]);

  const fetchChapters = async () => {
    try {
      setLoading(true);
      const response = await bookApi.getBookChapters(bookId);
      setChapters(response.data.chapters || []);
    } catch (error) {
      handleApiError(error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddChapter = () => {
    navigate(`/edit/${bookId}/chapter/new`);
  };

  const handleEditChapter = (chapterNumber) => {
    navigate(`/edit/${bookId}/chapter/${chapterNumber}`);
  };

  const handleDeleteChapter = async (chapterNumber) => {
    if (!window.confirm('Are you sure you want to delete this chapter?')) {
      return;
    }

    try {
      await chapterApi.deleteChapter(bookId, chapterNumber);
      showSuccessToast('Chapter deleted successfully!');
      fetchChapters();
    } catch (error) {
      handleApiError(error);
    }
  };

  const handleDragEnd = async (event) => {
    const { active, over } = event;

    if (active.id !== over.id) {
      const oldIndex = chapters.findIndex((ch) => (ch.id || ch._id) === active.id);
      const newIndex = chapters.findIndex((ch) => (ch.id || ch._id) === over.id);

      const newChapters = arrayMove(chapters, oldIndex, newIndex);
      setChapters(newChapters);

      // Create chapter order ARRAY: [2, 1, 3, 5, 4]
      // This represents the new chapter order by chapter number
      const chapterOrder = newChapters.map((chapter, index) =>
        chapter.chapterNumber || (index + 1)
      );

      console.log('📋 Reordering chapters (array format):', chapterOrder);

      try {
        await chapterApi.reorderChapters(bookId, chapterOrder);
        showSuccessToast('Chapters reordered successfully!');
        fetchChapters();
      } catch (error) {
        console.error('❌ Reorder error:', error);
        handleApiError(error);
        fetchChapters();
      }
    }
  };

  if (loading) {
    return (
      <div className='mt-8 bg-white rounded-lg p-6 shadow-md'>
        <div className='text-center py-4'>Loading chapters...</div>
      </div>
    );
  }

  return (
    <div className='mt-8 bg-white rounded-lg p-6 shadow-md'>
      <div className='flex justify-between items-center mb-6'>
        <h2 className='text-2xl font-bold text-[#1A5632]'>Chapters</h2>
        <button
          onClick={handleAddChapter}
          className='px-4 py-2 bg-[#1A5632] text-white rounded-lg hover:bg-[#00A819] transition-all font-semibold'
        >
          + Add New Chapter
        </button>
      </div>

      {chapters.length === 0 ? (
        <div className='text-center py-8 text-gray-500'>
          <p className='text-lg mb-4'>No chapters yet</p>
          <button
            onClick={handleAddChapter}
            className='px-6 py-3 bg-[#1A5632] text-white rounded-lg hover:bg-[#00A819] transition-all font-semibold'
          >
            Create First Chapter
          </button>
        </div>
      ) : (
        <>
          <p className='text-sm text-gray-600 mb-4'>
            💡 Drag chapters to reorder them
          </p>

          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={chapters.map((ch) => ch.id || ch._id)}
              strategy={verticalListSortingStrategy}
            >
              <div className='space-y-3'>
                {chapters.map((chapter, index) => (
                  <SortableChapterItem
                    key={chapter.id || chapter._id}
                    chapter={chapter}
                    index={index}
                    onEdit={handleEditChapter}
                    onDelete={handleDeleteChapter}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        </>
      )}
    </div>
  );
};

export default BookEditChapters;

