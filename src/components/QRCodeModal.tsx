import React, { useEffect, useState, useRef } from 'react';
import QRCode from 'qrcode';
import { QrCode, Copy, Check, ExternalLink, X, Maximize2, Minimize2 } from 'lucide-react';

interface QRCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  surveyUrl: string;
}

export const QRCodeModal: React.FC<QRCodeModalProps> = ({ isOpen, onClose, surveyUrl }) => {
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);
  const [isBigScreen, setIsBigScreen] = useState<boolean>(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!isOpen || !surveyUrl) return;

    QRCode.toDataURL(surveyUrl, {
      width: isBigScreen ? 450 : 280,
      margin: 2,
      color: {
        dark: '#1e1b4b',
        light: '#ffffff'
      }
    })
      .then((url) => setQrDataUrl(url))
      .catch((err) => console.error('Failed to generate QR code', err));
  }, [isOpen, surveyUrl, isBigScreen]);

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(surveyUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4 transition-all">
      <div 
        className={`bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 transition-all duration-300 relative flex flex-col items-center text-center ${
          isBigScreen ? 'max-w-2xl w-full p-8 sm:p-12' : 'max-w-md w-full p-6 sm:p-8'
        }`}
      >
        {/* Controls */}
        <div className="absolute top-4 right-4 flex items-center gap-2">
          <button
            onClick={() => setIsBigScreen(!isBigScreen)}
            title={isBigScreen ? 'ย่อขนาดปกติ' : 'ขยายใหญ่สำหรับจอโปรเจกเตอร์'}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            {isBigScreen ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
          </button>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Header */}
        <div className="mb-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 text-xs font-semibold mb-2">
            <QrCode className="w-3.5 h-3.5" />
            <span>สแกนเพื่อตอบแบบประเมิน</span>
          </div>
          <h3 className={`font-bold text-slate-900 dark:text-white ${isBigScreen ? 'text-2xl sm:text-3xl' : 'text-xl'}`}>
            สแกน QR Code ด้วยมือถือ
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-sm">
            เปิดกล้องมือถือส่องเพื่อเริ่มทำแบบประเมินความพึงพอใจได้ทันที โดยไม่ต้องดาวน์โหลดแอปและไม่ระบุตัวตน
          </p>
        </div>

        {/* QR Code Container */}
        <div className="p-4 bg-white rounded-2xl shadow-inner border border-slate-200 dark:border-slate-800 my-2">
          {qrDataUrl ? (
            <img 
              src={qrDataUrl} 
              alt="Survey QR Code" 
              className={`mx-auto rounded-lg ${isBigScreen ? 'w-72 h-72 sm:w-80 sm:h-80' : 'w-52 h-52 sm:w-60 sm:h-60'}`}
            />
          ) : (
            <div className="w-52 h-52 flex items-center justify-center text-slate-400 text-xs">
              กำลังสร้าง QR Code...
            </div>
          )}
        </div>

        {/* URL Box */}
        <div className="w-full mt-3">
          <div className="flex items-center gap-2 p-2 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700/60 text-xs text-slate-600 dark:text-slate-300 font-mono">
            <span className="truncate flex-1 text-left px-2 select-all">{surveyUrl}</span>
            <button
              onClick={handleCopy}
              className="px-3 py-1.5 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg text-slate-700 dark:text-slate-200 hover:bg-slate-100 flex items-center gap-1 shrink-0 font-sans transition-colors font-medium"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-emerald-600">คัดลอกแล้ว</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>คัดลอก</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Bottom Actions */}
        <div className="w-full grid grid-cols-2 gap-3 mt-4">
          <a
            href={surveyUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="py-2.5 px-3 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-medium flex items-center justify-center gap-1.5 transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>เปิดหน้าตอบในแท็บใหม่</span>
          </a>
          <button
            onClick={() => setIsBigScreen(!isBigScreen)}
            className="py-2.5 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-medium flex items-center justify-center gap-1.5 transition-colors shadow-xs"
          >
            {isBigScreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
            <span>{isBigScreen ? 'โหมดขนาดปกติ' : 'โหมดจอโปรเจกเตอร์'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
