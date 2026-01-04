
import React, { useState } from 'react';
import Modal from './common/Modal';

const QuickNoteModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
    const [note, setNote] = useState('');

    const handleSave = () => {
        if (note.trim() === '') {
            alert("La nota está vacía.");
            return;
        }
        // In a real app, this would save to a state management solution or API.
        console.log("Nota Guardada:", note);
        alert("Nota guardada en la consola del desarrollador.");
        setNote('');
        onClose();
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Nota Rápida">
            <div>
                <textarea
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    className="input-style w-full font-mono"
                    rows={12}
                    placeholder="Escribe tus ideas aquí..."
                    autoFocus
                />
                <div className="mt-4 flex justify-end">
                    <button
                        onClick={handleSave}
                        className="px-6 py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-500"
                    >
                        Guardar Nota
                    </button>
                </div>
            </div>
        </Modal>
    );
};

export default QuickNoteModal;
