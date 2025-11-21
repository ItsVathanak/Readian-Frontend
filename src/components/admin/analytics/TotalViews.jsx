import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../../ui/Card';

const TotalViews = ({ totalViews }) => {
  return (
    <Card className="shadow-lg rounded-lg">
      <CardHeader>
        <CardTitle>Total Views</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-4xl font-bold text-center py-4">
          {totalViews?.toLocaleString() || 0}
        </div>
        <p className="text-sm text-gray-500 text-center">Total book views</p>
      </CardContent>
    </Card>
  );
};

export default TotalViews;

