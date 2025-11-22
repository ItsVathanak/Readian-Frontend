import React from 'react'
import BookCard from './BookCard'

const BrowseBookGrid = ({filteredBooks}) => {
  return (
    <main className='grid grid-cols-1 2xl:grid-cols-2 w-full p-[50px] gap-y-10 place-content-start place-items-center '>
        {filteredBooks.length > 0 ? (
            filteredBooks.map((book) => <BookCard key={book._id} book={book} />)
        ) : (
            <div>
                <p className='text-gray-500'>No books match your criteria.</p>     
            </div>
        )}
    </main>
  )
}

export default BrowseBookGrid
