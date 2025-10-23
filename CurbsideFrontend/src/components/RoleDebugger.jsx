import { useAuth } from '../Root';

const RoleDebugger = () => {
  const { user, hasRole } = useAuth();

  if (!user) {
    return (
      <div className="fixed top-4 left-4 bg-red-100 border border-red-400 p-4 rounded-lg shadow-lg z-50">
        <h3 className="font-bold text-red-800">Debug: No User</h3>
        <p className="text-red-600">User is not logged in</p>
      </div>
    );
  }

  return (
    <div className="fixed top-4 left-4 bg-blue-100 border border-blue-400 p-4 rounded-lg shadow-lg z-50 max-w-xs">
      <h3 className="font-bold text-blue-800 mb-2">Debug: User Roles</h3>
      <div className="text-sm text-blue-700">
        <p><strong>UserName:</strong> {user.userName || user.name}</p>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Role:</strong> {user.role}</p>
        <p><strong>Roles Array:</strong> {JSON.stringify(user.roles || 'none')}</p>
        <hr className="my-2" />
        <p><strong>hasRole('admin'):</strong> {hasRole('admin') ? '✅' : '❌'}</p>
        <p><strong>hasRole('vendor'):</strong> {hasRole('vendor') ? '✅' : '❌'}</p>
        <p><strong>hasRole('appuser'):</strong> {hasRole('appuser') ? '✅' : '❌'}</p>
      </div>
    </div>
  );
};

export default RoleDebugger;