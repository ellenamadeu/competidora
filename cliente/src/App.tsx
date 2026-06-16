import { BrowserRouter, Routes, Route } from 'react-router-dom';
import DashboardLayout from './layouts/DashboardLayout';
import CategoriesPage from './pages/CategoriesPage';
import ProductsPage from './pages/ProductsPage';
import ClientsPage from './pages/ClientsPage';
import ClientDetailsPage from './pages/ClientDetailsPage';
import HomePage from './pages/HomePage';
import OrdersPage from './pages/OrdersPage';
import OrderDetailsPage from './pages/OrderDetailsPage';
import OrderTrackingPage from './pages/OrderTrackingPage';
import AgendaPage from './pages/AgendaPage';
import CaixaPage from './pages/CaixaPage';
import DespesasPage from './pages/DespesasPage';
import FornecedoresPage from './pages/FornecedoresPage';
import FuncionariosPage from './pages/FuncionariosPage';
import LoginPage from './pages/LoginPage';
import RequireAuth from './components/RequireAuth';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rota pública de Login */}
        <Route path="/login" element={<LoginPage />} />

        {/* Rotas protegidas sob DashboardLayout */}
        <Route element={<RequireAuth requiredLevel={1} />}>
          <Route path="/" element={<DashboardLayout />}>
            <Route index element={<HomePage />} />
            <Route path="clientes" element={<ClientsPage />} />
            <Route path="clientes/:id" element={<ClientDetailsPage />} />
            
            <Route path="pedidos" element={<OrdersPage />} />
            <Route path="pedidos/:id" element={<OrderDetailsPage />} />

            <Route path="agenda" element={<AgendaPage />} />
            <Route path="despesas" element={<DespesasPage />} />
            <Route path="fornecedores" element={<FornecedoresPage />} />
            
            <Route path="categorias" element={<CategoriesPage />} />
            <Route path="produtos" element={<ProductsPage />} />

            {/* Rotas exclusivas de nível Administrador (Nível 2) */}
            <Route element={<RequireAuth requiredLevel={2} />}>
              <Route path="caixa" element={<CaixaPage />} />
              <Route path="funcionarios" element={<FuncionariosPage />} />
            </Route>
          </Route>
        </Route>

        {/* Rota pública de Acompanhamento (Cliente final) */}
        <Route path="/acompanhamento/:id" element={<OrderTrackingPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
