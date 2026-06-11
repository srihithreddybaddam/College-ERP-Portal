import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getTimetable, saveTimetable, type TimetableSlot } from '../utils/timetableDB';
import { Clock, Calendar, Edit2, Check } from 'lucide-react';

export function Timetable() {
  const { user } = useAuth();
  const [timetable, setTimetable] = useState<TimetableSlot[]>([]);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (user) {
      setTimetable(getTimetable(user.collegeName));
    }
  }, [user]);

  const canEdit = user?.role === 'Admin' || user?.role === 'Teacher';

  const handleSave = () => {
    if (user) {
      saveTimetable(timetable, user.collegeName);
    }
    setIsEditing(false);
  };

  const handleChange = (dayIndex: number, slotKey: keyof TimetableSlot, value: string) => {
    const updated = [...timetable];
    updated[dayIndex] = { ...updated[dayIndex], [slotKey]: value };
    setTimetable(updated);
  };

  const renderCell = (day: TimetableSlot, dayIndex: number, slotKey: keyof TimetableSlot) => {
    if (slotKey === 'lunch') return <div className="text-gray-500 font-medium italic">Lunch Break</div>;
    
    if (isEditing) {
      return (
        <input 
          type="text" 
          value={day[slotKey]} 
          onChange={(e) => handleChange(dayIndex, slotKey, e.target.value)}
          className="w-full bg-white/10 border border-white/20 rounded px-2 py-1 text-xs text-white focus:outline-none focus:border-primary"
        />
      );
    }
    
    const value = day[slotKey];
    if (value === 'Free Period') return <span className="text-gray-500 text-xs">Free</span>;
    return <span className="text-gray-200 text-xs font-medium leading-tight">{value}</span>;
  };

  if (timetable.length === 0) return null;

  return (
    <div className="glass-card p-6 mt-6 overflow-hidden relative">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <Calendar className="text-primary" size={24} />
          <h2 className="text-lg font-bold text-white">Weekly Class Timetable</h2>
        </div>
        {canEdit && (
          <button 
            onClick={isEditing ? handleSave : () => setIsEditing(true)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              isEditing ? 'bg-green-500 hover:bg-green-600 text-white shadow-[0_0_15px_rgba(34,197,94,0.3)]' : 'bg-primary/20 text-primary hover:bg-primary/30'
            }`}
          >
            {isEditing ? <><Check size={16} /> Save Changes</> : <><Edit2 size={16} /> Edit Timetable</>}
          </button>
        )}
      </div>

      <div className="overflow-x-auto pb-4 nav-scrollbar">
        <table className="w-full text-left min-w-[800px]">
          <thead>
            <tr className="bg-white/5 border-b border-white/10 text-gray-400 text-xs uppercase tracking-wider">
              <th className="p-4 font-semibold w-1/6">Day</th>
              <th className="p-4 font-semibold"><div className="flex items-center gap-1"><Clock size={12}/> 10:00 - 11:00</div></th>
              <th className="p-4 font-semibold"><div className="flex items-center gap-1"><Clock size={12}/> 11:00 - 12:00</div></th>
              <th className="p-4 font-semibold bg-white/5 text-center"><Clock size={12} className="inline mr-1"/> 12:00 - 1:00</th>
              <th className="p-4 font-semibold"><div className="flex items-center gap-1"><Clock size={12}/> 1:00 - 2:00</div></th>
              <th className="p-4 font-semibold"><div className="flex items-center gap-1"><Clock size={12}/> 2:00 - 3:00</div></th>
              <th className="p-4 font-semibold"><div className="flex items-center gap-1"><Clock size={12}/> 3:00 - 4:00</div></th>
              <th className="p-4 font-semibold"><div className="flex items-center gap-1"><Clock size={12}/> 4:00 - 5:00</div></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {timetable.map((day, idx) => (
              <tr key={idx} className="hover:bg-white-[0.02] transition-colors">
                <td className="p-4 text-sm font-bold text-gray-300 border-r border-white/5">{day.day}</td>
                <td className="p-4 border-r border-white/5">{renderCell(day, idx, 'slot1')}</td>
                <td className="p-4 border-r border-white/5">{renderCell(day, idx, 'slot2')}</td>
                <td className="p-4 bg-white/5 text-center border-r border-white/5">{renderCell(day, idx, 'lunch')}</td>
                <td className="p-4 border-r border-white/5">{renderCell(day, idx, 'slot3')}</td>
                <td className="p-4 border-r border-white/5">{renderCell(day, idx, 'slot4')}</td>
                <td className="p-4 border-r border-white/5">{renderCell(day, idx, 'slot5')}</td>
                <td className="p-4">{renderCell(day, idx, 'slot6')}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
