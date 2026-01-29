/**
 * Whisper Transcription API Configuration
 * 
 * This file contains the API configuration for Whisper transcription service
 * running on Azure VM.
 * 
 * Configuration is loaded from .env.js file (via window.ENV) with fallback to Vite environment variables
 * (import.meta.env) and then default values.
 */
export const API_CONFIG = {
    /**
     * Whisper API endpoint URL (VM endpoint)
     * 
     * Example: 'http://20.119.49.191:5000'
     * This is the public IP of the VM running Whisper API
     * 
     * Priority: window.ENV?.API_ENDPOINT > import.meta.env.VITE_API_ENDPOINT > default
     */
    endpoint: (typeof window !== 'undefined' && window.ENV?.API_ENDPOINT) || import.meta.env.VITE_API_ENDPOINT || 'http://20.119.49.191:5000',
    
    /**
     * API route path
     * 
     * The route endpoint for transcription
     * Default: '/transcribe'
     */
    route: (typeof window !== 'undefined' && window.ENV?.API_ROUTE) || import.meta.env.VITE_API_ROUTE || '/transcribe',
    
    /**
     * API Key for authentication (optional - VM may not require it)
     * 
     * Priority: window.ENV?.API_KEY > import.meta.env.VITE_API_KEY > default
     */
    apiKey: (typeof window !== 'undefined' && window.ENV?.API_KEY) || import.meta.env.VITE_API_KEY || null
};

