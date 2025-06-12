export const mockUsers = {
  '1234567890': { 
    password: 'admin123', 
    role: 'admin', 
    name: 'Dr. Smith'
  },
  '9876543210': { 
    password: 'operator123', 
    role: 'operator', 
    name: 'Nurse Johnson'
  },
  '9886581294': { 
    password: 'customer123', 
    role: 'customer', 
    name: 'Mr. Darshan'
  }
};

// Mock prescriptions data for 3 QR codes
export const mockPrescriptions = {
  'QR001': {
    prescriptionId: 'RX001234',
    patientName: 'John Smith',
    doctorName: 'Dr. Sarah Johnson',
    date: '2025-06-10',
    validUntil: '2025-06-17',
    medicines: [
      {
        name: 'Paracetamol 500mg',
        dosage: '500mg',
        instructions: 'Take 1 tablet every 6 hours',
        quantity: 12,
        price: 25,
        available: true
      }
    ],
    doctorNotes: 'For fever and headache. Complete the full course.'
  },
  'QR002': {
    prescriptionId: 'RX005678',
    patientName: 'Maria Garcia',
    doctorName: 'Dr. Michael Chen',
    date: '2025-06-09',
    validUntil: '2025-07-09',
    medicines: [
      {
        name: 'Dolo 650mg',
        dosage: '650mg',
        instructions: 'Take 1 tablet twice daily after meals',
        quantity: 10,
        price: 35,
        available: true
      }
    ],
    doctorNotes: 'For high fever and body pain. Take with food.'
  },
  'QR003': {
    prescriptionId: 'RX009012',
    patientName: 'Robert Wilson',
    doctorName: 'Dr. Emily Brown',
    date: '2025-06-11',
    validUntil: '2025-07-11',
    medicines: [
      {
        name: 'Brufen 400mg',
        dosage: '400mg',
        instructions: 'Take 1 tablet daily after breakfast',
        quantity: 30,
        price: 45,
        available: true
      }
    ],
    doctorNotes: 'For inflammation and severe body pain. Take after meals.'
  }
};
