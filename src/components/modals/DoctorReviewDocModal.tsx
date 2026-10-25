import React, { useState } from 'react';
import { DoctorAuth, HealthDocument, Patient } from '../../types/clinical';

interface DoctorReviewDocModalProps {
  isOpen: boolean;
  document: HealthDocument | null;
  patient: Patient;
  doctorAuth?: DoctorAuth;
  onClose: () => void;
  onSaveReview: (docId: string, doctorNotes: string, reviewedByName: string) => void;
  onShowToast: (msg: string, type?: 'success' | 'alert' | 'info') => void;
}

export const DoctorReviewDocModal: React.FC<DoctorReviewDocModalProps> = ({
  isOpen,
  document,
  patient,
  doctorAuth,
  onClose,
  onSaveReview,
  onShowToast,
}) => {
  if (!isOpen || !document) return null;

  const [notes, setNotes] = useState(
    document.doctorNotes ||
      `Clinically correlated with patient condition (${patient.name}, ${patient.age}y). Findings reviewed and verified.`
  );
  const [digitalSign, setDigitalSign] = useState(true);

  const quickObservations = [
    '✓ Normal parameters / Clinically stable',
    '⚠️ Minor elevation noted - monitor on rounds',
    'Clear lung fields / No acute cardiopulmonary pathology',
    'Follow-up diagnostic testing in 2 weeks',
    'Correlated with active medication regimen',
  ];

  const handleApplyPreset = (txt: string) => {
    setNotes((prev) => (prev ? `${prev} ${txt}` : txt));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!notes.trim()) {
      onShowToast('Please provide your clinical assessment / review notes', 'alert');
      return;
    }

    const reviewerName = doctorAuth?.name || 'Dr. Attending Physician, MD';
    onSaveReview(document.id, notes.trim(), reviewerName);
    onShowToast(`Document "${document.title}" reviewed & signed by ${reviewerName}!`, 'success');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white w-full max-w-xl rounded-2xl shadow-2xl border border-[#dce9ff] flex flex-col max-h-[90vh] overflow-hidden">
        {/* Modal Header */}
        <div className="p-4 bg-[#eff4ff] border-b border-[#dce9ff] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-[#004357] text-white flex items-center justify-center">
              <span className="material-symbols-outlined text-[22px]">stethoscope</span>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h2 className="font-bold text-sm text-[#004357]">Doctor Diagnostic Review & Sign-Off</h2>
                <span className="px-1.5 py-0.2 rounded bg-[#dcfce7] text-[#166534] text-[9px] font-bold uppercase">
                  Clinical Action
                </span>
              </div>
              <p className="text-[11px] text-[#40484c]">
                Patient: <strong className="text-[#0b1c30]">{patient.name}</strong> • MRN: {patient.mrn} • {patient.bloodType}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-[#70787d] hover:bg-[#dce9ff] cursor-pointer"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 space-y-4 overflow-y-auto text-xs">
          {/* Document Summary Card */}
          <div className="p-3 rounded-xl bg-[#f8f9ff] border border-[#dce9ff] flex flex-col gap-2">
            <div className="flex items-start justify-between gap-2">
              <div>
                <span className="px-2 py-0.5 rounded-md bg-[#e5eeff] text-[#004357] font-bold text-[10px] uppercase">
                  {document.category}
                </span>
                <h3 className="font-bold text-sm text-[#0b1c30] mt-1">{document.title}</h3>
                <div className="text-[11px] text-[#52606d] mt-0.5">
                  Diagnostic Facility: {document.doctorOrLab} • Date: {document.date}
                </div>
              </div>
              <span className="text-[10px] text-[#70787d] font-mono">{document.fileSize}</span>
            </div>

            {/* Document Image or Scan Preview */}
            {document.fileUrl ? (
              <div className="rounded-xl overflow-hidden border border-[#dce9ff] bg-black/5 max-h-48 flex items-center justify-center relative group">
                <img
                  src={document.fileUrl}
                  alt={document.title}
                  className="w-full h-48 object-cover group-hover:scale-102 transition-transform"
                />
                <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-black/70 text-white text-[10px] backdrop-blur-xs flex items-center gap-1">
                  <span className="material-symbols-outlined text-[12px]">zoom_in</span>
                  <span>Radiology / Pathology View</span>
                </div>
              </div>
            ) : null}

            {/* AI Summary */}
            <div className="p-2.5 rounded-lg bg-[#eff4ff] border border-[#dce9ff] text-[#004357] text-[11px]">
              <strong className="block text-[10px] uppercase text-[#006398] mb-0.5">
                ✨ Extracted Lab / Diagnostic Findings:
              </strong>
              <p className="leading-relaxed">{document.aiSummary}</p>
            </div>

            {document.documentSnippet && (
              <div className="p-2 rounded-lg bg-white border border-[#e5eeff] font-mono text-[10px] text-[#40484c]">
                {document.documentSnippet}
              </div>
            )}
          </div>

          {/* Existing review status if already reviewed */}
          {document.reviewStatus === 'Reviewed by Doctor' && (
            <div className="p-3 rounded-xl bg-[#dcfce7]/70 border border-[#86efac] flex items-center gap-2 text-xs text-[#166534]">
              <span className="material-symbols-outlined text-[20px]">check_circle</span>
              <div>
                <strong>Already Clinically Reviewed</strong> by {document.reviewedByDoctorName || 'Attending Physician'}
                <div className="text-[11px] text-[#14532d] mt-0.5">"{document.doctorNotes}"</div>
              </div>
            </div>
          )}

          {/* Doctor Assessment Input Form */}
          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label className="block font-bold text-[#0b1c30] mb-1">
                Physician Clinical Assessment & Sign-Off Notes *
              </label>
              <textarea
                rows={3}
                required
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Enter clinical observations, correlation with symptoms, or follow-up instructions..."
                className="w-full p-2.5 text-xs bg-white border border-[#dce9ff] rounded-xl focus:border-[#004357] focus:ring-2 focus:ring-[#5bb8fe]/30 outline-hidden"
              />
            </div>

            {/* Quick Findings Chips */}
            <div>
              <span className="text-[10px] font-bold text-[#70787d] uppercase tracking-wider block mb-1">
                Quick Clinical Statements:
              </span>
              <div className="flex flex-wrap gap-1">
                {quickObservations.map((obs) => (
                  <button
                    key={obs}
                    type="button"
                    onClick={() => handleApplyPreset(obs)}
                    className="px-2 py-0.5 rounded-md bg-[#eff4ff] hover:bg-[#dce9ff] text-[#004357] text-[10px] font-medium transition-colors cursor-pointer"
                  >
                    + {obs}
                  </button>
                ))}
              </div>
            </div>

            {/* Digital Signature */}
            <div className="p-2.5 rounded-xl bg-[#eff4ff] border border-[#dce9ff] flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer text-xs">
                <input
                  type="checkbox"
                  checked={digitalSign}
                  onChange={(e) => setDigitalSign(e.target.checked)}
                  className="rounded text-[#004357] focus:ring-[#004357]"
                />
                <div>
                  <span className="font-bold text-[#004357]">Apply Electronic Physician Signature</span>
                  <div className="text-[10px] text-[#52606d]">
                    Signed by {doctorAuth?.name || 'Dr. Attending Physician'} • Reg: {doctorAuth?.nmcRegNo || 'NMC Verified'}
                  </div>
                </div>
              </label>
              <span className="material-symbols-outlined text-[#006141] text-[18px]">verified</span>
            </div>

            {/* Buttons */}
            <div className="pt-2 flex justify-end gap-2 border-t border-[#e5eeff]">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl bg-white border border-[#bfc8cd] text-[#40484c] hover:bg-[#eff4ff] font-semibold cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-[#004357] hover:bg-[#0d5c75] text-white font-bold flex items-center gap-1.5 shadow-md active:scale-98 transition-all cursor-pointer"
              >
                <span className="material-symbols-outlined text-[16px]">draw</span>
                <span>Sign Off & Archive in Chart</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
