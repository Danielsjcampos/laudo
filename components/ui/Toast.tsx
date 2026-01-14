import React, { useEffect, useState } from 'react';
import { XIcon } from '../icons/XIcon';
import { CheckCircleIcon } from '../icons/CheckCircleIcon';
import { InfoIcon } from '../icons/InfoIcon';
import { SuccessIcon } from '../icons/SuccessIcon';

type ToastType = 'info' | 'success' | 'warning' | 'error';

interface ToastProps {
  message: string;
  type: ToastType;
  onClose: () => void;
}

const toastConfig = {
    success: {
        icon: <SuccessIcon className="h-5 w-5 text-white" />,
        bg: 'bg-green-500',
    },
    info: {
        icon: <InfoIcon className="h-5 w-5 text-white" />,
        bg: 'bg-blue-500',
    },
    warning: {
        icon: <InfoIcon className="h-5 w-5 text-white" />,
        bg: 'bg-yellow-500',
    },
    error: {
        icon: <InfoIcon className="h-5 w-5 text-white" />,
        bg: 'bg-red-500',
    },
}

export const Toast: React.FC<ToastProps> = ({ message, type, onClose }) => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        setIsVisible(true);
        const timer = setTimeout(() => {
            handleClose();
        }, 4500); // Start fade out before auto-dismiss
        return () => clearTimeout(timer);
    }, []);

    const handleClose = () => {
        setIsVisible(false);
        setTimeout(onClose, 300); // Wait for fade-out animation
    };

    const { icon, bg } = toastConfig[type];

    return (
        <div
            className={`flex items-center text-white p-4 rounded-lg shadow-lg transition-all duration-300 ease-in-out transform ${bg} ${
                isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'
            }`}
            role="alert"
        >
            <div className="flex-shrink-0">{icon}</div>
            <div className="ml-3 text-sm font-medium">{message}</div>
            <button onClick={handleClose} className="ml-4 -mr-2 p-1.5 rounded-md inline-flex items-center justify-center hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white">
                <span className="sr-only">Close</span>
                <XIcon className="h-4 w-4" />
            </button>
        </div>
    );
};
