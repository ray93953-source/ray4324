import React, { useState, useEffect } from 'react';
import {
  X,
  Camera,
  MapPin,
  ThumbsUp,
  ThumbsDown,
  Upload,
  CheckCircle2,
  Sparkles,
  ArrowRight,
} from 'lucide-react';
import { Bridge, CitizenReport } from '../types';
import { useLanguage } from '../i18n/LanguageContext';

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  bridges: Bridge[];
  preselectedBridgeId?: string;
  onSubmitReport: (newReport: Omit<CitizenReport, 'id' | 'reportedAt' | 'status'>) => void;
}

export const ReportModal: React.FC<ReportModalProps> = ({
  isOpen,
  onClose,
  bridges,
  preselectedBridgeId,
  onSubmitReport,
}) => {
  const { t } = useLanguage();
  const [selectedBridgeId, setSelectedBridgeId] = useState<string>('');
  const [thumbs, setThumbs] = useState<'up' | 'down'>('down');
  const [issueCategory, setIssueCategory] = useState<CitizenReport['issueCategory']>('Cracking / Spalling');
  const [comment, setComment] = useState<string>('');
  const [photoUrl, setPhotoUrl] = useState<string>('');
  const [isLocating, setIsLocating] = useState<boolean>(false);
  const [isSubmittedSuccess, setIsSubmittedSuccess] = useState<boolean>(false);
  const [reporterRole, setReporterRole] = useState<CitizenReport['reporterRole']>('Citizen');

  // Sample quick disaster/structural photos for fast demo testing
  const SAMPLE_PHOTOS = [
    {
      label: 'Pier Foundation Crack',
      url: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=600&q=80',
    },
    {
      label: 'High Water Current Swirl',
      url: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=600&q=80',
    },
    {
      label: 'Damaged Expansion Joint',
      url: 'https://images.unsplash.com/photo-1506157786151-b8491531f063?auto=format&fit=crop&w=600&q=80',
    },
  ];

  useEffect(() => {
    if (preselectedBridgeId) {
      setSelectedBridgeId(preselectedBridgeId);
    } else if (bridges.length > 0 && !selectedBridgeId) {
      setSelectedBridgeId(bridges[0].id);
    }
  }, [preselectedBridgeId, bridges, selectedBridgeId]);

  if (!isOpen) return null;

  const currentBridge = bridges.find((b) => b.id === selectedBridgeId) || bridges[0];

  const handleAutoLocateNearest = () => {
    setIsLocating(true);
    setTimeout(() => {
      setSelectedBridgeId(bridges[0].id);
      setIsLocating(false);
    }, 600);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const fakeUrl = URL.createObjectURL(file);
      setPhotoUrl(fakeUrl);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentBridge) return;

    onSubmitReport({
      bridgeId: currentBridge.id,
      bridgeName: currentBridge.name,
      thumbs: thumbs,
      issueCategory: thumbs === 'down' ? issueCategory : 'Normal Condition',
      comment:
        comment.trim() ||
        (thumbs === 'down'
          ? `Observed ${issueCategory} on the deck/pier structure.`
          : 'Bridge surface clear, normal traffic flow and stable deck.'),
      photoUrl: photoUrl || undefined,
      hasPhoto: Boolean(photoUrl),
      userLocation: { lat: currentBridge.lat, lng: currentBridge.lng },
      reporterRole: reporterRole,
      reporterName: reporterRole === 'Citizen' ? 'Elena R. (Citizen Reporter)' : 'Commercial Driver #882',
    });

    setIsSubmittedSuccess(true);
    setTimeout(() => {
      setIsSubmittedSuccess(false);
      onClose();
      // Reset form
      setComment('');
      setPhotoUrl('');
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700/80 rounded-3xl w-full max-w-xl max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 bg-slate-900/95 backdrop-blur-md px-6 py-4 border-b border-slate-800 flex items-center justify-between z-10">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center">
              <Camera className="h-4 w-4" />
            </div>
            <div>
              <h2 className="font-bold text-base text-white">{t('modalTitle')}</h2>
              <p className="text-xs text-slate-400">{t('modalSub')}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        {isSubmittedSuccess ? (
          <div className="p-8 text-center space-y-4">
            <div className="h-16 w-16 mx-auto rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center animate-bounce">
              <CheckCircle2 className="h-8 w-8" />
            </div>
            <h3 className="text-xl font-bold text-white">{t('reportSuccessTitle')}</h3>
            <p className="text-sm text-slate-300 max-w-md mx-auto">
              <span className="text-amber-400 font-semibold">{currentBridge?.name}</span> {t('reportSuccessSub')}
            </p>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-500/20 border border-amber-500/30 text-amber-400 rounded-full text-xs font-semibold">
              <Sparkles className="h-3.5 w-3.5" /> {t('pointsAwarded')}
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            {/* Step 1: Select Bridge */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <label className="font-semibold text-slate-200 flex items-center gap-1.5">
                  <MapPin className="h-3.5 w-3.5 text-amber-400" /> {t('targetBridgeLocation')}
                </label>
                <button
                  type="button"
                  onClick={handleAutoLocateNearest}
                  className="text-amber-400 hover:underline flex items-center gap-1 cursor-pointer"
                >
                  {isLocating ? t('detectingGps') : t('autoDetectNearest')}
                </button>
              </div>

              <select
                value={selectedBridgeId}
                onChange={(e) => setSelectedBridgeId(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500"
              >
                {bridges.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.name} ({b.riverOrCrossing} • {t('score')}: {b.riskScore}/100)
                  </option>
                ))}
              </select>
            </div>

            {/* Step 2: Thumbs Up / Thumbs Down Condition Assessment */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-slate-200">
                {t('conditionAssessment')}
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setThumbs('down')}
                  className={`p-4 rounded-2xl border flex flex-col items-center justify-center gap-2 transition-all cursor-pointer ${
                    thumbs === 'down'
                      ? 'bg-rose-500/20 border-rose-500 text-rose-300 ring-2 ring-rose-500/30'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <ThumbsDown className="h-7 w-7 text-rose-500" />
                  <span className="font-bold text-sm text-white">{t('problemObserved')}</span>
                  <span className="text-[11px] text-slate-400 text-center">
                    {t('problemObservedSub')}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setThumbs('up')}
                  className={`p-4 rounded-2xl border flex flex-col items-center justify-center gap-2 transition-all cursor-pointer ${
                    thumbs === 'up'
                      ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300 ring-2 ring-emerald-500/30'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <ThumbsUp className="h-7 w-7 text-emerald-500" />
                  <span className="font-bold text-sm text-white">{t('looksSoundSafe')}</span>
                  <span className="text-[11px] text-slate-400 text-center">
                    {t('looksSoundSafeSub')}
                  </span>
                </button>
              </div>
            </div>

            {/* Step 3: Hazard Category (If Thumbs Down) */}
            {thumbs === 'down' && (
              <div className="space-y-2 animate-in fade-in duration-150">
                <label className="block text-xs font-semibold text-slate-200">{t('hazardTypeLabel')}</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {(
                    [
                      'Cracking / Spalling',
                      'Water Level / Submergence',
                      'Vibration / Sway',
                      'Pothole / Road Surface',
                      'Expansion Joint Failure',
                      'Debris Jamming Pier',
                    ] as const
                  ).map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setIssueCategory(cat)}
                      className={`px-3 py-2 text-xs rounded-xl border text-center transition-all cursor-pointer ${
                        issueCategory === cat
                          ? 'bg-amber-500/20 border-amber-500 text-amber-300 font-semibold'
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 4: Photo Upload with Sample Quick Picks */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <label className="font-semibold text-slate-200 flex items-center gap-1.5">
                  <Camera className="h-3.5 w-3.5 text-amber-400" /> {t('photoEvidenceLabel')}
                </label>
                <span className="text-[11px] text-slate-400">{t('photoTrustBonus')}</span>
              </div>

              {photoUrl ? (
                <div className="relative rounded-2xl overflow-hidden h-36 bg-slate-950 border border-slate-700">
                  <img src={photoUrl} alt="Report evidence" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => setPhotoUrl('')}
                    className="absolute top-2 right-2 p-1 rounded-full bg-slate-900/80 text-white hover:bg-slate-900 cursor-pointer"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <div className="space-y-2">
                  <label className="border-2 border-dashed border-slate-800 hover:border-amber-500/50 rounded-2xl p-4 flex flex-col items-center justify-center gap-2 cursor-pointer transition-colors bg-slate-950/40">
                    <Upload className="h-6 w-6 text-slate-400" />
                    <span className="text-xs text-slate-300 font-medium">{t('uploadPrompt')}</span>
                    <span className="text-[10px] text-slate-500">{t('uploadSpecs')}</span>
                    <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
                  </label>

                  {/* Quick sample photo selector for prototype demonstration */}
                  <div className="pt-1">
                    <span className="text-[10px] text-slate-400 font-medium">{t('demoPhotoPrompt')}</span>
                    <div className="flex items-center gap-2 mt-1">
                      {SAMPLE_PHOTOS.map((p) => (
                        <button
                          key={p.label}
                          type="button"
                          onClick={() => setPhotoUrl(p.url)}
                          className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-[11px] text-slate-300 rounded-lg border border-slate-700 truncate cursor-pointer"
                        >
                          {p.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Step 5: Comment */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-200">
                {t('additionalNotes')}
              </label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder={
                  thumbs === 'down'
                    ? 'E.g., Crack on Pier 3 footing is widening, vibrations felt under heavy truck axle loads...'
                    : 'E.g., Clear passage, no ponding water, regular speed limit maintained...'
                }
                rows={3}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
              />
            </div>

            {/* Reporter Role Selector */}
            <div className="flex items-center justify-between text-xs pt-1">
              <span className="text-slate-400">{t('submittingAs')}</span>
              <div className="flex items-center gap-2">
                {(['Citizen', 'Truck Driver', 'Bus Transit'] as const).map((role) => (
                  <button
                    key={role}
                    type="button"
                    onClick={() => setReporterRole(role)}
                    className={`px-2.5 py-1 rounded-md text-[11px] transition-colors cursor-pointer ${
                      reporterRole === role
                        ? 'bg-amber-500 text-slate-950 font-bold'
                        : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {role}
                  </button>
                ))}
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 via-rose-500 to-rose-600 text-slate-950 font-bold text-sm shadow-lg shadow-rose-500/25 hover:opacity-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>{t('submitReportBtn')}</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
