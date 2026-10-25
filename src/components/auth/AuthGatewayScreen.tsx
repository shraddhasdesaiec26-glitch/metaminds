import React, { useState } from 'react';
import { DoctorAuth, Patient, UserRegistrationData } from '../../types/clinical';
import { LANGUAGES, LanguageCode, getTranslation } from '../../utils/i18n';
import { PRESET_DOCTORS } from './DoctorLoginModal';

interface AuthGatewayScreenProps {
  onDoctorLogin: (doctorAuth: DoctorAuth) => void;
  onDoctorRegister: (doctorAuth: DoctorAuth) => void;
  onPatientLogin: (patientId: string, customPatient?: Patient) => void;
  onPatientRegister: (data: UserRegistrationData) => void;
  language: LanguageCode;
  onSelectLanguage: (lang: LanguageCode) => void;
  onShowToast: (msg: string, type?: 'success' | 'alert' | 'info') => void;
  savedUserData?: UserRegistrationData | null;
  patients: Patient[];
}

export const AuthGatewayScreen: React.FC<AuthGatewayScreenProps> = ({
  onDoctorLogin,
  onDoctorRegister,
  onPatientLogin,
  onPatientRegister,
  language,
  onSelectLanguage,
  onShowToast,
  savedUserData,
  patients,
}) => {
  // Navigation state within auth flow
  // 1. 'role': Ask if doctor or patient
  // 2. 'has_account_query': Once role chosen, ask if user has an account or not
  // 3. 'doctor_login' | 'doctor_register' | 'patient_login' | 'patient_register'
  const [currentStep, setCurrentStep] = useState<
    'role' | 'has_account_query' | 'doctor_login' | 'doctor_register' | 'patient_login' | 'patient_register'
  >('role');

  const [selectedRole, setSelectedRole] = useState<'doctor' | 'patient' | null>(null);
  const [showLangMenu, setShowLangMenu] = useState(false);

  // --- Doctor Login State ---
  const [docLoginEmail, setDocLoginEmail] = useState('r.iyer@stjudehealth.org');
  const [docLoginPassword, setDocLoginPassword] = useState('DoctorSecret@2026');

  // --- Doctor Register State ---
  const [docRegName, setDocRegName] = useState('Dr. Priya Sengupta');
  const [docRegNmc, setDocRegNmc] = useState('NMC-MCI-2024-88421');
  const [docRegCouncil, setDocRegCouncil] = useState('National Medical Commission / State Board');
  const [docRegDept, setDocRegDept] = useState('Cardiology & Intensive Care Unit (ICU)');
  const [docRegHospital, setDocRegHospital] = useState('St. Jude Memorial Hospital');
  const [docRegQual, setDocRegQual] = useState('MBBS, MD, DM (Cardiology)');
  const [docRegEmail, setDocRegEmail] = useState('dr.priya@stjudehealth.org');
  const [docRegPassword, setDocRegPassword] = useState('ClinicalEHR@2026');

  // --- Patient Login State ---
  const [patLoginId, setPatLoginId] = useState('98201 48291');
  const [patLoginPassword, setPatLoginPassword] = useState('123456');

  // --- Patient Register State ---
  const [patFullName, setPatFullName] = useState(savedUserData?.fullName || 'Eleanor Vance');
  const [patAge, setPatAge] = useState<number>(savedUserData?.age || 32);
  const [patGender, setPatGender] = useState<'Female' | 'Male' | 'Other'>(savedUserData?.gender || 'Female');
  const [patBloodGroup, setPatBloodGroup] = useState(savedUserData?.bloodGroup || 'O+');
  const [patPhone, setPatPhone] = useState(savedUserData?.phone || '98201 48291');
  const [patEmail, setPatEmail] = useState(savedUserData?.email || 'eleanor.vance@example.com');
  const [patAbhaId, setPatAbhaId] = useState(
    savedUserData?.abhaId || `91-${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(1000 + Math.random() * 9000)}@abdm`
  );
  const [patConditions, setPatConditions] = useState<string[]>(
    savedUserData?.conditions || ['Essential Hypertension (High BP)']
  );
  const [patAllergies, setPatAllergies] = useState<string[]>(
    savedUserData?.allergies || ['Penicillin']
  );
  const [patEmergencyName, setPatEmergencyName] = useState(savedUserData?.emergencyContactName || 'David Vance');
  const [patEmergencyPhone, setPatEmergencyPhone] = useState(savedUserData?.emergencyContactPhone || '98765 43210');
  const [patPassword, setPatPassword] = useState('PatientHealth@2026');

  const currentLangObj = LANGUAGES.find((l) => l.code === language) || LANGUAGES[0];
  const t = (k: string) => getTranslation(language, k);

  // Helper to generate fresh ABHA ID
  const handleGenerateAbha = () => {
    const p1 = Math.floor(1000 + Math.random() * 9000);
    const p2 = Math.floor(1000 + Math.random() * 9000);
    const p3 = Math.floor(1000 + Math.random() * 9000);
    const newId = `91-${p1}-${p2}-${p3}@abdm`;
    setPatAbhaId(newId);
    onShowToast('Generated new National ABHA Health ID: ' + newId, 'info');
  };

  // Toggle condition
  const toggleCondition = (item: string) => {
    if (item === 'None / Healthy') {
      setPatConditions(['None / Healthy']);
      return;
    }
    const clean = patConditions.filter((c) => c !== 'None / Healthy');
    if (clean.includes(item)) {
      const filtered = clean.filter((c) => c !== item);
      setPatConditions(filtered.length === 0 ? ['None / Healthy'] : filtered);
    } else {
      setPatConditions([...clean, item]);
    }
  };

  // Toggle allergy
  const toggleAllergy = (item: string) => {
    if (item === 'No Known Drug Allergies (NKDA)') {
      setPatAllergies(['No Known Drug Allergies (NKDA)']);
      return;
    }
    const clean = patAllergies.filter((a) => a !== 'No Known Drug Allergies (NKDA)');
    if (clean.includes(item)) {
      const filtered = clean.filter((a) => a !== item);
      setPatAllergies(filtered.length === 0 ? ['No Known Drug Allergies (NKDA)'] : filtered);
    } else {
      setPatAllergies([...clean, item]);
    }
  };

  // Submit doctor login
  const handleDoctorLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!docLoginEmail.trim()) {
      onShowToast('Please enter your doctor email or staff ID', 'alert');
      return;
    }

    const matchedPreset = PRESET_DOCTORS.find(
      (d) =>
        d.email?.toLowerCase() === docLoginEmail.trim().toLowerCase() ||
        d.hospitalStaffId.toLowerCase() === docLoginEmail.trim().toLowerCase() ||
        d.name.toLowerCase().includes(docLoginEmail.trim().toLowerCase())
    );

    const docAuth: DoctorAuth = matchedPreset || {
      isVerified: true,
      name: docLoginEmail.includes('@') ? `Dr. ${docLoginEmail.split('@')[0].replace('.', ' ')}` : 'Dr. Medical Clinician, MD',
      nmcRegNo: 'NMC-2024-' + Math.floor(10000 + Math.random() * 90000),
      stateMedicalCouncil: 'National Medical Commission (Verified Active)',
      qualification: 'MBBS, MD',
      hospitalStaffId: docLoginEmail.includes('@') ? docLoginEmail.split('@')[0].toUpperCase() : 'SJ-DOC-4921',
      department: 'Clinical Medicine & ICU',
      verifiedAt: 'NPI Registry & NMC Verified',
      digitalSignatureToken: 'PKI-' + Date.now(),
      email: docLoginEmail,
    };

    onShowToast(`Welcome back, ${docAuth.name}! Doctor EHR session active.`, 'success');
    onDoctorLogin(docAuth);
  };

  // Submit doctor registration
  const handleDoctorRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!docRegName.trim()) {
      onShowToast('Please enter your full doctor name', 'alert');
      return;
    }
    if (!docRegNmc.trim()) {
      onShowToast('Please enter your medical council registration number', 'alert');
      return;
    }

    const formattedName = docRegName.startsWith('Dr.') ? docRegName : `Dr. ${docRegName}`;
    const newDocAuth: DoctorAuth = {
      isVerified: true,
      name: formattedName,
      nmcRegNo: docRegNmc.trim(),
      stateMedicalCouncil: docRegCouncil.trim(),
      qualification: docRegQual.trim() || 'MBBS, MD',
      hospitalStaffId: `SJ-${Math.floor(1000 + Math.random() * 9000)}`,
      department: docRegDept.trim(),
      verifiedAt: 'Just Now (National Medical Commission & ABDM Registry)',
      digitalSignatureToken: `PKI-SHA256-${Date.now()}`,
      email: docRegEmail.trim(),
    };

    onShowToast(`Dr. ${docRegName} registered & verified with medical credentials!`, 'success');
    onDoctorRegister(newDocAuth);
  };

  // Submit patient login
  const handlePatientLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!patLoginId.trim()) {
      onShowToast('Please enter your mobile number, email, or ABHA ID', 'alert');
      return;
    }

    // Try finding an existing patient
    const found = patients.find(
      (p) =>
        p.id === patLoginId ||
        p.name.toLowerCase().includes(patLoginId.toLowerCase()) ||
        p.abhaId?.includes(patLoginId)
    );

    if (found) {
      onShowToast(`Welcome back, ${found.name}! Signed into Patient Portal.`, 'success');
      onPatientLogin(found.id);
    } else {
      // Login with default user profile
      const activeId = patients[0]?.id || 'pt-registered-user';
      onShowToast(`Signed into Patient Portal as ${patients[0]?.name || 'Patient'}`, 'success');
      onPatientLogin(activeId);
    }
  };

  // Submit patient registration
  const handlePatientRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!patFullName.trim()) {
      onShowToast('Please enter your full name', 'alert');
      return;
    }

    const regData: UserRegistrationData = {
      fullName: patFullName.trim(),
      age: patAge,
      gender: patGender,
      bloodGroup: patBloodGroup,
      phone: patPhone.trim(),
      email: patEmail.trim(),
      abhaId: patAbhaId.trim(),
      city: 'Mumbai',
      healthGoal: 'Active Health Monitoring & Disease Management',
      conditions: patConditions,
      allergies: patAllergies,
      emergencyContactName: patEmergencyName.trim(),
      emergencyContactRelation: 'Family Member',
      emergencyContactPhone: patEmergencyPhone.trim(),
      preferredMode: 'patient',
    };

    onShowToast(`Welcome, ${patFullName}! Health account created & linked to EHR.`, 'success');
    onPatientRegister(regData);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#e8f2ff] via-[#f4f8ff] to-[#eaf2ff] flex flex-col items-center justify-center p-3 sm:p-6 text-[#0b1c30]">
      {/* Top Brand Bar & Language Switcher */}
      <div className="w-full max-w-2xl sm:max-w-3xl flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-2xl overflow-hidden border border-[#93ccff] bg-white shadow-sm flex items-center justify-center">
            <img
              src="/assets/aistudio/WhatsApp_Image_2026-10-25_at_12.21.54_AM_4c858893.jpeg"
              alt="MediSync Icon"
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <div className="font-bold text-sm tracking-tight text-[#004357] flex items-center gap-1.5">
              <span>MEDISYNC</span>
              <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-[#cce5ff] text-[#004357] font-extrabold uppercase">
                Clinical + Patient
              </span>
            </div>
            <div className="text-[10px] text-[#40484c]">Connected Healthcare Ecosystem</div>
          </div>
        </div>

        {/* Language selector */}
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

      {/* Main Container Card */}
      <div className="w-full max-w-2xl sm:max-w-3xl bg-white/95 backdrop-blur-md rounded-3xl border border-[#cce5ff] shadow-xl p-5 sm:p-7 flex flex-col">
        {/* ========================================================= */}
        {/* STEP 1: Are you a Doctor or Patient?                      */}
        {/* ========================================================= */}
        {currentStep === 'role' && (
          <div className="space-y-6 animate-in fade-in">
            <div className="text-center space-y-1.5">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#e0f2fe] text-[#0369a1] text-xs font-bold border border-[#bae6fd]">
                <span className="w-2 h-2 rounded-full bg-[#0284c7] animate-pulse"></span>
                {t('first_step_identity')}
              </span>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#003444] tracking-tight">
                {t('welcome_to_medisync')}
              </h1>
              <p className="text-xs sm:text-sm text-[#40484c] max-w-md mx-auto">
                {t('select_role_desc')}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Doctor Option */}
              <button
                onClick={() => {
                  setSelectedRole('doctor');
                  setCurrentStep('has_account_query');
                }}
                className="group relative text-left p-5 rounded-2xl border-2 border-[#bde0fe] hover:border-[#006398] bg-gradient-to-br from-[#f0f8ff] to-[#ffffff] hover:shadow-lg transition-all duration-200 cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-12 h-12 rounded-2xl bg-[#004357] text-white flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
                      <span className="material-symbols-outlined text-[26px]">stethoscope</span>
                    </div>
                    <span className="px-2 py-0.5 rounded-full bg-[#dcfce7] text-[#166534] text-[10px] font-bold border border-[#86efac]">
                      {t('Clinical EHR')}
                    </span>
                  </div>
                  <h2 className="text-base font-bold text-[#004357] group-hover:text-[#006398] transition-colors">
                    {t('I am a Doctor')}
                  </h2>
                  <p className="text-xs text-[#52606d] mt-1 leading-relaxed">
                    {t('doctor_card_desc')}
                  </p>
                  <div className="mt-3 flex flex-wrap gap-1">
                    <span className="px-2 py-0.5 rounded-md bg-[#e5eeff] text-[#004357] text-[10px] font-semibold">
                      {t('Medical License ID')}
                    </span>
                    <span className="px-2 py-0.5 rounded-md bg-[#e5eeff] text-[#004357] text-[10px] font-semibold">
                      {t('Review Patient Uploads')}
                    </span>
                  </div>
                </div>

                <div className="mt-5 pt-3 border-t border-[#dce9ff] flex items-center justify-between text-xs font-bold text-[#006398] group-hover:translate-x-0.5 transition-transform">
                  <span>{t('Continue as Doctor')}</span>
                  <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                </div>
              </button>

              {/* Patient Option */}
              <button
                onClick={() => {
                  setSelectedRole('patient');
                  setCurrentStep('has_account_query');
                }}
                className="group relative text-left p-5 rounded-2xl border-2 border-[#bbf7d0] hover:border-[#006141] bg-gradient-to-br from-[#f0fdf4] to-[#ffffff] hover:shadow-lg transition-all duration-200 cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-12 h-12 rounded-2xl bg-[#006141] text-white flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
                      <span className="material-symbols-outlined text-[26px]">person</span>
                    </div>
                    <span className="px-2 py-0.5 rounded-full bg-[#cce5ff] text-[#004357] text-[10px] font-bold border border-[#93ccff]">
                      {t('Patient Portal')}
                    </span>
                  </div>
                  <h2 className="text-base font-bold text-[#00472f] group-hover:text-[#006141] transition-colors">
                    {t('I am a Patient')}
                  </h2>
                  <p className="text-xs text-[#52606d] mt-1 leading-relaxed">
                    {t('patient_card_desc')}
                  </p>
                  <div className="mt-3 flex flex-wrap gap-1">
                    <span className="px-2 py-0.5 rounded-md bg-[#dcfce7] text-[#166534] text-[10px] font-semibold">
                      {t('Live Vitals Telemetry')}
                    </span>
                    <span className="px-2 py-0.5 rounded-md bg-[#dcfce7] text-[#166534] text-[10px] font-semibold">
                      {t('Family Health Sharing')}
                    </span>
                  </div>
                </div>

                <div className="mt-5 pt-3 border-t border-[#dcfce7] flex items-center justify-between text-xs font-bold text-[#006141] group-hover:translate-x-0.5 transition-transform">
                  <span>{t('Continue as Patient')}</span>
                  <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                </div>
              </button>
            </div>

            {/* Bottom trust bar */}
            <div className="pt-3 border-t border-[#e5eeff] flex flex-wrap items-center justify-center gap-4 text-[11px] text-[#70787d]">
              <div className="flex items-center gap-1">
                <span className="material-symbols-outlined text-[15px] text-[#006141]">verified_user</span>
                <span>ABDM / ABHA Digital Health Locker</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="material-symbols-outlined text-[15px] text-[#006398]">sync</span>
                <span>Real-Time Patient & Doctor Document Sync</span>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* STEP 2: Do you already have an account?                  */}
        {/* ========================================================= */}
        {currentStep === 'has_account_query' && selectedRole && (
          <div className="space-y-6 animate-in fade-in">
            {/* Back button */}
            <button
              onClick={() => {
                setCurrentStep('role');
                setSelectedRole(null);
              }}
              className="inline-flex items-center gap-1 text-xs font-semibold text-[#006398] hover:underline cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px]">arrow_back</span>
              <span>{t('back_to_role')}</span>
            </button>

            <div className="text-center space-y-2">
              <div
                className={`w-14 h-14 rounded-2xl mx-auto flex items-center justify-center text-white shadow-md ${
                  selectedRole === 'doctor' ? 'bg-[#004357]' : 'bg-[#006141]'
                }`}
              >
                <span className="material-symbols-outlined text-[30px]">
                  {selectedRole === 'doctor' ? 'stethoscope' : 'person'}
                </span>
              </div>
              <h2 className="text-2xl font-extrabold text-[#003444] tracking-tight">
                {selectedRole === 'doctor' ? t('doctor_login_title') : t('patient_login_title')}
              </h2>
              <p className="text-xs sm:text-sm text-[#40484c] max-w-sm mx-auto">
                {t('has_account_desc')}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              {/* Option A: Yes, I have an account */}
              <button
                onClick={() => {
                  if (selectedRole === 'doctor') {
                    setCurrentStep('doctor_login');
                  } else {
                    setCurrentStep('patient_login');
                  }
                }}
                className="p-5 rounded-2xl border-2 border-[#bde0fe] hover:border-[#006398] bg-[#f0f8ff]/70 hover:bg-white text-left transition-all duration-200 cursor-pointer shadow-xs group"
              >
                <div className="w-10 h-10 rounded-xl bg-[#004357] text-white flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                  <span className="material-symbols-outlined text-[22px]">login</span>
                </div>
                <div className="font-bold text-sm text-[#004357]">{t('Yes, I have an account')}</div>
                <div className="text-xs text-[#52606d] mt-1">
                  {selectedRole === 'doctor' ? t('doctor_login_desc') : t('patient_login_desc')}
                </div>
                <div className="mt-4 flex items-center gap-1 text-xs font-bold text-[#006398]">
                  <span>{t('Sign In')}</span>
                  <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                </div>
              </button>

              {/* Option B: No, I don't have an account */}
              <button
                onClick={() => {
                  if (selectedRole === 'doctor') {
                    setCurrentStep('doctor_register');
                  } else {
                    setCurrentStep('patient_register');
                  }
                }}
                className="p-5 rounded-2xl border-2 border-[#bbf7d0] hover:border-[#006141] bg-[#f0fdf4]/70 hover:bg-white text-left transition-all duration-200 cursor-pointer shadow-xs group"
              >
                <div className="w-10 h-10 rounded-xl bg-[#006141] text-white flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                  <span className="material-symbols-outlined text-[22px]">person_add</span>
                </div>
                <div className="font-bold text-sm text-[#00472f]">{t("No, I don't have an account")}</div>
                <div className="text-xs text-[#52606d] mt-1">
                  {selectedRole === 'doctor'
                    ? t('doctor_register_desc')
                    : t('patient_register_desc')}
                </div>
                <div className="mt-4 flex items-center gap-1 text-xs font-bold text-[#006141]">
                  <span>{t('Create Account')}</span>
                  <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                </div>
              </button>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* STEP 3A: DOCTOR LOGIN (Account Exists)                    */}
        {/* ========================================================= */}
        {currentStep === 'doctor_login' && (
          <div className="space-y-5 animate-in fade-in">
            <div className="flex items-center justify-between">
              <button
                onClick={() => setCurrentStep('has_account_query')}
                className="inline-flex items-center gap-1 text-xs font-semibold text-[#006398] hover:underline cursor-pointer"
              >
                <span className="material-symbols-outlined text-[16px]">arrow_back</span>
                <span>{t('Back')}</span>
              </button>
              <span className="px-2 py-0.5 rounded-full bg-[#dcfce7] text-[#166534] text-[10px] font-bold">
                {t('Doctor Sign In')}
              </span>
            </div>

            <div>
              <h2 className="text-xl font-bold text-[#004357]">{t('doctor_login_title')}</h2>
              <p className="text-xs text-[#40484c] mt-0.5">
                {t('doctor_login_desc')}
              </p>
            </div>

            {/* Quick 1-Click Demo Profiles */}
            <div className="p-3 bg-[#eff4ff] rounded-xl border border-[#dce9ff]">
              <div className="text-[11px] font-bold text-[#004357] mb-2 flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px]">bolt</span>
                <span>{t('Quick 1-Click Doctor Profiles:')}</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {PRESET_DOCTORS.map((doc) => (
                  <button
                    key={doc.hospitalStaffId}
                    type="button"
                    onClick={() => {
                      setDocLoginEmail(doc.email || doc.hospitalStaffId);
                      setDocLoginPassword('clinicalAdmin#2026');
                      onDoctorLogin(doc);
                      onShowToast(`Signed in as ${doc.name}`, 'success');
                    }}
                    className="px-2.5 py-1 rounded-lg bg-white border border-[#93ccff] hover:bg-[#cce5ff] text-[#004357] text-[11px] font-semibold transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[13px] text-[#006398]">stethoscope</span>
                    <span>{doc.name.split(',')[0]}</span>
                    <span className="text-[9px] text-[#70787d]">({doc.department.split('&')[0].trim()})</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Login Form */}
            <form onSubmit={handleDoctorLoginSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#0b1c30] mb-1">
                  {t('Official Email or Staff ID')}
                </label>
                <input
                  type="text"
                  required
                  value={docLoginEmail}
                  onChange={(e) => setDocLoginEmail(e.target.value)}
                  placeholder="e.g. r.iyer@stjudehealth.org or SJ-ATTEND-4192"
                  className="w-full h-11 px-3.5 text-xs bg-white border border-[#dce9ff] rounded-xl focus:border-[#006398] focus:ring-2 focus:ring-[#5bb8fe]/30 outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#0b1c30] mb-1">
                  {t('Password')}
                </label>
                <input
                  type="password"
                  required
                  value={docLoginPassword}
                  onChange={(e) => setDocLoginPassword(e.target.value)}
                  placeholder="Enter your doctor account password"
                  className="w-full h-11 px-3.5 text-xs bg-white border border-[#dce9ff] rounded-xl focus:border-[#006398] focus:ring-2 focus:ring-[#5bb8fe]/30 outline-hidden"
                />
              </div>

              <button
                type="submit"
                className="w-full h-12 rounded-xl bg-[#004357] hover:bg-[#0d5c75] text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md active:scale-98 transition-all cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">verified</span>
                <span>{t('login_btn')}</span>
              </button>
            </form>

            <div className="text-center pt-2 border-t border-[#e5eeff]">
              <span className="text-xs text-[#52606d]">{t("No, I don't have an account")} </span>
              <button
                onClick={() => setCurrentStep('doctor_register')}
                className="text-xs font-bold text-[#006398] hover:underline cursor-pointer"
              >
                {t('New Doctor Registration')}
              </button>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* STEP 3B: DOCTOR REGISTRATION (Details to confirm doctor)  */}
        {/* ========================================================= */}
        {currentStep === 'doctor_register' && (
          <div className="space-y-4 animate-in fade-in">
            <div className="flex items-center justify-between">
              <button
                onClick={() => setCurrentStep('has_account_query')}
                className="inline-flex items-center gap-1 text-xs font-semibold text-[#006398] hover:underline cursor-pointer"
              >
                <span className="material-symbols-outlined text-[16px]">arrow_back</span>
                <span>Back</span>
              </button>
              <span className="px-2 py-0.5 rounded-full bg-[#e0f2fe] text-[#0369a1] text-[10px] font-bold border border-[#bae6fd]">
                Doctor Credential Verification
              </span>
            </div>

            <div>
              <h2 className="text-xl font-bold text-[#004357]">Doctor Registration</h2>
              <p className="text-xs text-[#40484c]">
                Please provide details to confirm you are a licensed physician or hospital clinician.
              </p>
            </div>

            <form onSubmit={handleDoctorRegisterSubmit} className="space-y-3.5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-[#0b1c30] mb-1">
                    Doctor Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={docRegName}
                    onChange={(e) => setDocRegName(e.target.value)}
                    placeholder="e.g. Dr. Priya Sengupta"
                    className="w-full h-10 px-3 text-xs bg-white border border-[#dce9ff] rounded-xl focus:border-[#006398] outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-[#0b1c30] mb-1">
                    Medical Council / License No. *
                  </label>
                  <input
                    type="text"
                    required
                    value={docRegNmc}
                    onChange={(e) => setDocRegNmc(e.target.value)}
                    placeholder="e.g. NMC-MCI-2024-88421"
                    className="w-full h-10 px-3 text-xs bg-white border border-[#dce9ff] rounded-xl focus:border-[#006398] outline-hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-[#0b1c30] mb-1">
                    Specialization / Department *
                  </label>
                  <select
                    value={docRegDept}
                    onChange={(e) => setDocRegDept(e.target.value)}
                    className="w-full h-10 px-2.5 text-xs bg-white border border-[#dce9ff] rounded-xl focus:border-[#006398] outline-hidden"
                  >
                    <option value="Cardiology & Intensive Care Unit (ICU)">Cardiology & ICU</option>
                    <option value="General Internal Medicine">General Internal Medicine</option>
                    <option value="Emergency & Trauma Resuscitation">Emergency & Trauma</option>
                    <option value="Pulmonology & Respiratory Care">Pulmonology & Respiratory</option>
                    <option value="Endocrinology & Diabetology">Endocrinology & Diabetology</option>
                    <option value="Orthopedic Surgery">Orthopedic Surgery</option>
                    <option value="Pediatrics & Child Health">Pediatrics</option>
                    <option value="Diagnostic Radiology & Imaging">Diagnostic Radiology</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-[#0b1c30] mb-1">
                    Medical Qualifications *
                  </label>
                  <input
                    type="text"
                    required
                    value={docRegQual}
                    onChange={(e) => setDocRegQual(e.target.value)}
                    placeholder="e.g. MBBS, MD, DM (Cardiology)"
                    className="w-full h-10 px-3 text-xs bg-white border border-[#dce9ff] rounded-xl focus:border-[#006398] outline-hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-[#0b1c30] mb-1">
                    Hospital / Clinic Affiliation *
                  </label>
                  <input
                    type="text"
                    required
                    value={docRegHospital}
                    onChange={(e) => setDocRegHospital(e.target.value)}
                    placeholder="e.g. St. Jude Memorial Hospital"
                    className="w-full h-10 px-3 text-xs bg-white border border-[#dce9ff] rounded-xl focus:border-[#006398] outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-[#0b1c30] mb-1">
                    State Council / Medical Board
                  </label>
                  <input
                    type="text"
                    value={docRegCouncil}
                    onChange={(e) => setDocRegCouncil(e.target.value)}
                    placeholder="e.g. Maharashtra Medical Council / State Board"
                    className="w-full h-10 px-3 text-xs bg-white border border-[#dce9ff] rounded-xl focus:border-[#006398] outline-hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-[#0b1c30] mb-1">
                    Official Email *
                  </label>
                  <input
                    type="email"
                    required
                    value={docRegEmail}
                    onChange={(e) => setDocRegEmail(e.target.value)}
                    placeholder="e.g. dr.priya@stjudehealth.org"
                    className="w-full h-10 px-3 text-xs bg-white border border-[#dce9ff] rounded-xl focus:border-[#006398] outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-[#0b1c30] mb-1">
                    Create Password *
                  </label>
                  <input
                    type="password"
                    required
                    value={docRegPassword}
                    onChange={(e) => setDocRegPassword(e.target.value)}
                    placeholder="Choose secure password"
                    className="w-full h-10 px-3 text-xs bg-white border border-[#dce9ff] rounded-xl focus:border-[#006398] outline-hidden"
                  />
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-[#cce5ff]/40 border border-[#93ccff] flex items-center gap-2 text-[11px] text-[#00476e]">
                <span className="material-symbols-outlined text-[18px] text-[#006398]">verified_user</span>
                <span>
                  Details verified against National Medical Commission & ABDM Health Professional Registry.
                </span>
              </div>

              <button
                type="submit"
                className="w-full h-12 rounded-xl bg-[#004357] hover:bg-[#0d5c75] text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md active:scale-98 transition-all cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">how_to_reg</span>
                <span>Confirm Doctor Verification & Open EHR</span>
              </button>
            </form>

            <div className="text-center pt-2 border-t border-[#e5eeff]">
              <span className="text-xs text-[#52606d]">Already have an account? </span>
              <button
                onClick={() => setCurrentStep('doctor_login')}
                className="text-xs font-bold text-[#006398] hover:underline cursor-pointer"
              >
                Sign in here
              </button>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* STEP 3C: PATIENT LOGIN (Account Exists)                   */}
        {/* ========================================================= */}
        {currentStep === 'patient_login' && (
          <div className="space-y-5 animate-in fade-in">
            <div className="flex items-center justify-between">
              <button
                onClick={() => setCurrentStep('has_account_query')}
                className="inline-flex items-center gap-1 text-xs font-semibold text-[#006398] hover:underline cursor-pointer"
              >
                <span className="material-symbols-outlined text-[16px]">arrow_back</span>
                <span>{t('Back')}</span>
              </button>
              <span className="px-2 py-0.5 rounded-full bg-[#dcfce7] text-[#166534] text-[10px] font-bold">
                {t('Patient Sign In')}
              </span>
            </div>

            <div>
              <h2 className="text-xl font-bold text-[#00472f]">{t('patient_login_title')}</h2>
              <p className="text-xs text-[#40484c] mt-0.5">
                {t('patient_login_desc')}
              </p>
            </div>

            {/* Quick 1-Click Patient Profiles */}
            <div className="p-3 bg-[#f0fdf4] rounded-xl border border-[#bbf7d0]">
              <div className="text-[11px] font-bold text-[#00472f] mb-2 flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px]">bolt</span>
                <span>{t('Quick 1-Click Patient Profiles:')}</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {patients.slice(0, 3).map((pat) => (
                  <button
                    key={pat.id}
                    type="button"
                    onClick={() => {
                      onPatientLogin(pat.id);
                      onShowToast(`Signed in as ${pat.name}`, 'success');
                    }}
                    className="px-2.5 py-1 rounded-lg bg-white border border-[#86efac] hover:bg-[#dcfce7] text-[#00472f] text-[11px] font-semibold transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[13px] text-[#006141]">person</span>
                    <span>{pat.name}</span>
                    <span className="text-[9px] text-[#70787d]">({pat.bloodType}, {pat.age}y)</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Login Form */}
            <form onSubmit={handlePatientLoginSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#0b1c30] mb-1">
                  {t('Mobile Number or ABHA Health ID')}
                </label>
                <input
                  type="text"
                  required
                  value={patLoginId}
                  onChange={(e) => setPatLoginId(e.target.value)}
                  placeholder="e.g. 98201 48291 or 91-8492-4820-1102@abdm"
                  className="w-full h-11 px-3.5 text-xs bg-white border border-[#dce9ff] rounded-xl focus:border-[#006141] focus:ring-2 focus:ring-[#86efac]/30 outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#0b1c30] mb-1">
                  {t('Password')}
                </label>
                <input
                  type="password"
                  required
                  value={patLoginPassword}
                  onChange={(e) => setPatLoginPassword(e.target.value)}
                  placeholder="Enter your password or 6-digit PIN"
                  className="w-full h-11 px-3.5 text-xs bg-white border border-[#dce9ff] rounded-xl focus:border-[#006141] focus:ring-2 focus:ring-[#86efac]/30 outline-hidden"
                />
              </div>

              <button
                type="submit"
                className="w-full h-12 rounded-xl bg-[#006141] hover:bg-[#00472f] text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md active:scale-98 transition-all cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">login</span>
                <span>{t('login_btn')}</span>
              </button>
            </form>

            <div className="text-center pt-2 border-t border-[#e5eeff]">
              <span className="text-xs text-[#52606d]">{t("No, I don't have an account")} </span>
              <button
                onClick={() => setCurrentStep('patient_register')}
                className="text-xs font-bold text-[#006141] hover:underline cursor-pointer"
              >
                {t('Patient Health Registration')}
              </button>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* STEP 3D: PATIENT REGISTRATION (Necessary patient details) */}
        {/* ========================================================= */}
        {currentStep === 'patient_register' && (
          <div className="space-y-4 animate-in fade-in">
            <div className="flex items-center justify-between">
              <button
                onClick={() => setCurrentStep('has_account_query')}
                className="inline-flex items-center gap-1 text-xs font-semibold text-[#006398] hover:underline cursor-pointer"
              >
                <span className="material-symbols-outlined text-[16px]">arrow_back</span>
                <span>Back</span>
              </button>
              <span className="px-2 py-0.5 rounded-full bg-[#dcfce7] text-[#166534] text-[10px] font-bold">
                New Patient Registration
              </span>
            </div>

            <div>
              <h2 className="text-xl font-bold text-[#00472f]">Patient Registration</h2>
              <p className="text-xs text-[#40484c]">
                Please enter your necessary health details to create your personal digital health record.
              </p>
            </div>

            <form onSubmit={handlePatientRegisterSubmit} className="space-y-3.5">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <label className="block text-[11px] font-bold text-[#0b1c30] mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={patFullName}
                    onChange={(e) => setPatFullName(e.target.value)}
                    placeholder="e.g. Eleanor Vance"
                    className="w-full h-10 px-3 text-xs bg-white border border-[#dce9ff] rounded-xl focus:border-[#006141] outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-[#0b1c30] mb-1">
                    Age *
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={120}
                    required
                    value={patAge}
                    onChange={(e) => setPatAge(parseInt(e.target.value) || 30)}
                    className="w-full h-10 px-3 text-xs bg-white border border-[#dce9ff] rounded-xl focus:border-[#006141] outline-hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-[#0b1c30] mb-1">
                    Gender *
                  </label>
                  <select
                    value={patGender}
                    onChange={(e) => setPatGender(e.target.value as any)}
                    className="w-full h-10 px-2.5 text-xs bg-white border border-[#dce9ff] rounded-xl focus:border-[#006141] outline-hidden"
                  >
                    <option value="Female">Female</option>
                    <option value="Male">Male</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-[#0b1c30] mb-1">
                    Blood Group *
                  </label>
                  <select
                    value={patBloodGroup}
                    onChange={(e) => setPatBloodGroup(e.target.value)}
                    className="w-full h-10 px-2.5 text-xs bg-white border border-[#dce9ff] rounded-xl focus:border-[#006141] outline-hidden"
                  >
                    {['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'].map((bg) => (
                      <option key={bg} value={bg}>
                        {bg}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-[#0b1c30] mb-1">
                    Mobile Phone *
                  </label>
                  <input
                    type="tel"
                    required
                    value={patPhone}
                    onChange={(e) => setPatPhone(e.target.value)}
                    placeholder="e.g. 98201 48291"
                    className="w-full h-10 px-3 text-xs bg-white border border-[#dce9ff] rounded-xl focus:border-[#006141] outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-[#0b1c30] mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={patEmail}
                    onChange={(e) => setPatEmail(e.target.value)}
                    placeholder="e.g. eleanor@example.com"
                    className="w-full h-10 px-3 text-xs bg-white border border-[#dce9ff] rounded-xl focus:border-[#006141] outline-hidden"
                  />
                </div>
              </div>

              {/* ABHA Health ID */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-[11px] font-bold text-[#0b1c30]">
                    ABHA Health ID (Ayushman Bharat Digital Locker)
                  </label>
                  <button
                    type="button"
                    onClick={handleGenerateAbha}
                    className="text-[10px] text-[#006141] font-bold hover:underline cursor-pointer"
                  >
                    ⚡ Auto-Generate ABHA
                  </button>
                </div>
                <input
                  type="text"
                  value={patAbhaId}
                  onChange={(e) => setPatAbhaId(e.target.value)}
                  className="w-full h-10 px-3 text-xs font-mono bg-white border border-[#dce9ff] rounded-xl focus:border-[#006141] outline-hidden"
                />
              </div>

              {/* Health conditions */}
              <div>
                <label className="block text-[11px] font-bold text-[#0b1c30] mb-1.5">
                  Existing Health Conditions
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {[
                    'None / Healthy',
                    'Essential Hypertension (High BP)',
                    'Type 2 Diabetes',
                    'Asthma / Bronchitis',
                    'High Cholesterol',
                    'Thyroid Disorder',
                  ].map((cond) => {
                    const isSelected = patConditions.includes(cond);
                    return (
                      <button
                        key={cond}
                        type="button"
                        onClick={() => toggleCondition(cond)}
                        className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-colors cursor-pointer border ${
                          isSelected
                            ? 'bg-[#006141] text-white border-[#006141]'
                            : 'bg-white text-[#40484c] border-[#dce9ff] hover:bg-[#eff4ff]'
                        }`}
                      >
                        {cond}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Allergies */}
              <div>
                <label className="block text-[11px] font-bold text-[#0b1c30] mb-1.5">
                  Known Drug & Food Allergies
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {[
                    'No Known Drug Allergies (NKDA)',
                    'Penicillin',
                    'Sulfa Drugs',
                    'Aspirin / NSAIDs',
                    'Peanuts / Nuts',
                    'Dust & Pollen',
                  ].map((alg) => {
                    const isSelected = patAllergies.includes(alg);
                    return (
                      <button
                        key={alg}
                        type="button"
                        onClick={() => toggleAllergy(alg)}
                        className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-colors cursor-pointer border ${
                          isSelected
                            ? 'bg-[#ba1a1a] text-white border-[#ba1a1a]'
                            : 'bg-white text-[#40484c] border-[#dce9ff] hover:bg-[#eff4ff]'
                        }`}
                      >
                        {alg}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Emergency Contact */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-[#0b1c30] mb-1">
                    Emergency Contact Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={patEmergencyName}
                    onChange={(e) => setPatEmergencyName(e.target.value)}
                    placeholder="e.g. David Vance"
                    className="w-full h-10 px-3 text-xs bg-white border border-[#dce9ff] rounded-xl focus:border-[#006141] outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-[#0b1c30] mb-1">
                    Emergency Contact Phone *
                  </label>
                  <input
                    type="tel"
                    required
                    value={patEmergencyPhone}
                    onChange={(e) => setPatEmergencyPhone(e.target.value)}
                    placeholder="e.g. 98765 43210"
                    className="w-full h-10 px-3 text-xs bg-white border border-[#dce9ff] rounded-xl focus:border-[#006141] outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#0b1c30] mb-1">
                  Create Password *
                </label>
                <input
                  type="password"
                  required
                  value={patPassword}
                  onChange={(e) => setPatPassword(e.target.value)}
                  placeholder="Choose your password"
                  className="w-full h-10 px-3 text-xs bg-white border border-[#dce9ff] rounded-xl focus:border-[#006141] outline-hidden"
                />
              </div>

              <button
                type="submit"
                className="w-full h-12 rounded-xl bg-[#006141] hover:bg-[#00472f] text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md active:scale-98 transition-all cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">check_circle</span>
                <span>Complete Registration & Open Health Portal</span>
              </button>
            </form>

            <div className="text-center pt-2 border-t border-[#e5eeff]">
              <span className="text-xs text-[#52606d]">Already registered? </span>
              <button
                onClick={() => setCurrentStep('patient_login')}
                className="text-xs font-bold text-[#006141] hover:underline cursor-pointer"
              >
                Sign in here
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
