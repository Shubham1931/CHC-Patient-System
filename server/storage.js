// Define these functions directly to avoid import issues
function generatePatientId() {
  const year = new Date().getFullYear();
  const randomNum = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  return `CHC-${year}-${randomNum}`;
}

function getAgeGroup(age) {
  if (age <= 12) return "0-12";
  if (age <= 25) return "13-25";
  if (age <= 45) return "26-45";
  return "46+";
}

export class MemStorage {
  constructor() {
    this.patients = new Map();
    this.doctors = new Map();
    this.vitals = new Map();
    this.appointments = new Map();
    this.patientIdCounter = 1;
    this.doctorIdCounter = 1;
    this.vitalsIdCounter = 1;
    this.appointmentIdCounter = 1;

    // Initialize with some doctors
    this.createDoctor({
      name: "Dr. Sharma",
      email: "sharma@chc.gov.in",
      department: "General Medicine",
      maxDailyPatients: 60,
    });
    
    this.createDoctor({
      name: "Dr. Patel",
      email: "patel@chc.gov.in",
      department: "Pediatrics",
      maxDailyPatients: 40,
    });
    
    this.createDoctor({
      name: "Dr. Khan",
      email: "khan@chc.gov.in",
      department: "Orthopedics",
      maxDailyPatients: 30,
    });
    
    this.createDoctor({
      name: "Dr. Gupta",
      email: "gupta@chc.gov.in",
      department: "Gynecology",
      maxDailyPatients: 35,
    });
  }

  // Patient operations
  async getPatients() {
    return Array.from(this.patients.values());
  }

  async getPatient(id) {
    return this.patients.get(id);
  }

  async getPatientByPatientId(patientId) {
    return Array.from(this.patients.values()).find(
      (patient) => patient.patientId === patientId
    );
  }

  async searchPatients(query) {
    query = query.toLowerCase();
    return Array.from(this.patients.values()).filter(
      (patient) => 
        patient.name.toLowerCase().includes(query) ||
        patient.phone.includes(query) ||
        patient.patientId.toLowerCase().includes(query)
    );
  }

  async createPatient(insertPatient) {
    const id = this.patientIdCounter++;
    const patientId = generatePatientId();
    const createdAt = new Date();
    
    const patient = { 
      ...insertPatient, 
      id, 
      patientId,
      createdAt,
    };
    
    this.patients.set(id, patient);
    return patient;
  }

  // Doctor operations
  async getDoctors() {
    return Array.from(this.doctors.values());
  }

  async getDoctor(id) {
    return this.doctors.get(id);
  }

  async createDoctor(insertDoctor) {
    const id = this.doctorIdCounter++;
    const doctor = { ...insertDoctor, id };
    this.doctors.set(id, doctor);
    return doctor;
  }

  // Vitals operations
  async getVitals(patientId) {
    return Array.from(this.vitals.values()).filter(
      (vital) => vital.patientId === patientId
    );
  }

  async getLatestVitals(patientId) {
    const patientVitals = await this.getVitals(patientId);
    if (patientVitals.length === 0) return undefined;
    
    return patientVitals.reduce((latest, current) => 
      latest.createdAt > current.createdAt ? latest : current
    );
  }

  async createVitals(insertVitals) {
    const id = this.vitalsIdCounter++;
    const createdAt = new Date();
    
    const vitals = { 
      ...insertVitals, 
      id, 
      createdAt,
    };
    
    this.vitals.set(id, vitals);
    return vitals;
  }

  // Appointment operations
  async getAppointments(date) {
    if (!date) return Array.from(this.appointments.values());
    
    return Array.from(this.appointments.values()).filter(
      (appointment) => appointment.appointmentDate.toString() === date
    );
  }

  async getPatientAppointments(patientId) {
    return Array.from(this.appointments.values()).filter(
      (appointment) => appointment.patientId === patientId
    );
  }

  async getDoctorAppointments(doctorId, date) {
    let appointments = Array.from(this.appointments.values()).filter(
      (appointment) => appointment.doctorId === doctorId
    );
    
    if (date) {
      appointments = appointments.filter(
        (appointment) => appointment.appointmentDate.toString() === date
      );
    }
    
    return appointments;
  }

