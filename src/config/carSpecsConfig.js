/**
 * Project DEMONDAD - Vehicle Specifications Configuration (Scene 2)
 */

export const CAR_SPECS_CONFIG = {
  brand: 'DEMONDAD',
  model: 'DEMON // GT1 PURSUIT',
  subtitle: 'CHASSIS NO. 001 // SPEC: TRACK PURSUIT',
  tagline: 'NATURALLY ASPIRATED V12 PURSUIT MACHINE',

  heroSpecs: [
    { id: 'accel', label: '0 – 100 KM/H', value: '2.9', unit: 'SEC' },
    { id: 'power', label: 'POWER', value: '789', unit: 'HP' },
    { id: 'speed', label: 'TOP SPEED', value: '340', unit: 'KM/H' },
    { id: 'engine', label: 'ENGINE', value: '6.3L V12', unit: 'NATURALLY ASPIRATED' },
  ],

  specCategories: [
    {
      category: 'POWERTRAIN',
      items: [
        { label: 'Engine Architecture', value: '65° Naturally Aspirated V12' },
        { label: 'Total Displacement', value: '6,262 cc (6.3 Liters)' },
        { label: 'Maximum Power', value: '789 HP (588 kW) @ 8,500 RPM' },
        { label: 'Peak Torque', value: '718 Nm (530 lb-ft) @ 7,000 RPM' },
        { label: 'Engine Redline', value: '8,900 RPM' },
        { label: 'Exhaust System', value: 'Titanium Inconel Equal-Length Headers' },
      ],
    },
    {
      category: 'DRIVETRAIN & CHASSIS',
      items: [
        { label: 'Transmission', value: '7-Speed Dual-Clutch F1 Paddle Shift' },
        { label: 'Drivetrain', value: 'Rear-Wheel Drive (RWD) with E-Diff 3' },
        { label: 'Chassis Type', value: 'Full Carbon Fiber Monocoque' },
        { label: 'Braking System', value: 'Brembo Carbon-Ceramic Matrix (CCM)' },
        { label: 'Front / Rear Discs', value: '398 mm Front / 360 mm Rear' },
        { label: 'Suspension', value: 'Magnetorheological Dual-Coil Dampers' },
      ],
    },
    {
      category: 'PERFORMANCE & WEIGHT',
      items: [
        { label: 'Acceleration 0–100 km/h', value: '2.9 seconds' },
        { label: 'Acceleration 0–200 km/h', value: '7.9 seconds' },
        { label: 'Top Speed', value: '340+ km/h (211+ mph)' },
        { label: 'Dry Weight', value: '1,525 kg (3,362 lbs)' },
        { label: 'Weight Distribution', value: '46% Front / 54% Rear' },
        { label: 'Downforce @ 200 km/h', value: '123 kg (Active Aero Active)' },
      ],
    },
  ],
};
