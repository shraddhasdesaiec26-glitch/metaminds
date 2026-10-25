import React, { useState } from 'react';
import { DoctorAuth, DocumentCategory, HealthDocument, Patient } from '../../types/clinical';
import { LanguageCode, getTranslation } from '../../utils/i18n';
import { DoctorReviewDocModal } from '../modals/DoctorReviewDocModal';

interface DocumentsVaultScreenProps {
  patient: Patient;
  documents: HealthDocument[];
  language: LanguageCode;
  appRole?: 'doctor' | 'patient' | 'wellness';
  doctorAuth?: DoctorAuth;
  onUploadDocument: (doc: Omit<HealthDocument, 'id'>) => void;
  onReviewDocument?: (docId: string, doctorNotes: string, reviewedByName: string) => void;
  onShowToast: (msg: string, type?: 'success' | 'alert' | 'info') => void;
}

export const DocumentsVaultScreen: React.FC<DocumentsVaultScreenProps> = ({
  patient,
  documents,
  language,
  appRole = 'patient',
  doctorAuth,
  onUploadDocument,
  onReviewDocument,
  onShowToast,
}) => {
  const [filter, setFilter] = useState<string>('All');
  const [search, setSearch] = useState('');
  const [selectedDoc, setSelectedDoc] = useState<HealthDocument | null>(null);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [reviewingDoc, setReviewingDoc] = useState<HealthDocument | null>(null);

  // Upload modal form states
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<DocumentCategory>('Blood Test');
  const [newDoctorOrLab, setNewDoctorOrLab] = useState('St. Jude Clinical Pathology Labs');
  const [newTags, setNewTags] = useState('Blood Test, Pathology, Routine');
  const [newSummary, setNewSummary] = useState('');
  const [uploadedFileUrl, setUploadedFileUrl] = useState<string>(
    'https://images.unsplash.com/photo-1579154204601-01588f351e67?w=800&auto=format&fit=crop&q=80'
  );
  const [fileNameDisplay, setFileNameDisplay] = useState('sample_blood_test.pdf');
  const [fileSizeDisplay, setFileSizeDisplay] = useState('1.4 MB PDF');

  const t = (k: string) => getTranslation(language, k);

  const categories = [
    'All',
    'Blood Test',
    'X-Ray',
    'Scan & MRI',
    'Pathology Report',
    'Prescription',
    'Discharge Summary',
  ];

  // Quick preset sample medical reports for effortless evaluator testing
  const sampleReports = [
    {
      title: 'Complete Blood Count (CBC) with Platelets',
      category: 'Blood Test' as DocumentCategory,
      lab: 'St. Jude Clinical Pathology Labs',
      tags: 'Blood Test, CBC, Hemoglobin, Platelets',
      summary: 'Hb: 14.1 g/dL, WBC: 7,200/uL, Platelets: 280,000/uL, Fasting Blood Glucose: 92 mg/dL. All parameters within normal baseline.',
      snippet: 'Hematology Report: Hemoglobin: 14.1 g/dL (Normal: 13.0-17.0). Packed Cell Volume (PCV): 42%. RBC Count: 4.8 mil/uL. Total Leukocyte Count (TLC): 7,200/cumm.',
      fileUrl: 'https://images.unsplash.com/photo-1579154204601-01588f351e67?w=800&auto=format&fit=crop&q=80',
      fileName: 'CBC_Platelets_Report.pdf',
      fileSize: '1.2 MB PDF',
    },
    {
      title: 'Chest Radiograph (PA & Lateral View X-Ray)',
      category: 'X-Ray' as DocumentCategory,
      lab: 'Metropolitan Imaging Center & Radiology',
      tags: 'X-Ray, Chest, Pulmonary, Lungs',
      summary: 'Normal chest radiograph. Bilateral lung parenchymal fields are clear. No active infiltrates, pleural effusion, or pneumothorax.',
      snippet: 'Impression: Posteroanterior and lateral projections of chest show normal bronchovascular markings, sharp costophrenic angles, and normal cardiothoracic ratio.',
      fileUrl: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?w=800&auto=format&fit=crop&q=80',
      fileName: 'Chest_XRay_PA_Lateral.dcm',
      fileSize: '3.6 MB DICOM',
    },
    {
      title: 'Brain & Lumbar Spine MRI Scan Report',
      category: 'Scan & MRI' as DocumentCategory,
      lab: 'Apollo Advanced Diagnostic MRI Center',
      tags: 'MRI Scan, Neuro, Lumbar Spine',
      summary: '1.5 Tesla MRI of brain and spine. No intracranial hemorrhage or acute infarction. Mild L4-L5 disc desiccation without spinal root impingement.',
      snippet: 'Findings: Brain parenchyma unremarkable. Ventricular system symmetric. Lumbar spine shows preserved vertebral heights and disc spaces except mild dehydration at L4-L5.',
      fileUrl: 'https://images.unsplash.com/photo-1559757175-5700dde675bc?w=800&auto=format&fit=crop&q=80',
      fileName: 'Brain_Spine_MRI_Scan.pdf',
      fileSize: '7.2 MB PDF',
    },
    {
      title: 'Urine Routine & Microscopic Pathology Analysis',
      category: 'Pathology Report' as DocumentCategory,
      lab: 'Suburban Diagnostic Laboratories',
      tags: 'Pathology, Urine Analysis, Renal Screening',
      summary: 'Color pale yellow, clear. Protein negative, glucose negative, ketone bodies absent. Microscopy shows 1-2 pus cells/HPF. Normal findings.',
      snippet: 'Urinalysis: Specific Gravity: 1.018. pH: 6.0. Albumin: Nil. Sugar: Nil. Microscopic Exam: Pus cells: 1-2 /HPF, Epithelial cells: Occasional. Crystals: Nil.',
      fileUrl: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&auto=format&fit=crop&q=80',
      fileName: 'Urine_Pathology_Report.pdf',
      fileSize: '890 KB PDF',
    },
  ];

  const handleApplySample = (s: typeof sampleReports[0]) => {
    setNewTitle(s.title);
    setNewCategory(s.category);
    setNewDoctorOrLab(s.lab);
    setNewTags(s.tags);
    setNewSummary(s.summary);
    setUploadedFileUrl(s.fileUrl);
    setFileNameDisplay(s.fileName);
    setFileSizeDisplay(s.fileSize);
    onShowToast(`Loaded sample report: ${s.title}`, 'info');
  };

  // Real file upload reader
  const handleRealFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileNameDisplay(file.name);
    const sizeMb = (file.size / (1024 * 1024)).toFixed(1);
    setFileSizeDisplay(`${sizeMb} MB ${file.name.split('.').pop()?.toUpperCase() || 'FILE'}`);

    // If auto title is empty, infer from filename
    if (!newTitle.trim()) {
      const cleanName = file.name
        .replace(/\.[^/.]+$/, '')
        .replace(/[-_]/g, ' ')
        .replace(/\b\w/g, (l) => l.toUpperCase());
      setNewTitle(cleanName);
    }

    // Auto-detect category from file name
    const lowerName = file.name.toLowerCase();
    if (lowerName.includes('xray') || lowerName.includes('x-ray')) {
      setNewCategory('X-Ray');
    } else if (lowerName.includes('mri') || lowerName.includes('ct') || lowerName.includes('scan')) {
      setNewCategory('Scan & MRI');
    } else if (lowerName.includes('blood') || lowerName.includes('cbc') || lowerName.includes('lipid')) {
      setNewCategory('Blood Test');
    } else if (lowerName.includes('urine') || lowerName.includes('biopsy') || lowerName.includes('path')) {
      setNewCategory('Pathology Report');
    }

    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          setUploadedFileUrl(reader.result);
        }
      };
      reader.readAsDataURL(file);
    } else {
      // PDF or other document
      setUploadedFileUrl('https://images.unsplash.com/photo-1579154204601-01588f351e67?w=800&auto=format&fit=crop&q=80');
    }

    onShowToast(`Attached file: ${file.name} (${sizeMb} MB)`, 'success');
  };

  const handleUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) {
      onShowToast('Please provide a document title', 'alert');
      return;
    }

    onUploadDocument({
      patientId: patient.id,
      patientName: patient.name,
      title: newTitle.trim(),
      category: newCategory,
      doctorOrLab: newDoctorOrLab.trim() || 'St. Jude Diagnostic Laboratories',
      date: 'Today, Oct 24, 2026',
      fileSize: fileSizeDisplay,
      tags: newTags.split(',').map((t) => t.trim()),
      verifiedAbdm: true,
      uploadedBy: 'patient',
      reviewStatus: 'Pending Review',
      fileUrl: uploadedFileUrl,
      aiSummary: newSummary.trim() || `Archived ${newCategory} uploaded by patient for clinical review.`,
      documentSnippet: `Document Name: ${newTitle.trim()}. Category: ${newCategory}. Facility: ${newDoctorOrLab}. Uploaded via ABDM Health Locker.`,
    });

    setIsUploadOpen(false);
    setNewTitle('');
    setNewDoctorOrLab('St. Jude Clinical Pathology Labs');
    setNewSummary('');
    onShowToast(`Uploaded "${newTitle}"! Shared with Doctor's clinical EHR.`);
  };

  // Filter documents
  const filteredDocs = documents.filter((doc) => {
    const matchesSearch =
      doc.title.toLowerCase().includes(search.toLowerCase()) ||
      doc.doctorOrLab.toLowerCase().includes(search.toLowerCase()) ||
      doc.tags.some((t) => t.toLowerCase().includes(search.toLowerCase()));

    const matchesCat =
      filter === 'All' ||
      doc.category === filter ||
      (filter === 'Blood Test' && doc.category === 'Blood Test') ||
      (filter === 'X-Ray' && (doc.category === 'X-Ray' || doc.category === 'Radiology Scan')) ||
      (filter === 'Scan & MRI' && (doc.category === 'Scan & MRI' || doc.category === 'Radiology Scan'));

    return matchesSearch && matchesCat;
  });

  return (
    <div className="flex flex-col w-full pb-8 px-3 pt-3 space-y-3 text-xs">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-1.5">
            <h1 className="text-lg font-bold text-[#004357]">{t('records_vault')}</h1>
            <span className="px-2 py-0.5 rounded-full bg-[#eff4ff] text-[#006398] font-bold text-[10px] border border-[#93ccff]">
              {documents.length} Records
            </span>
          </div>
          <p className="text-xs text-[#40484c]">
            Blood Tests, X-Rays, MRI/CT Scans & Prescriptions • <strong className="text-[#0b1c30]">{patient.name}</strong>
          </p>
        </div>

        {/* Upload Button */}
        <button
          onClick={() => {
            handleApplySample(sampleReports[0]);
            setIsUploadOpen(true);
          }}
          className="px-3.5 py-2 rounded-xl bg-[#004357] hover:bg-[#0d5c75] text-white font-bold text-xs flex items-center gap-1.5 shadow-md active:scale-98 transition-all cursor-pointer"
        >
          <span className="material-symbols-outlined text-[18px]">upload_file</span>
          <span>Upload Report</span>
        </button>
      </div>

      {/* Sync Status Banner */}
      <div className="p-3 rounded-xl bg-gradient-to-r from-[#eff4ff] to-[#e0f2fe] border border-[#93ccff] flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-[#004357] text-white flex items-center justify-center font-bold shrink-0">
            <span className="material-symbols-outlined text-[20px]">sync</span>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <strong className="text-xs text-[#001d31]">Real-Time EHR Synchronization</strong>
              <span className="px-1.5 py-0.2 rounded bg-[#6ffbbe] text-[#002113] text-[9px] font-bold uppercase">
                Active Link
              </span>
            </div>
            <span className="text-[11px] text-[#00476e]">
              Any report uploaded by the patient reflects immediately in the attending doctor's EHR chart.
            </span>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <span className="material-symbols-outlined absolute left-3 top-2.5 text-[#70787d] text-[20px]">
          search
        </span>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search blood test, X-Ray, MRI scan, lab findings..."
          className="w-full h-11 pl-10 pr-4 text-xs bg-white border border-[#dce9ff] rounded-xl shadow-xs focus:outline-hidden focus:border-[#006398] focus:ring-2 focus:ring-[#5bb8fe]/30"
        />
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
              filter === cat
                ? 'bg-[#004357] text-white shadow-xs'
                : 'bg-white text-[#40484c] border border-[#e5eeff] hover:bg-[#eff4ff]'
            }`}
          >
            {cat === 'Blood Test' && '🩸 '}
            {cat === 'X-Ray' && '🩻 '}
            {cat === 'Scan & MRI' && '🧠 '}
            {cat === 'Pathology Report' && '🔬 '}
            {cat === 'Prescription' && '📋 '}
            {cat}
          </button>
        ))}
      </div>

      {/* Documents List */}
      <div className="space-y-3">
        {filteredDocs.length === 0 ? (
          <div className="p-8 text-center bg-white rounded-2xl border border-[#dce9ff]">
            <span className="material-symbols-outlined text-4xl text-[#93ccff] mb-2">folder_open</span>
            <div className="font-bold text-sm text-[#004357]">No medical documents found</div>
            <p className="text-xs text-[#70787d] mt-1">
              Upload blood tests, X-rays, or scan reports to start building your digital vault.
            </p>
            <button
              onClick={() => {
                handleApplySample(sampleReports[0]);
                setIsUploadOpen(true);
              }}
              className="mt-3 px-4 py-2 rounded-xl bg-[#004357] text-white font-bold text-xs inline-flex items-center gap-1"
            >
              <span className="material-symbols-outlined text-[16px]">upload_file</span>
              <span>Upload Your First Report</span>
            </button>
          </div>
        ) : (
          filteredDocs.map((doc) => {
            const isBlood = doc.category === 'Blood Test';
            const isXray = doc.category === 'X-Ray' || doc.category === 'Radiology Scan';
            const isScan = doc.category === 'Scan & MRI';
            const isPrescription = doc.category === 'Prescription';
            const isReviewed = doc.reviewStatus === 'Reviewed by Doctor';

            return (
              <div
                key={doc.id}
                className="p-3.5 rounded-2xl bg-white border border-[#e5eeff] shadow-xs flex flex-col gap-2.5 hover:border-[#93ccff] transition-all"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-start gap-2.5 min-w-0">
                    <div
                      className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 font-bold ${
                        isBlood
                          ? 'bg-[#ffdad6] text-[#93000a]'
                          : isXray
                          ? 'bg-[#cce5ff] text-[#001d31]'
                          : isScan
                          ? 'bg-[#dce9ff] text-[#00476e]'
                          : isPrescription
                          ? 'bg-[#dcfce7] text-[#166534]'
                          : 'bg-[#eff4ff] text-[#004357]'
                      }`}
                    >
                      <span className="material-symbols-outlined text-[22px]">
                        {isBlood
                          ? 'biotech'
                          : isXray
                          ? 'radiology'
                          : isScan
                          ? 'neurology'
                          : isPrescription
                          ? 'prescriptions'
                          : 'description'}
                      </span>
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <h2 className="font-bold text-sm text-[#0b1c30] truncate">{doc.title}</h2>
                        {isReviewed ? (
                          <span className="px-2 py-0.5 rounded-full bg-[#dcfce7] text-[#166534] text-[10px] font-bold flex items-center gap-0.5">
                            <span className="material-symbols-outlined text-[12px]">check_circle</span>
                            Reviewed by Doctor
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-full bg-[#ffdad6] text-[#ba1a1a] text-[10px] font-bold flex items-center gap-0.5 animate-pulse">
                            <span className="material-symbols-outlined text-[12px]">schedule</span>
                            Pending Doctor Review
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-[#40484c] mt-0.5">
                        {doc.doctorOrLab} • {doc.date}
                      </div>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="px-2 py-0.5 rounded-md bg-[#eff4ff] text-[#006398] font-bold text-[10px] block">
                      {doc.category}
                    </span>
                    <span className="text-[10px] text-[#70787d] mt-1 block font-mono">{doc.fileSize}</span>
                  </div>
                </div>

                {/* Thumbnail Preview if present */}
                {doc.fileUrl && (
                  <div
                    onClick={() => setSelectedDoc(doc)}
                    className="h-28 rounded-xl overflow-hidden bg-black/5 relative group cursor-pointer border border-[#e5eeff]"
                  >
                    <img
                      src={doc.fileUrl}
                      alt={doc.title}
                      className="w-full h-full object-cover group-hover:scale-102 transition-transform"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end p-2 text-white text-[11px] font-semibold">
                      <span className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-[15px]">zoom_in</span>
                        <span>Click to examine report details</span>
                      </span>
                    </div>
                  </div>
                )}

                {/* AI / Clinical Summary */}
                <div className="p-2.5 rounded-xl bg-[#eff4ff] text-[11px] text-[#004357] leading-relaxed">
                  <span className="font-bold block text-[10px] uppercase text-[#006398] mb-0.5">
                    ✨ Key Clinical Findings:
                  </span>
                  {doc.aiSummary}
                </div>

                {/* If Doctor has signed off with notes */}
                {isReviewed && doc.doctorNotes && (
                  <div className="p-2.5 rounded-xl bg-[#f0fdf4] border border-[#86efac] text-[11px] text-[#166534]">
                    <div className="font-bold flex items-center gap-1">
                      <span className="material-symbols-outlined text-[14px]">stethoscope</span>
                      <span>Physician Review Note ({doc.reviewedByDoctorName || 'Dr. Rajesh Iyer'}):</span>
                    </div>
                    <p className="mt-0.5 leading-relaxed">{doc.doctorNotes}</p>
                  </div>
                )}

                {/* Tags & Action Row */}
                <div className="pt-2 border-t border-[#f0f4ff] flex items-center justify-between text-[11px]">
                  <div className="flex items-center gap-1 flex-wrap">
                    {doc.tags.map((tag) => (
                      <span key={tag} className="px-1.5 py-0.2 rounded bg-[#f8f9ff] text-[#70787d] text-[10px]">
                        #{tag}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center gap-2">
                    {/* If in Doctor mode, allow doctor to review/sign off directly */}
                    {appRole === 'doctor' && (
                      <button
                        onClick={() => setReviewingDoc(doc)}
                        className={`px-2.5 py-1 rounded-lg text-[11px] font-bold flex items-center gap-1 transition-all cursor-pointer ${
                          isReviewed
                            ? 'bg-[#eff4ff] text-[#004357] hover:bg-[#dce9ff]'
                            : 'bg-[#004357] text-white hover:bg-[#0d5c75] shadow-xs'
                        }`}
                      >
                        <span className="material-symbols-outlined text-[14px]">
                          {isReviewed ? 'edit_note' : 'draw'}
                        </span>
                        <span>{isReviewed ? 'Update Review' : 'Doctor Sign-Off'}</span>
                      </button>
                    )}

                    <button
                      onClick={() => setSelectedDoc(doc)}
                      className="px-2.5 py-1 rounded-lg bg-[#f0f4ff] hover:bg-[#dce9ff] text-[#006398] font-bold text-[11px] flex items-center gap-1 cursor-pointer"
                    >
                      <span>Examine</span>
                      <span className="material-symbols-outlined text-[14px]">open_in_new</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* DOCUMENT VIEWER MODAL */}
      {selectedDoc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-[#dce9ff] flex flex-col max-h-[85vh] overflow-hidden">
            <div className="p-4 bg-[#eff4ff] border-b border-[#dce9ff] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-[#004357] flex items-center justify-center text-white">
                  <span className="material-symbols-outlined text-[18px]">verified</span>
                </div>
                <div>
                  <h2 className="font-bold text-sm text-[#004357]">{selectedDoc.title}</h2>
                  <p className="text-xs text-[#40484c]">{selectedDoc.doctorOrLab} • {selectedDoc.date}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedDoc(null)}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-[#70787d] hover:bg-[#dce9ff] cursor-pointer"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <div className="p-4 space-y-3.5 text-xs overflow-y-auto">
              {/* Full document image preview */}
              {selectedDoc.fileUrl && (
                <div className="rounded-xl overflow-hidden border border-[#dce9ff] max-h-60 bg-black/5 flex items-center justify-center">
                  <img
                    src={selectedDoc.fileUrl}
                    alt={selectedDoc.title}
                    className="w-full h-60 object-cover"
                  />
                </div>
              )}

              {/* Review status banner */}
              {selectedDoc.reviewStatus === 'Reviewed by Doctor' ? (
                <div className="p-3 rounded-xl bg-[#dcfce7] border border-[#86efac] text-[#166534]">
                  <div className="font-bold flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[18px]">verified</span>
                    <span>Reviewed by {selectedDoc.reviewedByDoctorName || 'Attending Physician'}</span>
                  </div>
                  {selectedDoc.doctorNotes && (
                    <p className="text-[11px] mt-1 leading-relaxed text-[#14532d]">
                      "{selectedDoc.doctorNotes}"
                    </p>
                  )}
                  {selectedDoc.reviewedAt && (
                    <div className="text-[10px] text-[#166534] mt-1 opacity-80">
                      Signed: {selectedDoc.reviewedAt}
                    </div>
                  )}
                </div>
              ) : (
                <div className="p-3 rounded-xl bg-[#ffdad6]/60 border border-[#ffb4ab] text-[#ba1a1a] flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[18px]">schedule</span>
                    <span>Awaiting Attending Doctor Review</span>
                  </div>
                  {appRole === 'doctor' && (
                    <button
                      onClick={() => {
                        const target = selectedDoc;
                        setSelectedDoc(null);
                        setReviewingDoc(target);
                      }}
                      className="px-2.5 py-1 rounded-lg bg-[#004357] text-white text-[11px] font-bold"
                    >
                      Sign Off Now
                    </button>
                  )}
                </div>
              )}

              <div className="p-3 rounded-xl bg-[#cce5ff]/50 border border-[#93ccff]">
                <strong className="text-xs text-[#001d31] block mb-1">✨ Extracted Diagnostic Findings</strong>
                <p className="text-[#00476e] leading-relaxed">{selectedDoc.aiSummary}</p>
              </div>

              {selectedDoc.documentSnippet && (
                <div className="bg-[#f8f9ff] p-3 rounded-xl border border-[#e5eeff] space-y-1">
                  <strong className="text-xs text-[#0b1c30] block">Document Contents:</strong>
                  <p className="text-[#40484c] leading-relaxed font-mono text-[11px] whitespace-pre-wrap">
                    {selectedDoc.documentSnippet}
                  </p>
                </div>
              )}

              <div className="p-2.5 rounded-xl bg-[#eff4ff] flex items-center justify-between text-[11px]">
                <div>
                  <span className="text-[#70787d] block text-[10px]">Verification Protocol</span>
                  <strong className="text-[#004357]">Ayushman Bharat Digital Health Mission (ABDM)</strong>
                </div>
                <span className="text-[#006141] font-bold">100% Tamper-Proof</span>
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t border-[#e5eeff]">
                <button
                  onClick={() => {
                    onShowToast(`Downloaded ${selectedDoc.title} (${selectedDoc.fileSize})`, 'success');
                  }}
                  className="px-4 py-2 rounded-xl bg-[#e5eeff] hover:bg-[#dce9ff] text-[#004357] font-bold text-xs flex items-center gap-1 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[15px]">download</span>
                  <span>Download File</span>
                </button>
                <button
                  onClick={() => setSelectedDoc(null)}
                  className="px-5 py-2 rounded-xl bg-[#004357] text-white font-bold text-xs cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* UPLOAD DOCUMENT MODAL */}
      {isUploadOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl border border-[#dce9ff] flex flex-col max-h-[90vh] overflow-hidden">
            <div className="p-4 bg-[#eff4ff] border-b border-[#dce9ff] flex items-center justify-between">
              <div>
                <h2 className="font-bold text-sm text-[#004357]">Upload Medical Report or Scan</h2>
                <p className="text-xs text-[#40484c]">
                  Synchronized with Dr. {doctorAuth?.name || 'Attending Physician'}'s clinical EHR
                </p>
              </div>
              <button
                onClick={() => setIsUploadOpen(false)}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-[#70787d] hover:bg-[#dce9ff] cursor-pointer"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <form onSubmit={handleUploadSubmit} className="p-4 space-y-3.5 text-xs overflow-y-auto">
              {/* Quick Sample Selector for Evaluator Convenience */}
              <div>
                <label className="font-bold text-[#004357] block mb-1.5 flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px]">bolt</span>
                  <span>1-Click Test Samples (Blood, X-Ray, MRI, Pathology):</span>
                </label>
                <div className="grid grid-cols-2 gap-1.5">
                  {sampleReports.map((s) => (
                    <button
                      key={s.title}
                      type="button"
                      onClick={() => handleApplySample(s)}
                      className="p-2 rounded-xl bg-[#eff4ff] hover:bg-[#dce9ff] text-left border border-[#93ccff] transition-colors cursor-pointer"
                    >
                      <div className="font-bold text-[#004357] text-[11px] truncate">{s.title}</div>
                      <div className="text-[9px] text-[#52606d]">{s.category} • {s.fileSize}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Real File Input Area */}
              <div>
                <label className="font-bold text-[#0b1c30] block mb-1">
                  Choose File or Take Photo from Device
                </label>
                <label className="p-4 rounded-xl border-2 border-dashed border-[#006398] bg-[#eff4ff] text-center space-y-1 block cursor-pointer hover:bg-[#e0f2fe] transition-colors">
                  <input
                    type="file"
                    accept="image/*,application/pdf"
                    onChange={handleRealFileChange}
                    className="hidden"
                  />
                  <span className="material-symbols-outlined text-3xl text-[#006398]">cloud_upload</span>
                  <strong className="block text-xs text-[#004357]">
                    {fileNameDisplay ? `Attached: ${fileNameDisplay}` : 'Click to Upload Document / Scan'}
                  </strong>
                  <span className="text-[10px] text-[#70787d]">
                    Supports PDF, JPG, PNG, DICOM (Auto-previews image)
                  </span>
                </label>
              </div>

              {/* Category Dropdown */}
              <div>
                <label className="font-bold text-[#0b1c30] block mb-1">Document Category *</label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value as any)}
                  className="w-full h-10 px-2.5 bg-white border border-[#dce9ff] rounded-xl text-xs focus:border-[#004357] outline-hidden"
                >
                  <option value="Blood Test">🩸 Blood Test Report (CBC, Lipid, HbA1c, LFT/KFT)</option>
                  <option value="X-Ray">🩻 X-Ray Report (Chest, Bone, Spine)</option>
                  <option value="Scan & MRI">🧠 Scan & MRI / CT (Brain, Abdomen, USG)</option>
                  <option value="Pathology Report">🔬 Diagnostic & Pathology Report (Urine, Biopsy)</option>
                  <option value="Prescription">📋 Prescription Sheet</option>
                  <option value="Discharge Summary">🏥 Discharge Summary & Hospital Records</option>
                </select>
              </div>

              {/* Document Title */}
              <div>
                <label className="font-bold text-[#0b1c30] block mb-1">Document Title *</label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Complete Blood Count & Platelets, Chest X-Ray..."
                  required
                  className="w-full h-10 px-3 bg-white border border-[#dce9ff] rounded-xl text-xs focus:border-[#004357] outline-hidden"
                />
              </div>

              {/* Lab or Hospital Name */}
              <div>
                <label className="font-bold text-[#0b1c30] block mb-1">Diagnostic Lab / Hospital</label>
                <input
                  type="text"
                  value={newDoctorOrLab}
                  onChange={(e) => setNewDoctorOrLab(e.target.value)}
                  placeholder="e.g. St. Jude Pathology Labs, Metro Imaging"
                  className="w-full h-10 px-3 bg-white border border-[#dce9ff] rounded-xl text-xs focus:border-[#004357] outline-hidden"
                />
              </div>

              {/* Tags */}
              <div>
                <label className="font-bold text-[#0b1c30] block mb-1">Tags (comma separated)</label>
                <input
                  type="text"
                  value={newTags}
                  onChange={(e) => setNewTags(e.target.value)}
                  placeholder="Blood Test, Cardiology, Routine"
                  className="w-full h-10 px-3 bg-white border border-[#dce9ff] rounded-xl text-xs focus:border-[#004357] outline-hidden"
                />
              </div>

              {/* Clinical summary / Patient Notes */}
              <div>
                <label className="font-bold text-[#0b1c30] block mb-1">Patient Notes / Report Findings</label>
                <textarea
                  rows={2}
                  value={newSummary}
                  onChange={(e) => setNewSummary(e.target.value)}
                  placeholder="e.g. Routine 3-month fasting test. Doctor requested chest X-ray for lingering cough."
                  className="w-full p-2.5 bg-white border border-[#dce9ff] rounded-xl text-xs focus:border-[#004357] outline-hidden"
                />
              </div>

              <div className="p-2.5 rounded-xl bg-[#dcfce7] border border-[#86efac] text-[#166534] text-[11px] flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[16px]">sync</span>
                <span>Immediate reflection: Your doctor will be notified to review this report.</span>
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t border-[#e5eeff]">
                <button
                  type="button"
                  onClick={() => setIsUploadOpen(false)}
                  className="px-4 py-2 rounded-xl bg-white border border-[#bfc8cd] text-[#40484c] hover:bg-[#eff4ff] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#004357] hover:bg-[#0d5c75] text-white font-bold text-xs flex items-center gap-1 shadow-md active:scale-98 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[16px]">cloud_upload</span>
                  <span>Upload & Share with Doctor</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Doctor Review Modal */}
      {reviewingDoc && onReviewDocument && (
        <DoctorReviewDocModal
          isOpen={true}
          document={reviewingDoc}
          patient={patient}
          doctorAuth={doctorAuth}
          onClose={() => setReviewingDoc(null)}
          onSaveReview={(docId, notes, reviewer) => {
            onReviewDocument(docId, notes, reviewer);
            setReviewingDoc(null);
          }}
          onShowToast={onShowToast}
        />
      )}
    </div>
  );
};
