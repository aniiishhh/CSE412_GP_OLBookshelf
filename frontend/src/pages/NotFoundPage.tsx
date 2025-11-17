import { Link } from 'react-router-dom';
import { BookOpenIcon } from '@heroicons/react/24/outline';

const NotFoundPage = () => {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <BookOpenIcon className="h-24 w-24 text-bookshelf-accent mb-6" />
      <h1 className="text-4xl font-bold font-serif text-bookshelf-ink dark:text-white mb-4">
        404 - Page Not Found
      </h1>
      <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 max-w-md">
        The page you're looking for doesn't exist or has been moved.
      </p>
      <Link to="/" className="btn-primary">
        Return to Homepage
      </Link>
    </div>
  );
};

export default NotFoundPage;
