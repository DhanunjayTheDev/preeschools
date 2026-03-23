import { useEffect, useState } from 'react';
import useStudentStore from '../../stores/studentStore';
import useAuthStore from '../../stores/authStore';
import { DropdownTable, Loading } from '../../components/ui';

export default function TeacherStudents() {
  const { user } = useAuthStore();
  const { students, loading, fetchStudents } = useStudentStore();
  const assignedClasses = user?.assignedClasses || [];
  const [selectedClass, setSelectedClass] = useState(
    assignedClasses.length > 0
      ? (typeof assignedClasses[0] === 'string' ? assignedClasses[0] : assignedClasses[0].className)
      : ''
  );
  const [search, setSearch] = useState('');

  useEffect(() => {
    if (selectedClass) fetchStudents({ className: selectedClass });
  }, [selectedClass, fetchStudents]);

  const filtered = students.filter(s =>
    !search || `${s.firstName} ${s.lastName}`.toLowerCase().includes(search.toLowerCase()) ||
    s.studentId?.toLowerCase().includes(search.toLowerCase())
  );

  if (assignedClasses.length === 0) return (
    <div className="space-y-5">
      <h1 className="text-2xl font-bold text-gray-900">My Students</h1>
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-12 text-center">
        <div className="text-4xl mb-3">🏫</div>
        <p className="font-semibold text-gray-700">No classes assigned</p>
        <p className="text-sm text-gray-500 mt-1">Contact admin to get class assignments</p>
      </div>
    </div>
  );

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Students</h1>
          <p className="text-sm text-gray-500 mt-0.5">{filtered.length} students in {selectedClass}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3">
        <div className="relative">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text" placeholder="Search students..."
            value={search} onChange={e => setSearch(e.target.value)}
            className="pl-9 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-56"
          />
        </div>
        <DropdownTable
          label="Select Class"
          value={selectedClass}
          onChange={(val) => setSelectedClass(val)}
          placeholder="Choose a class"
          icon="🏫"
          searchable={false}
          columns={[{ key: 'label', label: 'Class Name' }]}
          options={assignedClasses.map(c => {
            const className = typeof c === 'string' ? c : c.className;
            return {
              value: className,
              label: className,
              searchFields: [className]
            };
          })}
        />
      </div>

      {loading ? (
        <div className="flex justify-center py-16"><Loading /></div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-12 text-center">
          <div className="text-4xl mb-3">👥</div>
          <p className="text-gray-500">No students found</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead><tr className="bg-gray-50 border-b border-gray-100">
              {['Student','ID','Class','Section','Parent','Contact','Status'].map(h => (
                <th key={h} className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
              ))}
            </tr></thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map(s => (
                <tr key={s._id} className="hover:bg-gray-50/60 transition-colors">
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-violet-100 flex items-center justify-center text-violet-700 font-bold text-xs flex-shrink-0">
                        {s.firstName?.[0]}{s.lastName?.[0]}
                      </div>
                      <span className="font-semibold text-gray-900">{s.firstName} {s.lastName}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 font-mono text-xs text-gray-500">{s.studentId}</td>
                  <td className="px-5 py-3.5 text-gray-600">{s.className}</td>
                  <td className="px-5 py-3.5 text-gray-600">{s.section || '-'}</td>
                  <td className="px-5 py-3.5 text-gray-600">{s.fatherName || '-'}</td>
                  <td className="px-5 py-3.5 text-gray-600">{s.fatherPhone || s.motherPhone || '-'}</td>
                  <td className="px-5 py-3.5">
                    <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                      s.status === 'ACTIVE' ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-500'
                    }`}>{s.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
