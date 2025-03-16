'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  FaHome, 
  FaFlask, 
  FaUserMd, 
  FaCalendarAlt, 
  FaUser, 
  FaCog, 
  FaSignOutAlt,
  FaBars,
  FaTimes,
  FaHospital,
  FaNotesMedical,
  FaClipboardList,
  FaHeartbeat,
  FaBell,
  FaChartLine,
  FaLifeRing,
  FaMedkit,
  FaLungs,
  FaStethoscope,
  FaUserCog,
  FaFileAlt,
  FaClinicMedical,
  FaDatabase,
  FaMoneyBillWave,
  FaUsers
} from 'react-icons/fa';

// Types
type UserRole = 'PATIENT' | 'PRACTITIONER' | 'CLINIC' | 'ADMIN';

interface NavItemProps {
  href: string;
  icon: React.ReactNode;
  label: string;
  active?: boolean;
}

interface DashboardLayoutProps {
  children: React.ReactNode;
  userRole?: UserRole; // In a real app, this would come from auth context
}

const NavItem = ({ href, icon, label, active }: NavItemProps) => {
  return (
    <Link 
      href={href}
      className={`flex items-center gap-3 px-4 py-3 rounded-md transition-colors ${
        active 
          ? 'bg-blue-100 text-blue-700' 
          : 'text-gray-700 hover:bg-gray-100'
      }`}
    >
      <span className="text-xl">{icon}</span>
      <span>{label}</span>
    </Link>
  );
};

// Patient-specific navigation
const PatientNavigation = ({ pathname }: { pathname: string }) => (
  <>
    <NavItem 
      href="/dashboard" 
      icon={<FaHome />} 
      label="Dashboard" 
      active={pathname === '/dashboard'} 
    />
    <NavItem 
      href="/ai-assistant" 
      icon={<FaHeartbeat />} 
      label="AI Health Assistant" 
      active={pathname.startsWith('/ai-assistant')} 
    />
    <NavItem 
      href="/image-analysis" 
      icon={<FaLungs />} 
      label="Image Analysis" 
      active={pathname.startsWith('/image-analysis')} 
    />
    <NavItem 
      href="/treatment-plans" 
      icon={<FaClipboardList />} 
      label="Treatment Plans" 
      active={pathname.startsWith('/treatment-plans')} 
    />
    <NavItem 
      href="/consultations" 
      icon={<FaUserMd />} 
      label="Doctor Consultations" 
      active={pathname.startsWith('/consultations')} 
    />
    <NavItem 
      href="/reminders" 
      icon={<FaBell />} 
      label="Medicine Reminders" 
      active={pathname.startsWith('/reminders')} 
    />
    <NavItem 
      href="/reports" 
      icon={<FaFileAlt />} 
      label="Health Reports" 
      active={pathname.startsWith('/reports')} 
    />
    <NavItem 
      href="/lifestyle" 
      icon={<FaChartLine />} 
      label="Lifestyle Coach" 
      active={pathname.startsWith('/lifestyle')} 
    />
    <NavItem 
      href="/sos" 
      icon={<FaLifeRing />} 
      label="Emergency SOS" 
      active={pathname.startsWith('/sos')} 
    />
  </>
);

// Doctor-specific navigation
const DoctorNavigation = ({ pathname }: { pathname: string }) => (
  <>
    <NavItem 
      href="/dashboard" 
      icon={<FaHome />} 
      label="Dashboard" 
      active={pathname === '/dashboard'} 
    />
    <NavItem 
      href="/patients" 
      icon={<FaUser />} 
      label="My Patients" 
      active={pathname.startsWith('/patients')} 
    />
    <NavItem 
      href="/consultations" 
      icon={<FaCalendarAlt />} 
      label="Consultations" 
      active={pathname.startsWith('/consultations')} 
    />
    <NavItem 
      href="/ai-diagnosis" 
      icon={<FaStethoscope />} 
      label="AI-Assisted Diagnosis" 
      active={pathname.startsWith('/ai-diagnosis')} 
    />
    <NavItem 
      href="/prescriptions" 
      icon={<FaNotesMedical />} 
      label="E-Prescriptions" 
      active={pathname.startsWith('/prescriptions')} 
    />
    <NavItem 
      href="/follow-ups" 
      icon={<FaClipboardList />} 
      label="Follow-Ups" 
      active={pathname.startsWith('/follow-ups')} 
    />
    <NavItem 
      href="/chatbot" 
      icon={<FaHeartbeat />} 
      label="AI Chatbot" 
      active={pathname.startsWith('/chatbot')} 
    />
    <NavItem 
      href="/profile" 
      icon={<FaUserCog />} 
      label="Doctor Profile" 
      active={pathname.startsWith('/profile')} 
    />
  </>
);

