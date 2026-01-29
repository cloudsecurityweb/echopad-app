import { useState, useRef, useCallback } from 'react';
import { transcribeAudio } from '../utils/transcription-service';

const MAX_RECORDING_TIME = 10; // 10 seconds max
const COUNTDOWN_TIME = 3; // 3 seconds countdown

export function useAudioRecorder() {
  const [isCountingDown, setIsCountingDown] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [countdownSeconds, setCountdownSeconds] = useState(COUNTDOWN_TIME);
  const [isProcessing, setIsProcessing] = useState(false);
  const [transcription, setTranscription] = useState('');
  const [error, setError] = useState(null);

  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const recordingIntervalRef = useRef(null);
  const countdownIntervalRef = useRef(null);
  const streamRef = useRef(null);

  const resetState = useCallback((keepProcessing = false) => {
    // Clear all intervals
    if (countdownIntervalRef.current) {
      clearInterval(countdownIntervalRef.current);
      countdownIntervalRef.current = null;
    }
    if (recordingIntervalRef.current) {
      clearInterval(recordingIntervalRef.current);
      recordingIntervalRef.current = null;
    }

    // Stop media recorder if active
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      try {
        mediaRecorderRef.current.stop();
      } catch (err) {
        console.error('Error stopping media recorder:', err);
      }
      mediaRecorderRef.current = null;
    }

    // Stop all tracks
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => {
        try {
          track.stop();
        } catch (err) {
          console.error('Error stopping track:', err);
        }
      });
      streamRef.current = null;
    }

    // Reset state
    setIsCountingDown(false);
    setIsRecording(false);
    setRecordingSeconds(0);
    setCountdownSeconds(COUNTDOWN_TIME);
    if (!keepProcessing) {
      setIsProcessing(false);
    }
    // Don't clear error here - let the UI handle it
    audioChunksRef.current = [];
  }, []);

  const stopRecording = useCallback(() => {
    // Clear countdown if still running
    if (countdownIntervalRef.current) {
      clearInterval(countdownIntervalRef.current);
      countdownIntervalRef.current = null;
    }

    // Stop actual recording if it's running
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
      // Don't reset processing state yet - let onstop handler manage it
      setIsCountingDown(false);
      setIsRecording(false);
    } else {
      // If recorder is already stopped, reset everything
      resetState();
    }

    // Clear recording timer
    if (recordingIntervalRef.current) {
      clearInterval(recordingIntervalRef.current);
      recordingIntervalRef.current = null;
    }

    // Note: Don't stop tracks here - let onstop handler do it after processing
  }, [resetState]);

  const startRecording = useCallback(async () => {
    if (isCountingDown || isRecording || isProcessing) {
      return; // Prevent multiple clicks
    }

    try {
      // Clear previous errors and transcription
      setError(null);
      setTranscription('');
      
      // Request microphone access
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      // Initialize MediaRecorder
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        // Set processing state immediately when recording stops
        setIsProcessing(true);
        setError(null);
        setIsCountingDown(false);
        setIsRecording(false);

        // Clear intervals
        if (countdownIntervalRef.current) {
          clearInterval(countdownIntervalRef.current);
          countdownIntervalRef.current = null;
        }
        if (recordingIntervalRef.current) {
          clearInterval(recordingIntervalRef.current);
          recordingIntervalRef.current = null;
        }

        try {
          // Combine audio chunks into a single Blob
          const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });

          // Validate audio blob has data
          if (audioBlob.size === 0) {
            throw new Error('No audio data recorded. Please try again.');
          }

          // Call transcription service
          const transcribedText = await transcribeAudio(audioBlob);

          if (transcribedText && transcribedText.trim()) {
            setTranscription(transcribedText);
            setError(null); // Clear any previous errors on success
          } else {
            throw new Error('Transcription returned empty result. Please try again.');
          }
        } catch (err) {
          console.error('Transcription error:', err);
          const errorMessage = err.message || 'Failed to transcribe audio. Please try again.';
          setError(errorMessage);
          setTranscription(''); // Clear transcription on error
        } finally {
          setIsProcessing(false);
          
          // Stop all tracks after processing
          if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => {
              try {
                track.stop();
              } catch (err) {
                console.error('Error stopping track:', err);
              }
            });
            streamRef.current = null;
          }
        }
      };

      // Add error handler for media recorder
      mediaRecorder.onerror = (event) => {
        console.error('MediaRecorder error:', event);
        const errorMessage = 'Recording error occurred. Please try again.';
        setError(errorMessage);
        resetState();
      };

      // Start countdown
      setIsCountingDown(true);
      setCountdownSeconds(COUNTDOWN_TIME);

      countdownIntervalRef.current = setInterval(() => {
        setCountdownSeconds((prev) => {
          if (prev <= 1) {
            // Countdown finished, start actual recording
            clearInterval(countdownIntervalRef.current);
            countdownIntervalRef.current = null;
            setIsCountingDown(false);
            setIsRecording(true);

            try {
              // Start actual recording
              if (mediaRecorder.state === 'inactive') {
                mediaRecorder.start();
              }

              // Start recording timer
              setRecordingSeconds(0);
              recordingIntervalRef.current = setInterval(() => {
                setRecordingSeconds((prev) => {
                  const newSeconds = prev + 1;
                  // Auto-stop at max time
                  if (newSeconds >= MAX_RECORDING_TIME) {
                    stopRecording();
                  }
                  return newSeconds;
                });
              }, 1000);
            } catch (err) {
              console.error('Error starting recording:', err);
              setError('Failed to start recording. Please try again.');
              resetState();
            }

            return 0;
          }
          return prev - 1;
        });
      }, 1000);

    } catch (err) {
      console.error('Error accessing microphone:', err);
      let errorMessage = 'Please allow microphone access to use the recording demo.';
      
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        errorMessage = 'Microphone permission denied. Please enable microphone access in your browser settings and try again.';
      } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
        errorMessage = 'No microphone found. Please connect a microphone and try again.';
      } else if (err.name === 'NotReadableError' || err.name === 'TrackStartError') {
        errorMessage = 'Microphone is already in use by another application. Please close other applications and try again.';
      }
      
      setError(errorMessage);
      resetState();
    }
  }, [isCountingDown, isRecording, stopRecording, resetState]);

  const clearTranscription = useCallback(() => {
    setTranscription('');
    setError(null);
    // Reset all state to initial state
    resetState();
  }, [resetState]);

  return {
    isCountingDown,
    isRecording,
    recordingSeconds,
    countdownSeconds,
    isProcessing,
    transcription,
    error,
    startRecording,
    stopRecording,
    clearTranscription,
  };
}






