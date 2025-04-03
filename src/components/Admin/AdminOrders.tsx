import { useState, useEffect } from 'react';
import { collection, onSnapshot, doc, updateDoc, query, orderBy, Timestamp } from 'firebase/firestore';
import { db } from '../../services/firebase';
import { Order, OrderStatus } from '../../types/types';

const AdminOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, 'orders'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const ordersData = querySnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          items: data.items,
          customerName: data.customerName,
          address: data.address,
          contact: data.contact,
          paymentMethod: data.paymentMethod,
          status: data.status,
          finalTotal: data.finalTotal,
          changeAmount: data.changeAmount ?? null,
          createdAt: data.createdAt
        } as Order;
      });
      setOrders(ordersData);
      setLoading(false);
    });

    return () => unsubscribe(); // Cancela o listener ao desmontar
  }, []);

  const updateOrderStatus = async (orderId: string, status: OrderStatus) => {
    try {
      await updateDoc(doc(db, 'orders', orderId), { status });

      let message = '';
      switch (status) {
        case 'accepted':
          message = 'Olá! O seu pedido está em preparo. Em breve estará pronto para entrega. 🍔🚀';
          break;
        case 'completed':
          message = 'Seu pedido foi concluído e já saiu para entrega! 🛵💨 Obrigado por escolher nossos serviços!';
          break;
        case 'rejected':
          message = 'Infelizmente, seu pedido não pôde ser processado. 😞 Por favor, tente novamente.';
          break;
      }

      console.log(`Status atualizado: ${message}`);
    } catch (error) {
      console.error('Erro ao atualizar pedido:', error);
    }
  };

  const getStatusMessage = (status: OrderStatus) => {
    switch (status) {
      case 'accepted': return 'Em preparo';
      case 'completed': return 'Concluído';
      case 'rejected': return 'Rejeitado';
      default: return 'Pendente';
    }
  };

  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case 'accepted': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-yellow-100 text-yellow-800';
    }
  };

  if (loading) {
    return <div className="text-center py-8">Carregando pedidos...</div>;
  }

  if (orders.length === 0) {
    return <div className="text-center py-8">Nenhum pedido encontrado</div>;
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold mb-6">Pedidos Recebidos</h2>

      {orders.map(order => (
        <div key={order.id} className="border rounded-lg overflow-hidden">
          <div className={`p-4 ${getStatusColor(order.status)}`}>
            <div className="flex justify-between items-center">
              <div>
                <span className="font-bold">Pedido #{order.id ? order.id.substring(0, 8) : 'N/A'}</span>
                <span className="mx-2">•</span>
                <span>
                  {order.createdAt && order.createdAt instanceof Timestamp
                    ? new Date(order.createdAt.toMillis()).toLocaleString()
                    : 'Data inválida'}
                </span>
              </div>
              <span className="font-semibold">{getStatusMessage(order.status)}</span>
            </div>
          </div>

          <div className="p-4 bg-white">
            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <h4 className="font-bold mb-2">Itens</h4>
                <ul className="space-y-2">
                  {order.items && order.items.length > 0 ? (
                    order.items.map((item, index) => (
                      <li key={index} className="flex justify-between">
                        <span>{item.name}</span>
                        <span>R$ {item.price.toFixed(2)}</span>
                      </li>
                    ))
                  ) : (
                    <li className="text-gray-500">Nenhum item encontrado</li>
                  )}
                  <li className="flex justify-between">
                    <span>Taxa de Entrega:</span>
                    <span>R$ 5,00</span>
                  </li>
                </ul>
                <div className="border-t mt-2 pt-2 font-bold flex justify-between">
                  <span>Total:</span>
                  <span>R$ {order.finalTotal.toFixed(2)}</span>
                </div>
              </div>

              <div>
                <h4 className="font-bold mb-2">Cliente</h4>
                <p>{order.customerName}</p>
                <p>{order.address}</p>
                <p>{order.contact}</p>
                <p>Pagamento: {order.paymentMethod}</p>
                {order.paymentMethod === 'cash' && order.changeAmount ? (
                  <p>Troco para: R$ {order.changeAmount}</p>
                ) : null}
              </div>

              <div>
                <h4 className="font-bold mb-2">Ações</h4>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => order.id && updateOrderStatus(order.id, 'accepted')}
                    disabled={order.status !== 'pending'}
                    className={`px-3 py-1 rounded ${order.status === 'pending'
                      ? 'bg-blue-500 text-white hover:bg-blue-600 cursor-pointer'
                      : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                      }`}
                  >
                    Aceitar
                  </button>
                  <button
                    onClick={() => order.id && updateOrderStatus(order.id, 'completed')}
                    disabled={order.status !== 'accepted'}
                    className={`px-3 py-1 rounded ${order.status === 'accepted'
                      ? 'bg-green-500 text-white hover:bg-green-600 cursor-pointer'
                      : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                      }`}
                  >
                    Concluir
                  </button>
                  <button
                    onClick={() => order.id && updateOrderStatus(order.id, 'rejected')}
                    disabled={order.status !== 'pending'}
                    className={`px-3 py-1 rounded ${order.status === 'pending'
                      ? 'bg-red-500 text-white hover:bg-red-600 cursor-pointer'
                      : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                      }`}
                  >
                    Rejeitar
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AdminOrders;