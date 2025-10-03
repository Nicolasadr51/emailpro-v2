// Page de l'éditeur d'emails - Version avancée avec architecture Claude 4.5 Sonnet
import React from 'react';
import { EmailEditor } from '../features/email-editor/components/EmailEditor';
import { EmailEditorProvider } from '../contexts/EmailEditorContext';

export const EmailEditorPage: React.FC = () => {
  return (
    <EmailEditorProvider>
      <EmailEditor />
    </EmailEditorProvider>
  );
};
