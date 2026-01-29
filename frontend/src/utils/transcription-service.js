/**
 * Microsoft Foundry Audio Transcription Service
 * 
 * Handles audio transcription using Microsoft Foundry (Azure OpenAI) API
 * Converts audio Blobs to text using the Whisper model
 */

import { API_CONFIG } from './api-config';

/**
 * Transcribe audio using Microsoft Foundry API
 * @param {Blob} audioBlob - Audio data as Blob from MediaRecorder
 * @returns {Promise<string>} - Transcribed text
 * @throws {Error} - If transcription fails
 */
export async function transcribeAudio(audioBlob) {
    // Validate API configuration
    if (!API_CONFIG || !API_CONFIG.endpoint || !API_CONFIG.apiKey) {
        throw new Error('API configuration is missing. Please check api-config.js');
    }

    if (API_CONFIG.endpoint === 'YOUR_ENDPOINT_URL' || API_CONFIG.apiKey === 'YOUR_API_KEY') {
        throw new Error('Please configure your Microsoft Foundry API credentials in api-config.js');
    }

    // Validate audio blob
    if (!audioBlob || !(audioBlob instanceof Blob)) {
        throw new Error('Invalid audio data provided');
    }

    // Construct API endpoint URL
    // Check if endpoint already includes the full path
    let endpointUrl;
    if (API_CONFIG.endpoint.includes('/openai/deployments')) {
        // Endpoint is already a full URL - use it as-is, but ensure it's for transcriptions not translations
        endpointUrl = API_CONFIG.endpoint.replace('/audio/translations', '/audio/transcriptions');
        // Update API version in URL if needed
        if (API_CONFIG.endpoint.includes('api-version=')) {
            endpointUrl = endpointUrl.replace(/api-version=[^&]+/, `api-version=${API_CONFIG.apiVersion}`);
        } else {
            endpointUrl += (endpointUrl.includes('?') ? '&' : '?') + `api-version=${API_CONFIG.apiVersion}`;
        }
    } else {
        // Endpoint is just the base URL - construct full path
        endpointUrl = `${API_CONFIG.endpoint}/openai/deployments/${API_CONFIG.deployment}/audio/transcriptions?api-version=${API_CONFIG.apiVersion}`;
    }

    // Convert Blob to File for FormData
    const audioFile = new File([audioBlob], 'recording.webm', { 
        type: audioBlob.type || 'audio/webm' 
    });

    // Create FormData
    const formData = new FormData();
    formData.append('file', audioFile);
    formData.append('model', API_CONFIG.deployment);
    formData.append('language', 'en'); // Optional: specify language for better accuracy

    try {
        // Make API request with retry logic
        const response = await fetchWithRetry(endpointUrl, {
            method: 'POST',
            headers: {
                'api-key': API_CONFIG.apiKey
            },
            body: formData
        });

        // Check if response is OK
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(
                errorData.error?.message || 
                `Transcription failed: ${response.status} ${response.statusText}`
            );
        }

        // Parse response
        const result = await response.json();
        
        // Extract text from response (handles different response formats)
        let transcribedText = null;
        
        if (result.text) {
            // Standard format: { text: "transcribed text" }
            transcribedText = result.text;
        } else if (result.transcription) {
            // Alternative format: { transcription: "transcribed text" }
            transcribedText = result.transcription;
        } else if (typeof result === 'string') {
            // Response is already a string
            transcribedText = result;
        }
        
        if (!transcribedText || transcribedText.trim() === '') {
            throw new Error('Transcription response missing or empty text field');
        }

        // Return only the text, ignoring other fields like words, duration, etc.
        return transcribedText.trim();

    } catch (error) {
        // Enhance error messages for better user experience
        if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
            throw new Error('Network error: Please check your internet connection and try again.');
        } else if (error.message.includes('401') || error.message.includes('Unauthorized')) {
            throw new Error('Authentication failed: Please check your API key configuration.');
        } else if (error.message.includes('429') || error.message.includes('rate limit')) {
            throw new Error('Rate limit exceeded: Please wait a moment and try again.');
        } else if (error.message.includes('400') || error.message.includes('Bad Request')) {
            throw new Error('Invalid audio format: Please try recording again.');
        }
        
        // Re-throw with original message if not handled above
        throw error;
    }
}

/**
 * Fetch with retry logic for transient failures
 * @param {string} url - Request URL
 * @param {Object} options - Fetch options
 * @param {number} maxRetries - Maximum number of retries (default: 2)
 * @param {number} retryDelay - Delay between retries in ms (default: 1000)
 * @returns {Promise<Response>} - Fetch response
 */
export async function fetchWithRetry(url, options, maxRetries = 2, retryDelay = 1000) {
    let lastError;
    
    for (let attempt = 0; attempt <= maxRetries; attempt++) {
        try {
            const response = await fetch(url, options);
            
            // Retry on 5xx errors (server errors) or 429 (rate limit)
            if (response.status >= 500 || response.status === 429) {
                if (attempt < maxRetries) {
                    await new Promise(resolve => setTimeout(resolve, retryDelay * (attempt + 1)));
                    continue;
                }
            }
            
            return response;
        } catch (error) {
            lastError = error;
            
            // Retry on network errors
            if (attempt < maxRetries && (
                error.message.includes('Failed to fetch') || 
                error.message.includes('NetworkError')
            )) {
                await new Promise(resolve => setTimeout(resolve, retryDelay * (attempt + 1)));
                continue;
            }
            
            throw error;
        }
    }
    
    throw lastError;
}



