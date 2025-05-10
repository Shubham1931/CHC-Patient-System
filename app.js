import express from 'express';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import path from 'path';

// Get the directory name
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Create Express application
const app = express();
const port = 5000;

// Middleware for JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Simple in-memory storage
const patients = [];
const doctors = [
  { id: 1, name: "Dr. Sarah Johnson", department: "General Medicine", email: "sarah.johnson@example.com", maxDailyPatients: 20 },
  { id: 2, name: "Dr. Michael Chen", department: "Pediatrics", email: "michael.chen@example.com", maxDailyPatients: 15 },
  { id: 3, name: "Dr. Amanda Patel", department: "Gynecology", email: "amanda.patel@example.com", maxDailyPatients: 12 },
  { id: 4, name: "Dr. Robert Wilson", department: "Orthopedics", email: "robert.wilson@example.com", maxDailyPatients: 10 }
];
const appointments = [];
const vitals = [];

// Generate patient ID
function generatePatientId() {
  const year = new Date().getFullYear();
  const randomNum = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  return `CHC-${year}-${randomNum}`;
}

// API routes
app.get('/api/patients', (req, res) => {
  res.json(patients);
});

app.post('/api/patients', (req, res) => {
  const { name, age, gender, phone, address, chiefComplaint, emergencyContact, bloodGroup, allergies } = req.body;
  
  const newPatient = {
    id: patients.length + 1,
    patientId: generatePatientId(),
    name,
    age: parseInt(age),
    gender,
    phone,
    address,
    emergencyContact,
    bloodGroup,
    allergies,
    chiefComplaint,
    createdAt: new Date().toISOString()
  };
  
  patients.push(newPatient);
  res.status(201).json(newPatient);
});

app.get('/api/doctors', (req, res) => {
  res.json(doctors);
});

// Dashboard metrics
app.get('/api/dashboard/metrics', (req, res) => {
  const metrics = {
    totalPatients: patients.length,
    patientsChange: 5,
    appointments: appointments.length,
    appointmentsChange: 8,
    waiting: Math.floor(patients.length * 0.3),
    avgWaitTime: 15,
    newRegistrations: Math.floor(patients.length * 0.2),
    newRegistrationsChange: 10
  };
  
  res.json(metrics);
});

app.get('/api/dashboard/gender-distribution', (req, res) => {
  // Mock data
  const genderData = [
    { name: 'Male', value: 45 },
    { name: 'Female', value: 52 },
    { name: 'Other', value: 3 }
  ];
  
  res.json(genderData);
});

app.get('/api/dashboard/age-distribution', (req, res) => {
  // Mock data
  const ageData = [
    { name: '0-12', value: 20 },
    { name: '13-25', value: 15 },
    { name: '26-45', value: 35 },
    { name: '46+', value: 30 }
  ];
  
  res.json(ageData);
});

app.get('/api/dashboard/doctor-distribution', (req, res) => {
  // Mock data
  const doctorData = doctors.map(doctor => {
    const patientsSeen = Math.floor(Math.random() * doctor.maxDailyPatients);
    const slotsLeft = doctor.maxDailyPatients - patientsSeen;
    
    let status = "Available";
    if (slotsLeft === 0) {
      status = "Full";
    } else if (slotsLeft <= 3) {
      status = "Limited";
    }
    
    return {
      ...doctor,
      patientsSeen,
      slotsLeft,
      status
    };
  });
  
  res.json(doctorData);
});

// Serve the static files from the client directory
app.use(express.static(path.join(__dirname, 'client')));

// Catch-all route for client-side routing
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client', 'index.html'));
});

// Start the server
app.listen(port, '0.0.0.0', () => {
  console.log(`Server running on port ${port}`);
});