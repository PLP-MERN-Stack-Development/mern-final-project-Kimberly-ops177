import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-8 mt-auto">
      <div className="container mx-auto px-4">
        <div className="text-center">
          <p>&copy; {new Date().getFullYear()} EduHub. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
