"use client";

import React, { useState } from "react";
import { Shipment, Port, DisruptionEvent } from "@/lib/types";
import { ShipmentRiskTable } from "@/components/ShipmentRiskTable";
import { AddShipmentModal } from "@/components/AddShipmentModal";
import { CSVImportModal } from "@/components/CSVImportModal";
import { ShipmentDetailModal } from "@/components/ShipmentDetailModal";
import { api } from "@/lib/api";

interface ShipmentsViewProps {
  shipments: Shipment[];
  ports: Port[];
  disruptions: DisruptionEvent[];
  onRefresh: () => Promise<void>;
}

export const ShipmentsView: React.FC<ShipmentsViewProps> = ({
  shipments,
  ports,
  disruptions,
  onRefresh
}) => {
  const [selectedShipment, setSelectedShipment] = useState<Shipment | null>(null);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isImportOpen, setIsImportOpen] = useState(false);

  const handleCreateShipment = async (data: Partial<Shipment>) => {
    await api.createShipment(data);
    await onRefresh();
  };

  const handleExportCSV = () => {
    window.open("http://127.0.0.1:8000/api/shipments/export-csv", "_blank");
  };

  return (
    <div className="space-y-6">
      <ShipmentRiskTable
        shipments={shipments}
        onSelectShipment={(s) => setSelectedShipment(s)}
        onOpenAddModal={() => setIsAddOpen(true)}
        onOpenImportModal={() => setIsImportOpen(true)}
        onExportCSV={handleExportCSV}
      />

      {/* Add Modal */}
      <AddShipmentModal
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        ports={ports}
        onSubmit={handleCreateShipment}
      />

      {/* Import Modal */}
      <CSVImportModal
        isOpen={isImportOpen}
        onClose={() => setIsImportOpen(false)}
        onSuccess={onRefresh}
      />

      {/* Details Modal */}
      <ShipmentDetailModal
        shipment={selectedShipment}
        onClose={() => setSelectedShipment(null)}
        disruptions={disruptions}
      />
    </div>
  );
};
