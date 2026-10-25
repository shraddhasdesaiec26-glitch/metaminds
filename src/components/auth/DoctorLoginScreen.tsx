import React, { useState } from 'react';
import { DoctorAuth } from '../../types/clinical';

interface DoctorLoginScreenProps {
  onLoginSuccess: (auth: DoctorAuth) => void;
  onBackToGateway: () => void;
  onShowToast: (msg: string, type?: 'success' | 'alert' | 'info') => void;
}

export const VERIFIED_CLINICIANS: (DoctorAuth & { email: string; npi: string; pin: string })[] = [
  {
    isVerified: true,
    name: 'Dr. Rajesh Iyer, MD',
    nmcRegNo: 'NMC-MCI-2012-084920',
    npi: '1942083921',
    email: 'r.iyer@stjudehealth.org',
    pin: '••••••••••••',
    stateMedicalCouncil: 'Maharashtra Medical Council (MMC) / Active State Board',
    qualification: 'MD, DM (Cardiology), FACC',
    hospitalStaffId: 'SJ-ATTEND-4192',
    department: 'Cardiology & Intensive Care Unit (ICU)',
    verifiedAt: 'NPI Registry & National Medical Commission (Verified Active)',
    digitalSignatureToken: 'PKI-SHA256-IYER-1942083921',
    twoFactorMethod: 'Duo Push',
  },
  {
    isVerified: true,
    name: 'Dr. Ananya Sharma, MBBS, MD',
    nmcRegNo: 'KMC-2015-091482',
    npi: '1092837412',
    email: 'a.sharma@stjudehealth.org',
    pin: '••••••••••••',
    stateMedicalCouncil: 'Karnataka Medical Council (KMC) / Active State Board',
    qualification: 'MBBS, MD (Internal Medicine)',
    hospitalStaffId: 'SJ-INTERNIST-8841',
    department: 'General Internal Medicine & Step-Down',
    verifiedAt: 'NPI Registry & National Medical Commission (Verified Active)',
    digitalSignatureToken: 'PKI-SHA256-SHARMA-1092837412',
    twoFactorMethod: 'Duo Push',
  },
  {
    isVerified: true,
    name: 'Dr. Vikram Patel, MD',
    nmcRegNo: 'GMC-2010-048291',
    npi: '1829304912',
    email: 'v.patel@stjudehealth.org',
    pin: '••••••••••••',
    stateMedicalCouncil: 'Gujarat Medical Council (GMC) / Active State Board',
    qualification: 'MD, DNB (Endocrinology)',
    hospitalStaffId: 'SJ-ENDO-3310',
    department: 'Emergency & Trauma Resuscitation',
    verifiedAt: 'NPI Registry & National Medical Commission (Verified Active)',
    digitalSignatureToken: 'PKI-SHA256-PATEL-1829304912',
    twoFactorMethod: 'FIDO Key',
  },
];

