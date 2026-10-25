import React, { useState } from 'react';
import { Patient, UserRegistrationData } from '../../types/clinical';

interface EditPatientDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  patient: Patient;
  onSave: (updated: Partial<UserRegistrationData> & { name?: string; bloodType?: string; age?: number; phone?: string; emergencyContact?: string }) => void;
  onShowToast: (msg: string, type?: 'success' | 'alert' | 'info') => void;
}

const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'];

export const EditPatientDetailsModal: React.FC<EditPatientDetailsModalProps> = ({
  isOpen,
  onClose,
  patient,
  onSave,
  onShowToast,
}) => {
  const [name, setName] = useState(patient.name);
  const [age, setAge] = useState(patient.age);
  const [gender, setGender] = useState(patient.gender);
  const [bloodType, setBloodType] = useState(patient.bloodType || 'O+');
  const [phone, setPhone] = useState('98201 48291');
  const [emergencyContact, setEmergencyContact] = useState(
    patient.alerts.find((a) => a.toLowerCase().includes('emergency'))?.replace('Emergency: ', '') || 'David Vance (98765 43210)'
  );
  const [newAllergy, setNewAllergy] = useState('');
  const [allergies, setAllergies] = useState<string[]>(
    patient.allergies.map((a) => a.allergen)
  );

  if (!isOpen) return null;

  const handleAddAllergy = () => {
    if (!newAllergy.trim()) return;
    if (!allergies.includes(newAllergy.trim().toUpperCase())) {
      setAllergies([...allergies, newAllergy.trim().toUpperCase()]);
      setNewAllergy('');
    }
  };

  const handleRemoveAllergy = (alg: string) => {
    setAllergies(allergies.filter((a) => a !== alg));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    onSave({
      fullName: name.trim(),
      name: name.trim(),
      age: Number(age) || 30,
      gender: gender as any,
      bloodGroup: bloodType,
      bloodType: bloodType,
      phone: phone.trim(),
      emergencyContactName: emergencyContact.split('(')[0]?.trim() || 'Emergency Contact',
      emergencyContactPhone: emergencyContact.match(/\((.*?)\)/)?.[1] || '98765 43210',
      emergencyContact: emergencyContact.trim(),
      allergies: allergies.length > 0 ? allergies : ['No Known Drug Allergies (NKDA)'],
    });

    onClose();
    onShowToast(`Updated patient details for ${name}. Synced across Doctor & Patient portals!`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl border border-[#dce9ff] flex flex-col overflow-hidden max-h-[90vh]">
        {/* Header */}
        <div className="p-4 bg-[#eff4ff] border-b border-[#dce9ff] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#004357] flex items-center justify-center text-white">
              <span className="material-symbols-outlined text-[18px]">manage_accounts</span>
            </div>
            <div>
              <h2 className="text-base font-bold text-[#004357]">Edit Patient Details</h2>
              <p className="text-xs text-[#40484c]">
                Changes sync immediately to both Patient & Doctor EHR views
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-[#70787d] hover:bg-[#dce9ff] transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-4 space-y-3.5 text-xs overflow-y-auto">
          {/* Full Name */}
          <div>
            <label className="block text-[11px] font-bold text-[#0b1c30] mb-1">
              Patient Full Name <span className="text-[#ba1a1a]">*</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full h-10 px-3 bg-[#f0f5fc] border border-[#d5e2f0] rounded-xl text-xs font-semibold text-[#0b1c30]"
            />
          </div>

          {/* Age, Gender, Blood Type */}
          <div className="grid grid-cols-3 gap-2">
            <div>
              <label className="block text-[11px] font-bold text-[#0b1c30] mb-1">Age</label>
              <input
                type="number"
                min={1}
                max={120}
                value={age}
                onChange={(e) => setAge(Number(e.target.value))}
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

            <div>
              <label className="block text-[11px] font-bold text-[#0b1c30] mb-1">Blood Group</label>
              <select
                value={bloodType}
                onChange={(e) => setBloodType(e.target.value)}
                className="w-full h-10 px-2 bg-[#f0f5fc] border border-[#d5e2f0] rounded-xl text-xs font-bold text-[#ba1a1a]"
              >
                {BLOOD_GROUPS.map((bg) => (
                  <option key={bg} value={bg}>
                    {bg}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Emergency Contact */}
          <div>
            <label className="block text-[11px] font-bold text-[#0b1c30] mb-1">
              Emergency Contact & Phone
            </label>
            <input
              type="text"
              value={emergencyContact}
              onChange={(e) => setEmergencyContact(e.target.value)}
              placeholder="e.g. David Vance (98765 43210)"
              className="w-full h-10 px-3 bg-[#f0f5fc] border border-[#d5e2f0] rounded-xl text-xs"
            />
          </div>

          {/* Allergies list */}
          <div>
            <label className="block text-[11px] font-bold text-[#0b1c30] mb-1">
              Documented Drug Allergies
            </label>
            <div className="flex gap-1.5 mb-2">
              <input
                type="text"
                value={newAllergy}
                onChange={(e) => setNewAllergy(e.target.value)}
                placeholder="Add allergen (e.g. SULFA)"
                className="flex-1 h-9 px-3 bg-[#f0f5fc] border border-[#d5e2f0] rounded-lg text-xs uppercase"
              />
              <button
                type="button"
                onClick={handleAddAllergy}
                className="px-3 py-1.5 rounded-lg bg-[#004357] text-white font-bold text-xs"
              >
                Add
              </button>
            </div>

            <div className="flex flex-wrap gap-1.5 min-h-[30px] p-2 bg-[#f8fbff] border border-[#dce9ff] rounded-xl">
              {allergies.length === 0 ? (
                <span className="text-[11px] text-[#70787d]">No allergies recorded (NKDA)</span>
              ) : (
                allergies.map((alg) => (
                  <span
                    key={alg}
                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#ffdad6] text-[#ba1a1a] text-[11px] font-bold"
                  >
                    <span>{alg}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveAllergy(alg)}
                      className="hover:text-black font-bold"
                    >
                      ×
                    </button>
                  </span>
                ))
              )}
            </div>
          </div>

          <div className="p-2.5 rounded-xl bg-[#eaf4ff] text-[10px] text-[#004357] flex items-center gap-2">
            <span className="material-symbols-outlined text-[16px] text-[#006398]">sync</span>
            <span>All edits are recorded with real-time bidirectional ABDM synchronization.</span>
          </div>

          {/* Buttons */}
          <div className="pt-2 flex justify-end gap-2 border-t border-[#e5eeff]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-white border border-[#bfc8cd] text-[#40484c] text-xs font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-[#004357] hover:bg-[#003444] text-white font-bold text-xs flex items-center gap-1.5 shadow-xs cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px]">save</span>
              <span>Save & Sync</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
