import { useState, useRef, useEffect } from 'react';
import { Mic, MicOff, Loader } from 'lucide-react';
import Button from './Button';
import './VoiceInput.css';

const VoiceInput = ({ onTranscriptReceived, language = 'ta-IN' }) => {
    const [isListening, setIsListening] = useState(false);
    const [transcript, setTranscript] = useState('');
    const [interimTranscript, setInterimTranscript] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState('');
    const recognitionRef = useRef(null);

    useEffect(() => {
        // Check if browser supports Speech Recognition
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

        if (!SpeechRecognition) {
            setError('Voice input is not supported in your browser. Please use Chrome or Edge.');
            return;
        }

        // Initialize Speech Recognition
        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = language; // 'ta-IN' for Tamil, 'en-IN' for English

        recognition.onstart = () => {
            setIsListening(true);
            setError('');
        };

        recognition.onresult = (event) => {
            let interim = '';
            let final = '';

            for (let i = event.resultIndex; i < event.results.length; i++) {
                const transcriptPart = event.results[i][0].transcript;
                if (event.results[i].isFinal) {
                    final += transcriptPart + ' ';
                } else {
                    interim += transcriptPart;
                }
            }

            if (final) {
                setTranscript(prev => prev + final);
            }
            setInterimTranscript(interim);
        };

        recognition.onerror = (event) => {
            console.error('Speech recognition error:', event.error);
            setError(`Error: ${event.error}. Please try again.`);
            setIsListening(false);
        };

        recognition.onend = () => {
            setIsListening(false);
            setInterimTranscript('');
        };

        recognitionRef.current = recognition;

        return () => {
            if (recognitionRef.current) {
                recognitionRef.current.stop();
            }
        };
    }, [language]);

    const startListening = () => {
        if (recognitionRef.current && !isListening) {
            setTranscript('');
            setInterimTranscript('');
            setError('');
            recognitionRef.current.start();
        }
    };

    const stopListening = () => {
        if (recognitionRef.current && isListening) {
            recognitionRef.current.stop();
        }
    };

    const handleProcess = async () => {
        if (!transcript.trim()) {
            setError('Please speak something first');
            return;
        }

        setIsProcessing(true);
        try {
            await onTranscriptReceived(transcript);
            setTranscript('');
        } catch (err) {
            setError('Failed to process voice input. Please try again.');
        } finally {
            setIsProcessing(false);
        }
    };

    const handleClear = () => {
        setTranscript('');
        setInterimTranscript('');
        setError('');
    };

    return (
        <div className="voice-input-container">
            <div className="voice-controls">
                {!isListening ? (
                    <Button
                        variant="primary"
                        size="lg"
                        onClick={startListening}
                        disabled={isProcessing || !!error}
                        className="mic-button"
                    >
                        <Mic size={24} />
                        Start Voice Input
                    </Button>
                ) : (
                    <Button
                        variant="danger"
                        size="lg"
                        onClick={stopListening}
                        className="mic-button listening"
                    >
                        <MicOff size={24} />
                        Stop Recording
                    </Button>
                )}
            </div>

            {isListening && (
                <div className="listening-indicator">
                    <div className="pulse-ring"></div>
                    <div className="pulse-ring delay-1"></div>
                    <div className="pulse-ring delay-2"></div>
                    <p>Listening... Speak now</p>
                </div>
            )}

            {(transcript || interimTranscript) && (
                <div className="transcript-box">
                    <h4>Transcript:</h4>
                    <p className="transcript-text">
                        {transcript}
                        {interimTranscript && (
                            <span className="interim">{interimTranscript}</span>
                        )}
                    </p>
                    <div className="transcript-actions">
                        <Button
                            variant="primary"
                            onClick={handleProcess}
                            disabled={isProcessing || !transcript.trim()}
                        >
                            {isProcessing ? (
                                <>
                                    <Loader size={18} className="spin" />
                                    Processing...
                                </>
                            ) : (
                                'Process & Create Job'
                            )}
                        </Button>
                        <Button
                            variant="secondary"
                            onClick={handleClear}
                            disabled={isProcessing}
                        >
                            Clear
                        </Button>
                    </div>
                </div>
            )}

            {error && (
                <div className="voice-error">
                    <p>{error}</p>
                </div>
            )}

            <div className="voice-tips">
                <p><strong>Tips:</strong></p>
                <ul>
                    <li>Speak clearly and mention: job type, skills needed, budget, and duration</li>
                    <li>Example (Tamil): "எனக்கு ஒரு ரியாக்ட் டெவலப்பர் வேண்டும் 50000 ரூபாய்க்கு ஒரு மாதத்தில்"</li>
                    <li>Example (English): "I need a React developer for 50000 rupees in one month"</li>
                </ul>
            </div>
        </div>
    );
};

export default VoiceInput;
