import http from './http';

export const deleteTranscription = (transcriptionId) =>
  http.delete(`/api/transcription-history/${transcriptionId}`);
