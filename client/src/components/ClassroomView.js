import React, { useState, useEffect, useCallback } from 'react';
import * as api from '../api';
import ChapterItem from './ChapterItem';
import AssignmentItem from './AssignmentItem';
import AnnouncementItem from './AnnouncementItem';
import ContentModal from './ContentModal';

const ClassroomView = ({ classroomId, token, user, onBack }) => {
  const [classroom, setClassroom] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [modalState, setModalState] = useState({ open: false, type: '', data: null });

  const isTeacher = classroom && user && classroom.teacher === user._id;

  const fetchClassroom = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await api.getClassroom(classroomId, token);
      setClassroom(data);
    } catch (err) {
      setError(err.message || 'Failed to fetch classroom data.');
    } finally {
      setIsLoading(false);
    }
  }, [classroomId, token]);

  useEffect(() => {
    fetchClassroom();
  }, [fetchClassroom]);

  const handleModalOpen = (type, data = null) => {
    setModalState({ open: true, type, data });
  };

  const handleModalClose = () => {
    setModalState({ open: false, type: '', data: null });
  };

  const handleSave = async (type, data) => {
    try {
      const { classroomId, chapterId, itemId, ...payload } = data;
      switch (type) {
        case 'chapter':
          if (itemId) await api.updateChapter(classroomId, itemId, payload, token);
          else await api.createChapter(classroomId, payload, token);
          break;
        case 'topic':
          if (itemId) await api.updateTopic(classroomId, chapterId, itemId, payload, token);
          else await api.createTopic(classroomId, chapterId, payload, token);
          break;
        case 'assignment':
           if (itemId) await api.updateAssignment(classroomId, itemId, payload, token);
           else await api.createAssignment(classroomId, payload, token);
          break;
        case 'announcement':
          if (itemId) await api.updateAnnouncement(classroomId, itemId, payload, token);
          else await api.createAnnouncement(classroomId, payload, token);
          break;
        default:
          break;
      }
      fetchClassroom();
      handleModalClose();
    } catch (err) {
      console.error(`Failed to save ${type}:`, err);
      setError(`Error: Could not save ${type}.`);
    }
  };

  const handleDelete = async (type, ids) => {
    if (!window.confirm(`Are you sure you want to delete this ${type}?`)) return;
    try {
        const { classroomId, chapterId, itemId } = ids;
        switch (type) {
            case 'chapter':
                await api.deleteChapter(classroomId, itemId, token);
                break;
            case 'topic':
                await api.deleteTopic(classroomId, chapterId, itemId, token);
                break;
            case 'assignment':
                await api.deleteAssignment(classroomId, itemId, token);
                break;
            case 'announcement':
                await api.deleteAnnouncement(classroomId, itemId, token);
                break;
            default:
                break;
        }
        fetchClassroom();
    } catch (err) {
        console.error(`Failed to delete ${type}:`, err);
        setError(`Error: Could not delete ${type}.`);
    }
  };

  if (isLoading) return <p className="text-center">Loading classroom...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;
  if (!classroom) return <p className="text-center">Classroom not found.</p>;

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-text-primary">{classroom.name}</h1>
          <p className="text-md text-text-secondary mt-1">{classroom.subject}</p>
        </div>
        <button onClick={onBack} className="btn-secondary">Back</button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Curriculum Section */}
        <div className="lg:col-span-2 space-y-4">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Curriculum</h2>
                {isTeacher && <button onClick={() => handleModalOpen('chapter')} className="btn-primary">Add Chapter</button>}
            </div>
            {classroom.chapters?.length > 0 ? (
                classroom.chapters.map(chapter => (
                    <ChapterItem 
                        key={chapter._id} 
                        chapter={chapter}
                        classroomId={classroomId}
                        isTeacher={isTeacher}
                        onEdit={handleModalOpen}
                        onDelete={handleDelete}
                    />
                ))
            ) : <p>No chapters created yet.</p>}
        </div>

        {/* Side Section */}
        <div className="space-y-6">
            {/* Announcements */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <h2 className="text-2xl font-bold">Corkboard</h2>
                {isTeacher && <button onClick={() => handleModalOpen('announcement')} className="btn-primary">Post</button>}
              </div>
              <div className="card space-y-3">
                {classroom.announcements?.length > 0 ? (
                  classroom.announcements.map(ann => <AnnouncementItem key={ann._id} announcement={ann} isTeacher={isTeacher} classroomId={classroomId} onEdit={handleModalOpen} onDelete={handleDelete} />)
                ) : <p>No announcements.</p>}
              </div>
            </div>

            {/* Assignments */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <h2 className="text-2xl font-bold">Assignments</h2>
                {isTeacher && <button onClick={() => handleModalOpen('assignment')} className="btn-primary">Create</button>}
              </div>
              <div className="card space-y-3">
                {classroom.assignments?.length > 0 ? (
                  classroom.assignments.map(ass => <AssignmentItem key={ass._id} assignment={ass} isTeacher={isTeacher} classroomId={classroomId} onEdit={handleModalOpen} onDelete={handleDelete} />)
                ) : <p>No assignments.</p>}
              </div>
            </div>
        </div>
      </div>
      
      {modalState.open && <ContentModal type={modalState.type} data={modalState.data} classroomId={classroomId} onSave={handleSave} onClose={handleModalClose} />}
    </div>
  );
};

export default ClassroomView;
