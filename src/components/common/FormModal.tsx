import React from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';

interface FormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: () => void;
  title: string;
  children: React.ReactNode;
  isLoading?: boolean;
  submitLabel?: string;
}

export const FormModal: React.FC<FormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  title,
  children,
  isLoading = false,
  submitLabel = 'Save',
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      footer={
        <>
          <Button
            variant="text"
            onClick={onClose}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            onClick={onSubmit}
            loading={isLoading}
          >
            {submitLabel}
          </Button>
        </>
      }
    >
      {children}
    </Modal>
  );
};
