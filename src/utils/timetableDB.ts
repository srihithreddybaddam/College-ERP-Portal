export interface TimetableSlot {
  day: string;
  slot1: string; // 10:00 - 11:00
  slot2: string; // 11:00 - 12:00
  lunch: string; // 12:00 - 1:00 (Always Break)
  slot3: string; // 1:00 - 2:00
  slot4: string; // 2:00 - 3:00
  slot5: string; // 3:00 - 4:00
  slot6: string; // 4:00 - 5:00
}

const defaultTimetable: TimetableSlot[] = [
  { day: 'Monday', slot1: 'AI (C10)', slot2: 'DBMS (C03)', lunch: 'Lunch Break', slot3: 'AI LAB (S128)', slot4: 'AI LAB (S128)', slot5: 'SDPM (C18)', slot6: 'Strategic Com (C17)' },
  { day: 'Tuesday', slot1: 'Microcontroller (C25)', slot2: 'Strategic Com (C17)', lunch: 'Lunch Break', slot3: 'DBMS LAB (S127)', slot4: 'DBMS LAB (S127)', slot5: 'AI (C10)', slot6: 'SDPM (C18)' },
  { day: 'Wednesday', slot1: 'SDPM (C18)', slot2: 'Microcontroller (C25)', lunch: 'Lunch Break', slot3: 'DBMS (C03)', slot4: 'Strategic Com (C17)', slot5: 'SDPM LAB (F124)', slot6: 'SDPM LAB (F124)' },
  { day: 'Thursday', slot1: 'Strategic Com (C17)', slot2: 'AI (C10)', lunch: 'Lunch Break', slot3: 'Microcontroller (C25)', slot4: 'DBMS (C03)', slot5: 'Micro Controller LAB (F128)', slot6: 'Micro Controller LAB (F128)' },
  { day: 'Friday', slot1: 'DBMS (C03)', slot2: 'SDPM (C18)', lunch: 'Lunch Break', slot3: 'AI (C10)', slot4: 'Microcontroller (C25)', slot5: 'Free Period', slot6: 'Free Period' },
  { day: 'Saturday', slot1: 'Strategic Com (C17)', slot2: 'DBMS (C03)', lunch: 'Lunch Break', slot3: 'SDPM (C18)', slot4: 'Free Period', slot5: 'Free Period', slot6: 'Free Period' }
];

export const getTimetable = (collegeName?: string): TimetableSlot[] => {
  if (!collegeName) return defaultTimetable;
  
  const store = localStorage.getItem('timetableDB_dict');
  if (store) {
    const dict = JSON.parse(store);
    if (dict[collegeName]) {
      return dict[collegeName];
    }
  }
  
  const legacyStore = localStorage.getItem('timetableDB');
  if (legacyStore) return JSON.parse(legacyStore);
  
  return defaultTimetable;
};

export const saveTimetable = (data: TimetableSlot[], collegeName?: string) => {
  if (collegeName) {
    const store = localStorage.getItem('timetableDB_dict');
    const dict = store ? JSON.parse(store) : {};
    dict[collegeName] = data;
    localStorage.setItem('timetableDB_dict', JSON.stringify(dict));
  } else {
    localStorage.setItem('timetableDB', JSON.stringify(data));
  }
};

