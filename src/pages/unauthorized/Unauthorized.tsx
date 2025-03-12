import React from 'react';
import {Link} from 'react-router-dom';

const UnauthorizedPage: React.FC = () => {

  return (
    <div className="flex flex-col items-center justify-center h-screen w-screen" style={{ backgroundColor: "#F0F0F0" }}>
      <div className="bg-white p-20 rounded-lg shadow-md text-center">
        <h1 className="text-5xl font-bold">Unauthorized Access</h1>
        <p className="text-xl mt-12 text-gray-600">You do not have permission to view this page.</p>
        <Link to="/" className="text-xl mt-5 text-blue-500 hover:underline">
          Return to HomePage
        </Link>
      </div>
    </div>
  );
};

export default UnauthorizedPage;
