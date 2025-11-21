import { Tabs } from 'expo-router';
import { LabRequestProvider } from '../../contexts/LabRequestContext';

export default function TabLayout() {
  return (
    <LabRequestProvider>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarStyle: { display: 'none' },
        }}
      >
        <Tabs.Screen name="index" />
        <Tabs.Screen name="login" />
        <Tabs.Screen name="verify-otp" />
        <Tabs.Screen name="register-patient" />
        <Tabs.Screen name="register-doctor" />
        <Tabs.Screen name="register-lab" />
        <Tabs.Screen name="patient-home" />
        <Tabs.Screen name="profile" />
        <Tabs.Screen name="doctor-home" />
        <Tabs.Screen name="doctor-patient-profile" />
        <Tabs.Screen name="doctor-appointments" />
        <Tabs.Screen name="doctor-profile" />
        <Tabs.Screen name="lab-home" />
        <Tabs.Screen name="process-request" />
        <Tabs.Screen name="view-reports" />
        <Tabs.Screen name="success-confirmation" />
        <Tabs.Screen name="timeline" />
        <Tabs.Screen name="upload-document" />
      </Tabs>
    </LabRequestProvider>
  );
}
