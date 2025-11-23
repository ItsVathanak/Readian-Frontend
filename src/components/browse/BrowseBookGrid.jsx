import React from 'react'
import BookCard from './BookCard'

const BrowseBookGrid = ({filteredBooks}) => {
  return (
    <main className='grid grid-cols-1 xl:grid-cols-2 w-full p-4 sm:p-6 md:p-8 lg:p-10 xl:p-12 gap-4 sm:gap-6 md:gap-8 lg:gap-10 place-content-start place-items-center'>
        {filteredBooks.length > 0 ? (
            filteredBooks.map((book) => <BookCard key={book._id} book={book} />)
        ) : (
            <div className='col-span-full text-center py-12'>
                <p className='text-gray-500 text-lg'>No books match your criteria.</p>
            </div>
        )}
    </main>
  )
}

export default BrowseBookGrid
