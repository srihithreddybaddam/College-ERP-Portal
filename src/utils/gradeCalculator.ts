export function calculateGrade(marks: number) {
  if (marks >= 91) return { grade: 'O', performance: 'Outstanding', color: 'text-cyan-400' };
  if (marks >= 81) return { grade: 'A+', performance: 'Excellent', color: 'text-blue-400' };
  if (marks >= 71) return { grade: 'A', performance: 'Very Good', color: 'text-green-400' };
  if (marks >= 61) return { grade: 'B+', performance: 'Good', color: 'text-emerald-400' };
  if (marks >= 55) return { grade: 'B', performance: 'Above Average', color: 'text-yellow-400' };
  if (marks >= 50) return { grade: 'C+', performance: 'Average', color: 'text-orange-400' };
  if (marks >= 40) return { grade: 'C', performance: 'Pass', color: 'text-gray-400' };
  return { grade: 'U', performance: 'Fail', color: 'text-red-500' };
}
