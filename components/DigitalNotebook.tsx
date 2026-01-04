
import React from 'react';
import Header from './Header';

const DigitalNotebook: React.FC = () => {
    return (
        <div>
            <Header title="Cuaderno Digital" />
            <div className="bg-black/50 backdrop-blur-sm border border-green-500/20 shadow-lg p-8 rounded-lg text-center">
                 <div className="mb-4 text-5xl text-green-400">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                </div>
                <h3 className="text-2xl font-semibold text-green-300">Módulo en Desarrollo</h3>
                <p className="text-gray-400 mt-2">
                    Un sistema avanzado de toma de notas con reconocimiento de escritura está siendo integrado.
                    <br />
                    Próximamente podrás dibujar, escribir a mano y organizar tus ideas en este cuaderno digital inteligente.
                </p>
                 <div className="mt-6 animate-pulse text-sm text-green-500/50">
                    [ INICIALIZANDO MOTOR DE RECONOCIMIENTO MyScript... ]
                </div>
            </div>
        </div>
    );
};

export default DigitalNotebook;
