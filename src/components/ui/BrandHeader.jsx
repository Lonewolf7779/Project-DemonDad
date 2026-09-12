import React from 'react';

export function BrandHeader({ stage }) {
  const getStatusDotClass = () => {
    switch (stage) {
      case 'ONLINE': return 'status-indicator-dot online';
      case 'ARC_STRIKE':
      case 'IGNITION': return 'status-indicator-dot arc';
      case 'DRL_INIT': return 'status-indicator-dot drl';
      default: return 'status-indicator-dot';
    }
  };

  const getStatusLabel = () => {
    switch (stage) {
      case 'ONLINE': return 'SYS: ONLINE // NOMINAL';
      case 'IGNITION': return 'SYS: IGNITION PULSE';
      case 'ARC_STRIKE': return 'SYS: ARC DISCHARGE';
      case 'DRL_INIT': return 'SYS: DRL AWAKEN';
      default: return 'SYS: STANDBY';
    }
  };

  return (
    <header className="brand-header">
      <div>
        <h1 className="brand-title">DEMONDAD</h1>
        <p className="brand-subtitle">GT1 PURSUIT // 6000K LASER OPTICS</p>
      </div>

      <div className="brand-badge">
        <span className={getStatusDotClass()}></span>
        <span>{getStatusLabel()}</span>
      </div>
    </header>
  );
}
