'use client';

import React, { useContext } from 'react';
import { LanguageContext } from '../app/providers';
import { X } from 'lucide-react';
import { QR_IMAGES } from '../constants';

interface WeChatQRModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const WeChatQRModal: React.FC<WeChatQRModalProps> = ({ isOpen, onClose }) => {
  const { t } = useContext(LanguageContext);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" onClick={onClose}>
      <div className="bg-white dark:bg-gray-900 p-6 rounded-3xl shadow-2xl max-w-sm w-full relative" onClick={e => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-900 dark:hover:text-white">
          <X size={24} />
        </button>
        <div className="text-center">
          <h3 className="text-xl font-bold mb-4">{t('about.scanAdd')}</h3>
          <div className="bg-white p-2 rounded-xl inline-block mb-2 shadow-inner border border-gray-100">
            <img src={QR_IMAGES.wechatContact} alt="WeChat QR" className="w-48 h-48 object-contain" />
          </div>
          <p className="text-sm text-gray-500">ID: xiaocaiquan</p>
        </div>
      </div>
    </div>
  );
};
