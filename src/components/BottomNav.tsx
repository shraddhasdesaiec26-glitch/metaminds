import React from 'react';
import { LanguageCode, getTranslation } from '../utils/i18n';

interface BottomNavProps {
  appRole: 'doctor' | 'patient' | 'wellness';
  activeScreen: string;
  onNavigate: (screen: any) => void;
  language: LanguageCode;
  pendingRxCount?: number;
  pendingReportsCount?: number;
}

interface NavItem {
  id: string;
  label: string;
  icon: string;
  badge?: number;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  appRole,
  activeScreen,
  onNavigate,
  language,
  pendingRxCount = 0,
  pendingReportsCount = 0,
}) => {
  const t = (k: string) => getTranslation(language, k);

  // Under wellness tab, user requested to remove booking, vault, insurance at the bottom:
  // "under wellness tab, there are options for booking, vault, insurance at the bottom. remove those. only one screen when i click on wellness. keep everything else as it is"
  if (appRole === 'wellness' || activeScreen === 'wellness') {
    return null;
  }

  // Options appearing ONLY in the doctor portal as requested: appointments, schedule and hours, patient details, write e prescriptions
  const doctorNavItems: NavItem[] = [
    { id: 'appointments', label: t('appointments'), icon: 'calendar_month', badge: 4 },
    { id: 'schedule_hours', label: t('Schedule & Hours') || 'Schedule & Hours', icon: 'schedule' },
    { id: 'patients', label: t('patient_list'), icon: 'vital_signs' },
    { id: 'write_prescription', label: t('new_rx_order'), icon: 'edit_document' },
  ];

  const patientNavItems: NavItem[] = [
    { id: 'chart', label: t('chart'), icon: 'vital_signs' },
    { id: 'appointments', label: t('appointments'), icon: 'calendar_month' },
    { id: 'prescriptions', label: t('prescriptions'), icon: 'pill' },
    { id: 'records_vault', label: t('records_vault'), icon: 'folder_shared' },
    { id: 'payments_billing', label: t('payments_billing'), icon: 'payments' },
  ];

  const navItems = appRole === 'doctor' ? doctorNavItems : patientNavItems;

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-xl border-t border-[#dce9ff] shadow-[0_-2px_12px_rgba(0,0,0,0.05)]"
      style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
    >
      <div className="w-full max-w-4xl mx-auto flex justify-around items-center h-16 px-3 sm:px-6">
        {navItems.map((item) => {
          const isActive =
            appRole === 'doctor'
              ? (item.id === 'patients' && (activeScreen === 'patients' || activeScreen === 'chart')) ||
                (item.id === 'appointments' && activeScreen === 'appointments') ||
                (item.id === 'schedule_hours' && activeScreen === 'schedule_hours')
              : activeScreen === item.id;

          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id === 'wellness_main' ? 'wellness' : item.id)}
              className={`flex flex-col items-center justify-center min-w-[60px] min-h-[44px] transition-colors relative cursor-pointer ${
                isActive
                  ? 'text-[#004357] font-bold'
                  : 'text-[#505a60] hover:text-[#0b1c30]'
              }`}
              aria-current={isActive ? 'page' : undefined}
            >
              <div className="relative flex items-center justify-center">
                <span
                  className="material-symbols-outlined text-[21px]"
                  style={isActive ? { fontVariationSettings: "'FILL' 1" } : undefined}
                >
                  {item.icon}
                </span>
                {item.badge && item.badge > 0 ? (
                  <span className="absolute -top-1 -right-2 w-4 h-4 rounded-full bg-[#ba1a1a] text-white text-[9px] font-bold flex items-center justify-center">
                    {item.badge}
                  </span>
                ) : null}
              </div>
              <span className="font-label-sm text-[10px] mt-0.5 tracking-normal whitespace-nowrap truncate max-w-[74px]">
                {item.label}
              </span>
              {isActive && (
                <span className="absolute bottom-1 w-6 h-0.5 rounded-full bg-[#004357]" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
