import React, { useState } from 'react';
import { usePWAInstall } from '../utils/usePWAInstall';
import { downloadProjectZip } from '../utils/zipExporter';
import {
  X,
  Download,
  Smartphone,
  Laptop,
  Apple,
  Share2,
  Copy,
  CheckCircle2,
  ExternalLink,
  FolderArchive,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';

interface DownloadAppModalProps {
  isOpen: boolean;
  onClose: () => void;
  appName: string;
}

export const DownloadAppModal: React.FC<DownloadAppModalProps> = ({
  isOpen,
  onClose,
  appName,
}) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [activeTab, setActiveTab] = useState<'install' | 'source' | 'link'>('install');
  const [isZipping, setIsZipping] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  if (!isOpen) return null;

  const currentUrl = typeof window !== 'undefined' ? window.location.href : 'https://ais-pre-aocmqdq6dhq6khfym55tco-690181941591.asia-northeast1.run.app';

  const handleDownloadZip = async () => {
    setIsZipping(true);
    try {
      await downloadProjectZip(appName);
    } catch (err) {
      console.error('Error generating zip:', err);
    } finally {
      setIsZipping(false);
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard?.writeText(currentUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="relative bg-white w-full max-w-2xl rounded-2xl shadow-2xl border border-stone-200 overflow-hidden my-6 max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-200 bg-stone-900 text-white">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-amber-400 text-stone-950 font-display font-bold flex items-center justify-center text-sm">
              <Download className="w-4 h-4 stroke-[2.5]" />
            </div>
            <div>
              <h3 className="font-display font-bold text-lg text-white">
                Download & Install {appName}
              </h3>
              <p className="text-xs text-stone-400">
                Install as a mobile app, save source code, or share online
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-stone-400 hover:text-white hover:bg-stone-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selection */}
        <div className="flex border-b border-stone-200 px-6 bg-stone-50 gap-4 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('install')}
            className={`py-3 px-2 border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'install'
                ? 'border-amber-500 text-amber-700 font-bold'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            <Smartphone className="w-4 h-4" />
            <span>Install App on Phone / PC</span>
          </button>

          <button
            onClick={() => setActiveTab('source')}
            className={`py-3 px-2 border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'source'
                ? 'border-amber-500 text-amber-700 font-bold'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            <FolderArchive className="w-4 h-4" />
            <span>Download Source Code (.ZIP)</span>
          </button>

          <button
            onClick={() => setActiveTab('link')}
            className={`py-3 px-2 border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'link'
                ? 'border-amber-500 text-amber-700 font-bold'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            <Share2 className="w-4 h-4" />
            <span>Shareable Web Link</span>
          </button>
        </div>

        {/* Tab Content */}
        <div className="overflow-y-auto p-6 space-y-6">
          {activeTab === 'install' && (
            <div className="space-y-5">
              {/* Status Banner */}
              {isInstalled ? (
                <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-3 text-emerald-800 text-xs">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                  <div>
                    <span className="font-bold block">App is already installed!</span>
                    You are running {appName} in standalone native application mode.
                  </div>
                </div>
              ) : isInstallable ? (
                <div className="p-4 bg-amber-50 border border-amber-300 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div>
                    <span className="font-bold text-stone-900 text-sm block">
                      Ready for One-Click Install
                    </span>
                    <span className="text-xs text-stone-600">
                      Install {appName} to your home screen or desktop application menu.
                    </span>
                  </div>
                  <button
                    onClick={install}
                    className="px-5 py-2.5 bg-amber-400 hover:bg-amber-300 text-stone-950 font-bold text-xs rounded-lg shadow-sm whitespace-nowrap active:scale-[0.98]"
                  >
                    Install {appName} Now
                  </button>
                </div>
              ) : null}

              {/* Instructions by Device */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Android Phone */}
                <div className="p-4 rounded-xl border border-stone-200 bg-stone-50 space-y-2">
                  <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center mb-1">
                    <Smartphone className="w-4 h-4" />
                  </div>
                  <h4 className="font-bold text-stone-900 text-xs">Android (Chrome / Edge)</h4>
                  <ol className="text-[11px] text-stone-600 space-y-1 list-decimal pl-4 leading-relaxed">
                    <li>Open this URL in Google Chrome.</li>
                    <li>Tap the <strong>three dots (⋮)</strong> menu in the top right.</li>
                    <li>Tap <strong>"Install app"</strong> or <strong>"Add to Home screen"</strong>.</li>
                  </ol>
                </div>

                {/* iPhone / iPad */}
                <div className="p-4 rounded-xl border border-stone-200 bg-stone-50 space-y-2">
                  <div className="w-8 h-8 rounded-lg bg-stone-200 text-stone-800 flex items-center justify-center mb-1">
                    <Apple className="w-4 h-4" />
                  </div>
                  <h4 className="font-bold text-stone-900 text-xs">iPhone & iPad (Safari)</h4>
                  <ol className="text-[11px] text-stone-600 space-y-1 list-decimal pl-4 leading-relaxed">
                    <li>Open this link in Apple <strong>Safari</strong>.</li>
                    <li>Tap the <strong>Share button</strong> (square with arrow up).</li>
                    <li>Scroll down and tap <strong>"Add to Home Screen"</strong>.</li>
                  </ol>
                </div>

                {/* PC / Laptop */}
                <div className="p-4 rounded-xl border border-stone-200 bg-stone-50 space-y-2">
                  <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center mb-1">
                    <Laptop className="w-4 h-4" />
                  </div>
                  <h4 className="font-bold text-stone-900 text-xs">Windows / Mac Laptop</h4>
                  <ol className="text-[11px] text-stone-600 space-y-1 list-decimal pl-4 leading-relaxed">
                    <li>Open this link in Chrome or Edge.</li>
                    <li>Click the <strong>Install icon</strong> in the right side of the address bar.</li>
                    <li>Launch anytime from your desktop or start menu.</li>
                  </ol>
                </div>
              </div>

              <div className="p-3 bg-stone-100 rounded-xl text-stone-600 text-xs flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>
                  Works offline with low data caching—tailored specifically for Papua New Guinea mobile connections.
                </span>
              </div>
            </div>
          )}

          {activeTab === 'source' && (
            <div className="space-y-5">
              <div className="p-5 bg-stone-50 rounded-2xl border border-stone-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h4 className="font-bold text-stone-900 text-sm">
                    Download Complete Source Code (.ZIP)
                  </h4>
                  <p className="text-xs text-stone-600 mt-0.5 max-w-md">
                    Packages all React, TypeScript, Tailwind styles, PNG mock data, and test files into a ready-to-run ZIP archive.
                  </p>
                </div>

                <button
                  onClick={handleDownloadZip}
                  disabled={isZipping}
                  className="px-5 py-2.5 bg-amber-400 hover:bg-amber-300 disabled:opacity-50 text-stone-950 font-bold text-xs rounded-xl shadow-sm flex items-center gap-2 whitespace-nowrap active:scale-[0.98]"
                >
                  <Download className="w-4 h-4" />
                  <span>{isZipping ? 'Packaging ZIP...' : 'Download Project ZIP'}</span>
                </button>
              </div>

              {/* Instructions for Google AI Studio Interface Export */}
              <div className="p-4 rounded-xl border border-stone-200 bg-white space-y-2">
                <span className="text-xs font-bold text-stone-800 uppercase tracking-wide">
                  Export directly via Google AI Studio Header
                </span>
                <p className="text-xs text-stone-600 leading-relaxed">
                  You can also download your app or export to GitHub directly through the AI Studio interface:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 text-xs">
                  <div className="p-3 bg-stone-50 rounded-lg border border-stone-100">
                    <strong className="block text-stone-900 mb-0.5">1. Export to ZIP</strong>
                    Look for the <strong>Download / Export</strong> icon in the top header menu of Google AI Studio to download the entire workspace.
                  </div>
                  <div className="p-3 bg-stone-50 rounded-lg border border-stone-100">
                    <strong className="block text-stone-900 mb-0.5">2. Push to GitHub</strong>
                    Connect your GitHub account in AI Studio to commit and deploy this repository straight into GitHub.
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'link' && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase mb-1">
                  Public Web Address for {appName}
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    readOnly
                    value={currentUrl}
                    className="w-full text-xs p-3 bg-stone-50 border border-stone-300 rounded-lg font-mono text-stone-800 select-all"
                  />
                  <button
                    onClick={handleCopyLink}
                    className="px-4 py-3 bg-stone-900 hover:bg-stone-800 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shrink-0"
                  >
                    {copiedLink ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                    <span>{copiedLink ? 'Copied!' : 'Copy Link'}</span>
                  </button>
                </div>
              </div>

              <div className="p-4 bg-amber-50/70 border border-amber-200 rounded-xl text-xs text-stone-700 leading-relaxed">
                <span className="font-bold text-stone-900 block mb-1">How to access on mobile in PNG:</span>
                Send this link to yourself on WhatsApp, open it on your phone (Digicel or Vodafone 4G), and tap <strong>"Add to Home Screen"</strong> to enjoy the native full-screen app experience!
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-stone-50 border-t border-stone-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-stone-900 hover:bg-stone-800 text-white font-semibold text-xs rounded-lg"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
