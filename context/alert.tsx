import React, { createContext, useContext, useState } from 'react';
import CustomAlert from '@/components/CustomAlert';

interface AlertButton {
  text: string;
  onPress: () => void;
  style?: 'default' | 'cancel' | 'confirm';
}

interface AlertContextType {
  alert: (title: string, message: string, buttons?: AlertButton[]) => void;
}

const AlertContext = createContext<AlertContextType | undefined>(undefined);

export function AlertProvider({ children }: { children: React.ReactNode }) {
  const [visible, setVisible] = useState(false);
  const [alertConfig, setAlertConfig] = useState({
    title: '',
    message: '',
    buttons: [{ text: '확인', onPress: () => {}, style: 'default' as const }],
  });

  const alert = (title: string, message: string, buttons?: AlertButton[]) => {
    setAlertConfig({
      title,
      message,
      buttons: buttons || [{ text: '확인', onPress: () => {}, style: 'default' }],
    });
    setVisible(true);
  };

  return (
    <AlertContext.Provider value={{ alert }}>
      {children}
      <CustomAlert
        visible={visible}
        title={alertConfig.title}
        message={alertConfig.message}
        buttons={alertConfig.buttons}
        onClose={() => setVisible(false)}
      />
    </AlertContext.Provider>
  );
}

export function useAlert() {
  const context = useContext(AlertContext);
  if (context === undefined) {
    throw new Error('useAlert must be used within an AlertProvider');
  }
  return context;
} 