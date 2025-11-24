import React from 'react'
import { Link } from 'react-router-dom'

//truncate
function truncate(str, n) {
    return str?.length > n ? str.substring(0, n-1) + "..." : str;
}

const BookEditChapters = ({chapters, onEditChapter, onNewChapter, isNewBook, onUpdateChapter, onDeleteChapter}) => {
    return (
        <div className='w-[910px] flex flex-col'>
            <h2 className='geist font-bold text-[32px] mb-6'>
                Chapters
            </h2>

            <div className="space-y-4 bg-[#C0FFB3] p-6 rounded-[20px] border-r-2 border-b-2 border-black">

            {chapters.length === 0 ? (
                <p className="text-gray-600 text-center py-4">No chapters yet. Click "New Chapter" to add one.</p>
            ) : (
                chapters.map((chap) => (
                  isNewBook ? (
                    // Inline editing for new books
                    <div key={chap.id} className="border-b pb-4 mb-4">
                        <div className="flex justify-between items-center mb-2">
                            <input
                                type="text"
                                value={chap.title}
                                onChange={(e) => onUpdateChapter(chap.id, 'title', e.target.value)}
                                className="flex-1 p-2 border rounded-lg mr-2"
                                placeholder="Chapter Title"
                            />
                            <button
                                onClick={() => onDeleteChapter(chap.id)}
                                className="px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                            >
                                Delete
                            </button>
                        </div>
                        <textarea
                            value={chap.content}
                            onChange={(e) => onUpdateChapter(chap.id, 'content', e.target.value)}
                            className="w-full p-2 border rounded-lg h-32"
                            placeholder="Chapter content..."
                        />
                    </div>
                  ) : (
                    // Normal view for existing books
                    <div key={chap.id} title={chap.title} className="flex justify-between items-center p-2 border-b">
                        <p className="text-lg">{truncate(chap.title,80)}</p>

                        <button
                          onClick={() => onEditChapter(chap.id)}
                          className="font-semibold text-blue-500 hover:underline"
                        >
                          Edit
                        </button>
                    </div>
                  )
                ))
            )}

            </div>
            
            {/* New chapter */}
            <button 
                onClick={onNewChapter}
                className="block self-end w-fit mt-4 py-3 px-6 text-center bg-[#1A5632] text-[#FFD7DF] rounded-lg font-bold "
            >
                New Chapter
            </button>
        </div>
    )
}

export default BookEditChapters
