import { format } from "date-fns";

interface PatientInfoCardProps {
  patient: any;
}

export default function PatientInfoCard({ patient }: PatientInfoCardProps) {
  return (
    <div className="p-4 bg-neutral-50 border border-neutral-200 rounded-md">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <p className="text-sm text-neutral-500">Patient ID</p>
          <p className="text-md font-medium text-neutral-900">{patient.patientId || "N/A"}</p>
        </div>
        <div>
          <p className="text-sm text-neutral-500">Name</p>
          <p className="text-md font-medium text-neutral-900">{patient.name || "N/A"}</p>
        </div>
        <div>
          <p className="text-sm text-neutral-500">Age/Gender</p>
          <p className="text-md font-medium text-neutral-900">
            {patient.age || "N/A"} / {patient.gender ? (patient.gender.charAt(0).toUpperCase() + patient.gender.slice(1)) : "N/A"}
          </p>
        </div>
        <div>
          <p className="text-sm text-neutral-500">Phone</p>
          <p className="text-md font-medium text-neutral-900">{patient.phone || "N/A"}</p>
        </div>
        {patient.lastVisit && (
          <div>
            <p className="text-sm text-neutral-500">Last Visit</p>
            <p className="text-md font-medium text-neutral-900">
              {format(new Date(patient.lastVisit), "MMM d, yyyy")}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
