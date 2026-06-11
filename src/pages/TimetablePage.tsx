import { Timetable } from '../components/Timetable';

export function TimetablePage() {
  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-12">
      <div className="flex flex-col justify-between mb-4">
        <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight">University Timetable</h1>
        <p className="text-gray-400 mt-1">Review all active academic schedules.</p>
      </div>

      <Timetable />
    </div>
  );
}
