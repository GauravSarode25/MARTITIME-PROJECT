"use client";

import React, { useState } from "react";
import { ShieldCheck, AlertOctagon, XCircle, CheckCircle, FileText, Lock, UserCheck } from "lucide-react";
import { SlickIncident, VesselCandidate } from "../data/mockMaritimeData";

interface ModalConfirmationProps {
  isOpen: boolean;
  onClose: () => void;
  actionType: "CONFIRM" | "REJECT" | "REASSIGN";
  incident: SlickIncident;
  candidate: VesselCandidate | null;
  onConfirmSuccess: (action: string, notes: string) => void;
}

export const ModalConfirmation: React.FC<ModalConfirmationProps> = ({
  isOpen,
  onClose,
  actionType,
  incident,
  candidate,
  onConfirmSuccess
}) => {
  const [analystNotes, setAnalystNotes] = useState<string>("");
  const [analystSignature, setAnalystSignature] = useState<string>("CDR. E. VANCE (MARITIME INTEL DIVISION)");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submitted, setSubmitted] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
      setTimeout(() => {
        onConfirmSuccess(actionType, analystNotes);
        setSubmitted(false);
        onClose();
      }, 1500);
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-[600] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
      <div className="navy-panel w-full max-w-xl rounded-lg overflow-hidden border border-[#e2e8f0] shadow-xl bg-white animate-in fade-in zoom-in duration-200">
        {/* Header Bar */}
        <div className={`p-4 border-b border-[#e2e8f0] flex items-center justify-between ${
          actionType === "CONFIRM" ? "bg-gradient-to-r from-red-50 to-white" : "bg-gradient-to-r from-slate-50 to-white"
        }`}>
          <div className="flex items-center gap-3">
            {actionType === "CONFIRM" ? (
              <AlertOctagon className="w-6 h-6 text-red-700 animate-pulse" />
            ) : actionType === "REJECT" ? (
              <XCircle className="w-6 h-6 text-amber-700" />
            ) : (
              <UserCheck className="w-6 h-6 text-sky-700" />
            )}
            <div>
              <h3 className="font-sans font-semibold text-[#1a1f2e] text-[15px] uppercase">
                {actionType === "CONFIRM" && "OFFICIAL MARPOL ANNEX I ALERT CONFIRMATION"}
                {actionType === "REJECT" && "REJECT SLICK ATTRIBUTION (FALSE POSITIVE)"}
                {actionType === "REASSIGN" && "REASSIGN INCIDENT TARGET CANDIDATE"}
              </h3>
              <p className="text-[12px] font-sans text-slate-500">
                INCIDENT ID: <span className="font-mono">{incident.id}</span>
              </p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-500 hover:text-[#1a1f2e] font-sans text-lg px-2">✕</button>
        </div>

        {/* Modal Body */}
        {submitted ? (
          <div className="p-8 text-center space-y-3 font-sans">
            <CheckCircle className="w-12 h-12 text-emerald-600 mx-auto animate-bounce" />
            <div className="font-sans font-semibold text-[#1a1f2e] text-[18px]">DECISION TRANSMITTED TO PORT STATE CONTROL</div>
            <div className="text-[13px] text-slate-600">
              Encrypted digest logged to National Maritime Intelligence Audit Ledger.
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-5 space-y-4 font-sans text-[13px]">
            {/* Target Summary Badge */}
            <div className="bg-[#f8fafc] p-3 rounded border border-[#e2e8f0] space-y-1">
              <div className="text-[11px] text-slate-500 font-medium">Implicated Target Vessel</div>
              {candidate ? (
                <div className="flex items-center justify-between font-sans text-[#1a1f2e]">
                  <span className="font-semibold text-[15px] text-[#1a1f2e]">{candidate.name}</span>
                  <span className="text-red-700 font-mono font-bold text-[13px]">{candidate.riskScore}% ATTRIBUTION SCORE</span>
                </div>
              ) : (
                <div className="text-slate-500 italic">No specific vessel assigned</div>
              )}
              <div className="text-[12px] text-slate-600 font-sans">
                Slick Area: <span className="text-amber-700 font-mono font-bold">{incident.slickAreaKm2} km²</span> | Location: <span className="text-slate-800 font-mono">{incident.centerCoordinates[0]}°N, {incident.centerCoordinates[1]}°E</span>
              </div>
            </div>

            {/* Action Directives */}
            <div className="space-y-1 text-slate-700 text-[12px] bg-amber-50/50 p-3 rounded border border-amber-200">
              {actionType === "CONFIRM" && (
                <p>
                  ⚠️ <strong className="text-red-700 font-semibold">LEGAL ACTION WARNING:</strong> Confirming this attribution will dispatch an emergency MARPOL Annex I violation alert to Coast Guard Command and flag MMSI <strong className="text-[#b45309] font-mono">{candidate?.mmsi}</strong> for mandatory Port State Inspection at next port call.
                </p>
              )}
              {actionType === "REJECT" && (
                <p>
                  Rejecting this incident will flag the SAR anomaly as a natural oil seep, biogenic bloom, or wind-wave attenuation false positive.
                </p>
              )}
            </div>

            {/* Senior Analyst Notes */}
            <div className="space-y-1">
              <label className="text-slate-700 font-semibold text-[13px] flex items-center justify-between">
                <span>ANALYST EVALUATION REASONING & EVIDENCE NOTES:</span>
                <span className="text-[11px] text-slate-500 font-normal">Required</span>
              </label>
              <textarea
                required
                rows={3}
                value={analystNotes}
                onChange={(e) => setAnalystNotes(e.target.value)}
                placeholder="Enter expert analysis reasoning, Lagrangian drift cross-verification details, or AIS gap correlation rationale..."
                className="w-full bg-[#f8fafc] border border-[#e2e8f0] rounded p-2 text-[#1a1f2e] text-[13px] font-sans focus:outline-none focus:border-amber-600 shadow-sm"
              />
            </div>

            {/* Digital Signature */}
            <div className="space-y-1">
              <label className="text-slate-700 font-semibold text-[13px] flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-[#b45309]" />
                <span>DIGITAL ANALYST SIGNATURE & CREDENTIALS:</span>
              </label>
              <input
                type="text"
                required
                value={analystSignature}
                onChange={(e) => setAnalystSignature(e.target.value)}
                className="w-full bg-[#f8fafc] border border-[#e2e8f0] rounded p-2 text-[#1a1f2e] font-sans text-[13px] focus:outline-none shadow-sm"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-3 pt-2 border-t border-slate-200">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded bg-white border border-slate-300 text-slate-700 hover:bg-slate-100 font-semibold text-[13px]"
              >
                CANCEL
              </button>

              <button
                type="submit"
                disabled={isSubmitting}
                className={`px-5 py-2 rounded font-sans font-semibold text-[13px] shadow-sm flex items-center gap-2 ${
                  actionType === "CONFIRM"
                    ? "bg-gradient-to-r from-red-600 to-red-700 text-white border border-red-500 hover:brightness-110"
                    : "bg-gradient-to-r from-amber-600 to-amber-700 text-white hover:brightness-110"
                }`}
              >
                {isSubmitting ? (
                  <>
                    <span className="animate-spin text-sm">⏳</span> TRANSMITTING...
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4" />
                    {actionType === "CONFIRM" && "SIGN & ISSUE MARPOL ALERT"}
                    {actionType === "REJECT" && "CONFIRM REJECTION"}
                    {actionType === "REASSIGN" && "CONFIRM REASSIGNMENT"}
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
