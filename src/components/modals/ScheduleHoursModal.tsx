import React, { useState } from 'react';
import { DoctorAuth } from '../../types/clinical';
import { LanguageCode, getTranslation } from '../../utils/i18n';

interface ScheduleHoursModalProps {
  isOpen: boolean;
  onClose: () => void;
  doctorAuth?: DoctorAuth;
  language?: LanguageCode;
  onShowToast: (msg: string, type?: 'success' | 'alert' | 'info') => void;
}

export const ScheduleHoursModal: React.FC<ScheduleHoursModalProps> = ({
  isOpen,
  onClose,
  doctorAuth,
  language = 'en',
  onShowToast,
}) => {
  const [acceptingWalkins, setAcceptingWalkins] = useState(true);
  const [onCallStatus, setOnCallStatus] = useState<'available' | 'in_consultation' | 'emergency_only'>('available');
  const t = (k: string) => getTranslation(language, k);

  if (!isOpen) return null;

  const weeklySchedule = [
    {
      days: 'Monday – Friday',
      timing: '09:00 AM – 01:00 PM',
      type: 'Outpatient Clinic (OPD)',
      location: 'Consultation Suite 204',
      status: 'Current Slot (Active)',
      active: true,
    },
    {
      days: 'Monday – Friday',
      timing: '02:00 PM – 05:00 PM',
      type: 'ICU & Inpatient Rounds',
      location: 'Critical Care Unit, Level 3',
      status: 'Scheduled Daily',
      active: false,
    },
    {
      days: 'Monday – Friday',
      timing: '06:00 PM – 08:00 PM',
      type: 'Evening Teleconsultation',
      location: 'Medisync Virtual OPD',
      status: 'Video Consults',
      active: false,
    },
    {
      days: 'Saturday',
      timing: '09:00 AM – 02:00 PM',
      type: 'Weekend Specialty Clinic',
      location: 'OPD Annex Suite B',
      status: 'Prior Booking Only',
      active: false,
    },
    {
      days: 'Sunday',
      timing: '24 Hours On-Call',
      type: 'Emergency Resuscitation & Trauma',
      location: 'St. Jude Emergency Dept',
      status: 'Code Duty',
      active: false,
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white w-full max-w-lg rounded-3xl border border-[#dce9ff] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-5 bg-gradient-to-r from-[#004357] to-[#006398] text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/15 border border-white/20 flex items-center justify-center text-[#2dd4bf] shadow-inner">
              <span className="material-symbols-outlined text-[24px]">schedule</span>
            </div>
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                {t('Schedule & Hours')}
              </h2>
              <p className="text-xs text-[#bde9ff]">
                {doctorAuth?.name || 'Dr. Rahul Agarwal, MD'} • OPD Suite 204
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Status bar */}
        <div className="px-5 py-3 bg-[#eff4ff] border-b border-[#dce9ff] flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#10b981] animate-pulse"></span>
            <span className="font-bold text-[#004357]">Current Status:</span>
            <span className="text-[#0b1c30] font-semibold">
              {onCallStatus === 'available'
                ? 'Available in OPD Suite 204'
                : onCallStatus === 'in_consultation'
                ? 'In Patient Consultation'
                : 'Emergency Code / ICU Only'}
            </span>
          </div>

          <button
            onClick={() => {
              const next =
                onCallStatus === 'available'
                  ? 'in_consultation'
                  : onCallStatus === 'in_consultation'
                  ? 'emergency_only'
                  : 'available';
              setOnCallStatus(next);
              onShowToast(`Doctor status updated to: ${next.replace('_', ' ')}`);
            }}
            className="px-2.5 py-1 rounded-lg bg-white border border-[#93ccff] text-[#006398] font-bold text-[11px] hover:bg-[#dce9ff] transition-all cursor-pointer"
          >
            Change
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4 overflow-y-auto">
          {/* Quick Toggle for Walk-in Consultations */}
          <div className="p-3.5 rounded-2xl bg-[#f8f9ff] border border-[#dce9ff] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#e5eeff] text-[#006398] flex items-center justify-center">
                <span className="material-symbols-outlined text-[20px]">door_open</span>
              </div>
              <div>
                <strong className="text-xs text-[#0b1c30] block">Accept Walk-in Patients</strong>
                <span className="text-[11px] text-[#40484c]">
                  Allow front-desk nurse to add urgent add-on tokens today
                </span>
              </div>
            </div>
            <button
              onClick={() => {
                setAcceptingWalkins(!acceptingWalkins);
                onShowToast(
                  !acceptingWalkins ? 'Walk-in tokens enabled for today' : 'Walk-in tokens paused'
                );
              }}
              className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${
                acceptingWalkins ? 'bg-[#006398]' : 'bg-slate-300'
              }`}
            >
              <span
                className={`absolute top-0.5 w-5 h-5 rounded-full bg-white transition-transform shadow-xs ${
                  acceptingWalkins ? 'right-0.5' : 'left-0.5'
                }`}
              />
            </button>
          </div>

          {/* Weekly Roster Table */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-[#004357] px-1">
              <span>Weekly Timetable & Wards</span>
              <span className="text-[11px] text-[#70787d]">Updated: Today</span>
            </div>

            <div className="space-y-2">
              {weeklySchedule.map((slot, i) => (
                <div
                  key={i}
                  className={`p-3 rounded-2xl border transition-all ${
                    slot.active
                      ? 'bg-[#e5eeff]/60 border-[#006398] ring-1 ring-[#006398]/30'
                      : 'bg-white border-[#e5eeff]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-[#0b1c30]">{slot.days}</span>
                      {slot.active && (
                        <span className="px-2 py-0.5 rounded-full bg-[#10b981]/20 text-[#047857] text-[10px] font-extrabold flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#10b981] animate-ping" />
                          Live Now
                        </span>
                      )}
                    </div>
                    <span className="text-xs font-extrabold text-[#006398]">{slot.timing}</span>
                  </div>

                  <div className="mt-1 flex items-center justify-between text-[11px] text-[#40484c]">
                    <span className="font-semibold text-[#004357]">{slot.type}</span>
                    <span>{slot.location}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Hospital Staff & Pager Info */}
          <div className="p-3.5 rounded-2xl bg-[#f0fdf4] border border-[#bbf7d0] text-xs text-[#166534] flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span className="material-symbols-outlined text-[20px] text-[#15803d]">phone_in_talk</span>
              <div>
                <strong className="block text-[#14532d]">Emergency ICU Hospital Pager: Ext 402</strong>
                <span className="text-[11px] text-[#166534]">
                  Trauma desk will route critical code emergencies to Dr. Rahul instantly.
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-[#f8f9ff] border-t border-[#dce9ff] flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-[#004357] hover:bg-[#003140] text-white font-bold text-xs shadow-md transition-colors cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
