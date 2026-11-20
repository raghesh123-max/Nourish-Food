import React, { useMemo, useState } from 'react';
import {
  FileCheck2,
  Search,
  FlaskConical,
  CalendarCheck2,
  X,
  CheckCircle2,
  UserCheck,
} from 'lucide-react';
import {
  CLINICAL_DIETITIANS,
  LAB_ASSAY_RECORDS,
  LabAssayRecord,
} from '../data/clinicalData';
import { VerifiedBadge } from './ClinicalVisuals';

export const LabsScreen: React.FC = () => {
  const [batchSearch, setBatchSearch] = useState('');
  const [selectedAssay, setSelectedAssay] = useState<LabAssayRecord | null>(null);

  // Consultation booking state
  const [selectedDietitianId, setSelectedDietitianId] = useState(CLINICAL_DIETITIANS[0].id);
  const [selectedSlot, setSelectedSlot] = useState(CLINICAL_DIETITIANS[0].nextSlots[0]);
  const [patientName, setPatientName] = useState('');
  const [patientPhone, setPatientPhone] = useState('');
  const [labNote, setLabNote] = useState('');
  const [bookingConfirmed, setBookingConfirmed] = useState<{
    dietitianName: string;
    slot: string;
    patientName: string;
  } | null>(null);
  const [formError, setFormError] = useState('');

  const activeDietitian = useMemo(
    () =>
      CLINICAL_DIETITIANS.find((d) => d.id === selectedDietitianId) || CLINICAL_DIETITIANS[0],
    [selectedDietitianId]
  );

  const filteredAssays = useMemo(() => {
    const q = batchSearch.trim().toLowerCase();
    if (!q) return LAB_ASSAY_RECORDS;
    return LAB_ASSAY_RECORDS.filter(
      (r) =>
        r.batchCode.toLowerCase().includes(q) ||
        r.mealName.toLowerCase().includes(q) ||
        r.labName.toLowerCase().includes(q)
    );
  }, [batchSearch]);

  const handleBookConsultation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!patientName.trim() || patientPhone.trim().length < 8) {
      setFormError('Please enter your full name and a valid 10-digit mobile number.');
      return;
    }
    setFormError('');
    setBookingConfirmed({
      dietitianName: activeDietitian.name,
      slot: selectedSlot,
      patientName: patientName.trim(),
    });
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <section className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div className="space-y-1 max-w-2xl">
          <p className="text-xs font-semibold text-[#135D43]">
            Transparent Clinical Accountability
          </p>
          <h1 className="font-display text-2xl sm:text-[28px] font-bold text-[#0E3E2D] leading-tight">
            NABL Kitchen Assays &amp; Registered Dietitians
          </h1>
          <p className="text-sm text-[#4B5563]">
            Inspect third-party laboratory batch certificates for every meal on the menu or schedule
            a complimentary biomarker review with our Bengaluru and Mumbai dietitians.
          </p>
        </div>
        <VerifiedBadge status="verified" label="ISO/IEC 17025 AUDITED" />
      </section>

      {/* Kitchen Batch Assay Ledger */}
      <section className="bg-white rounded-2xl border border-[#E8E4DC] overflow-hidden">
        <div className="p-5 sm:p-6 border-b border-[#E8E4DC] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <FlaskConical className="w-5 h-5 text-[#135D43]" />
            <div>
              <h2 className="font-display text-lg font-semibold text-[#0E3E2D]">
                Active Batch Assay Ledger
              </h2>
              <p className="text-xs text-[#4B5563]">
                Select any batch row to inspect the signed laboratory analysis summary
              </p>
            </div>
          </div>

          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-[#9CA3AF] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="search"
              value={batchSearch}
              onChange={(e) => setBatchSearch(e.target.value)}
              placeholder="Search batch code or meal..."
              aria-label="Search batch assays"
              className="clinical-input w-full pl-10 pr-3 text-sm"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[700px]">
            <thead>
              <tr className="bg-[#FBF9F5] border-b border-[#E8E4DC] text-[11px] font-bold uppercase tracking-[0.03em] text-[#4B5563]">
                <th className="py-3.5 px-5">Batch Code</th>
                <th className="py-3.5 px-4">Formulation</th>
                <th className="py-3.5 px-4">Assay Lab</th>
                <th className="py-3.5 px-4">GI / Protein Dev.</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-5 text-right">Certificate</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E8E4DC] text-sm">
              {filteredAssays.map((record) => (
                <tr
                  key={record.id}
                  className="hover:bg-[#FBF9F5] transition-colors"
                >
                  <td className="py-4 px-5 font-display font-bold text-[#0E3E2D] tabular-nums whitespace-nowrap">
                    {record.batchCode}
                  </td>
                  <td className="py-4 px-4">
                    <p className="font-semibold text-[#1F2937]">{record.mealName}</p>
                    <p className="text-xs text-[#4B5563] mt-0.5">
                      Cold chain: {record.coldChainTemp} · {record.testedDate}
                    </p>
                  </td>
                  <td className="py-4 px-4 text-xs text-[#4B5563]">
                    <p className="font-medium text-[#1F2937]">{record.labName}</p>
                    <p className="mt-0.5 tabular-nums">{record.accreditationId}</p>
                  </td>
                  <td className="py-4 px-4 text-xs tabular-nums">
                    <p className="font-semibold text-[#1F2937]">GI {record.giAssay}</p>
                    <p className="text-[#135D43] font-medium mt-0.5">
                      {record.proteinVariancePct}
                    </p>
                  </td>
                  <td className="py-4 px-4">
                    <VerifiedBadge
                      status={record.status}
                      label={record.status === 'verified' ? 'NABL VERIFIED' : 'ESTIMATED'}
                      compact
                    />
                  </td>
                  <td className="py-4 px-5 text-right">
                    <button
                      type="button"
                      onClick={() => setSelectedAssay(record)}
                      className="min-h-[38px] px-3.5 rounded-lg border border-[#E8E4DC] bg-white hover:bg-[#EBF3F0] hover:border-[#135D43]/30 text-xs font-semibold text-[#0E3E2D] inline-flex items-center gap-1.5 transition-colors whitespace-nowrap cursor-pointer"
                    >
                      <FileCheck2 className="w-3.5 h-3.5 text-[#135D43]" />
                      Inspect
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Clinical Dietitian Team & Consultation Booking */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center gap-2">
            <UserCheck className="w-5 h-5 text-[#135D43]" />
            <h2 className="font-display text-lg font-semibold text-[#0E3E2D]">
              Certified Clinical Nutritionists
            </h2>
          </div>

          <div className="space-y-3">
            {CLINICAL_DIETITIANS.map((dt) => {
              const isSelected = dt.id === activeDietitian.id;
              return (
                <div
                  key={dt.id}
                  onClick={() => {
                    setSelectedDietitianId(dt.id);
                    setSelectedSlot(dt.nextSlots[0]);
                    setBookingConfirmed(null);
                  }}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      setSelectedDietitianId(dt.id);
                      setSelectedSlot(dt.nextSlots[0]);
                      setBookingConfirmed(null);
                    }
                  }}
                  className={`p-5 rounded-2xl border transition-colors cursor-pointer ${
                    isSelected
                      ? 'bg-[#EBF3F0]/55 border-[#135D43]'
                      : 'bg-white border-[#E8E4DC] hover:border-[#135D43]/40'
                  }`}
                >
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div>
                      <h3 className="font-display text-lg font-semibold text-[#0E3E2D]">
                        {dt.name}
                      </h3>
                      <p className="text-xs font-medium text-[#135D43] mt-0.5">{dt.credentials}</p>
                    </div>
                    <span className="text-xs font-bold text-[#0E3E2D] tabular-nums bg-[#F4F1EA] px-2.5 py-1 rounded-full">
                      {dt.consultationFeeInr === 0 ? 'Included in Plan' : `₹${dt.consultationFeeInr}`}
                    </span>
                  </div>
                  <p className="text-sm text-[#4B5563] mt-2">{dt.specialty}</p>
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-[#4B5563] mt-3 pt-3 border-t border-[#E8E4DC]/80">
                    <span>{dt.cityHub}</span>
                    <span aria-hidden="true">·</span>
                    <span className="tabular-nums">{dt.experienceYears} yrs clinical practice</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Consultation Booking Card */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-[#E8E4DC] p-5 sm:p-6 space-y-5">
          <div className="flex items-center gap-2">
            <CalendarCheck2 className="w-5 h-5 text-[#135D43]" />
            <h2 className="font-display text-lg font-semibold text-[#0E3E2D]">
              Book 20-Min Lab Review
            </h2>
          </div>

          {bookingConfirmed ? (
            <div className="p-5 rounded-xl bg-[#EBF3F0] border border-[#135D43]/25 space-y-3">
              <div className="flex items-center gap-2 text-[#0E3E2D]">
                <CheckCircle2 className="w-5 h-5 text-[#135D43]" />
                <p className="font-display text-base font-bold">Consultation Confirmed</p>
              </div>
              <p className="text-sm text-[#1F2937] leading-relaxed">
                <strong>{bookingConfirmed.patientName}</strong>, your clinical review with{' '}
                <strong>{bookingConfirmed.dietitianName}</strong> is booked for{' '}
                <strong>{bookingConfirmed.slot}</strong>. Video link &amp; lab upload prompt sent via
                SMS.
              </p>
              <button
                type="button"
                onClick={() => {
                  setBookingConfirmed(null);
                  setPatientName('');
                  setPatientPhone('');
                  setLabNote('');
                }}
                className="min-h-[42px] px-4 rounded-xl bg-white border border-[#135D43]/25 text-xs font-semibold text-[#0E3E2D] hover:bg-[#F4F1EA] cursor-pointer"
              >
                Book Another Session
              </button>
            </div>
          ) : (
            <form onSubmit={handleBookConsultation} className="space-y-4">
              <div className="p-3 rounded-xl bg-[#FBF9F5] border border-[#E8E4DC] text-xs text-[#4B5563]">
                Selected specialist:{' '}
                <strong className="text-[#0E3E2D]">{activeDietitian.name}</strong>
              </div>

              <div className="space-y-2">
                <span className="block text-xs font-semibold text-[#1F2937]">
                  Available Time Slots
                </span>
                <div className="flex flex-wrap gap-2">
                  {activeDietitian.nextSlots.map((slot) => (
                    <button
                      key={slot}
                      type="button"
                      onClick={() => setSelectedSlot(slot)}
                      className={`min-h-[40px] px-3 py-1.5 rounded-full text-xs font-semibold transition-colors cursor-pointer ${
                        selectedSlot === slot
                          ? 'bg-[#135D43] text-white'
                          : 'bg-[#F4F1EA] text-[#4B5563] hover:bg-[#E8E4DC]'
                      }`}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-1.5">
                <label htmlFor="patient-name" className="block text-xs font-semibold text-[#1F2937]">
                  Full Name
                </label>
                <input
                  id="patient-name"
                  type="text"
                  value={patientName}
                  onChange={(e) => setPatientName(e.target.value)}
                  placeholder="e.g., Ananya Krishnan"
                  className="clinical-input w-full px-3.5 text-sm text-[#1F2937] placeholder:text-[#9CA3AF]"
                />
              </div>

              <div className="space-y-1.5">
                <label
                  htmlFor="patient-phone"
                  className="block text-xs font-semibold text-[#1F2937]"
                >
                  Mobile Number (+91)
                </label>
                <input
                  id="patient-phone"
                  type="tel"
                  value={patientPhone}
                  onChange={(e) => setPatientPhone(e.target.value)}
                  placeholder="98450 12345"
                  className="clinical-input w-full px-3.5 text-sm text-[#1F2937] placeholder:text-[#9CA3AF] tabular-nums"
                />
              </div>

              <div className="space-y-1.5">
                <label htmlFor="lab-note" className="block text-xs font-semibold text-[#1F2937]">
                  Recent Biomarkers (Optional)
                </label>
                <input
                  id="lab-note"
                  type="text"
                  value={labNote}
                  onChange={(e) => setLabNote(e.target.value)}
                  placeholder="e.g., HbA1c 6.1%, LDL 118, Vitamin D 24"
                  className="clinical-input w-full px-3.5 text-sm text-[#1F2937] placeholder:text-[#9CA3AF]"
                />
              </div>

              {formError && <p className="text-xs font-semibold text-[#BA1A1A]">{formError}</p>}

              <button
                type="submit"
                className="w-full min-h-[52px] rounded-xl bg-[#D95D39] hover:bg-[#C24E2D] active:scale-[0.98] text-white text-sm font-semibold transition-all cursor-pointer"
              >
                Confirm Consultation · {selectedSlot}
              </button>
            </form>
          )}
        </div>
      </section>

      {/* Batch Certificate Modal */}
      {selectedAssay && (
        <div
          className="fixed inset-0 z-50 bg-[#0E3E2D]/35 backdrop-blur-[2px] flex items-end sm:items-center justify-center p-0 sm:p-4"
          role="dialog"
          aria-modal="true"
          aria-label={`Certificate of Analysis for ${selectedAssay.batchCode}`}
        >
          <div className="bg-white w-full sm:max-w-lg rounded-t-3xl sm:rounded-2xl border border-[#E8E4DC] shadow-clinical-float p-6 space-y-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <VerifiedBadge
                  status={selectedAssay.status}
                  label={`${selectedAssay.batchCode} · ${selectedAssay.accreditationId}`}
                  compact
                />
                <h3 className="font-display text-xl font-bold text-[#0E3E2D] mt-2">
                  {selectedAssay.mealName}
                </h3>
                <p className="text-xs text-[#4B5563] mt-0.5">{selectedAssay.labName}</p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedAssay(null)}
                aria-label="Close certificate"
                className="w-10 h-10 rounded-xl bg-[#F4F1EA] hover:bg-[#E8E4DC] flex items-center justify-center text-[#1F2937] cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-sm leading-relaxed text-[#4B5563] bg-[#FBF9F5] p-4 rounded-xl border border-[#E8E4DC]">
              {selectedAssay.summary}
            </p>

            <div className="grid grid-cols-2 gap-3 text-xs tabular-nums">
              <div className="p-3 rounded-xl border border-[#E8E4DC]">
                <span className="text-[#4B5563]">Glycemic Index Assay</span>
                <p className="font-display text-base font-bold text-[#0E3E2D] mt-0.5">
                  GI {selectedAssay.giAssay}
                </p>
              </div>
              <div className="p-3 rounded-xl border border-[#E8E4DC]">
                <span className="text-[#4B5563]">Protein Variance</span>
                <p className="font-display text-base font-bold text-[#135D43] mt-0.5">
                  {selectedAssay.proteinVariancePct}
                </p>
              </div>
              <div className="p-3 rounded-xl border border-[#E8E4DC]">
                <span className="text-[#4B5563]">Heavy Metals Screen</span>
                <p className="font-semibold text-[#1F2937] mt-0.5">{selectedAssay.heavyMetals}</p>
              </div>
              <div className="p-3 rounded-xl border border-[#E8E4DC]">
                <span className="text-[#4B5563]">Pesticide Residue</span>
                <p className="font-semibold text-[#1F2937] mt-0.5">
                  {selectedAssay.pesticideResidue}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setSelectedAssay(null)}
              className="w-full min-h-[48px] rounded-xl bg-[#135D43] hover:bg-[#0E3E2D] text-white text-sm font-semibold cursor-pointer"
            >
              Close Certificate
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