export const DoctorLoginScreen: React.FC<DoctorLoginScreenProps> = ({
  onLoginSuccess,
  onBackToGateway,
  onShowToast,
}) => {
  const [activeTab, setActiveTab] = useState<'sso' | 'fido'>('sso');
  const [selectedClinician, setSelectedClinician] = useState(VERIFIED_CLINICIANS[0]);
  const [emailOrStaffId, setEmailOrStaffId] = useState(VERIFIED_CLINICIANS[0].email);
  const [npiNumber, setNpiNumber] = useState(VERIFIED_CLINICIANS[0].npi);
  const [department, setDepartment] = useState(VERIFIED_CLINICIANS[0].department);
  const [password, setPassword] = useState('clinicalAdmin#2026');
  const [showPassword, setShowPassword] = useState(false);
  const [twoFactorChoice, setTwoFactorChoice] = useState<'Duo Push' | 'FIDO Key' | 'Token Code'>('Duo Push');
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [isVerifyingNpi, setIsVerifyingNpi] = useState(false);

  // Check if current NPI matches a verified clinician
  const currentVerified = VERIFIED_CLINICIANS.find(
    (c) => c.npi === npiNumber.trim() || c.hospitalStaffId.toLowerCase() === emailOrStaffId.toLowerCase().trim()
  ) || {
    name: selectedClinician.name,
    nmcRegNo: selectedClinician.nmcRegNo,
    stateMedicalCouncil: selectedClinician.stateMedicalCouncil,
    qualification: selectedClinician.qualification,
    hospitalStaffId: selectedClinician.hospitalStaffId,
  };

  const handleSelectPreset = (doc: typeof VERIFIED_CLINICIANS[0]) => {
    setSelectedClinician(doc);
    setEmailOrStaffId(doc.email);
    setNpiNumber(doc.npi);
    setDepartment(doc.department);
    onShowToast(`Selected verified clinician profile: ${doc.name}`, 'info');
  };

  const handleLookupNpi = () => {
    setIsVerifyingNpi(true);
    setTimeout(() => {
      setIsVerifyingNpi(false);
      onShowToast(`NPI #${npiNumber} verified: Active license with State Medical Board`, 'success');
    }, 600);
  };

  const handleAuthenticate = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!emailOrStaffId.trim() || !password.trim()) {
      onShowToast('Please provide your hospital staff credentials', 'alert');
      return;
    }

    setIsAuthenticating(true);
    setTimeout(() => {
      setIsAuthenticating(false);
      const authenticatedDoctor: DoctorAuth = {
        isVerified: true,
        name: currentVerified.name,
        nmcRegNo: currentVerified.nmcRegNo,
        stateMedicalCouncil: currentVerified.stateMedicalCouncil,
        qualification: currentVerified.qualification,
        hospitalStaffId: selectedClinician.hospitalStaffId || 'SJ-ATTEND-4192',
        department: department,
        verifiedAt: 'NPI & National Medical Register (Verified Active)',
        digitalSignatureToken: `PKI-SHA256-${Date.now()}`,
        email: emailOrStaffId,
        npi: npiNumber,
        twoFactorMethod: twoFactorChoice,
      };

      onLoginSuccess(authenticatedDoctor);
      onShowToast(`Welcome ${authenticatedDoctor.name}! Doctor session verified.`);
    }, 800);
  };

  const handleBiometricLogin = () => {
    setIsAuthenticating(true);
    setTimeout(() => {
      setIsAuthenticating(false);
      handleAuthenticate();
    }, 600);
  };

  const handleBreakGlass = () => {
    const breakGlassDoctor: DoctorAuth = {
      isVerified: true,
      name: 'Dr. Emergency Override (Break-Glass)',
      nmcRegNo: 'EMERGENCY-OVERRIDE-CODE-BLUE',
      stateMedicalCouncil: 'Hospital Executive Committee Emergency Override',
      qualification: 'Attending Emergency Physician',
      hospitalStaffId: 'EMERG-9999',
      department: department,
      verifiedAt: 'BREAK-GLASS AUDIT LOGGED - 21 CFR Part 11',
      digitalSignatureToken: `BREAKGLASS-${Date.now()}`,
      email: emailOrStaffId,
      npi: npiNumber,
    };
    onLoginSuccess(breakGlassDoctor);
    onShowToast('⚠️ BREAK-GLASS Emergency Access Granted. Audit logs recorded.', 'alert');
  };

  return (
    <div className="min-h-screen bg-[#f3f7fc] flex flex-col items-center justify-center p-2 sm:p-4 text-[#0b1c30]">
      {/* Top back navigation */}
      <div className="w-full max-w-[430px] flex items-center justify-between mb-2">
        <button
          onClick={onBackToGateway}
          className="text-xs font-semibold text-[#006398] hover:text-[#004357] flex items-center gap-1 cursor-pointer py-1 px-2 rounded-lg hover:bg-white/60 transition-colors"
        >
          <span className="material-symbols-outlined text-[16px]">arrow_back</span>
          <span>Back to Portal Selection</span>
        </button>
        <span className="text-[11px] font-bold text-[#70787d]">Doctor Login</span>
      </div>

      {/* Main Clinician Access Card */}
      <div className="w-full max-w-[430px] bg-white rounded-3xl shadow-xl border border-[#dce9ff] overflow-hidden flex flex-col">
        {/* Clinician Portal Header */}
        <div className="p-4 pt-5 pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-[#004357] flex items-center justify-center text-white shadow-xs">
                <span className="material-symbols-outlined text-[20px]">local_hospital</span>
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-sm text-[#004357] tracking-tight">MediSyncEHR</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-[#10b981]"></span>
                </div>
                <div className="text-[10px] text-[#52606d]">• St. Jude Healthcare Network</div>
              </div>
            </div>

            <div className="px-2.5 py-1 rounded-full bg-[#e0f2fe] border border-[#bae6fd] text-[#0284c7] font-bold text-[10px] flex items-center gap-1 tracking-wide">
              <span className="material-symbols-outlined text-[13px]">verified_user</span>
              <span>LEVEL 4 EPCS</span>
            </div>
          </div>

          <div className="mt-3">
            <h1 className="text-xl font-extrabold text-[#002b38] tracking-tight">
              Clinician Portal Access
            </h1>
            <p className="text-xs text-[#52606d] mt-0.5 leading-relaxed">
              Secure, verified authentication for licensed medical professionals & attending clinical staff.
            </p>
          </div>
        </div>

        {/* Tab switchers: SSO / NPI Login vs SmartCard / FIDO2 */}
        <div className="px-4 pb-2">
          <div className="p-1 rounded-xl bg-[#e5efff]/70 border border-[#dce9ff] flex items-center gap-1 text-xs">
            <button
              type="button"
              onClick={() => setActiveTab('sso')}
              className={`flex-1 py-2 px-2 rounded-lg font-bold flex items-center justify-center gap-1.5 transition-all ${
                activeTab === 'sso'
                  ? 'bg-white text-[#004357] shadow-sm border border-[#d0e2ff]'
                  : 'text-[#52606d] hover:text-[#0b1c30]'
              }`}
            >
              <span className="material-symbols-outlined text-[16px] text-[#006398]">badge</span>
              <span>SSO / NPI Login</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('fido')}
              className={`flex-1 py-2 px-2 rounded-lg font-bold flex items-center justify-center gap-1.5 transition-all ${
                activeTab === 'fido'
                  ? 'bg-white text-[#004357] shadow-sm border border-[#d0e2ff]'
                  : 'text-[#52606d] hover:text-[#0b1c30]'
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">contactless</span>
              <span>SmartCard / FIDO2</span>
            </button>
          </div>
        </div>

        {/* Presets Quick Picker */}
        <div className="px-4 py-1.5 bg-[#f8fbff] border-y border-[#e8f1fc]">
          <div className="flex items-center justify-between text-[11px] font-semibold text-[#52606d] mb-1">
            <span>Verified Clinician Presets (Click to Auto-Fill):</span>
          </div>
          <div className="flex gap-1.5 overflow-x-auto no-scrollbar pb-0.5">
            {VERIFIED_CLINICIANS.map((doc) => {
              const isSelected = doc.npi === npiNumber;
              return (
                <button
                  key={doc.npi}
                  type="button"
                  onClick={() => handleSelectPreset(doc)}
                  className={`px-2 py-1 rounded-lg text-[10px] font-bold whitespace-nowrap border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-[#004357] text-white border-[#004357] shadow-xs'
                      : 'bg-white text-[#004357] border-[#cfe3ff] hover:bg-[#eff6ff]'
                  }`}
                >
                  {doc.name.split(',')[0]}
                </button>
              );
            })}
          </div>
        </div>

        {/* Login Form Body */}
        <form onSubmit={handleAuthenticate} className="p-4 space-y-3.5 text-xs">
          {/* Hospital Email or Staff ID */}
          <div>
            <label className="block text-[11px] font-bold text-[#0b1c30] mb-1">
              Hospital Email or Staff ID
            </label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-2.5 text-[#52606d] text-[18px]">
                mail
              </span>
              <input
                type="text"
                value={emailOrStaffId}
                onChange={(e) => setEmailOrStaffId(e.target.value)}
                placeholder="e.g. r.iyer@stjudehealth.org"
                required
                className="w-full h-10 pl-9 pr-3 bg-[#f0f5fc] border border-[#d5e2f0] rounded-xl text-xs text-[#0b1c30] font-medium focus:bg-white focus:border-[#006398] focus:outline-hidden transition-colors"
              />
            </div>
          </div>

          {/* National Provider Identifier (NPI) */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-[11px] font-bold text-[#0b1c30]">
                National Provider Identifier (NPI)
              </label>
              <button
                type="button"
                onClick={handleLookupNpi}
                className="text-[11px] font-bold text-[#006398] hover:underline cursor-pointer"
              >
                {isVerifyingNpi ? 'Checking...' : 'Lookup NPI'}
              </button>
            </div>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-2.5 text-[#52606d] text-[18px]">
                clinical_notes
              </span>
              <input
                type="text"
                value={npiNumber}
                onChange={(e) => setNpiNumber(e.target.value)}
                placeholder="10-digit NPI e.g. 1942083921"
                required
                className="w-full h-10 pl-9 pr-9 bg-[#f0f5fc] border border-[#d5e2f0] rounded-xl text-xs font-mono text-[#0b1c30] tracking-wider focus:bg-white focus:border-[#006398] focus:outline-hidden transition-colors"
              />
              <span className="material-symbols-outlined absolute right-3 top-2.5 text-[#10b981] text-[20px]">
                check_circle
              </span>
            </div>

            {/* Doctor Verification Match Banner (Matches User's Mockup) */}
            <div className="mt-1.5 p-2.5 rounded-xl bg-[#eaf4ff] border border-[#cbe3ff] flex items-center justify-between">
              <div className="min-w-0 pr-2">
                <strong className="text-xs text-[#003444] font-bold block truncate">
                  {currentVerified.name}
                </strong>
                <p className="text-[10px] text-[#405466] truncate">
                  NPI Verified • Active State Medical Board Registration
                </p>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-[#86efac]/50 text-[#166534] font-extrabold text-[9px] uppercase tracking-wider border border-[#86efac]">
                ACTIVE
              </span>
            </div>
          </div>

          {/* Active Clinical Service Unit */}
          <div>
            <label className="block text-[11px] font-bold text-[#0b1c30] mb-1">
              Active Clinical Service Unit
            </label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-2.5 text-[#52606d] text-[18px]">
                apartment
              </span>
              <select
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="w-full h-10 pl-9 pr-8 bg-[#f0f5fc] border border-[#d5e2f0] rounded-xl text-xs text-[#0b1c30] font-medium appearance-none focus:bg-white focus:border-[#006398] focus:outline-hidden transition-colors"
              >
                <option value="Cardiology & Intensive Care Unit (ICU)">
                  Cardiology & Intensive Care Unit (ICU)
                </option>
                <option value="General Internal Medicine & Step-Down">
                  General Internal Medicine & Step-Down
                </option>
                <option value="Emergency & Trauma Resuscitation">
                  Emergency & Trauma Resuscitation
                </option>
                <option value="PACU Surgical Suite">PACU Surgical Suite</option>
              </select>
              <span className="material-symbols-outlined absolute right-3 top-2.5 text-[#52606d] text-[18px] pointer-events-none">
                unfold_more
              </span>
            </div>
          </div>

          {/* Institutional Password */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-[11px] font-bold text-[#0b1c30]">Institutional Password</label>
              <button
                type="button"
                onClick={() => onShowToast('Password reset link sent to your hospital email', 'info')}
                className="text-[11px] font-bold text-[#006398] hover:underline cursor-pointer"
              >
                Reset Token
              </button>
            </div>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-2.5 text-[#52606d] text-[18px]">
                vpn_key
              </span>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                required
                className="w-full h-10 pl-9 pr-9 bg-[#f0f5fc] border border-[#d5e2f0] rounded-xl text-xs text-[#0b1c30] font-mono tracking-widest focus:bg-white focus:border-[#006398] focus:outline-hidden transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="material-symbols-outlined absolute right-3 top-2.5 text-[#52606d] hover:text-[#0b1c30] text-[18px] cursor-pointer"
              >
                {showPassword ? 'visibility_off' : 'visibility'}
              </button>
            </div>
          </div>

          {/* 2FA Required for Bedside Orders Card */}
          <div className="p-3 rounded-2xl bg-[#eff6ff] border border-[#d2e5fe] space-y-2">
            <div className="flex items-start gap-2">
              <div className="w-6 h-6 rounded-md bg-[#004357] text-white flex items-center justify-center shrink-0 mt-0.5">
                <span className="material-symbols-outlined text-[15px]">security</span>
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-[11px] text-[#003444]">
                    2FA Required for Bedside Orders
                  </span>
                  <span className="px-1.5 py-0.2 rounded bg-[#0284c7] text-white text-[8px] font-bold">
                    DEA EPCS
                  </span>
                </div>
                <p className="text-[10px] text-[#52606d] mt-0.5 leading-snug">
                  HIPAA Compliant Session. Controlled substances e-prescribing mandates Duo Push,
                  YubiKey hardware token, or hospital push verification.
                </p>
              </div>
            </div>

            {/* 2FA Radio Selectors */}
            <div className="pt-1 flex items-center justify-between text-[11px] font-semibold text-[#0b1c30]">
              <label className="flex items-center gap-1.5 cursor-pointer">
                <input
                  type="radio"
                  name="twoFactor"
                  checked={twoFactorChoice === 'Duo Push'}
                  onChange={() => setTwoFactorChoice('Duo Push')}
                  className="accent-[#004357]"
                />
                <span>Duo Push</span>
              </label>

              <label className="flex items-center gap-1.5 cursor-pointer">
                <input
                  type="radio"
                  name="twoFactor"
                  checked={twoFactorChoice === 'FIDO Key'}
                  onChange={() => setTwoFactorChoice('FIDO Key')}
                  className="accent-[#004357]"
                />
                <span>FIDO Key</span>
              </label>

              <label className="flex items-center gap-1.5 cursor-pointer">
                <input
                  type="radio"
                  name="twoFactor"
                  checked={twoFactorChoice === 'Token Code'}
                  onChange={() => setTwoFactorChoice('Token Code')}
                  className="accent-[#004357]"
                />
                <span>Token Code</span>
              </label>
            </div>
          </div>

          {/* Primary Action Button */}
          <button
            type="submit"
            disabled={isAuthenticating}
            className="w-full h-12 rounded-2xl bg-[#004357] hover:bg-[#003241] active:scale-[0.99] text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all cursor-pointer"
          >
            {isAuthenticating ? (
              <>
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                <span>Verifying Credentials & NPI Registry...</span>
              </>
            ) : (
              <>
                <span className="material-symbols-outlined text-[18px]">lock</span>
                <span>Authenticate & Access Rounds</span>
              </>
            )}
          </button>

          {/* Secondary Biometrics Button */}
          <button
            type="button"
            onClick={handleBiometricLogin}
            disabled={isAuthenticating}
            className="w-full h-11 rounded-2xl bg-[#e5efff] hover:bg-[#d6e7ff] text-[#004357] font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer border border-[#cbe1ff]"
          >
            <span className="material-symbols-outlined text-[18px]">fingerprint</span>
            <span>Login with Hospital Face ID / Touch ID</span>
          </button>
        </form>

        {/* Emergency Break-Glass Access (Red Banner matching image) */}
        <div className="p-3 bg-[#fee2e2] border-t border-[#fca5a5] flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <span className="material-symbols-outlined text-[#dc2626] text-[20px] shrink-0">
              warning
            </span>
            <div className="min-w-0">
              <span className="text-[11px] font-bold text-[#991b1b] block">
                Critical Emergency Access?
              </span>
              <span className="text-[10px] text-[#b91c1c] truncate block">
                Code Blue / Immediate clinical override
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={handleBreakGlass}
            className="px-3 py-1.5 rounded-xl bg-[#b91c1c] hover:bg-[#991b1b] text-white font-bold text-xs shrink-0 shadow-xs cursor-pointer active:scale-95 transition-all"
          >
            Break-Glass
          </button>
        </div>

        {/* Footer Support Links */}
        <div className="p-3 bg-[#f8fbff] border-t border-[#e8f1fc] flex items-center justify-center gap-3 text-[10px] text-[#52606d] font-semibold">
          <button
            type="button"
            onClick={() => onShowToast('Calling 24/7 Clinical IT Desk (Ext: 4400)', 'info')}
            className="hover:underline flex items-center gap-0.5"
          >
            <span className="material-symbols-outlined text-[13px]">headset_mic</span>
            <span>24/7 Clinical IT Desk</span>
          </button>
          <span>•</span>
          <button
            type="button"
            onClick={() => onShowToast('Bluetooth Barcode & Bedside Scanner Paired', 'success')}
            className="hover:underline flex items-center gap-0.5"
          >
            <span className="material-symbols-outlined text-[13px]">qr_code_scanner</span>
            <span>Scanner Pair</span>
          </button>
          <span>•</span>
          <button
            type="button"
            onClick={() => onShowToast('DEA EPCS Level 4 Guidelines Loaded', 'info')}
            className="hover:underline flex items-center gap-0.5"
          >
            <span className="material-symbols-outlined text-[13px]">help</span>
            <span>EPCS Guide</span>
          </button>
        </div>

        {/* Legal Security Disclaimer */}
        <div className="p-3 bg-white text-center border-t border-[#e8f1fc] text-[9px] text-[#70787d] space-y-1">
          <div className="flex items-center justify-center gap-1 font-bold text-[#40484c]">
            <span className="material-symbols-outlined text-[12px] text-[#006398]">lock</span>
            <span>AES 256-bit End-to-End Encrypted Tunnel</span>
          </div>
          <p className="leading-tight text-[#8a949e]">
            Authorized hospital medical personnel only. All access, queries, and medication dispensations
            are recorded per HIPAA Security Rule § 164.312 & HITECH Act.
          </p>
        </div>
      </div>
    </div>
  );
};
