import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../../ui/Card';

const PremiumBooks = ({ premiumCount, totalCount }) => {
  const percentage = totalCount > 0 ? ((premiumCount / totalCount) * 100).toFixed(1) : 0;

  return (
    <Card className="shadow-lg rounded-lg">
      <CardHeader>
        <CardTitle>Premium Books</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-4xl font-bold text-center py-4 text-green-600">
          {premiumCount || 0}
        </div>
        <p className="text-sm text-gray-500 text-center">
          {percentage}% of total books
        </p>
      </CardContent>
    </Card>
  );
};

export default PremiumBooks;

