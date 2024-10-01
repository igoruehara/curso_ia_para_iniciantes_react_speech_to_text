import React, { useState, useEffect, useRef } from 'react';
import './SpeechToText.css';

const SpeechToText = () => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [error, setError] = useState('');
  const recognitionRef = useRef(null);

  useEffect(() => {
    // Verifica se o navegador suporta a Web Speech API
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setError('Seu navegador não suporta a Web Speech API. Por favor, use o Chrome ou Edge.');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'pt-BR';
    recognition.interimResults = true;
    recognition.continuous = true;

    recognitionRef.current = recognition;

    recognition.onresult = (event) => {
      let interimTranscript = '';
      let finalTranscript = '';
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        const transcriptPiece = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += transcriptPiece + ' ';
        } else {
          interimTranscript += transcriptPiece;
        }
      }
      setTranscript(finalTranscript + interimTranscript);
    };

    recognition.onerror = (event) => {
      console.error('Speech recognition error detected: ' + event.error);
      setError('Ocorreu um erro durante o reconhecimento de fala: ' + event.error);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    // Cleanup quando o componente for desmontado
    return () => {
      recognition.stop();
    };
  }, []);

  const startListening = () => {
    if (recognitionRef.current) {
      setTranscript('');
      setError('');
      recognitionRef.current.start();
      setIsListening(true);
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  };

  return (
    <div className="speech-container">
      <h1>Reconhecimento de Fala (Speech-to-Text)</h1>

      {error && <p className="error">{error}</p>}

      <div className="controls">
        {!isListening ? (
          <button onClick={startListening}>Iniciar Gravação</button>
        ) : (
          <button onClick={stopListening}>Parar Gravação</button>
        )}
      </div>

      <div className="transcript">
        <h2>Texto Transcrito:</h2>
        <p>{transcript}</p>
      </div>
    </div>
  );
};

export default SpeechToText;
