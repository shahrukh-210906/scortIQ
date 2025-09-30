import React, { useState, useEffect } from 'react';

const ContentModal = ({ type, data, classroomId, onSave, onClose }) => {
  const [formData, setFormData] = useState({});

  useEffect(() => {
    // When editing, initialize form with existing data
    const initialData = { ...data };
    // Format date for input type="date" if it exists
    if (initialData.dueDate && typeof initialData.dueDate === 'string') {
      initialData.dueDate = initialData.dueDate.split('T')[0];
    }
    setFormData(initialData);
  }, [data]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(type, { ...formData, classroomId });
  };

  const titleCase = str => str.charAt(0).toUpperCase() + str.slice(1);

  const renderFields = () => {
    switch (type) {
      case 'chapter':
        return <input type="text" name="name" value={formData.name || ''} onChange={handleChange} placeholder="Chapter Name" className="input" required />;
      case 'topic':
        return (
          <>
            <input type="text" name="name" value={formData.name || ''} onChange={handleChange} placeholder="Topic Name" className="input" required />
            <textarea name="notes" value={formData.notes || ''} onChange={handleChange} placeholder="Topic Notes" className="input" rows="4" required />
          </>
        );
      case 'assignment':
        return (
          <>
            <input type="text" name="title" value={formData.title || ''} onChange={handleChange} placeholder="Assignment Title" className="input" required />
            <input type="date" name="dueDate" value={formData.dueDate || ''} onChange={handleChange} className="input" required />
          </>
        );
      case 'announcement':
        return <textarea name="content" value={formData.content || ''} onChange={handleChange} placeholder="Announcement..." className="input" rows="3" required />;
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-background-primary p-6 rounded-lg shadow-xl w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">{data?.itemId ? 'Edit' : 'Create'} {titleCase(type)}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {renderFields()}
          <div className="flex justify-end space-x-2">
            <button type="button" onClick={onClose} className="btn-secondary">Cancel</button>
            <button type="submit" className="btn-primary">Save</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ContentModal;

