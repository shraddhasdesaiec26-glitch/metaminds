import React, { useState } from 'react';
import { Appointment, DoctorAuth, HealthDocument, InvoiceBill, Patient, RxOrder } from '../../types/clinical';

interface DoctorPortalDashboardProps {
  doctorAuth: DoctorAuth;
  patients: Patient[];
  selectedPatientId: string;
  onSelectPatient: (patient: Patient) => void;
  onNavigateScreen: (screenId: string) => void;
  onOpenNewRx: () => void;
  onLogout: () => void;
  documents: HealthDocument[];
  appointments: Appointment[];
  invoices: InvoiceBill[];
  orders: RxOrder[];
  onShowToast: (msg: string, type?: 'success' | 'alert' | 'info') => void;
}

export const DoctorPortalDashboard: React.FC<DoctorPortalDashboardProps> = ({
  doctorAuth,
  patients,
  selectedPatientId,
  onSelectPatient,
  onNavigateScreen,
  onOpenNewRx,
  onLogout,
  documents,
  appointments,
  invoices,
  orders,
  onShowToast,
}) => {
  const [activeModal, setActiveModal] = useState<'schedule' | 'reminders' | 'appointments_quick' | null>(null);

  // Extract first name for the "Hello, Dr. Rahul" greeting
  const doctorFirstName = doctorAuth?.name
    ? doctorAuth.name.replace('Dr. ', '').split(' ')[0]
    : 'Rahul';

  // Count pending reviews & reminders
  const pendingDocsCount = documents.filter((d) => d.reviewStatus === 'Pending Review').length;
  const pendingInvoicesCount = invoices.filter((i) => i.status === 'Pending').length;

  const upcomingPatient = patients.find((p) => p.id === 'pt-rohan-mehta') || patients[0];

  const remindersList = [
    {
      id: 'rem-1',
      title: 'Review Rohan Mehta Diagnostic MRI Report',
      due: 'Today, 10:30 AM',
      patient: 'Rohan Mehta',
      urgent: true,
      category: 'Diagnostic Review',
    },
    {
      id: 'rem-2',
      title: 'Verify Inpatient Blood Gas & Potassium for Eleanor Vance',
      due: 'Today, 12:00 PM',
      patient: 'Eleanor Vance',
      urgent: false,
      category: 'ICU Telemetry',
    },
    {
      id: 'rem-3',
      title: 'Sign Electronic Prescription Refill for Marcus Chen',
      due: 'Today, 02:00 PM',
      patient: 'Marcus Chen',
      urgent: false,
      category: 'Pharmacy e-Rx',
    },
  ];

  const clinicHours = [
    { day: 'Monday - Friday', hours: '09:00 AM - 01:00 PM (OPD)', type: 'In-Clinic Consultations' },
    { day: 'Monday - Friday', hours: '02:00 PM - 05:00 PM (ICU & Wards)', type: 'Inpatient Hospital Rounds' },
    { day: 'Saturday', hours: '09:00 AM - 02:00 PM (General OPD)', type: 'Weekend Clinic' },
    { day: 'Sunday', hours: 'On-Call Emergency Duty Only', type: 'Emergency Resuscitation' },
  ];

  return (
    <div className="min-h-screen bg-[#0b171e] text-white flex flex-col items-center justify-start p-4 sm:p-6 pb-24 select-none">
      <div className="w-full max-w-4xl space-y-6">
        {/* Top Header Bar matching screenshot */}
        <div className="flex items-center justify-between pt-2">
          {/* Logo with pulse wave */}
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-[#172e3a] border border-[#234657] flex items-center justify-center text-[#2dd4bf] shadow-sm">
              <span className="material-symbols-outlined text-[22px]">vital_signs</span>
            </div>
            <span className="text-xl font-bold tracking-tight text-white flex items-center">
              MediSync
            </span>
          </div>

          {/* Doctor Name and Exit / Logout Button */}
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-slate-300 hidden sm:inline">
              {doctorAuth?.name ? doctorAuth.name.split(',')[0] : 'Dr. Rahul Agarwal'}
            </span>
            <button
              onClick={onLogout}
              className="w-10 h-10 rounded-xl bg-[#142630] border border-[#213f50] hover:bg-[#1a3442] hover:border-[#2dd4bf]/40 flex items-center justify-center text-slate-300 hover:text-white transition-all cursor-pointer shadow-xs"
              title="Logout / Switch Account"
            >
              <span className="material-symbols-outlined text-[20px]">logout</span>
            </button>
          </div>
        </div>

        {/* Subheader and Greeting */}
        <div className="space-y-1">
          <div className="text-[12px] font-bold tracking-widest text-[#2dd4bf] uppercase">
            DOCTOR
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Hello, Dr. {doctorFirstName}
          </h1>
        </div>

        {/* UPCOMING Card matching screenshot */}
        <div className="space-y-2">
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
            UPCOMING
          </div>

          <div
            onClick={() => {
              onSelectPatient(upcomingPatient);
              onNavigateScreen('chart');
              onShowToast('Opened clinical details for Rohan Mehta', 'info');
            }}
            className="w-full bg-[#2dd4bf] text-[#072420] rounded-2xl p-4 sm:p-5 flex items-center justify-between cursor-pointer hover:bg-[#34e2cb] hover:shadow-lg transition-all group"
          >
            <div className="flex items-center gap-4 sm:gap-6 min-w-0">
              {/* Time */}
              <div className="flex flex-col shrink-0">
                <span className="text-2xl sm:text-3xl font-extrabold leading-none tracking-tight">
                  10 : 00
                </span>
                <span className="text-xs font-semibold text-[#0f3d37] mt-0.5">
                  Today
                </span>
              </div>

              {/* Patient and Condition */}
              <div className="min-w-0">
                <h2 className="text-lg sm:text-xl font-bold truncate text-[#072420] group-hover:underline">
                  Rohan Mehta
                </h2>
                <div className="text-xs sm:text-sm font-medium text-[#0f3d37] truncate mt-0.5">
                  Persistent headache • In-clinic
                </div>
              </div>
            </div>

            {/* Confirmed Pill */}
            <div className="shrink-0 pl-2">
              <span className="px-3 py-1.5 rounded-full bg-[#072d27] text-[#2dd4bf] text-xs font-bold tracking-wide shadow-xs flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#2dd4bf] animate-pulse"></span>
                <span>Confirmed</span>
              </span>
            </div>
          </div>
        </div>

        {/* 7 Doctor Options Grid matching screenshot */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 pt-1">
          {/* Tile 1: Appointments */}
          <button
            onClick={() => onNavigateScreen('appointments')}
            className="relative bg-[#13252f] hover:bg-[#18303d] border border-[#1e3b4a] hover:border-[#2dd4bf]/60 p-4 sm:p-5 rounded-2xl flex flex-col justify-between text-left transition-all duration-200 cursor-pointer shadow-sm group min-h-[110px]"
          >
            <div className="flex items-start justify-between w-full">
              <div className="w-10 h-10 rounded-xl bg-[#1b3644] border border-[#274f63] flex items-center justify-center text-[#2dd4bf] group-hover:scale-105 transition-transform">
                <span className="material-symbols-outlined text-[22px]">calendar_add_on</span>
              </div>
              <span className="w-6 h-6 rounded-full bg-[#1b3644] border border-[#2b586e] text-[#2dd4bf] font-bold text-xs flex items-center justify-center">
                4
              </span>
            </div>
            <div className="font-bold text-sm sm:text-base text-slate-100 mt-4 group-hover:text-white">
              Appointments
            </div>
          </button>

          {/* Tile 2: Schedule & hours */}
          <button
            onClick={() => setActiveModal('schedule')}
            className="relative bg-[#13252f] hover:bg-[#18303d] border border-[#1e3b4a] hover:border-[#2dd4bf]/60 p-4 sm:p-5 rounded-2xl flex flex-col justify-between text-left transition-all duration-200 cursor-pointer shadow-sm group min-h-[110px]"
          >
            <div className="flex items-start justify-between w-full">
              <div className="w-10 h-10 rounded-xl bg-[#1b3644] border border-[#274f63] flex items-center justify-center text-[#2dd4bf] group-hover:scale-105 transition-transform">
                <span className="material-symbols-outlined text-[22px]">schedule</span>
              </div>
            </div>
            <div className="font-bold text-sm sm:text-base text-slate-100 mt-4 group-hover:text-white">
              Schedule & hours
            </div>
          </button>

          {/* Tile 3: Reminders */}
          <button
            onClick={() => setActiveModal('reminders')}
            className="relative bg-[#13252f] hover:bg-[#18303d] border border-[#1e3b4a] hover:border-[#2dd4bf]/60 p-4 sm:p-5 rounded-2xl flex flex-col justify-between text-left transition-all duration-200 cursor-pointer shadow-sm group min-h-[110px]"
          >
            <div className="flex items-start justify-between w-full">
              <div className="w-10 h-10 rounded-xl bg-[#1b3644] border border-[#274f63] flex items-center justify-center text-[#2dd4bf] group-hover:scale-105 transition-transform">
                <span className="material-symbols-outlined text-[22px]">notifications</span>
              </div>
              <span className="w-6 h-6 rounded-full bg-[#1b3644] border border-[#2b586e] text-[#2dd4bf] font-bold text-xs flex items-center justify-center">
                2
              </span>
            </div>
            <div className="font-bold text-sm sm:text-base text-slate-100 mt-4 group-hover:text-white">
              Reminders
            </div>
          </button>

          {/* Tile 4: Patient details (Requirement 1 & 2: select patient and view details) */}
          <button
            onClick={() => onNavigateScreen('chart')}
            className="relative bg-[#13252f] hover:bg-[#18303d] border-2 border-[#2dd4bf]/40 hover:border-[#2dd4bf] p-4 sm:p-5 rounded-2xl flex flex-col justify-between text-left transition-all duration-200 cursor-pointer shadow-sm group min-h-[110px]"
          >
            <div className="flex items-start justify-between w-full">
              <div className="w-10 h-10 rounded-xl bg-[#0f3b37] border border-[#1c645b] flex items-center justify-center text-[#2dd4bf] group-hover:scale-105 transition-transform">
                <span className="material-symbols-outlined text-[22px]">vital_signs</span>
              </div>
              <span className="px-1.5 py-0.5 rounded-md bg-[#0f3b37] text-[#2dd4bf] text-[10px] font-bold uppercase">
                Active EHR
              </span>
            </div>
            <div className="font-bold text-sm sm:text-base text-white mt-4 flex items-center justify-between">
              <span>Patient details</span>
              <span className="material-symbols-outlined text-[18px] text-[#2dd4bf] group-hover:translate-x-0.5 transition-transform">
                arrow_forward
              </span>
            </div>
          </button>

          {/* Tile 5: Write e-prescription */}
          <button
            onClick={onOpenNewRx}
            className="relative bg-[#13252f] hover:bg-[#18303d] border border-[#1e3b4a] hover:border-[#2dd4bf]/60 p-4 sm:p-5 rounded-2xl flex flex-col justify-between text-left transition-all duration-200 cursor-pointer shadow-sm group min-h-[110px]"
          >
            <div className="flex items-start justify-between w-full">
              <div className="w-10 h-10 rounded-xl bg-[#1b3644] border border-[#274f63] flex items-center justify-center text-[#2dd4bf] group-hover:scale-105 transition-transform">
                <span className="material-symbols-outlined text-[22px]">description</span>
              </div>
            </div>
            <div className="font-bold text-sm sm:text-base text-slate-100 mt-4 group-hover:text-white">
              Write e-prescription
            </div>
          </button>

          {/* Tile 6: Records & reports */}
          <button
            onClick={() => onNavigateScreen('records_vault')}
            className="relative bg-[#13252f] hover:bg-[#18303d] border border-[#1e3b4a] hover:border-[#2dd4bf]/60 p-4 sm:p-5 rounded-2xl flex flex-col justify-between text-left transition-all duration-200 cursor-pointer shadow-sm group min-h-[110px]"
          >
            <div className="flex items-start justify-between w-full">
              <div className="w-10 h-10 rounded-xl bg-[#1b3644] border border-[#274f63] flex items-center justify-center text-[#2dd4bf] group-hover:scale-105 transition-transform">
                <span className="material-symbols-outlined text-[22px]">folder</span>
              </div>
              <span className="w-6 h-6 rounded-full bg-[#1b3644] border border-[#2b586e] text-[#2dd4bf] font-bold text-xs flex items-center justify-center">
                {pendingDocsCount > 0 ? pendingDocsCount : 3}
              </span>
            </div>
            <div className="font-bold text-sm sm:text-base text-slate-100 mt-4 group-hover:text-white">
              Records & reports
            </div>
          </button>

          {/* Tile 7: Billing & invoices */}
          <button
            onClick={() => onNavigateScreen('payments_billing')}
            className="relative bg-[#13252f] hover:bg-[#18303d] border border-[#1e3b4a] hover:border-[#2dd4bf]/60 p-4 sm:p-5 rounded-2xl flex flex-col justify-between text-left transition-all duration-200 cursor-pointer shadow-sm group min-h-[110px]"
          >
            <div className="flex items-start justify-between w-full">
              <div className="w-10 h-10 rounded-xl bg-[#1b3644] border border-[#274f63] flex items-center justify-center text-[#2dd4bf] group-hover:scale-105 transition-transform">
                <span className="material-symbols-outlined text-[22px]">account_balance_wallet</span>
              </div>
              <span className="w-6 h-6 rounded-full bg-[#e11d48] text-white font-bold text-xs flex items-center justify-center">
                {pendingInvoicesCount > 0 ? pendingInvoicesCount : 1}
              </span>
            </div>
            <div className="font-bold text-sm sm:text-base text-slate-100 mt-4 group-hover:text-white">
              Billing & invoices
            </div>
          </button>

          {/* Tile 8: Patient Census Switcher */}
          <button
            onClick={() => onNavigateScreen('patients')}
            className="relative bg-[#13252f] hover:bg-[#18303d] border border-[#1e3b4a] hover:border-[#2dd4bf]/60 p-4 sm:p-5 rounded-2xl flex flex-col justify-between text-left transition-all duration-200 cursor-pointer shadow-sm group min-h-[110px]"
          >
            <div className="flex items-start justify-between w-full">
              <div className="w-10 h-10 rounded-xl bg-[#1b3644] border border-[#274f63] flex items-center justify-center text-[#2dd4bf] group-hover:scale-105 transition-transform">
                <span className="material-symbols-outlined text-[22px]">groups</span>
              </div>
              <span className="text-[10px] font-bold text-slate-400">
                {patients.length} Beds
              </span>
            </div>
            <div className="font-bold text-sm sm:text-base text-slate-100 mt-4 group-hover:text-white">
              All ICU Patients
            </div>
          </button>
        </div>

        {/* Quick Patient Switcher Bar inside Doctor Dashboard */}
        <div className="p-4 rounded-2xl bg-[#12222b] border border-[#1d3744] space-y-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[#2dd4bf] text-[18px]">how_to_reg</span>
              <span className="font-bold text-xs text-slate-200">
                Quick Patient Selector (Select patient to examine clinical chart):
              </span>
            </div>
            <span className="text-[11px] text-slate-400">
              Active: <strong className="text-[#2dd4bf]">{patients.find((p) => p.id === selectedPatientId)?.name || 'Rohan Mehta'}</strong>
            </span>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
            {patients.map((p) => {
              const isSelected = p.id === selectedPatientId;
              return (
                <button
                  key={p.id}
                  onClick={() => {
                    onSelectPatient(p);
                    onNavigateScreen('chart');
                    onShowToast(`Switched chart to ${p.name}`, 'info');
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer shrink-0 ${
                    isSelected
                      ? 'bg-[#2dd4bf] text-[#072420] font-bold shadow-md'
                      : 'bg-[#18313e] hover:bg-[#1e3d4d] text-slate-300 border border-[#25485a]'
                  }`}
                >
                  <span className="material-symbols-outlined text-[15px]">person</span>
                  <span>{p.name}</span>
                  <span className="text-[10px] opacity-80">({p.room.split(' ')[0]})</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* SCHEDULE & HOURS MODAL */}
      {activeModal === 'schedule' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-in fade-in">
          <div className="bg-[#12242e] w-full max-w-md rounded-2xl border border-[#244759] shadow-2xl p-5 space-y-4 text-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-[#1f3d4c]">
              <div className="flex items-center gap-2 text-white font-bold text-base">
                <span className="material-symbols-outlined text-[#2dd4bf]">schedule</span>
                <span>Dr. {doctorFirstName}'s Schedule & Clinic Hours</span>
              </div>
              <button
                onClick={() => setActiveModal(null)}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-white hover:bg-[#1b3543] cursor-pointer"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <div className="space-y-2.5 text-xs">
              {clinicHours.map((ch, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-xl bg-[#172e3a] border border-[#234657] flex flex-col gap-1"
                >
                  <div className="flex items-center justify-between font-bold text-[#2dd4bf]">
                    <span>{ch.day}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-[#0d212b] text-slate-300">
                      {ch.type}
                    </span>
                  </div>
                  <div className="text-slate-300 font-mono text-[11px]">{ch.hours}</div>
                </div>
              ))}
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setActiveModal(null)}
                className="px-4 py-2 rounded-xl bg-[#2dd4bf] text-[#072420] font-bold text-xs cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* REMINDERS MODAL */}
      {activeModal === 'reminders' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-in fade-in">
          <div className="bg-[#12242e] w-full max-w-md rounded-2xl border border-[#244759] shadow-2xl p-5 space-y-4 text-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-[#1f3d4c]">
              <div className="flex items-center gap-2 text-white font-bold text-base">
                <span className="material-symbols-outlined text-[#2dd4bf]">notifications_active</span>
                <span>Clinical Reminders ({remindersList.length})</span>
              </div>
              <button
                onClick={() => setActiveModal(null)}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-white hover:bg-[#1b3543] cursor-pointer"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <div className="space-y-2.5 text-xs">
              {remindersList.map((rem) => (
                <div
                  key={rem.id}
                  className="p-3 rounded-xl bg-[#172e3a] border border-[#234657] flex items-start justify-between gap-2"
                >
                  <div>
                    <div className="flex items-center gap-1.5 font-bold text-white">
                      <span>{rem.title}</span>
                      {rem.urgent && (
                        <span className="px-1.5 py-0.2 rounded bg-rose-500/30 text-rose-300 text-[9px] font-bold">
                          Urgent
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] text-slate-400 mt-1">
                      Patient: <strong className="text-slate-200">{rem.patient}</strong> • Due: {rem.due}
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      const matched = patients.find((p) => p.name === rem.patient);
                      if (matched) onSelectPatient(matched);
                      onNavigateScreen('chart');
                      setActiveModal(null);
                    }}
                    className="px-2 py-1 rounded-lg bg-[#2dd4bf] text-[#072420] font-bold text-[10px] shrink-0"
                  >
                    Open
                  </button>
                </div>
              ))}
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setActiveModal(null)}
                className="px-4 py-2 rounded-xl bg-[#2dd4bf] text-[#072420] font-bold text-xs cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