// Clinic-specific navigation
const ClinicNavigation = ({ pathname }: { pathname: string }) => (
  <>
    <NavItem 
      href="/dashboard" 
      icon={<FaHome />} 
      label="Dashboard" 
      active={pathname === '/dashboard'} 
    />
    <NavItem 
      href="/doctors" 
      icon={<FaUserMd />} 
      label="Manage Doctors" 
      active={pathname.startsWith('/doctors')} 
    />
    <NavItem 
      href="/patients" 
      icon={<FaUsers />} 
      label="Patients" 
      active={pathname.startsWith('/patients')} 
    />
    <NavItem 
      href="/appointments" 
      icon={<FaCalendarAlt />} 
      label="Appointments" 
      active={pathname.startsWith('/appointments')} 
    />
    <NavItem 
      href="/patient-records" 
      icon={<FaDatabase />} 
      label="Patient Records" 
      active={pathname.startsWith('/patient-records')} 
    />
    <NavItem 
      href="/billing" 
      icon={<FaMoneyBillWave />} 
      label="Billing & Payments" 
      active={pathname.startsWith('/billing')} 
    />
    <NavItem 
      href="/inventory" 
      icon={<FaMedkit />} 
      label="Medicine Inventory" 
      active={pathname.startsWith('/inventory')} 
    />
    <NavItem 
      href="/analytics" 
      icon={<FaChartLine />} 
      label="Research & Analytics" 
      active={pathname.startsWith('/analytics')} 
    />
    <NavItem 
      href="/clinic-profile" 
      icon={<FaClinicMedical />} 
      label="Clinic Profile" 
      active={pathname.startsWith('/clinic-profile')} 
    />
  </>
);

export default function DashboardLayout({ children, userRole = 'PATIENT' }: DashboardLayoutProps) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // Determine which role's navigation to show
  const renderRoleNavigation = () => {
    switch (userRole) {
      case 'PRACTITIONER':
        return <DoctorNavigation pathname={pathname} />;
      case 'CLINIC':
        return <ClinicNavigation pathname={pathname} />;
      case 'PATIENT':
      default:
        return <PatientNavigation pathname={pathname} />;
    }
  };

  // Get title based on user role
  const getRoleTitle = () => {
    switch (userRole) {
      case 'PRACTITIONER':
        return 'Doctor Dashboard';
      case 'CLINIC':
        return 'Clinic Management';
      case 'PATIENT':
      default:
        return 'Patient Dashboard';
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Mobile sidebar toggle */}
      <button
        className="fixed z-30 bottom-4 right-4 p-3 rounded-full bg-blue-600 text-white lg:hidden"
        onClick={toggleSidebar}
      >
        {sidebarOpen ? <FaTimes /> : <FaBars />}
      </button>

      {/* Sidebar */}
      <aside 
        className={`fixed inset-y-0 left-0 z-20 w-64 transform transition-transform duration-300 ease-in-out bg-white border-r border-gray-200 lg:relative lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-center h-16 border-b border-gray-200">
            <Link href="/dashboard" className="flex items-center gap-2">
              <span className="text-xl font-bold text-blue-600">AI Homeopathy</span>
            </Link>
          </div>

          {/* Role indicator */}
          <div className="bg-blue-50 px-4 py-2 border-b border-gray-200">
            <span className="text-sm font-medium text-blue-800">
              {getRoleTitle()}
            </span>
          </div>

          {/* Navigation */}
          <nav className="flex-1 py-4 px-2 space-y-1 overflow-y-auto">
            {renderRoleNavigation()}
          </nav>

          {/* Bottom navigation */}
          <div className="py-4 px-2 border-t border-gray-200">
            <NavItem 
              href="/settings" 
              icon={<FaCog />} 
              label="Settings" 
              active={pathname === '/settings'} 
            />
            <NavItem 
              href="/auth/logout" 
              icon={<FaSignOutAlt />} 
              label="Logout" 
            />
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 h-16 flex items-center justify-between px-6">
          <h1 className="text-2xl font-semibold text-gray-800">
            {pathname === '/dashboard' && 'Dashboard'}
            {pathname.startsWith('/ai-assistant') && 'AI Health Assistant'}
            {pathname.startsWith('/image-analysis') && 'Smart Image Analysis'}
            {pathname.startsWith('/treatment-plans') && 'Treatment Plans'}
            {pathname.startsWith('/consultations') && 'Consultations'}
            {pathname.startsWith('/reminders') && 'Medicine Reminders'}
            {pathname.startsWith('/reports') && 'Health Reports'}
            {pathname.startsWith('/lifestyle') && 'Lifestyle Coach'}
            {pathname.startsWith('/sos') && 'Emergency SOS'}
            {pathname.startsWith('/patients') && 'Patients'}
            {pathname.startsWith('/ai-diagnosis') && 'AI-Assisted Diagnosis'}
            {pathname.startsWith('/prescriptions') && 'E-Prescriptions'}
            {pathname.startsWith('/follow-ups') && 'Follow-Ups'}
            {pathname.startsWith('/chatbot') && 'AI Chatbot'}
            {pathname.startsWith('/profile') && 'Doctor Profile'}
            {pathname.startsWith('/doctors') && 'Manage Doctors'}
            {pathname.startsWith('/appointments') && 'Appointments'}
            {pathname.startsWith('/patient-records') && 'Patient Records'}
            {pathname.startsWith('/billing') && 'Billing & Payments'}
            {pathname.startsWith('/inventory') && 'Medicine Inventory'}
            {pathname.startsWith('/analytics') && 'Research & Analytics'}
            {pathname.startsWith('/clinic-profile') && 'Clinic Profile'}
            {pathname === '/settings' && 'Settings'}
          </h1>
          <div className="flex items-center gap-4">
            <div className="relative">
              <span className="flex h-10 w-10 rounded-full bg-blue-100 items-center justify-center">
                <span className="text-blue-600 font-medium">
                  {userRole === 'PATIENT' ? 'P' : userRole === 'PRACTITIONER' ? 'D' : 'C'}
                </span>
              </span>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-10 bg-black bg-opacity-50 lg:hidden"
          onClick={toggleSidebar}
        />
      )}
    </div>
  );
} 