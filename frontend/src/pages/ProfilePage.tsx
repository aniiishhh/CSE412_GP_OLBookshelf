import React from 'react';

const ProfilePage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold">My Profile</h1>
      
      <div className="card mt-6 mb-8">
        <div className="mb-4">
          <h2 className="text-xl font-semibold mb-2">Account Information</h2>
          <p className="text-bookshelf-light-text dark:text-bookshelf-dark-text">
            <span className="font-medium">Email:</span> user@example.com
          </p>
          <p className="text-bookshelf-light-text dark:text-bookshelf-dark-text">
            <span className="font-medium">Display Name:</span> Book Lover
          </p>
        </div>
        
        <button className="btn-secondary">
          Edit Profile
        </button>
      </div>
      
      <div className="card">
        <h2 className="text-xl font-semibold mb-4">My Reading List</h2>
        <p className="text-bookshelf-light-muted dark:text-bookshelf-dark-muted italic">
          You haven't added any books to your reading list yet.
        </p>
      </div>
    </div>
  );
};

export default ProfilePage;
