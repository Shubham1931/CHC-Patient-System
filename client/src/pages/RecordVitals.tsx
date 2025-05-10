import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { vitalsFormSchema } from "@shared/schema";
import { useMutation, useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useLocation, useParams } from "wouter";
import PatientInfoCard from "@/components/PatientInfoCard";
import { Skeleton } from "@/components/ui/skeleton";

export default function RecordVitals() {
  const { toast } = useToast();
  const [_, navigate] = useLocation();
  const { id } = useParams();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch patient data if ID is provided
  const { data: patient, isLoading: patientLoading } = useQuery({
    queryKey: [`/api/patients/${id}`],
    enabled: !!id,
  });

  const form = useForm({
    resolver: zodResolver(vitalsFormSchema),
    defaultValues: {
      patientId: id ? parseInt(id) : undefined,
      temperature: "",
      bloodPressureSystolic: undefined,
      bloodPressureDiastolic: undefined,
      heartRate: undefined,
      respiratoryRate: undefined,
      oxygenSaturation: undefined,
      weight: "",
      height: "",
      bloodGlucose: "",
      notes: "",
    },
  });

  // Update form when patient is loaded
  useEffect(() => {
    if (patient && id) {
      form.setValue("patientId", parseInt(id));
    }
  }, [patient, id, form]);

  const recordVitals = useMutation({
    mutationFn: async (data: any) => {
      return apiRequest("POST", "/api/vitals", data);
    },
    onSuccess: async () => {
      toast({
        title: "Success",
        description: "Vitals recorded successfully",
        variant: "default",
      });
      if (id) {
        navigate("/search");
      } else {
        form.reset();
      }
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to record vitals",
        variant: "destructive",
      });
    },
    onSettled: () => {
      setIsSubmitting(false);
    },
  });

  async function onSubmit(data: any) {
    if (!data.patientId) {
      toast({
        title: "Error",
        description: "Please select a patient first",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    recordVitals.mutate(data);
  }

  function handleCancel() {
    if (id) {
      navigate("/search");
    } else {
      form.reset();
    }
  }

  return (
    <main className="py-6">
      <div className="px-4 mx-auto max-w-7xl sm:px-6 md:px-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-neutral-800">Record Vitals</h1>
        </div>

        <Card>
          <CardContent className="p-6">
            {id && (
              <div className="mb-6">
                <h3 className="text-lg font-medium text-neutral-700 mb-4">Patient Information</h3>
                {patientLoading ? (
                  <div className="p-4 bg-neutral-50 border border-neutral-200 rounded-md">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {[1, 2, 3, 4].map((i) => (
                        <div key={i}>
                          <Skeleton className="h-4 w-20 mb-2" />
                          <Skeleton className="h-6 w-40" />
                        </div>
                      ))}
                    </div>
                  </div>
                ) : patient ? (
                  <PatientInfoCard patient={patient} />
                ) : (
                  <div className="p-4 bg-neutral-50 border border-neutral-200 rounded-md">
                    <p className="text-neutral-500">Patient not found</p>
                  </div>
                )}
              </div>
            )}

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)}>
                <h3 className="text-lg font-medium text-neutral-700 mb-4">Vital Signs</h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                  <FormField
                    control={form.control}
                    name="temperature"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Temperature (°C) *</FormLabel>
                        <div className="relative">
                          <FormControl>
                            <Input placeholder="36.5" {...field} />
                          </FormControl>
                          <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                            <i className="ri-thermometer-line text-neutral-500"></i>
                          </div>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="space-y-1">
                    <FormLabel>Blood Pressure (mmHg) *</FormLabel>
                    <div className="flex space-x-2">
                      <FormField
                        control={form.control}
                        name="bloodPressureSystolic"
                        render={({ field }) => (
                          <FormItem className="flex-1">
                            <FormControl>
                              <Input placeholder="Systolic" type="number" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <span className="flex items-center text-neutral-500">/</span>
                      <FormField
                        control={form.control}
                        name="bloodPressureDiastolic"
                        render={({ field }) => (
                          <FormItem className="flex-1">
                            <FormControl>
                              <Input placeholder="Diastolic" type="number" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  <FormField
                    control={form.control}
                    name="heartRate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Heart Rate (bpm) *</FormLabel>
                        <div className="relative">
                          <FormControl>
                            <Input placeholder="72" type="number" {...field} />
                          </FormControl>
                          <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                            <i className="ri-heart-pulse-line text-neutral-500"></i>
                          </div>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="respiratoryRate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Respiratory Rate (bpm)</FormLabel>
                        <FormControl>
                          <Input placeholder="16" type="number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="oxygenSaturation"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Oxygen Saturation (%)</FormLabel>
                        <div className="relative">
                          <FormControl>
                            <Input placeholder="98" type="number" min="0" max="100" {...field} />
                          </FormControl>
                          <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                            <i className="ri-pulse-line text-neutral-500"></i>
                          </div>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="weight"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Weight (kg)</FormLabel>
                        <FormControl>
                          <Input placeholder="65.5" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="height"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Height (cm)</FormLabel>
                        <FormControl>
                          <Input placeholder="175" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="bloodGlucose"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Blood Glucose (mg/dL)</FormLabel>
                        <FormControl>
                          <Input placeholder="95" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="notes"
                  render={({ field }) => (
                    <FormItem className="mt-6">
                      <FormLabel>Additional Notes</FormLabel>
                      <FormControl>
                        <Textarea rows={3} placeholder="Enter additional notes about the patient's condition" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex justify-end space-x-4 mt-6 pt-6 border-t border-neutral-200">
                  <Button type="button" variant="outline" onClick={handleCancel}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isSubmitting || patientLoading}>
                    {isSubmitting ? "Saving..." : "Save Vitals"}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
