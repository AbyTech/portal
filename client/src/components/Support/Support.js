import React from 'react';

const Support = () => {
  return (
    <div className="text-white">
      <h1 className="text-3xl font-bold mb-4">Support</h1>
      <p className="text-lg">
        For any questions or issues, please contact us at:
      </p>
      <a 
        href="mailto:support@example.com" 
        className="text-xl text-sidebar-active hover:underline mt-2 inline-block"
      >
        premierrecoveryandmonetization@gmail.com
      </a>
    </div>
  );
};

export default Support;
