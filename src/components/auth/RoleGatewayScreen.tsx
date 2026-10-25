import React from 'react';
import { LANGUAGES, LanguageCode, getTranslation } from '../../utils/i18n';

interface RoleGatewayScreenProps {
  onSelectRole: (role: 'doctor' | 'patient') => void;
  language: LanguageCode;
  onSelectLanguage: (lang: LanguageCode) => void;
}

export const RoleGatewayScreen: React.FC<RoleGatewayScreenProps> = ({
  onSelectRole,
  language,
  onSelectLanguage,
}) => {
  const [showLangMenu, setShowLangMenu] = React.useState(false);
  const t = (k: string) => getTranslation(language, k);
  const currentLangObj = LANGUAGES.find((l) => l.code === language) || LANGUAGES[0];

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#e8f2ff] via-[#f4f8ff] to-[#eaf2ff] flex flex-col items-center justify-center p-3 sm:p-6 text-[#0b1c30]">
      {/* Top Bar with Language Selector */}
      <div className="w-full max-w-xl flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-xl overflow-hidden border border-[#93ccff] bg-white shadow-sm flex items-center justify-center">
            <img
              src="/assets/aistudio/WhatsApp_Image_2026-10-25_at_12.21.54_AM_4c858893.jpeg"
              alt="MediSync Icon"
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <div className="font-bold text-sm tracking-tight text-[#004357]">MEDISYNC</div>
            <div className="text-[10px] text-[#40484c]">Healthcare Ecosystem</div>
          </div>
        </div>

        {/* Language dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowLangMenu(!showLangMenu)}
            className="px-2.5 py-1.5 rounded-xl bg-white border border-[#cce5ff] text-[#004357] font-semibold text-xs flex items-center gap-1.5 shadow-xs hover:bg-[#eff4ff] transition-colors"
          >
            <span className="material-symbols-outlined text-[16px] text-[#006398]">translate</span>
            <span>{currentLangObj.nativeName}</span>
            <span className="material-symbols-outlined text-[14px]">expand_more</span>
          </button>

          {showLangMenu && (
            <div className="absolute right-0 top-10 w-44 bg-white rounded-xl shadow-xl border border-[#cce5ff] py-1 z-50 animate-in fade-in">
              <div className="px-3 py-1 text-[10px] font-bold text-[#70787d] uppercase tracking-wider border-b border-[#e5eeff]">
                Select Language
              </div>
              <div className="max-h-56 overflow-y-auto no-scrollbar">
                {LANGUAGES.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => {
                      onSelectLanguage(lang.code);
                      setShowLangMenu(false);
                    }}
                    className={`w-full text-left px-3 py-1.5 text-xs flex items-center justify-between ${
                      lang.code === language
                        ? 'bg-[#e5eeff] text-[#004357] font-bold'
                        : 'text-[#0b1c30] hover:bg-[#eff4ff]'
                    }`}
                  >
                    <span>{lang.nativeName}</span>
                    <span className="text-[10px] text-[#70787d]">{lang.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Main Role Selection Card */}
      <div className="w-full max-w-xl bg-white/95 backdrop-blur-md rounded-3xl border border-[#cce5ff] shadow-xl p-5 sm:p-7 flex flex-col space-y-6">
        {/* Header Banner */}
        <div className="text-center space-y-1.5">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#e0f2fe] text-[#0369a1] text-xs font-bold border border-[#bae6fd]">
            <span className="w-2 h-2 rounded-full bg-[#0284c7] animate-pulse"></span>
            Unified Healthcare Access
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#003444] tracking-tight">
            Welcome to MediSync
          </h1>
          <p className="text-xs sm:text-sm text-[#40484c] max-w-md mx-auto">
            Please choose your role to enter the appropriate dashboard.
          </p>
        </div>

        {/* Role Choice Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Option 1: Doctor / Clinician */}
          <button
            onClick={() => onSelectRole('doctor')}
            className="group relative text-left p-5 rounded-2xl border-2 border-[#bde0fe] hover:border-[#006398] bg-gradient-to-br from-[#f0f8ff] to-[#ffffff] hover:shadow-lg transition-all duration-200 cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="w-12 h-12 rounded-2xl bg-[#004357] text-white flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
                  <span className="material-symbols-outlined text-[26px]">stethoscope</span>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-[#dcfce7] text-[#166534] text-[10px] font-bold border border-[#86efac]">
                  Level 4 EPCS
                </span>
              </div>
              <h2 className="text-base font-bold text-[#004357] group-hover:text-[#006398] transition-colors">
                I am a Doctor
              </h2>
              <p className="text-xs text-[#52606d] mt-1 leading-relaxed">
                Hospital clinicians, attending physicians, surgeons & ICU staff.
              </p>
              <div className="mt-3 flex flex-wrap gap-1">
                <span className="px-2 py-0.5 rounded-md bg-[#e5eeff] text-[#004357] text-[10px] font-semibold">
                  NPI / NMC Verification
                </span>
                <span className="px-2 py-0.5 rounded-md bg-[#e5eeff] text-[#004357] text-[10px] font-semibold">
                  ICU Rounds & MAR
                </span>
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-[#dce9ff] flex items-center justify-between text-xs font-bold text-[#006398] group-hover:translate-x-0.5 transition-transform">
              <span>Doctor Sign In</span>
              <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
            </div>
          </button>

          {/* Option 2: Patient / Family */}
          <button
            onClick={() => onSelectRole('patient')}
            className="group relative text-left p-5 rounded-2xl border-2 border-[#bbf7d0] hover:border-[#006141] bg-gradient-to-br from-[#f0fdf4] to-[#ffffff] hover:shadow-lg transition-all duration-200 cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="w-12 h-12 rounded-2xl bg-[#006141] text-white flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
                  <span className="material-symbols-outlined text-[26px]">badge</span>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-[#cce5ff] text-[#004357] text-[10px] font-bold border border-[#93ccff]">
                  ABHA Health ID
                </span>
              </div>
              <h2 className="text-base font-bold text-[#00472f] group-hover:text-[#006141] transition-colors">
                I am a Patient
              </h2>
              <p className="text-xs text-[#52606d] mt-1 leading-relaxed">
                Access prescriptions, uploaded records, vital trends & doctor appointments.
              </p>
              <div className="mt-3 flex flex-wrap gap-1">
                <span className="px-2 py-0.5 rounded-md bg-[#dcfce7] text-[#166534] text-[10px] font-semibold">
                  Existing Account Login
                </span>
                <span className="px-2 py-0.5 rounded-md bg-[#dcfce7] text-[#166534] text-[10px] font-semibold">
                  New Sign Up
                </span>
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-[#dcfce7] flex items-center justify-between text-xs font-bold text-[#006141] group-hover:translate-x-0.5 transition-transform">
              <span>Patient Login / Sign Up</span>
              <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
            </div>
          </button>
        </div>

        {/* Trust Badges */}
        <div className="pt-2 border-t border-[#e5eeff] flex flex-wrap items-center justify-center gap-4 text-[11px] text-[#70787d]">
          <div className="flex items-center gap-1">
            <span className="material-symbols-outlined text-[15px] text-[#006141]">verified_user</span>
            <span>ABDM / ABHA Integrated</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="material-symbols-outlined text-[15px] text-[#006398]">lock</span>
            <span>256-Bit Encrypted Sessions</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="material-symbols-outlined text-[15px] text-[#ba1a1a]">local_hospital</span>
            <span>St. Jude Health Network</span>
          </div>
        </div>
      </div>
    </div>
  );
};
