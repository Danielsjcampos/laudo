import React, { useState } from 'react';
import { Modal } from '../../ui/Modal';
import { Button } from '../../ui/Button';
import { useToast } from '../../../contexts/ToastContext';

interface AddPatientModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (name: string, cpf: string, email: string) => void;
}

export const AddPatientModal: React.FC<AddPatientModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const [name, setName] = useState('');
  const [cpf, setCpf] = useState('');
  const [email, setEmail] = useState('');
  const { addToast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name && cpf && email) {
      onSubmit(name, cpf, email);
      addToast('Paciente cadastrado com sucesso!', 'success');
      onClose(); // Close modal on successful submission
      // Reset form fields
      setName('');
      setCpf('');
      setEmail('');
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Cadastrar Novo Paciente">
      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Nome Completo</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Nome do paciente"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-blue-500 focus:border-brand-blue-500"
              required
            />
          </div>
          <div>
            <label htmlFor="cpf" className="block text-sm font-medium text-gray-700 mb-1">CPF</label>
            <input
              type="text"
              id="cpf"
              value={cpf}
              onChange={(e) => setCpf(e.target.value)}
              placeholder="000.000.000-00"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-blue-500 focus:border-brand-blue-500"
              required
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">E-mail</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="email@paciente.com"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-blue-500 focus:border-brand-blue-500"
              required
            />
          </div>
        </div>
        <div className="mt-6 flex justify-end space-x-2">
          <Button type="button" variant="outline" onClick={onClose}>Cancelar</Button>
          <Button type="submit">Cadastrar</Button>
        </div>
      </form>
    </Modal>
  );
};
