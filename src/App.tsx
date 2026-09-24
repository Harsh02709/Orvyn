import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/layout/Header';
import { Sidebar } from './components/layout/Sidebar';
import { MobileBottomNav } from './components/layout/MobileBottomNav';
import { OverviewView } from './components/views/OverviewView';
import { DocumentsView } from './components/views/DocumentsView';
import { DistributeView } from './components/views/DistributeView';
import { RecipientsView } from './components/views/RecipientsView';
import { DecryptionEventsView } from './components/views/DecryptionEventsView';
import { AuditLedgerView } from './components/views/AuditLedgerView';
import { ForensicAnalysisView } from './components/views/ForensicAnalysisView';
import { KeyManagementView } from './components/views/KeyManagementView';
import { SecurityView } from './components/views/SecurityView';
import { ReportsView } from './components/views/ReportsView';
import { SettingsView } from './components/views/SettingsView';
import { DecryptModal } from './components/modals/DecryptModal';
import { DocumentDetailModal } from './components/modals/DocumentDetailModal';
import { WatermarkInspectorModal } from './components/modals/WatermarkInspectorModal';
import { DemoTourModal } from './components/modals/DemoTourModal';

const AppContent: React.FC = () => {
  const { activeView } = useApp();

  const renderActiveView = () => {
    switch (activeView) {
      case 'overview':
        return <OverviewView />;
      case 'documents':
        return <DocumentsView />;
      case 'distribute':
        return <DistributeView />;
      case 'recipients':
        return <RecipientsView />;
      case 'events':
        return <DecryptionEventsView />;
      case 'ledger':
        return <AuditLedgerView />;
      case 'forensics':
        return <ForensicAnalysisView />;
      case 'keys':
        return <KeyManagementView />;
      case 'security':
        return <SecurityView />;
      case 'reports':
        return <ReportsView />;
      case 'settings':
        return <SettingsView />;
      default:
        return <OverviewView />;
    }
  };

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-[#080c14] text-slate-100 font-sans">
      <Header />
      <div className="flex flex-1 min-h-0 overflow-hidden relative">
        <Sidebar />
        <main className="flex-1 min-h-0 overflow-y-auto p-3 sm:p-5 lg:p-6 bg-[#080c14]">
          <div className="max-w-7xl mx-auto pb-20 lg:pb-12">
            {renderActiveView()}
          </div>
        </main>
      </div>

      {/* Mobile Sticky Bottom Navigation */}
      <MobileBottomNav />

      {/* Global Modals */}
      <DecryptModal />
      <DocumentDetailModal />
      <WatermarkInspectorModal />
      <DemoTourModal />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
