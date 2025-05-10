import { pgTable, text, serial, integer, boolean, date, time, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Patient table schema
export const patients = pgTable("patients", {
  id: serial("id").primaryKey(),
  patientId: text("patient_id").notNull().unique(),
  name: text("name").notNull(),
  age: integer("age").notNull(),
  gender: text("gender").notNull(),
  phone: text("phone").notNull(),
  address: text("address").notNull(),
  emergencyContact: text("emergency_contact"),
  bloodGroup: text("blood_group"),
  allergies: text("allergies"),
  chiefComplaint: text("chief_complaint").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Doctor table schema
export const doctors = pgTable("doctors", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  department: text("department").notNull(),
  maxDailyPatients: integer("max_daily_patients").notNull(),
});

// Vitals table schema
export const vitals = pgTable("vitals", {
  id: serial("id").primaryKey(),
  patientId: integer("patient_id").notNull(),
  temperature: text("temperature").notNull(),
  bloodPressureSystolic: integer("blood_pressure_systolic").notNull(),
  bloodPressureDiastolic: integer("blood_pressure_diastolic").notNull(),
  heartRate: integer("heart_rate").notNull(),
  respiratoryRate: integer("respiratory_rate"),
  oxygenSaturation: integer("oxygen_saturation"),
  weight: text("weight"),
  height: text("height"),
  bloodGlucose: text("blood_glucose"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Appointment table schema
export const appointments = pgTable("appointments", {
  id: serial("id").primaryKey(),
  patientId: integer("patient_id").notNull(),
  doctorId: integer("doctor_id").notNull(),
  appointmentDate: date("appointment_date").notNull(),
  appointmentTime: time("appointment_time").notNull(),
  reason: text("reason").notNull(),
  sendReminder: boolean("send_reminder").default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Insert schemas
export const insertPatientSchema = createInsertSchema(patients).omit({
  id: true,
  patientId: true,
  createdAt: true,
});

export const insertDoctorSchema = createInsertSchema(doctors).omit({
  id: true,
});

export const insertVitalsSchema = createInsertSchema(vitals).omit({
  id: true,
  createdAt: true,
});

export const insertAppointmentSchema = createInsertSchema(appointments).omit({
  id: true,
  createdAt: true,
});

// Extended schemas for frontend use
export const patientFormSchema = insertPatientSchema.extend({
  name: z.string().min(2, "Name must be at least 2 characters"),
  age: z.coerce.number().min(0, "Age must be a positive number").max(120, "Age must be under 120"),
  gender: z.enum(["male", "female", "other"], {
    required_error: "Gender is required",
  }),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  address: z.string().min(5, "Address is required"),
  chiefComplaint: z.string().min(5, "Chief complaint is required"),
});

export const vitalsFormSchema = insertVitalsSchema.extend({
  temperature: z.string().min(1, "Temperature is required"),
  bloodPressureSystolic: z.coerce.number().min(60, "Systolic pressure must be at least 60"),
  bloodPressureDiastolic: z.coerce.number().min(40, "Diastolic pressure must be at least 40"),
  heartRate: z.coerce.number().min(30, "Heart rate must be at least 30"),
});

export const appointmentFormSchema = insertAppointmentSchema.extend({
  doctorId: z.coerce.number().min(1, "Doctor is required"),
  appointmentDate: z.coerce.date({
    errorMap: () => ({ message: "Please select a valid date" }),
  }),
  appointmentTime: z.string().min(1, "Time slot is required"),
  reason: z.string().min(5, "Reason for visit is required"),
});