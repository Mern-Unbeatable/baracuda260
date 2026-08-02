import React, { memo } from 'react';

const AboutContent = memo(() => {
  return (
    <div className='max-w-4xl mx-auto'>
      <article className='bg-white rounded-lg shadow-md p-8'>
        <h1 className='text-4xl font-bold text-gray-800 mb-4'>About Us</h1>
        <p className='text-lg text-gray-600 mb-4'>
          Learn more about our company and what we do
        </p>
        <div className='space-y-4 mt-6'>
          <div className='border-l-4 border-blue-500 pl-4'>
            <h3 className='text-xl font-semibold text-gray-800'>Our Mission</h3>
            <p className='text-gray-600'>
              To deliver exceptional web solutions that help businesses grow
            </p>
          </div>
          <div className='border-l-4 border-green-500 pl-4'>
            <h3 className='text-xl font-semibold text-gray-800'>Our Values</h3>
            <p className='text-gray-600'>
              Innovation, quality, and customer satisfaction
            </p>
          </div>
        </div>
      </article>
    </div>
  );
});

AboutContent.displayName = 'AboutContent';

export default AboutContent;
