import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";

export default function SearchPatients() {
  const { toast } = useToast();
  const [_, navigate] = useLocation();
  const [searchTerm, setSearchTerm] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  const { data: patients, isLoading, refetch } = useQuery({
    queryKey: ['/api/patients', searchTerm],
    enabled: searchTerm.length > 0 || isSearching,
  });

  const handleSearch = async () => {
    if (searchTerm.length === 0) {
      toast({
        title: "Search Error",
        description: "Please enter a search term",
        variant: "destructive",
      });
      return;
    }

    setIsSearching(true);
    await refetch();
  };

  const handleViewRecord = (patientId: number) => {
    // Navigate to patient record
    toast({
      title: "View Record",
      description: `Viewing record for patient ID: ${patientId}`,
    });
  };

  const handleRecordVitals = (patientId: number) => {
    navigate(`/vitals/${patientId}`);
  };

  const handleBookAppointment = (patientId: number) => {
    navigate(`/appointments/${patientId}`);
  };

  return (
    <main className="py-6">
      <div className="px-4 mx-auto max-w-7xl sm:px-6 md:px-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-neutral-800">Search Patients</h1>
        </div>

        <Card>
          <CardContent className="p-6">
            <div className="mb-6">
              <div className="flex flex-col md:flex-row md:items-center gap-4">
                <div className="flex-grow">
                  <label htmlFor="searchQuery" className="block text-sm font-medium text-neutral-700 mb-1">
                    Search by Name, Phone or ID
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <i className="ri-search-line text-neutral-500"></i>
                    </div>
                    <Input
                      id="searchQuery"
                      placeholder="Enter patient details..."
                      className="pl-10"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          handleSearch();
                        }
                      }}
                    />
                  </div>
                </div>
                <div className="flex-shrink-0 flex gap-2">
                  <Button onClick={handleSearch} className="mt-2 md:mt-0">
                    Search
                  </Button>
                  <Button variant="outline" className="mt-2 md:mt-0">
                    <i className="ri-filter-3-line mr-2"></i> Filters
                  </Button>
                </div>
              </div>
            </div>

            <div className="overflow-x-auto mt-4">
              {isLoading ? (
                <div className="space-y-4">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="flex gap-4">
                      <Skeleton className="h-12 w-full" />
                    </div>
                  ))}
                </div>
              ) : patients && patients.length > 0 ? (
                <table className="min-w-full divide-y divide-neutral-200">
                  <thead className="bg-neutral-100">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                        Patient ID
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                        Name
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                        Age/Gender
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                        Phone
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                        Last Visit
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-neutral-200">
                    {patients.map((patient: any) => (
                      <tr key={patient.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-primary">{patient.patientId}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-neutral-900">{patient.name}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-neutral-700">
                            {patient.age} / {patient.gender.charAt(0).toUpperCase() + patient.gender.slice(1)}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-neutral-700">{patient.phone}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-neutral-700">
                            {patient.lastVisit ? format(new Date(patient.lastVisit), "MMM d, yyyy") : "N/A"}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex space-x-2">
                            <button
                              className="text-primary hover:text-primary-dark"
                              onClick={() => handleViewRecord(patient.id)}
                              title="View Record"
                            >
                              <i className="ri-file-list-line"></i>
                            </button>
                            <button
                              className="text-secondary hover:text-secondary-dark"
                              onClick={() => handleRecordVitals(patient.id)}
                              title="Record Vitals"
                            >
                              <i className="ri-heart-pulse-line"></i>
                            </button>
                            <button
                              className="text-accent hover:text-yellow-600"
                              onClick={() => handleBookAppointment(patient.id)}
                              title="Book Appointment"
                            >
                              <i className="ri-calendar-check-line"></i>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : isSearching ? (
                <div className="text-center py-8">
                  <p className="text-neutral-500">No patients found matching your search criteria.</p>
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-neutral-500">Enter search terms to find patients.</p>
                </div>
              )}
            </div>

            {patients && patients.length > 0 && (
              <div className="flex items-center justify-between mt-6">
                <div className="text-sm text-neutral-700">
                  Showing <span className="font-medium">1</span> to{" "}
                  <span className="font-medium">{patients.length}</span> of{" "}
                  <span className="font-medium">{patients.length}</span> results
                </div>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm" disabled>
                    Previous
                  </Button>
                  <Button variant="outline" size="sm" className="bg-neutral-100">
                    1
                  </Button>
                  <Button variant="outline" size="sm">
                    Next
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
