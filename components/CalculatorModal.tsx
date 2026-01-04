
import React, { useState } from 'react';
import Modal from './common/Modal';

const CalculatorModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
    const [display, setDisplay] = useState('0');
    const [currentValue, setCurrentValue] = useState<number | null>(null);
    const [operator, setOperator] = useState<string | null>(null);
    const [waitingForOperand, setWaitingForOperand] = useState(false);

    const handleDigitClick = (digit: string) => {
        if (waitingForOperand) {
            setDisplay(digit);
            setWaitingForOperand(false);
        } else {
            setDisplay(display === '0' ? digit : display + digit);
        }
    };
    
    const handleDecimalClick = () => {
        if (!display.includes('.')) {
            setDisplay(display + '.');
        }
    };

    const handleOperatorClick = (nextOperator: string) => {
        const inputValue = parseFloat(display);

        if (currentValue === null) {
            setCurrentValue(inputValue);
        } else if (operator) {
            const result = performCalculation();
            setCurrentValue(result);
            setDisplay(String(result));
        }
        
        setWaitingForOperand(true);
        setOperator(nextOperator);
    };

    const performCalculation = () => {
        const inputValue = parseFloat(display);
        if (currentValue === null || operator === null) return inputValue;

        switch (operator) {
            case '+': return currentValue + inputValue;
            case '-': return currentValue - inputValue;
            case '*': return currentValue * inputValue;
            case '/': return currentValue / inputValue;
            default: return inputValue;
        }
    };

    const handleEqualsClick = () => {
        if (operator && currentValue !== null) {
            const result = performCalculation();
            setDisplay(String(result));
            setCurrentValue(null);
            setOperator(null);
            setWaitingForOperand(false);
        }
    };
    
    const handleClear = () => {
        setDisplay('0');
        setCurrentValue(null);
        setOperator(null);
        setWaitingForOperand(false);
    };

    const buttons = [
        '7', '8', '9', '/',
        '4', '5', '6', '*',
        '1', '2', '3', '-',
        '0', '.', '=', '+'
    ];
    
    const renderButton = (btn: string) => {
        const isOperator = ['/', '*', '-', '+'].includes(btn);
        const isEquals = btn === '=';
        
        let action;
        if (!isNaN(parseInt(btn))) action = () => handleDigitClick(btn);
        else if (btn === '.') action = handleDecimalClick;
        else if (isOperator) action = () => handleOperatorClick(btn);
        else if (isEquals) action = handleEqualsClick;
        
        let classes = "h-16 text-2xl font-bold rounded-lg transition-colors ";
        if(isOperator || isEquals) {
            classes += "bg-green-600 text-white hover:bg-green-500";
        } else {
            classes += "bg-gray-800 text-gray-200 hover:bg-gray-700 border border-green-500/30";
        }
        
        return <button key={btn} onClick={action} className={classes}>{btn}</button>;
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Calculadora">
            <div className="w-full max-w-xs mx-auto">
                <div className="w-full h-20 bg-black/50 border border-green-500/30 rounded-lg flex items-center justify-end p-4 mb-4">
                    <p className="text-4xl text-green-300 font-mono truncate">{display}</p>
                </div>
                <button onClick={handleClear} className="w-full h-12 mb-4 bg-red-800 hover:bg-red-700 text-white font-bold rounded-lg text-lg">
                    AC
                </button>
                <div className="grid grid-cols-4 gap-2">
                    {buttons.map(renderButton)}
                </div>
            </div>
        </Modal>
    );
};

export default CalculatorModal;
