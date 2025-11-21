import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../../ui/Card';

const TotalBooks = ({ totalBooks }) => {
  return (
    <Card className="shadow-lg rounded-lg">
      <CardHeader>
        <CardTitle>Total Books</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-4xl font-bold text-center py-4">{totalBooks || 0}</div>
        <p className="text-sm text-gray-500 text-center">Published books in library</p>
      </CardContent>
    </Card>
  );
};

export default TotalBooks;

