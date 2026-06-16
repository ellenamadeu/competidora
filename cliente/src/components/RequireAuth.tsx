import { Navigate, Outlet } from 'react-router-dom';

export default function RequireAuth({ requiredLevel = 1 }: { requiredLevel?: number }) {
  const token = localStorage.getItem('token');
  const userJson = localStorage.getItem('user');

  if (!token || !userJson) {
    return <Navigate to="/login" replace />;
  }

  try {
    const user = JSON.parse(userJson);
    const userLevel = Number(user.acesso || 0);

    if (userLevel < requiredLevel) {
      // Se não tiver o nível requerido (ex: tentando acessar Caixa/Staff sendo Operador), 
      // redireciona para a página inicial.
      return <Navigate to="/" replace />;
    }

    return <Outlet />;
  } catch (error) {
    localStorage.clear();
    return <Navigate to="/login" replace />;
  }
}
