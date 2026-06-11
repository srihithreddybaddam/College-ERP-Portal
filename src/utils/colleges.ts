export const COLLEGES = [
  'Sandip University, Nashik',
  'IIT Hyderabad',
  'IIT Bombay',
  'IIT Delhi',
  'NIT Warangal',
  'NIT Trichy',
  'JNTU Hyderabad',
  'Osmania University',
  'Vasavi College of Engineering',
  'Chaitanya Bharathi Institute of Technology (CBIT)',
  'VNR VJIET',
  'Malla Reddy Engineering College',
  'Gokaraju Rangaraju Institute of Engineering and Technology (GRIET)'
] as const;

export type CollegeName = typeof COLLEGES[number];
