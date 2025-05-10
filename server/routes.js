import { createServer } from "http";
import { storage } from "./storage.js";
import { z } from "zod";
// Use the internal function from storage.js
import { 
  insertPatientSchema,
  insertVitalsSchema,
  insertAppointmentSchema
} from "../shared/schema.js";

export async function registerRoutes(app) {
  // Dashboard routes
  app.get('/api/dashboard/metrics', async (req, res) => {
    try {
      const metrics = await storage.getDashboardMetrics();
      res.json(metrics);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get('/api/dashboard/gender-distribution', async (req, res) => {
    try {
      const genderDistribution = await storage.getGenderDistribution();
      res.json(genderDistribution);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get('/api/dashboard/age-distribution', async (req, res) => {
    try {
      const ageDistribution = await storage.getAgeDistribution();
      res.json(ageDistribution);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get('/api/dashboard/doctor-distribution', async (req, res) => {
    try {
      const doctorDistribution = await storage.getDoctorDistribution();
      res.json(doctorDistribution);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

  // Patient routes
  app.get('/api/patients', async (req, res) => {
    try {
      const { query } = req.query;
      
      if (query && typeof query === 'string') {
        const patients = await storage.searchPatients(query);
        res.json(patients);
      } else {
        const patients = await storage.getPatients();
        res.json(patients);
      }
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post('/api/patients', async (req, res) => {
    try {
      const validatedData = insertPatientSchema.parse(req.body);
      const patient = await storage.createPatient(validatedData);
      res.status(201).json(patient);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: error.errors });
      } else {
        res.status(500).json({ message: error.message });
      }
    }
  });

  app.get('/api/patients/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      
      if (isNaN(id)) {
        return res.status(400).json({ message: 'Invalid patient ID' });
      }
      
      const patient = await storage.getPatient(id);
      
      if (!patient) {
        return res.status(404).json({ message: 'Patient not found' });
      }
      
      res.json(patient);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

  // Doctor routes
  app.get('/api/doctors', async (req, res) => {
    try {
      const doctors = await storage.getDoctors();
      res.json(doctors);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get('/api/doctors/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      
      if (isNaN(id)) {
        return res.status(400).json({ message: 'Invalid doctor ID' });
      }
      
      const doctor = await storage.getDoctor(id);
      
      if (!doctor) {
        return res.status(404).json({ message: 'Doctor not found' });
      }
      
      res.json(doctor);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

  // Vitals routes
  app.post('/api/vitals', async (req, res) => {
    try {
      const validatedData = insertVitalsSchema.parse(req.body);
      
      // Verify patient exists
      const patient = await storage.getPatient(validatedData.patientId);
      if (!patient) {
        return res.status(404).json({ message: 'Patient not found' });
      }
      
      const vitals = await storage.createVitals(validatedData);
      res.status(201).json(vitals);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: error.errors });
      } else {
        res.status(500).json({ message: error.message });
      }
    }
  });

  app.get('/api/patients/:id/vitals', async (req, res) => {
    try {
      const patientId = parseInt(req.params.id);
      
      if (isNaN(patientId)) {
        return res.status(400).json({ message: 'Invalid patient ID' });
      }
      
      // Verify patient exists
      const patient = await storage.getPatient(patientId);
      if (!patient) {
        return res.status(404).json({ message: 'Patient not found' });
      }
      
      const vitals = await storage.getVitals(patientId);
      res.json(vitals);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
  
  app.get('/api/vitals/:patientId', async (req, res) => {
    try {
      const patientId = parseInt(req.params.patientId);
      
      if (isNaN(patientId)) {
        return res.status(400).json({ message: 'Invalid patient ID' });
      }
      
      // Verify patient exists
      const patient = await storage.getPatient(patientId);
      if (!patient) {
        return res.status(404).json({ message: 'Patient not found' });
      }
      
      const vitals = await storage.getVitals(patientId);
      res.json(vitals);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

  // Appointment routes
  app.post('/api/appointments', async (req, res) => {
    try {
      const validatedData = insertAppointmentSchema.parse(req.body);
      
      // Verify patient exists
      const patient = await storage.getPatient(validatedData.patientId);
      if (!patient) {
        return res.status(404).json({ message: 'Patient not found' });
      }
      
      // Verify doctor exists
      const doctor = await storage.getDoctor(validatedData.doctorId);
      if (!doctor) {
        return res.status(404).json({ message: 'Doctor not found' });
      }
      
      // Verify doctor has availability
      const date = new Date(validatedData.appointmentDate).toISOString().split('T')[0];
      const doctorAppointments = await storage.getDoctorAppointments(validatedData.doctorId, date);
      
      if (doctorAppointments.length >= doctor.maxDailyPatients) {
        return res.status(400).json({ message: 'Doctor has no available slots for this date' });
      }
      
      const appointment = await storage.createAppointment(validatedData);
      res.status(201).json(appointment);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: error.errors });
      } else {
        res.status(500).json({ message: error.message });
      }
    }
  });

  app.get('/api/appointments', async (req, res) => {
    try {
      const { date } = req.query;
      const appointments = await storage.getAppointments(date);
      res.json(appointments);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get('/api/patients/:id/appointments', async (req, res) => {
    try {
      const patientId = parseInt(req.params.id);
      
      if (isNaN(patientId)) {
        return res.status(400).json({ message: 'Invalid patient ID' });
      }
      
      // Verify patient exists
      const patient = await storage.getPatient(patientId);
      if (!patient) {
        return res.status(404).json({ message: 'Patient not found' });
      }
      
      const appointments = await storage.getPatientAppointments(patientId);
      res.json(appointments);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
  
  app.get('/api/appointments/patient/:patientId', async (req, res) => {
    try {
      const patientId = parseInt(req.params.patientId);
      
      if (isNaN(patientId)) {
        return res.status(400).json({ message: 'Invalid patient ID' });
      }
      
      // Verify patient exists
      const patient = await storage.getPatient(patientId);
      if (!patient) {
        return res.status(404).json({ message: 'Patient not found' });
      }
      
      const appointments = await storage.getPatientAppointments(patientId);
      res.json(appointments);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
  
  app.get('/api/patients/search', async (req, res) => {
    try {
      const { q } = req.query;
      
      if (!q || typeof q !== 'string') {
        return res.status(400).json({ message: 'Search query is required' });
      }
      
      const patients = await storage.searchPatients(q);
      res.json(patients);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}