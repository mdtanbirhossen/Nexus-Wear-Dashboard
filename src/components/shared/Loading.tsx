import React from 'react';

const Loading = () => {
     return (
          <div className='flex w-full items-center justify-center'>
               <div
                    className="w-8 h-8 border-4 border-t-blue-500 border-gray-300 rounded-full animate-spin"
               ></div>
          </div>
     );
};

export default Loading;