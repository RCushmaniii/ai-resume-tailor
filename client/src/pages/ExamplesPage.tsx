// File: src/pages/ExamplesPage.tsx
import { useState, useEffect } from 'react';
import ExampleComponent from '../examples/ExampleComponent';
import MswAlert from '../components/ui/MswAlert';
import { useTranslation } from 'react-i18next';

interface User {
  id: string;
  firstName: string;
  lastName: string;
}

interface ExampleUser {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'user';
}

export function ExamplesPage() {
  const { t } = useTranslation();
  const [user, setUser] = useState<User | null>(null);
  const [users, setUsers] = useState<ExampleUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  // MSW status check removed as we're using a demo alert instead

  // Fetch user data from the API
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch('/api/user');
        
        if (!response.ok) {
          throw new Error(`API error: ${response.status}`);
        }
        
        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
          throw new Error(`Expected JSON response but got ${contentType}`);
        }
        
        const data = await response.json();
        setUser(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : t('markdown.errors.unknown'));
      }
    };

    fetchUser();
  }, [t]);

  // Fetch example users data from the API
  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const response = await fetch('/api/users');
        
        if (!response.ok) {
          throw new Error(`API error: ${response.status}`);
        }
        
        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
          throw new Error(`Expected JSON response but got ${contentType}`);
        }
        
        const data = await response.json();
        setUsers(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : t('markdown.errors.unknown'));
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [t]);

  // Define the cobalt blue color for use in styles
  const cobaltBlue = '#0047ab';
  
  return (
    <div className="space-y-12">
      <div>
        <h1 className="text-3xl font-bold mb-2" style={{ color: cobaltBlue }}>{t('examples.title')}</h1>
        <p className="text-gray-600 dark:text-gray-400 mb-6">{t('examples.description')}</p>
      </div>
      
      {/* MSW Status Banner */}
      <MswAlert />
      
      <section className="space-y-6 bg-white p-6 rounded-lg shadow-sm border border-gray-100">
        <h2 className="text-2xl font-semibold border-b pb-2" style={{ color: cobaltBlue }}>{t('examples.sections.uiDemo.title')}</h2>
        <p className="text-gray-600">{t('examples.sections.uiDemo.description')}</p>
        <ExampleComponent 
          title={t('examples.sections.uiDemo.exampleTitle')} 
          description={t('examples.sections.uiDemo.exampleDescription')}
        />
      </section>
      
      <section className="space-y-6 bg-white p-6 rounded-lg shadow-sm border border-gray-100">
        <h2 className="text-2xl font-semibold border-b pb-2" style={{ color: cobaltBlue }}>{t('examples.sections.apiSingle.title')}</h2>
        <p className="text-gray-600">{t('examples.sections.apiSingle.description')}</p>
        {error && <p className="text-red-500">{t('examples.errorPrefix', { message: error })}</p>}
        {user ? (
          <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
            <h3 className="text-lg font-medium mb-3" style={{ color: cobaltBlue }}>{t('examples.sections.apiSingle.userProfile')}</h3>
            <div className="space-y-2">
              <div className="flex items-center">
                <p className="text-gray-500 w-20">{t('examples.sections.apiSingle.id')}</p>
                <p className="font-medium">{user.id}</p>
              </div>
              <div className="flex items-center">
                <p className="text-gray-500 w-20">{t('examples.sections.apiSingle.name')}</p>
                <p className="font-medium">{user.firstName} {user.lastName}</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center h-32 bg-gray-50 rounded-md">
            <p className="text-gray-500">{t('examples.sections.apiSingle.loadingUser')}</p>
          </div>
        )}
      </section>
      
      <section className="space-y-6 bg-white p-6 rounded-lg shadow-sm border border-gray-100">
        <h2 className="text-2xl font-semibold border-b pb-2" style={{ color: cobaltBlue }}>{t('examples.sections.apiTable.title')}</h2>
        <p className="text-gray-600">{t('examples.sections.apiTable.description')}</p>
        {error && <p className="text-red-500">{t('examples.errorPrefix', { message: error })}</p>}
        {loading ? (
          <div className="flex items-center justify-center h-32 bg-gray-50 rounded-md">
            <p className="text-gray-500">{t('examples.sections.apiTable.loadingUsers')}</p>
          </div>
        ) : (
          <div className="rounded-md overflow-hidden border border-gray-200">
            <table className="min-w-full divide-y divide-gray-200">
              <thead style={{ backgroundColor: '#f8fafc' }}>
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: cobaltBlue }}>{t('examples.sections.apiTable.headers.id')}</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: cobaltBlue }}>{t('examples.sections.apiTable.headers.name')}</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: cobaltBlue }}>{t('examples.sections.apiTable.headers.email')}</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: cobaltBlue }}>{t('examples.sections.apiTable.headers.role')}</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">{user.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">{user.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">{user.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full" 
                        style={{ 
                          backgroundColor: user.role === 'admin' ? '#e0e7ff' : '#dcfce7',
                          color: user.role === 'admin' ? cobaltBlue : '#166534'
                        }}>
                        {user.role}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}

export default ExamplesPage;
