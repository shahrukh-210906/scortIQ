const API_URL = 'http://localhost:5000/api';

const request = async (method, path, body, token) => {
  const options = {
    method,
    headers: {
      'Content-Type': 'application/json',
      'x-auth-token': token,
    },
  };

  if (body) {
    options.body = JSON.stringify(body);
  }

  const response = await fetch(`${API_URL}${path}`, options);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.msg || 'An API error occurred');
  }

  return data;
};

// Classroom
export const getClassroom = (id, token) => request('GET', `/classrooms/${id}`, null, token);

// Chapters
export const createChapter = (classroomId, data, token) => request('POST', `/classrooms/${classroomId}/chapters`, data, token);
export const updateChapter = (classroomId, chapterId, data, token) => request('PUT', `/classrooms/${classroomId}/chapters/${chapterId}`, data, token);
export const deleteChapter = (classroomId, chapterId, token) => request('DELETE', `/classrooms/${classroomId}/chapters/${chapterId}`, null, token);

// Topics
export const createTopic = (classroomId, chapterId, data, token) => request('POST', `/classrooms/${classroomId}/chapters/${chapterId}/topics`, data, token);
export const updateTopic = (classroomId, chapterId, topicId, data, token) => request('PUT', `/classrooms/${classroomId}/chapters/${chapterId}/topics/${topicId}`, data, token);
export const deleteTopic = (classroomId, chapterId, topicId, token) => request('DELETE', `/classrooms/${classroomId}/chapters/${chapterId}/topics/${topicId}`, null, token);

// Assignments
export const createAssignment = (classroomId, data, token) => request('POST', `/classrooms/${classroomId}/assignments`, data, token);
export const updateAssignment = (classroomId, assignmentId, data, token) => request('PUT', `/classrooms/${classroomId}/assignments/${assignmentId}`, data, token);
export const deleteAssignment = (classroomId, assignmentId, token) => request('DELETE', `/classrooms/${classroomId}/assignments/${assignmentId}`, null, token);

// Announcements
export const createAnnouncement = (classroomId, data, token) => request('POST', `/classrooms/${classroomId}/announcements`, data, token);
export const updateAnnouncement = (classroomId, announcementId, data, token) => request('PUT', `/classrooms/${classroomId}/announcements/${announcementId}`, data, token);
export const deleteAnnouncement = (classroomId, announcementId, token) => request('DELETE', `/classrooms/${classroomId}/announcements/${announcementId}`, null, token);
