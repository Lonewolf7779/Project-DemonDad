import React from 'react';

export function TelemetryHUD({ stage, lightState }) {
  const projectorLumenPercent = lightState 
    ? Math.round((lightState.projectorIntensity || 0) * 100) 
    : 0;
  
  const arcVoltage = lightState && lightState.arcIntensity > 0.05
    ? `${Math.round(18 + lightState.arcIntensity * 6.5)} kV`
    : '12.6 V';

  return (
    <div className="hud-telemetry">
      <div className="telemetry-card">
        <div className="telemetry-label">POWER TRAIN / BUS</div>
        <div className="telemetry-value">
          {stage === 'ONLINE' ? '12.8V // STABILIZED' : `BALLAST: ${arcVoltage}`}
        </div>
      </div>

      <div className="telemetry-card">
        <div className="telemetry-label">OPTICS // LUMENS</div>
        <div className="telemetry-value">
          {stage === 'ONLINE' ? '100% // 6000K LASER' : `${projectorLumenPercent}% LUMEN OUTPUT`}
        </div>
      </div>
    </div>
  );
}
