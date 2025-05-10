import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { appointmentFormSchema } from "@shared/schema";
import { useMutation, useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useLocation, useParams } from "wouter";
import PatientInfoCard from "@/components/PatientInfoCard";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";

export default function BookAppointment() {
  const { toast } = useToast();
  const [_, navigate] = useLocation();
  const { id } = useParams();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch patient data if ID is provided
  const { data: patient, isLoading: patientLoading } = useQuery({
    queryKey: [`/api/patients/${id}`],
    enabled: !!id,
  });

  // Fetch doctors list
  const { data: doctors, isLoading: doctorsLoading } = useQuery({
    queryKey: ["/api/doctors"],
  });

  const form = useForm({
    resolver: zodResolver(appointmentFormSchema),
    defaultValues: {
      patientId: id ? parseInt(id) : undefined,
      doctorId: undefined,
      appointmentDate: undefined,
      appointmentTime: "",
      reason: "",
      sendReminder: false,
    },
  });

  // Update form when patient is loaded
  useEffect(() => {
    if (patient && id) {
      form.setValue("patientId", parseInt(id));
    }
  }, [patient, id, form]);

  // Watch for department changes to filter doctors
  const department = form.watch("department");
  const [filteredDoctors, setFilteredDoctors] = useState<any[]>([]);

  useEffect(() => {
    if (doctors && department) {
      setFilteredDoctors(doctors.filter((doc: any) => doc.department === department));
    } else if (doctors) {
      setFilteredDoctors(doctors);
    }
  }, [doctors, department]);

  const bookAppointment = useMutation({
    mutationFn: async (data: any) => {
      return apiRequest("POST", "/api/appointments", data);
    },
    onSuccess: async () => {
      toast({
        title: "Success",
        description: "Appointment booked successfully",
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
        description: error.message || "Failed to book appointment",
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
    bookAppointment.mutate(data);
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
          <h1 className="text-2xl font-bold text-neutral-800">Book Appointment</h1>
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
                <h3 className="text-lg font-medium text-neutral-700 mb-4">Appointment Details</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="department"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Department *</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select department" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="none">Select department</SelectItem>
                            <SelectItem value="General Medicine">General Medicine</SelectItem>
                            <SelectItem value="Pediatrics">Pediatrics</SelectItem>
                            <SelectItem value="Orthopedics">Orthopedics</SelectItem>
                            <SelectItem value="Gynecology">Gynecology</SelectItem>
                            <SelectItem value="ENT">ENT</SelectItem>
                            <SelectItem value="Ophthalmology">Ophthalmology</SelectItem>
                            <SelectItem value="Dermatology">Dermatology</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="doctorId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Doctor *</FormLabel>
                        <Select onValueChange={(value) => field.onChange(parseInt(value))} value={field.value?.toString()}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select doctor" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="none">Select doctor</SelectItem>
                            {doctorsLoading ? (
                              <SelectItem value="loading" disabled>Loading doctors...</SelectItem>
                            ) : filteredDoctors && filteredDoctors.length > 0 ? (
                              filteredDoctors.map((doctor: any) => (
                                <SelectItem key={doctor.id} value={doctor.id.toString()}>
                                  {doctor.name} - {doctor.department}
                                </SelectItem>
                              ))
                            ) : (
                              <SelectItem value="no-doctors" disabled>
                                {department ? "No doctors in selected department" : "No doctors available"}
                              </SelectItem>
                            )}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="appointmentDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Date *</FormLabel>
                        <FormControl>
                          <Input
                            type="date"
                            min={format(new Date(), "yyyy-MM-dd")}
                            {...field}
                            value={field.value ? format(new Date(field.value), "yyyy-MM-dd") : ""}
                            onChange={(e) => field.onChange(e.target.value ? new Date(e.target.value) : undefined)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="appointmentTime"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Time Slot *</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select time slot" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="none">Select time slot</SelectItem>
                            <SelectItem value="09:00">09:00 AM - 09:15 AM</SelectItem>
                            <SelectItem value="09:15">09:15 AM - 09:30 AM</SelectItem>
                            <SelectItem value="09:30">09:30 AM - 09:45 AM</SelectItem>
                            <SelectItem value="09:45">09:45 AM - 10:00 AM</SelectItem>
                            <SelectItem value="10:00">10:00 AM - 10:15 AM</SelectItem>
                            <SelectItem value="10:15">10:15 AM - 10:30 AM</SelectItem>
                            <SelectItem value="10:30">10:30 AM - 10:45 AM</SelectItem>
                            <SelectItem value="10:45">10:45 AM - 11:00 AM</SelectItem>
                            <SelectItem value="11:00">11:00 AM - 11:15 AM</SelectItem>
                            <SelectItem value="11:15">11:15 AM - 11:30 AM</SelectItem>
                            <SelectItem value="11:30">11:30 AM - 11:45 AM</SelectItem>
                            <SelectItem value="11:45">11:45 AM - 12:00 PM</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="reason"
                  render={({ field }) => (
                    <FormItem className="mt-6">
                      <FormLabel>Visit Reason *</FormLabel>
                      <FormControl>
                        <Textarea rows={3} placeholder="Enter reason for the appointment" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="sendReminder"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 mt-6">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Send SMS reminder to patient</FormLabel>
                      </div>
                    </FormItem>
                  )}
                />

                <div className="flex justify-end space-x-4 mt-6 pt-6 border-t border-neutral-200">
                  <Button type="button" variant="outline" onClick={handleCancel}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isSubmitting || patientLoading}>
                    {isSubmitting ? "Booking..." : "Book Appointment"}
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
