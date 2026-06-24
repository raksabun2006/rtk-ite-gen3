"use client";
import { useState } from "react";
import { columns } from "@/components/tables/Columns";
import { DataTable } from "@/components/tables/TableComponent";
import { ViewProductDetail } from "@/components/ui/view-detail-product";
import { useGetAllProductQuery } from "@/services/ecommerce";

export default function DataTablePage() {
  const { data } = useGetAllProductQuery({
    page: 0,
    size: 10000,
  });
  const tableData = Array.isArray(data?.content) ? data?.content : [];

  const [selectedUuid, setSelectedUuid] = useState<string | null>(null);

  const handleViewDetail = (uuid: string) => {
    setSelectedUuid(uuid);
  };

  const handleClose = () => {
    setSelectedUuid(null);
  };

  return (
    <div className="container mx-auto py-10">
      <DataTable
        columns={columns({ onViewDetail: handleViewDetail })}
        data={tableData}
      />

      {/* Modal */}
      {selectedUuid && (
        <ViewProductDetail
          uuid={selectedUuid}
          open={true}
          onOpenChange={(open) => {
            if (!open) handleClose();
          }}
        />
      )}
    </div>
  );
}