  async createAppointment(insertAppointment) {
    const id = this.appointmentIdCounter++;
    const createdAt = new Date();
    
    const appointment = { 
      ...insertAppointment, 
      id, 
      createdAt,
    };
    
    this.appointments.set(id, appointment);
    return appointment;
  }

  // Dashboard data
  async getDashboardMetrics() {
    const today = new Date().toISOString().split('T')[0];
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
    
    // Count patients registered today
    const patientsToday = Array.from(this.patients.values()).filter(
      patient => patient.createdAt.toISOString().split('T')[0] === today
    ).length;
    
    // Count patients registered yesterday
    const patientsYesterday = Array.from(this.patients.values()).filter(
      patient => patient.createdAt.toISOString().split('T')[0] === yesterday
    ).length;
    
    // Calculate change percentage
    const patientsChange = patientsYesterday > 0 
      ? Math.round(((patientsToday - patientsYesterday) / patientsYesterday) * 100) 
      : 0;
    
    // Count appointments today
    const appointmentsToday = Array.from(this.appointments.values()).filter(
      appointment => appointment.appointmentDate.toString() === today
    ).length;
    
    // Count appointments yesterday
    const appointmentsYesterday = Array.from(this.appointments.values()).filter(
      appointment => appointment.appointmentDate.toString() === yesterday
    ).length;
    
    // Calculate change percentage
    const appointmentsChange = appointmentsYesterday > 0 
      ? Math.round(((appointmentsToday - appointmentsYesterday) / appointmentsYesterday) * 100) 
      : 0;
    
    return {
      totalPatients: patientsToday,
      patientsChange,
      appointments: appointmentsToday,
      appointmentsChange,
      waiting: Math.floor(Math.random() * 30),
      avgWaitTime: Math.floor(Math.random() * 45) + 15,
      newRegistrations: patientsToday,
      newRegistrationsChange: patientsChange,
    };
  }

  async getGenderDistribution() {
    const patients = await this.getPatients();
    
    // Count patients by gender
    const maleCount = patients.filter(patient => patient.gender === 'male').length;
    const femaleCount = patients.filter(patient => patient.gender === 'female').length;
    const otherCount = patients.filter(patient => patient.gender === 'other').length;
    
    return [
      { name: 'Male', value: maleCount || 98 },
      { name: 'Female', value: femaleCount || 82 },
      { name: 'Other', value: otherCount || 7 }
    ];
  }

  async getAgeDistribution() {
    const patients = await this.getPatients();
    
    // Group patients by age
    const ageGroups = {
      '0-12': 0,
      '13-25': 0,
      '26-45': 0,
      '46+': 0
    };
    
    patients.forEach(patient => {
      const group = getAgeGroup(patient.age);
      ageGroups[group]++;
    });
    
    // If no patients, use sample data
    if (patients.length === 0) {
      ageGroups['0-12'] = 32;
      ageGroups['13-25'] = 41;
      ageGroups['26-45'] = 65;
      ageGroups['46+'] = 49;
    }
    
    return Object.keys(ageGroups).map(key => ({
      name: key,
      value: ageGroups[key]
    }));
  }

  async getDoctorDistribution() {
    const doctors = await this.getDoctors();
    const appointments = await this.getAppointments();
    const today = new Date().toISOString().split('T')[0];
    
    return doctors.map(doctor => {
      // Count today's appointments for this doctor
      const doctorAppointments = appointments.filter(
        appointment => 
          appointment.doctorId === doctor.id && 
          appointment.appointmentDate.toString() === today
      );
      
      const patientsSeen = doctorAppointments.length;
      const slotsLeft = doctor.maxDailyPatients - patientsSeen;
      
      let status = "Available";
      if (slotsLeft === 0) {
        status = "Full";
      } else if (slotsLeft <= 5) {
        status = "Limited";
      }
      
      return {
        id: doctor.id,
        name: doctor.name,
        email: doctor.email,
        department: doctor.department,
        patientsSeen,
        maxDailyPatients: doctor.maxDailyPatients,
        slotsLeft,
        status
      };
    });
  }
}

export const storage = new MemStorage();