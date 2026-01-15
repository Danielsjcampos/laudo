
import React, { useState } from 'react';
import { mockReportTemplates, type ReportTemplate } from '../../../data/mockData';
import { Button } from '../../ui/Button';
import { FileTextIcon } from '../../icons/FileTextIcon';
import { EditIcon } from '../../icons/EditIcon';
import { TrashIcon } from '../../icons/TrashIcon';
import { useToast } from '../../../contexts/ToastContext';

const ReportTemplatesManager: React.FC = () => {
    const [templates, setTemplates] = useState<ReportTemplate[]>(mockReportTemplates);
    const [isEditing, setIsEditing] = useState(false);
    const [currentTemplate, setCurrentTemplate] = useState<Partial<ReportTemplate>>({});
    const { addToast } = useToast();

    // Mock ID generation
    const generateId = () => `rt${Math.floor(Math.random() * 10000)}`;

    const handleSave = () => {
        if (!currentTemplate.title || !currentTemplate.content) {
            addToast('Preencha título e conteúdo.', 'error');
            return;
        }

        if (currentTemplate.id) {
            // Edit
            setTemplates(prev => prev.map(t => t.id === currentTemplate.id ? { ...t, ...currentTemplate as ReportTemplate } : t));
            addToast('Modelo atualizado!', 'success');
        } else {
            // Create
            const newTemplate: ReportTemplate = {
                id: generateId(),
                doctorId: 'd1', // Mock doctor ID
                title: currentTemplate.title,
                content: currentTemplate.content
            };
            setTemplates(prev => [...prev, newTemplate]);
            addToast('Modelo criado com sucesso!', 'success');
        }
        setIsEditing(false);
        setCurrentTemplate({});
    };

    const handleDelete = (id: string) => {
        if (confirm('Tem certeza que deseja excluir este modelo?')) {
            setTemplates(prev => prev.filter(t => t.id !== id));
            addToast('Modelo excluído.', 'success');
        }
    };

    const startEdit = (template: ReportTemplate) => {
        setCurrentTemplate(template);
        setIsEditing(true);
    };

    const startNew = () => {
        setCurrentTemplate({});
        setIsEditing(true);
    };

    return (
        <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-black text-gray-900">Meus Modelos de Laudo</h1>
                    <p className="text-gray-500 font-medium">Gerencie seus templates para agilizar a produção de laudos.</p>
                </div>
                {!isEditing && (
                    <Button onClick={startNew} className="rounded-xl shadow-lg">
                        + Novo Modelo
                    </Button>
                )}
            </div>

            {isEditing ? (
                <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 space-y-6">
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Título do Modelo</label>
                        <input
                            type="text"
                            value={currentTemplate.title || ''}
                            onChange={(e) => setCurrentTemplate(prev => ({ ...prev, title: e.target.value }))}
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-blue-500 outline-none"
                            placeholder="Ex: Raio-X Normal"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Conteúdo do Laudo</label>
                        <textarea
                            value={currentTemplate.content || ''}
                            onChange={(e) => setCurrentTemplate(prev => ({ ...prev, content: e.target.value }))}
                            className="w-full h-96 p-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-blue-500 outline-none font-mono text-sm"
                            placeholder="Escreva a estrutura do seu laudo aqui..."
                        />
                    </div>
                    <div className="flex justify-end space-x-3">
                        <Button variant="outline" onClick={() => setIsEditing(false)}>Cancelar</Button>
                        <Button onClick={handleSave}>Salvar Modelo</Button>
                    </div>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {templates.map(template => (
                        <div key={template.id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow group relative">
                            <div className="absolute top-4 right-4 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button onClick={() => startEdit(template)} className="p-2 bg-gray-100 rounded-lg hover:bg-brand-blue-50 text-gray-600 hover:text-brand-blue-600">
                                    <EditIcon className="h-4 w-4" />
                                </button>
                                <button onClick={() => handleDelete(template.id)} className="p-2 bg-gray-100 rounded-lg hover:bg-red-50 text-gray-600 hover:text-red-600">
                                    <TrashIcon className="h-4 w-4" />
                                </button>
                            </div>
                            <div className="flex items-center mb-4">
                                <div className="bg-brand-blue-50 p-3 rounded-xl mr-3">
                                    <FileTextIcon className="h-6 w-6 text-brand-blue-600" />
                                </div>
                                <h3 className="font-bold text-gray-900">{template.title}</h3>
                            </div>
                            <div className="bg-gray-50 p-3 rounded-xl h-32 overflow-hidden relative">
                                <p className="text-xs text-gray-500 whitespace-pre-wrap">{template.content}</p>
                                <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-gray-50 to-transparent"></div>
                            </div>
                        </div>
                    ))}

                    {templates.length === 0 && (
                        <div className="col-span-full text-center py-12 text-gray-400">
                            <p>Você ainda não possui modelos cadastrados.</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default ReportTemplatesManager;
