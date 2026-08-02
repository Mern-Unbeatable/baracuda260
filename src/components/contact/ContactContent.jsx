import React, { useState, useCallback, memo } from 'react';
import { useApi } from '../../hooks/useApi';
import toast from 'react-hot-toast';
import { httpMethods } from '../../services/httpMethods';
import { API_ENDPOINTS } from '../../services/httpEndpoint';

const ContactForm = memo(() => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });

  const { loading: isSubmitting, execute: submitForm } = useApi((data) =>
    httpMethods.post(API_ENDPOINTS.CONTACT.SEND, data),
  );

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }, []);

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();

      const { data, error } = await submitForm(formData);

      if (error) {
        toast.error(
          error.message || 'Failed to send message. Please try again.',
        );
        return;
      }

      toast.success('Message sent successfully!');

      setFormData({
        name: '',
        email: '',
        message: '',
      });
    },
    [formData, submitForm],
  );

  return (
    <form onSubmit={handleSubmit} className='space-y-6'>
      <div>
        <label
          htmlFor='name'
          className='block text-sm font-medium text-gray-700 mb-2'
        >
          Name
        </label>
        <input
          type='text'
          id='name'
          name='name'
          value={formData.name}
          onChange={handleChange}
          className='w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition'
          required
          aria-required='true'
          disabled={isSubmitting}
        />
      </div>
      <div>
        <label
          htmlFor='email'
          className='block text-sm font-medium text-gray-700 mb-2'
        >
          Email
        </label>
        <input
          type='email'
          id='email'
          name='email'
          value={formData.email}
          onChange={handleChange}
          className='w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition'
          required
          aria-required='true'
          disabled={isSubmitting}
        />
      </div>
      <div>
        <label
          htmlFor='message'
          className='block text-sm font-medium text-gray-700 mb-2'
        >
          Message
        </label>
        <textarea
          id='message'
          name='message'
          value={formData.message}
          onChange={handleChange}
          rows='4'
          className='w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition'
          required
          aria-required='true'
          disabled={isSubmitting}
        />
      </div>
      <button
        type='submit'
        className='w-full bg-blue-600 text-white py-3 px-6 rounded-md hover:bg-blue-700 transition font-semibold disabled:opacity-50 disabled:cursor-not-allowed'
        disabled={isSubmitting}
      >
        {isSubmitting ? 'Sending...' : 'Send Message'}
      </button>
    </form>
  );
});

ContactForm.displayName = 'ContactForm';

const ContactContent = memo(() => {
  return (
    <div className='max-w-2xl mx-auto'>
      <article className='bg-white rounded-lg shadow-md p-8'>
        <h1 className='text-4xl font-bold text-gray-800 mb-4'>Contact Us</h1>
        <p className='text-gray-600 mb-6'>Get in touch with us</p>
        <ContactForm />
      </article>
    </div>
  );
});

ContactContent.displayName = 'ContactContent';

export default ContactContent;
