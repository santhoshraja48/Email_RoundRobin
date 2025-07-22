import React, { useState } from 'react';
import InputGet from './InputGet';
import ToEmail from './ToEmail';

const Navigation = () => {
  const [activeTab, setActiveTab] = useState('input-get');
  const [isCollapsed, setIsCollapsed] = useState(false);

  const handleFromEmails = () => {
    setActiveTab('input-get');
  };

  const handleToEmails = () => {
    setActiveTab('to-email');
  };

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  const styles = {
    container: {
      display: 'flex',
      height: '100vh',
      backgroundColor: '#f8fafc'
    },
    sidebar: {
      width: isCollapsed ? '70px' : '280px',
      backgroundColor: '#ffffff',
      borderRight: '1px solid #e2e8f0',
      transition: 'width 0.3s ease',
      display: 'flex',
      flexDirection: 'column',
      position: 'fixed',
      height: '100vh',
      zIndex: 1000
    },
    header: {
      backgroundColor: '#1e40af',
      padding: '1rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      color: '#ffffff'
    },
    brand: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.75rem',
      fontSize: '1.125rem',
      fontWeight: '600'
    },
    brandIcon: {
      width: '32px',
      height: '32px',
      backgroundColor: '#8b5cf6',
      borderRadius: '6px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '1rem'
    },
    toggleButton: {
      backgroundColor: 'transparent',
      border: 'none',
      color: '#ffffff',
      cursor: 'pointer',
      padding: '0.25rem',
      borderRadius: '4px',
      transition: 'background-color 0.2s'
    },
    progressSection: {
      backgroundColor: '#f3e8ff',
      padding: '1rem',
      borderBottom: '1px solid #e2e8f0'
    },
    progressText: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      fontSize: '0.875rem',
      fontWeight: '500',
      color: '#7c3aed',
      marginBottom: '0.5rem'
    },
    progressBar: {
      width: '100%',
      height: '6px',
      backgroundColor: '#e2e8f0',
      borderRadius: '3px',
      overflow: 'hidden'
    },
    progressFill: {
      width: '25%',
      height: '100%',
      backgroundColor: '#7c3aed',
      transition: 'width 0.3s ease'
    },
    navMenu: {
      flex: 1,
      padding: '1rem 0',
      overflowY: 'auto'
    },
    navItem: {
      display: 'flex',
      alignItems: 'center',
      padding: '0.75rem 1rem',
      cursor: 'pointer',
      transition: 'background-color 0.2s',
      color: '#374151',
      textDecoration: 'none',
      borderLeft: '3px solid transparent'
    },
    navItemActive: {
      backgroundColor: '#f1f5f9',
      borderLeftColor: '#3b82f6',
      color: '#1f2937'
    },
    navIcon: {
      width: '20px',
      height: '20px',
      marginRight: isCollapsed ? '0' : '0.75rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '1rem',
      color: '#6b7280'
    },
    navText: {
      fontSize: '0.875rem',
      fontWeight: '500',
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      opacity: isCollapsed ? '0' : '1',
      transition: 'opacity 0.3s ease'
    },
    badge: {
      backgroundColor: '#8b5cf6',
      color: '#ffffff',
      fontSize: '0.75rem',
      padding: '0.125rem 0.375rem',
      borderRadius: '0.25rem',
      marginLeft: 'auto',
      opacity: isCollapsed ? '0' : '1',
      transition: 'opacity 0.3s ease'
    },
    mainContent: {
      flex: 1,
      marginLeft: isCollapsed ? '70px' : '280px',
      transition: 'margin-left 0.3s ease',
      padding: '2rem',
      backgroundColor: '#f8fafc'
    }
  };

  const navItems = [
    { id: 'input-get', label: 'From Email Accounts', icon: '📧', active: activeTab === 'input-get' },
    { id: 'to-email', label: 'To Email Accounts', icon: '📤', active: activeTab === 'to-email' },
  ];

  const handleNavClick = (id) => {
    console.log('Navigation clicked:', id);
    setActiveTab(id);
    
    if (id === 'input-get') {
      handleFromEmails();
    } else if (id === 'to-email') {
      handleToEmails();
    }
    // Add other navigation handlers as needed
  };

  return (
    <div style={styles.container}>
      {/* Sidebar */}
      <div style={styles.sidebar}>

        {/* Navigation Menu */}
        <div style={styles.navMenu}>
          {navItems.map((item) => (
            <div
              key={item.id}
              style={{
                ...styles.navItem,
                ...(item.active ? styles.navItemActive : {})
              }}
              onClick={() => handleNavClick(item.id)}
            >
              <div style={styles.navIcon}>{item.icon}</div>
              <span style={styles.navText}>{item.label}</span>
              {item.badge && <span style={styles.badge}>{item.badge}</span>}
            </div>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div style={styles.mainContent}>
        {activeTab === 'input-get' && <InputGet />}
        {activeTab === 'to-email' && <ToEmail />}
        {activeTab === 'inbox' && <div>Master Inbox Content</div>}
        {activeTab === 'crm' && <div>CRM Content</div>}
        {activeTab === 'integrations' && <div>Integrations Content</div>}
        {activeTab === 'analytics' && <div>Global Analytics Content</div>}
        {activeTab === 'delivery' && <div>Smart Delivery Content</div>}
        {activeTab === 'servers' && <div>SmartServers Content</div>}
        {activeTab === 'university' && <div>Smartlead University Content</div>}
        {activeTab === 'events' && <div>Smartlead Events Content</div>}
        {activeTab === 'help' && <div>Help Center Content</div>}
      </div>
    </div>
  );
};

export default Navigation;
