"use client";

import AddServiceModal from "@/app/(authenticated)/workspaces/services/AddServiceModal";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { ServiceInfo, ServiceModel, WorkspaceModel } from "@/lib/sesameApi";
import { PenBoxIcon, PlusIcon, Trash2Icon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import DeleteServiceModal from "./DeleteServiceModal";
import EditServiceModal from "./EditServiceModal";

interface Props {
  availableServices: ServiceInfo[];
  services: ServiceModel[];
  workspaces: WorkspaceModel[];
}

const serviceTypeLabels: Record<ServiceModel["service_type"], string> = {
  llm: "LLM",
  stt: "STT",
  tts: "TTS",
  transport: "Transport",
};

export default function ServiceConfig({
  availableServices,
  services,
  workspaces,
}: Props) {
  const { refresh } = useRouter();
  const [addService, setAddService] = useState(false);
  const [editServiceId, setEditServiceId] = useState("");
  const [deleteServiceId, setDeleteServiceId] = useState("");

  const editService = services.find((s) => s.service_id === editServiceId);
  const deleteService = services.find((s) => s.service_id === deleteServiceId);

  const { toast } = useToast();

  return (
    <>
      <div className="flex justify-end">
        <Button className="gap-1" onClick={() => setAddService(true)}>
          <PlusIcon size={16} />
          Add Service
        </Button>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Provider</TableHead>
            <TableHead>Type</TableHead>
            <TableHead className="max-w-40">Workspace</TableHead>
            <TableHead>
              <span className="sr-only">Actions</span>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {services.map((s) => (
            <TableRow key={s.service_id}>
              <TableCell>{s.title}</TableCell>
              <TableCell>
                <span className="capitalize">{s.service_provider}</span>
              </TableCell>
              <TableCell>
                {serviceTypeLabels[s.service_type] ?? (
                  <span className="capitalize">{s.service_type}</span>
                )}
              </TableCell>
              <TableCell>
                <span className="block overflow-hidden truncate">
                  {s.workspace_id
                    ? (workspaces.find(
                        (ws) => ws.workspace_id === s.workspace_id,
                      )?.title ?? "Unknown")
                    : "All"}
                </span>
              </TableCell>
              <TableCell>
                <div className="flex gap-1 items-center">
                  <Button
                    size="icon"
                    variant="secondary"
                    onClick={() => setEditServiceId(s.service_id)}
                  >
                    <span className="sr-only">Edit</span>
                    <PenBoxIcon size={16} />
                  </Button>
                  <Button
                    size="icon"
                    variant="destructive"
                    onClick={() => setDeleteServiceId(s.service_id)}
                  >
                    <span className="sr-only">Delete</span>
                    <Trash2Icon size={16} />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {addService && (
        <AddServiceModal
          onClose={() => setAddService(false)}
          onSaved={() => {
            refresh();
            setAddService(false);
            toast({
              title: "Service added",
            });
          }}
          services={availableServices}
          workspaces={workspaces}
        />
      )}
      {editService && (
        <EditServiceModal
          onClose={() => setEditServiceId("")}
          onSaved={() => {
            refresh();
            setEditServiceId("");
            toast({
              title: "Service saved",
            });
          }}
          service={editService}
          workspaces={workspaces}
        />
      )}
      {deleteService && (
        <DeleteServiceModal
          onClose={() => setDeleteServiceId("")}
          onDeleted={() => {
            refresh();
            setDeleteServiceId("");
            toast({
              title: "Service deleted",
            });
          }}
          service={deleteService}
        />
      )}
    </>
  );
}
