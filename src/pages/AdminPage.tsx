import { useState } from 'react';

import AdminOrders from '../components/Admin/AdminOrders';
import AdminControl from '../components/Admin/AdminControl';
import AdminStats from '../components/Admin/AdminStats';

const AdminPage = () => {
  const [activeTab, setActiveTab] = useState<'orders' | 'control' | 'stats'>('orders');

  return (
    <div className="max-w-6xl mx-auto">
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-4">Painel Admin</h1>
      </div>

      <div className="flex border-b border-gray-200 mb-6">
        <button
          onClick={() => setActiveTab('orders')}
          className={`px-4 py-2 font-medium cursor-pointer ${activeTab === 'orders' ? 'text-orange-500 border-b-2 border-orange-500' : 'text-gray-500'}`}
        >
          Pedidos
        </button>
        <button
          onClick={() => setActiveTab('control')}
          className={`px-4 py-2 font-medium cursor-pointer ${activeTab === 'control' ? 'text-orange-500 border-b-2 border-orange-500' : 'text-gray-500'}`}
        >
          Controle de Itens
        </button>
        <button
          onClick={() => setActiveTab('stats')}
          className={`px-4 py-2 font-medium cursor-pointer ${activeTab === 'stats' ? 'text-orange-500 border-b-2 border-orange-500' : 'text-gray-500'}`}
        >
          Estatísticas
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        {activeTab === 'orders' && <AdminOrders />}
        {activeTab === 'control' && <AdminControl />}
        {activeTab === 'stats' && <AdminStats />}
      </div>
    </div>
  );
};

export default AdminPage;