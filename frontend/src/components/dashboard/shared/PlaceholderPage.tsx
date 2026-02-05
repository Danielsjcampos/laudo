import React from 'react';
import { StethoscopeIcon } from '../../icons/StethoscopeIcon';

interface PlaceholderPageProps {
    title: string;
    message?: string;
}

const PlaceholderPage: React.FC<PlaceholderPageProps> = ({ title, message }) => {
    return (
        <div className="flex flex-col items-center justify-center h-full bg-gray-50 p-8 rounded-lg text-center">
            <StethoscopeIcon className="h-16 w-16 text-brand-blue-300 mb-4" />
            <h1 className="text-2xl font-bold text-gray-700">{title}</h1>
            <p className="mt-2 text-gray-500 max-w-md">
                {message || 'Esta funcionalidade está em desenvolvimento e estará disponível em breve.'}
            </p>
        </div>
    );
};

export default PlaceholderPage;
