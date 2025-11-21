import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface UploadedFile {
  id: string;
  name: string;
  type: 'pdf' | 'image';
  uri: string;
  size: number;
}

export interface TestRequest {
  id: number;
  patient: string;
  patientId: string;
  doctor: string;
  hospital: string;
  tests: string[];
  doctorNote: string;
  status: 'pending' | 'processing' | 'completed';
  timestamp: string;
  uploadedFiles: UploadedFile[];
  priority: 'high' | 'normal';
}

interface LabRequestContextType {
  testRequests: TestRequest[];
  updateRequestStatus: (requestId: number, files: UploadedFile[]) => void;
  getRequestById: (requestId: number) => TestRequest | undefined;
}

const LabRequestContext = createContext<LabRequestContextType | undefined>(undefined);

const initialRequests: TestRequest[] = [
  {
    id: 1,
    patient: 'Robert Johnson',
    patientId: 'P-101',
    doctor: 'Dr. Mehta',
    hospital: 'Yashwant Hospital, Pune',
    tests: ['Complete Blood Count', 'Lipid Profile'],
    doctorNote: 'Check anemia',
    status: 'pending',
    timestamp: '2 hours ago',
    uploadedFiles: [],
    priority: 'high',
  },
  {
    id: 2,
    patient: 'Linda Martinez',
    patientId: 'P-102',
    doctor: 'Dr. Sharma',
    hospital: 'City Hospital, Mumbai',
    tests: ['Lipid Profile'],
    doctorNote: 'Regular checkup',
    status: 'pending',
    timestamp: '4 hours ago',
    uploadedFiles: [],
    priority: 'normal',
  },
  {
    id: 3,
    patient: 'David Wilson',
    patientId: 'P-103',
    doctor: 'Dr. Patel',
    hospital: 'Apollo Hospital, Delhi',
    tests: ['Thyroid Function Test'],
    doctorNote: 'Follow-up test',
    status: 'pending',
    timestamp: '5 hours ago',
    uploadedFiles: [],
    priority: 'normal',
  },
  {
    id: 4,
    patient: 'Sarah Smith',
    patientId: 'P-104',
    doctor: 'Dr. Kumar',
    hospital: 'Max Hospital, Bangalore',
    tests: ['Blood Sugar', 'HbA1c'],
    doctorNote: 'Diabetic patient monitoring',
    status: 'completed',
    timestamp: '8 hours ago',
    uploadedFiles: [
      {
        id: '1',
        name: 'blood_sugar_report.pdf',
        type: 'pdf',
        uri: 'https://example.com/report1.pdf',
        size: 245000,
      },
      {
        id: '2',
        name: 'hba1c_results.pdf',
        type: 'pdf',
        uri: 'https://example.com/report2.pdf',
        size: 180000,
      },
    ],
    priority: 'normal',
  },
  {
    id: 5,
    patient: 'Michael Brown',
    patientId: 'P-105',
    doctor: 'Dr. Singh',
    hospital: 'Fortis Hospital, Chennai',
    tests: ['Liver Function Test'],
    doctorNote: '',
    status: 'completed',
    timestamp: '10 hours ago',
    uploadedFiles: [
      {
        id: '3',
        name: 'liver_function.pdf',
        type: 'pdf',
        uri: 'https://example.com/report3.pdf',
        size: 320000,
      },
    ],
    priority: 'normal',
  },
];

export function LabRequestProvider({ children }: { children: ReactNode }) {
  const [testRequests, setTestRequests] = useState<TestRequest[]>(initialRequests);

  const updateRequestStatus = (requestId: number, files: UploadedFile[]) => {
    setTestRequests((prevRequests) =>
      prevRequests.map((request) =>
        request.id === requestId
          ? { ...request, status: 'completed' as const, uploadedFiles: files }
          : request
      )
    );
  };

  const getRequestById = (requestId: number) => {
    return testRequests.find((request) => request.id === requestId);
  };

  return (
    <LabRequestContext.Provider value={{ testRequests, updateRequestStatus, getRequestById }}>
      {children}
    </LabRequestContext.Provider>
  );
}

export function useLabRequests() {
  const context = useContext(LabRequestContext);
  if (context === undefined) {
    throw new Error('useLabRequests must be used within a LabRequestProvider');
  }
  return context;
}
