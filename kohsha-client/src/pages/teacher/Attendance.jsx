import useAuthStore from '../../stores/authStore';

export default function Attendance() {
  const { user } = useAuthStore();
  const assignedClasses = user?.assignedClasses || [];

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Attendance</h1>
        <p className="text-sm text-gray-500 mt-0.5">Mark and track student attendance</p>
      </div>

      <div className="bg-white rounded-2xl border border-dashed border-gray-200 shadow-sm p-12">
        <div className="flex flex-col items-center justify-center text-center">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-violet-100 to-purple-100 flex items-center justify-center text-4xl mb-5">
            ✅
          </div>
          <h3 className="text-lg font-bold text-gray-900 mb-2">Attendance Module</h3>
          <p className="text-gray-500 max-w-sm text-sm leading-relaxed">
            Attendance tracking is coming soon. You'll be able to mark daily attendance
            {assignedClasses.length > 0 && ` for your classes:`}
          </p>
          {assignedClasses.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-4 justify-center">
              {assignedClasses.map(cls => {
                const className = typeof cls === 'string' ? cls : cls.className;
                return (
                  <span key={typeof cls === 'string' ? cls : cls._id} className="px-3 py-1.5 bg-violet-50 text-violet-700 border border-violet-200 rounded-full text-sm font-semibold">
                    🏫 {className}
                  </span>
                );
              })}
            </div>
          )}
          <div className="mt-6 px-4 py-3 bg-amber-50 border border-amber-200 rounded-xl text-sm text-amber-700 font-medium">
            🛠️ Feature in development — stay tuned!
          </div>
        </div>
      </div>
    </div>
  );
}
