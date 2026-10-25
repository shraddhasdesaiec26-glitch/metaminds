import React, { useState } from 'react';
import { UserRegistrationData } from '../../types/clinical';
import { LANGUAGES, LanguageCode, getTranslation } from '../../utils/i18n';

interface PatientAuthScreenProps {
  initialMode?: 'login' | 'signup';
  onLoginExisting: (identifier: string, isDemo?: boolean) => void;
  onSignUpNew: (data: UserRegistrationData) => void;
  onBackToGateway: () => void;
  language: LanguageCode;
  onSelectLanguage: (lang: LanguageCode) => void;
  onShowToast: (msg: string, type?: 'success' | 'alert' | 'info') => void;
}

const COMMON_ALLERGIES = [
  'No Known Drug Allergies (NKDA)',
  'Penicillin',
  'Sulfa Drugs',
  'Aspirin / NSAIDs',
  'Peanuts & Nuts',
  'Dust / Pollen',
];

const COMMON_CONDITIONS = [
  'Healthy / No Chronic Conditions',
  'Hypertension (High BP)',
  'Type 2 Diabetes',
  'Asthma / Bronchitis',
  'High Cholesterol',
  'Thyroid Disorder',
];

const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'];

export const PatientAuthScreen: React.FC<PatientAuthScreenProps> = ({
  initialMode = 'login',
  onLoginExisting,
  onSignUpNew,
  onBackToGateway,
  language,
  onSelectLanguage,
  onShowToast,
}) => {
  const [mode, setMode] = useState<'login' | 'signup'>(initialMode);
  const [showLangMenu, setShowLangMenu] = useState(false);

  // Login form states
  const [loginIdentifier, setLoginIdentifier] = useState('98201 48291');
  const [authMethod, setAuthMethod] = useState<'pin' | 'otp'>('pin');
  const [loginPin, setLoginPin] = useState('419208');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Sign up form states
  const [fullName, setFullName] = useState('Eleanor Vance');
  const [phone, setPhone] = useState('98201 48291');
  const [age, setAge] = useState<number>(32);
  const [gender, setGender] = useState<'Female' | 'Male' | 'Other'>('Female');
  const [bloodGroup, setBloodGroup] = useState('O+');
  const [abhaId, setAbhaId] = useState(
    `91-${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(1000 + Math.random() * 9000)}@abdm`
  );
  const [selectedConditions, setSelectedConditions] = useState<string[]>([
    'Healthy / No Chronic Conditions',
  ]);
  const [selectedAllergies, setSelectedAllergies] = useState<string[]>([
    'No Known Drug Allergies (NKDA)',
  ]);
  const [emergencyName, setEmergencyName] = useState('David Vance');
  const [emergencyRelation, setEmergencyRelation] = useState('Spouse');
  const [emergencyPhone, setEmergencyPhone] = useState('98765 43210');

  const t = (k: string) => getTranslation(language, k);
  const currentLangObj = LANGUAGES.find((l) => l.code === language) || LANGUAGES[0];

  const handleGenerateAbhaId = () => {
    const p1 = Math.floor(1000 + Math.random() * 9000);
    const p2 = Math.floor(1000 + Math.random() * 9000);
    const p3 = Math.floor(1000 + Math.random() * 9000);
    setAbhaId(`91-${p1}-${p2}-${p3}@abdm`);
    onShowToast('Generated new ABHA Health ID number');
  };

  const toggleAllergy = (item: string) => {
    if (item === 'No Known Drug Allergies (NKDA)') {
      setSelectedAllergies(['No Known Drug Allergies (NKDA)']);
      return;
    }
    const withoutNkda = selectedAllergies.filter((a) => a !== 'No Known Drug Allergies (NKDA)');
    if (withoutNkda.includes(item)) {
      const next = withoutNkda.filter((a) => a !== item);
      setSelectedAllergies(next.length === 0 ? ['No Known Drug Allergies (NKDA)'] : next);
    } else {
      setSelectedAllergies([...withoutNkda, item]);
    }
  };

  const toggleCondition = (item: string) => {
    if (item === 'Healthy / No Chronic Conditions') {
      setSelectedConditions(['Healthy / No Chronic Conditions']);
      return;
    }
    const withoutHealthy = selectedConditions.filter(
      (c) => c !== 'Healthy / No Chronic Conditions'
    );
    if (withoutHealthy.includes(item)) {
      const next = withoutHealthy.filter((c) => c !== item);
      setSelectedConditions(next.length === 0 ? ['Healthy / No Chronic Conditions'] : next);
    } else {
      setSelectedConditions([...withoutHealthy, item]);
    }
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginIdentifier.trim()) {
      onShowToast('Please enter your ABHA ID or mobile number', 'alert');
      return;
    }
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      onLoginExisting(loginIdentifier.trim());
      onShowToast('Signed in successfully! Loading patient dashboard.');
    }, 600);
  };

  const handleSignUpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !phone.trim()) {
      onShowToast('Please fill in your name and phone number', 'alert');
      return;
    }
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      onSignUpNew({
        fullName: fullName.trim(),
        age: Number(age) || 30,
        gender,
        phone: phone.trim(),
        email: `${fullName.toLowerCase().replace(/\s+/g, '.')}@example.com`,
        bloodGroup,
        abhaId,
        city: 'Mumbai, Maharashtra',
        healthGoal: 'Routine Wellness & Health Tracking',
        allergies: selectedAllergies,
        conditions: selectedConditions,
        emergencyContactName: emergencyName.trim() || 'Emergency Contact',
        emergencyContactRelation: emergencyRelation,
        emergencyContactPhone: emergencyPhone.trim() || phone.trim(),
        preferredMode: 'patient',
      });
      onShowToast(`Health ID ${abhaId} generated for ${fullName}!`);
    }, 700);
  };

  const handleQuickDemoLogin = (name: string, identifier: string) => {
    setLoginIdentifier(identifier);
    onLoginExisting(identifier, true);
    onShowToast(`Logged into verified demo patient account: ${name}`);
  };

  return (
    <div className="min-h-screen bg-[#f4f8fd] flex flex-col items-center justify-center p-2 sm:p-4 text-[#0b1c30]">
      {/* Top back & language bar */}
      <div className="w-full max-w-[440px] flex items-center justify-between mb-2">
        <button
          onClick={onBackToGateway}
          className="text-xs font-semibold text-[#006398] hover:text-[#004357] flex items-center gap-1 cursor-pointer py-1 px-2 rounded-lg hover:bg-white/60 transition-colors"
        >
          <span className="material-symbols-outlined text-[16px]">arrow_back</span>
          <span>Back to Portal Selection</span>
        </button>

        {/* Language selector */}
        <div className="relative">
          <button
            onClick={() => setShowLangMenu(!showLangMenu)}
            className="px-2 py-1 rounded-lg bg-white border border-[#dce9ff] text-[#004357] font-semibold text-[11px] flex items-center gap-1 hover:bg-[#eff4ff] transition-colors"
          >
            <span className="material-symbols-outlined text-[14px] text-[#006398]">translate</span>
            <span>{currentLangObj.nativeName}</span>
            <span className="material-symbols-outlined text-[12px]">expand_more</span>
          </button>
          {showLangMenu && (
            <div className="absolute right-0 top-8 w-40 bg-white rounded-xl shadow-xl border border-[#dce9ff] py-1 z-50 animate-in fade-in">
              {LANGUAGES.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => {
                    onSelectLanguage(lang.code);
                    setShowLangMenu(false);
                  }}
                  className={`w-full text-left px-3 py-1.5 text-xs flex items-center justify-between ${
                    lang.code === language ? 'bg-[#e5eeff] text-[#004357] font-bold' : 'text-[#0b1c30] hover:bg-[#eff4ff]'
                  }`}
                >
                  <span>{lang.nativeName}</span>
                  <span className="text-[10px] text-[#70787d]">{lang.label}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Main Container */}
      <div className="w-full max-w-[440px] bg-white rounded-3xl shadow-xl border border-[#dce9ff] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-4 pt-5 pb-3 bg-gradient-to-b from-[#f0f8ff] to-white border-b border-[#e5efff]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl overflow-hidden border border-[#93ccff] bg-white shadow-xs shrink-0 flex items-center justify-center">
                <img
                  src="/assets/aistudio/WhatsApp_Image_2026-10-25_at_12.21.54_AM_4c858893.jpeg"
                  alt="MediSync Icon"
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <span className="font-extrabold text-sm text-[#004357] tracking-tight block">
                  MediSync Patient Care
                </span>
                <span className="text-[10px] text-[#52606d] block">
                  Ayushman Bharat Digital Mission (ABDM)
                </span>
              </div>
            </div>

            <span className="px-2 py-0.5 rounded-full bg-[#dcfce7] border border-[#86efac] text-[#166534] font-bold text-[10px] flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#16a34a] animate-pulse"></span>
              ABHA Active
            </span>
          </div>

          <div className="mt-3">
            <h1 className="text-xl font-extrabold text-[#002b38] tracking-tight">
              {mode === 'login' ? 'Patient Sign In' : 'Create Patient Account'}
            </h1>
            <p className="text-xs text-[#52606d] mt-0.5 leading-relaxed">
              {mode === 'login'
                ? 'Sign in to access your prescriptions, lab reports, and appointment records.'
                : 'Enter your details once to establish your official ABHA health profile.'}
            </p>
          </div>
        </div>

        {/* Segmented Mode Selector: Log In vs Sign Up */}
        <div className="px-4 pt-3 pb-1">
          <div className="p-1 rounded-xl bg-[#e5efff]/80 border border-[#dce9ff] flex items-center text-xs font-bold">
            <button
              type="button"
              onClick={() => setMode('login')}
              className={`flex-1 py-2 rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                mode === 'login'
                  ? 'bg-white text-[#004357] shadow-sm border border-[#cbe1ff]'
                  : 'text-[#52606d] hover:text-[#0b1c30]'
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">login</span>
              <span>Already have an Account</span>
            </button>
            <button
              type="button"
              onClick={() => setMode('signup')}
              className={`flex-1 py-2 rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                mode === 'signup'
                  ? 'bg-white text-[#004357] shadow-sm border border-[#cbe1ff]'
                  : 'text-[#52606d] hover:text-[#0b1c30]'
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">person_add</span>
              <span>New Patient Sign Up</span>
            </button>
          </div>
        </div>

        {/* Mode 1: Log In (Existing Account) */}
        {mode === 'login' && (
          <div className="p-4 space-y-4">
            {/* Quick Demo Logins for effortless review */}
            <div className="p-2.5 rounded-2xl bg-[#eff6ff] border border-[#dce9ff] space-y-1.5">
              <span className="text-[11px] font-bold text-[#004357] block">
                Quick Demo Patient Accounts (1-Click Login):
              </span>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => handleQuickDemoLogin('Eleanor Vance', '98201 48291')}
                  className="p-2 rounded-xl bg-white border border-[#cbe1ff] hover:bg-[#e0f0ff] text-left text-xs transition-colors cursor-pointer shadow-2xs"
                >
                  <div className="font-bold text-[#004357] truncate">Eleanor Vance</div>
                  <div className="text-[10px] text-[#52606d] truncate">ABHA: 91-4820-1920@abdm</div>
                  <span className="text-[9px] text-[#0284c7] font-semibold mt-0.5 inline-block">Click to Sign In →</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleQuickDemoLogin('Rajesh Kumar', '98765 12345')}
                  className="p-2 rounded-xl bg-white border border-[#cbe1ff] hover:bg-[#e0f0ff] text-left text-xs transition-colors cursor-pointer shadow-2xs"
                >
                  <div className="font-bold text-[#004357] truncate">Rajesh Kumar</div>
                  <div className="text-[10px] text-[#52606d] truncate">ABHA: 91-8841-3310@abdm</div>
                  <span className="text-[9px] text-[#0284c7] font-semibold mt-0.5 inline-block">Click to Sign In →</span>
                </button>
              </div>
            </div>

            <form onSubmit={handleLoginSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-[11px] font-bold text-[#0b1c30] mb-1">
                  ABHA Health ID or Registered Phone Number <span className="text-[#ba1a1a]">*</span>
                </label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3 top-2.5 text-[#52606d] text-[18px]">
                    badge
                  </span>
                  <input
                    type="text"
                    value={loginIdentifier}
                    onChange={(e) => setLoginIdentifier(e.target.value)}
                    placeholder="e.g. 98201 48291 or 91-0000-0000-0000@abdm"
                    required
                    className="w-full h-10 pl-9 pr-3 bg-[#f0f5fc] border border-[#d5e2f0] rounded-xl text-xs text-[#0b1c30] font-medium focus:bg-white focus:border-[#006398] focus:outline-hidden transition-colors"
                  />
                </div>
              </div>

              {/* Auth Method Switch: PIN vs OTP */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-[11px] font-bold text-[#0b1c30]">
                    {authMethod === 'pin' ? 'Security PIN / Password' : '6-Digit OTP via SMS'}
                  </label>
                  <button
                    type="button"
                    onClick={() => setAuthMethod(authMethod === 'pin' ? 'otp' : 'pin')}
                    className="text-[11px] font-bold text-[#006398] hover:underline cursor-pointer"
                  >
                    {authMethod === 'pin' ? 'Switch to OTP' : 'Switch to PIN'}
                  </button>
                </div>

                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3 top-2.5 text-[#52606d] text-[18px]">
                    {authMethod === 'pin' ? 'key' : 'sms'}
                  </span>
                  <input
                    type="password"
                    value={loginPin}
                    onChange={(e) => setLoginPin(e.target.value)}
                    maxLength={10}
                    placeholder={authMethod === 'pin' ? 'Enter 6-digit PIN' : 'Enter 6-digit SMS code'}
                    required
                    className="w-full h-10 pl-9 pr-3 bg-[#f0f5fc] border border-[#d5e2f0] rounded-xl text-xs font-mono tracking-widest text-[#0b1c30] focus:bg-white focus:border-[#006398] focus:outline-hidden transition-colors"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full h-12 rounded-2xl bg-[#006141] hover:bg-[#004d33] active:scale-[0.99] text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all cursor-pointer"
              >
                {isSubmitting ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    <span>Signing In...</span>
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-[18px]">login</span>
                    <span>Sign In to Patient Portal</span>
                  </>
                )}
              </button>

              {/* Switch to Sign Up */}
              <div className="text-center pt-2 border-t border-[#e5eeff]">
                <span className="text-[11px] text-[#52606d]">Don't have a registered account? </span>
                <button
                  type="button"
                  onClick={() => setMode('signup')}
                  className="text-[11px] font-bold text-[#006398] hover:underline cursor-pointer"
                >
                  Sign Up Here
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Mode 2: Sign Up (New Patient Account) */}
        {mode === 'signup' && (
          <form onSubmit={handleSignUpSubmit} className="p-4 space-y-3.5 text-xs max-h-[75vh] overflow-y-auto">
            {/* Full Name */}
            <div>
              <label className="block text-[11px] font-bold text-[#0b1c30] mb-1">
                Full Legal Name <span className="text-[#ba1a1a]">*</span>
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="e.g. Eleanor Vance"
                required
                className="w-full h-10 px-3 bg-[#f0f5fc] border border-[#d5e2f0] rounded-xl text-xs text-[#0b1c30] font-medium focus:bg-white focus:border-[#006398] focus:outline-hidden"
              />
            </div>

            {/* Mobile & Age & Gender */}
            <div className="grid grid-cols-3 gap-2">
              <div className="col-span-1">
                <label className="block text-[11px] font-bold text-[#0b1c30] mb-1">
                  Phone <span className="text-[#ba1a1a]">*</span>
                </label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Mobile"
                  required
                  className="w-full h-10 px-2.5 bg-[#f0f5fc] border border-[#d5e2f0] rounded-xl text-xs"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#0b1c30] mb-1">
                  Age <span className="text-[#ba1a1a]">*</span>
                </label>
                <input
                  type="number"
                  min={1}
                  max={120}
                  value={age}
                  onChange={(e) => setAge(Number(e.target.value))}
                  required
                  className="w-full h-10 px-2.5 bg-[#f0f5fc] border border-[#d5e2f0] rounded-xl text-xs"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#0b1c30] mb-1">Gender</label>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value as any)}
                  className="w-full h-10 px-2 bg-[#f0f5fc] border border-[#d5e2f0] rounded-xl text-xs"
                >
                  <option value="Female">Female</option>
                  <option value="Male">Male</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            {/* Blood Group & ABHA ID */}
            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="block text-[11px] font-bold text-[#0b1c30] mb-1">Blood Group</label>
                <select
                  value={bloodGroup}
                  onChange={(e) => setBloodGroup(e.target.value)}
                  className="w-full h-10 px-2 bg-[#f0f5fc] border border-[#d5e2f0] rounded-xl text-xs font-bold text-[#ba1a1a]"
                >
                  {BLOOD_GROUPS.map((bg) => (
                    <option key={bg} value={bg}>
                      {bg}
                    </option>
                  ))}
                </select>
              </div>

              <div className="col-span-2">
                <div className="flex items-center justify-between mb-1">
                  <label className="text-[11px] font-bold text-[#0b1c30]">ABHA Health ID</label>
                  <button
                    type="button"
                    onClick={handleGenerateAbhaId}
                    className="text-[10px] text-[#006398] font-bold hover:underline cursor-pointer"
                  >
                    Regenerate
                  </button>
                </div>
                <input
                  type="text"
                  value={abhaId}
                  onChange={(e) => setAbhaId(e.target.value)}
                  className="w-full h-10 px-2.5 bg-[#eaf4ff] border border-[#cbe3ff] rounded-xl text-xs font-mono text-[#004357]"
                />
              </div>
            </div>

            {/* Emergency Contact */}
            <div className="p-2.5 rounded-xl bg-[#fef2f2] border border-[#fecaca] space-y-2">
              <span className="text-[11px] font-bold text-[#991b1b] flex items-center gap-1">
                <span className="material-symbols-outlined text-[15px]">emergency</span>
                <span>Emergency Contact Person</span>
              </span>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  value={emergencyName}
                  onChange={(e) => setEmergencyName(e.target.value)}
                  placeholder="Contact Name (e.g. David)"
                  className="h-9 px-2 bg-white border border-[#fca5a5] rounded-lg text-xs"
                />
                <input
                  type="text"
                  value={emergencyPhone}
                  onChange={(e) => setEmergencyPhone(e.target.value)}
                  placeholder="Contact Phone"
                  className="h-9 px-2 bg-white border border-[#fca5a5] rounded-lg text-xs"
                />
              </div>
            </div>

            {/* Health Conditions / Primary Focus */}
            <div>
              <label className="block text-[11px] font-bold text-[#0b1c30] mb-1">
                Current Health Conditions (Select all that apply)
              </label>
              <div className="flex flex-wrap gap-1.5">
                {COMMON_CONDITIONS.map((cond) => {
                  const isSelected = selectedConditions.includes(cond);
                  return (
                    <button
                      key={cond}
                      type="button"
                      onClick={() => toggleCondition(cond)}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold border transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-[#004357] text-white border-[#004357]'
                          : 'bg-[#f0f5fc] text-[#52606d] border-[#d5e2f0] hover:bg-[#e0efff]'
                      }`}
                    >
                      {cond}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Drug Allergies */}
            <div>
              <label className="block text-[11px] font-bold text-[#0b1c30] mb-1">
                Known Drug Allergies
              </label>
              <div className="flex flex-wrap gap-1.5">
                {COMMON_ALLERGIES.map((alg) => {
                  const isSelected = selectedAllergies.includes(alg);
                  return (
                    <button
                      key={alg}
                      type="button"
                      onClick={() => toggleAllergy(alg)}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold border transition-all cursor-pointer ${
                        isSelected
                          ? alg.includes('NKDA')
                            ? 'bg-[#006141] text-white border-[#006141]'
                            : 'bg-[#ba1a1a] text-white border-[#ba1a1a]'
                          : 'bg-[#f0f5fc] text-[#52606d] border-[#d5e2f0] hover:bg-[#e0efff]'
                      }`}
                    >
                      {alg}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-12 rounded-2xl bg-[#006141] hover:bg-[#004d33] active:scale-[0.99] text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  <span>Establishing Digital Health Profile...</span>
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-[18px]">verified</span>
                  <span>Create ABHA Profile & Open Dashboard</span>
                </>
              )}
            </button>

            {/* Switch to Log In */}
            <div className="text-center pt-2 border-t border-[#e5eeff]">
              <span className="text-[11px] text-[#52606d]">Already have an account? </span>
              <button
                type="button"
                onClick={() => setMode('login')}
                className="text-[11px] font-bold text-[#006398] hover:underline cursor-pointer"
              >
                Log In Instead
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
