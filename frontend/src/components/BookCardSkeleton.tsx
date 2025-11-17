interface BookCardSkeletonProps {
  className?: string;
}

const BookCardSkeleton = ({ className = '' }: BookCardSkeletonProps) => {
  return (
    <div 
      className={`bg-white rounded-lg shadow-md overflow-hidden animate-pulse ${className}`}
    >
      {/* Book cover skeleton */}
      <div className="h-56 bg-gray-300"></div>
      
      {/* Book info skeleton */}
      <div className="p-4">
        {/* Title skeleton */}
        <div className="h-5 bg-gray-300 rounded w-3/4 mb-2"></div>
        
        {/* Author skeleton */}
        <div className="h-4 bg-gray-300 rounded w-1/2 mb-4"></div>
        
        {/* Action button skeleton */}
        <div className="mt-3 flex justify-between items-center">
          <div className="h-3 bg-gray-300 rounded w-1/4"></div>
          <div className="h-5 w-5 bg-gray-300 rounded-full"></div>
        </div>
      </div>
    </div>
  );
};

export default BookCardSkeleton;
