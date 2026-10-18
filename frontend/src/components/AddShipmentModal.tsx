"use client";

import React, { useState } from "react";
import { Shipment, Port } from "@/lib/types";
import { X, Plus, Ship, Check, AlertCircle } from "lucide-react";
import { api } from "@/lib/api";

interface AddShipmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  ports?: Port[];
  onSubmit?: (data: Partial<Shipment>) => Promise<void>;
  onShipmentAdded?: () => Promise<void>;
}

export const AddShipmentModal: React.FC<AddShipmentModalProps> = ({
  isOpen,
  onClose,
  ports = [],
  onSubmit,
  onShipmentAdded,
}) => {
  const [trackingRef, setTrackingRef] = useState("");
  const [origin, setOrigin] = useState("CNSHA");
  const [destination, setDestination] = useState("USLAX");
  const [carrier, setCarrier] = useState("Maersk Line");
  const [vessel, setVessel] = useState("");
  const [containerId, setContainerId] = useState("");
  const [departureDate, setDepartureDate] = useState("2026-10-18");
  const [expectedArrival, setExpectedArrival] = useState("2026-11-02");
  const [deliveryDeadline, setDeliveryDeadline] = useState("2026-11-05");
  const [valueUsd, setValueUsd] = useState<number>(450000);
  const [cargoDescription, setCargoDescription] = useState("Industrial Automotive Components");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);
    try {
      const payload: Partial<Shipment> = {
        tracking_ref: trackingRef || `TRK-${Date.now().toString().slice(-6)}`,
        origin,
        destination,
        carrier,
        vessel: vessel || "Simulated Vessel",
        container_id: containerId || `MSKU-${Math.floor(100000 + Math.random() * 900000)}-1`,
        departure_date: departureDate,
        expected_arrival: expectedArrival,
        delivery_deadline: deliveryDeadline,
        value_usd: Number(valueUsd) || 100000,
        cargo_description: cargoDescription,
        status: "IN_TRANSIT"
      };

      if (onSubmit) {
        await onSubmit(payload);
      } else {
        await api.createShipment(payload);
      }
      if (onShipmentAdded) {
        await onShipmentAdded();
      }
      onClose();
    } catch (err: any) {
      setError(err.message || "Failed to create shipment");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#111722] border border-[#242D3D] rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-[#242D3D] flex items-center justify-between bg-[#0C1019]">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-[#4F8CFF]/20 text-[#4F8CFF] border border-[#4F8CFF]/30">
              <Ship className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-[#F1F5F9]">Add Monitored Shipment</h2>
              <p className="text-xs text-[#8D9AAF]">Register new consignment for automated risk scoring</p>
            </div>
          </div>
          <button onClick={onClose} className="text-[#8D9AAF] hover:text-[#F1F5F9]">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 rounded-lg bg-[#FF5252]/15 border border-[#FF5252]/30 text-xs text-[#FF5252] flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-[#8D9AAF] mb-1">Origin Port</label>
              <select
                value={origin}
                onChange={(e) => setOrigin(e.target.value)}
                className="w-full bg-[#0C1019] border border-[#242D3D] rounded-lg px-3 py-2 text-xs text-[#F1F5F9] focus:outline-none focus:border-[#4F8CFF]"
              >
                {ports.map(p => (
                  <option key={p.code} value={p.code}>{p.name} ({p.code})</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-[#8D9AAF] mb-1">Destination Port</label>
              <select
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                className="w-full bg-[#0C1019] border border-[#242D3D] rounded-lg px-3 py-2 text-xs text-[#F1F5F9] focus:outline-none focus:border-[#4F8CFF]"
              >
                {ports.map(p => (
                  <option key={p.code} value={p.code}>{p.name} ({p.code})</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-[#8D9AAF] mb-1">Ocean Carrier</label>
              <select
                value={carrier}
                onChange={(e) => setCarrier(e.target.value)}
                className="w-full bg-[#0C1019] border border-[#242D3D] rounded-lg px-3 py-2 text-xs text-[#F1F5F9] focus:outline-none focus:border-[#4F8CFF]"
              >
                <option value="Maersk Line">Maersk Line</option>
                <option value="MSC Mediterranean Shipping">MSC Mediterranean Shipping</option>
                <option value="COSCO Shipping">COSCO Shipping</option>
                <option value="Hapag-Lloyd">Hapag-Lloyd</option>
                <option value="CMA CGM">CMA CGM</option>
                <option value="Ocean Network Express (ONE)">Ocean Network Express (ONE)</option>
                <option value="Evergreen Line">Evergreen Line</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-[#8D9AAF] mb-1">Tracking Ref / B/L</label>
              <input
                type="text"
                placeholder="e.g. MSKU9810294"
                value={trackingRef}
                onChange={(e) => setTrackingRef(e.target.value)}
                className="w-full bg-[#0C1019] border border-[#242D3D] rounded-lg px-3 py-2 text-xs text-[#F1F5F9] focus:outline-none focus:border-[#4F8CFF]"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-[#8D9AAF] mb-1">Departure</label>
              <input
                type="date"
                value={departureDate}
                onChange={(e) => setDepartureDate(e.target.value)}
                className="w-full bg-[#0C1019] border border-[#242D3D] rounded-lg px-2 py-2 text-xs text-[#F1F5F9] focus:outline-none focus:border-[#4F8CFF]"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-[#8D9AAF] mb-1">Scheduled ETA</label>
              <input
                type="date"
                value={expectedArrival}
                onChange={(e) => setExpectedArrival(e.target.value)}
                className="w-full bg-[#0C1019] border border-[#242D3D] rounded-lg px-2 py-2 text-xs text-[#F1F5F9] focus:outline-none focus:border-[#4F8CFF]"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-[#8D9AAF] mb-1">SLA Deadline</label>
              <input
                type="date"
                value={deliveryDeadline}
                onChange={(e) => setDeliveryDeadline(e.target.value)}
                className="w-full bg-[#0C1019] border border-[#242D3D] rounded-lg px-2 py-2 text-xs text-[#F1F5F9] focus:outline-none focus:border-[#4F8CFF]"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-[#8D9AAF] mb-1">Cargo Description</label>
              <input
                type="text"
                value={cargoDescription}
                onChange={(e) => setCargoDescription(e.target.value)}
                className="w-full bg-[#0C1019] border border-[#242D3D] rounded-lg px-3 py-2 text-xs text-[#F1F5F9] focus:outline-none focus:border-[#4F8CFF]"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-[#8D9AAF] mb-1">Value (USD)</label>
              <input
                type="number"
                value={valueUsd}
                onChange={(e) => setValueUsd(Number(e.target.value))}
                className="w-full bg-[#0C1019] border border-[#242D3D] rounded-lg px-3 py-2 text-xs text-[#F1F5F9] focus:outline-none focus:border-[#4F8CFF]"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-4 border-t border-[#242D3D] flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-[#242D3D] hover:bg-[#2D394D] text-xs font-semibold text-[#F1F5F9] transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 rounded-lg bg-[#4F8CFF] hover:bg-[#3D78E6] text-white text-xs font-semibold shadow-sm transition disabled:opacity-60 flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{isSubmitting ? "Creating..." : "Register Shipment"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
