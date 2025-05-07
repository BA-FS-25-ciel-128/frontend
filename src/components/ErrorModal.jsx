// ErrorModal.jsx
import React from 'react';
import { useChat } from '../hooks/useChat';

export const ErrorModal = () => {
    const { error, clearError } = useChat();

    if (!error) return null;

    return (
        <div className="error-modal-overlay">
            <div className="error-modal">
                <h3>Fehler im Backend</h3>
                <p>Es wurde eine unzulässige Nachricht gesendet, bitte versuche es erneut!</p>
                <button onClick={clearError}>Schliessen</button>
            </div>
        </div>
    );
};