import { useEffect, useRef, useState } from 'react';
import { collection, addDoc, serverTimestamp, where, query, getDocs } from 'firebase/firestore';
import { db } from '../services/firebase';
import type { Category, MenuItem as MenuItemType, Order, PaymentMethod } from '../types/types';

import MenuItem from '../components/Customer/MenuItem';
import OrderSummary from '../components/Customer/OrderSummary';
import OrderForm from '../components/Customer/OrderForm';

const CustomerPage = () => {
  const [cart, setCart] = useState<MenuItemType[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [orderStatus, setOrderStatus] = useState<string | null>(null);

  const orderSummaryRef = useRef<HTMLDivElement | null>(null);
  const orderStatusRef = useRef<HTMLDivElement | null>(null);

  const [menuItems, setMenuItems] = useState<{ [key in Category]: MenuItemType[] }>({
    sandwiches: [],
    drinks: [],
    extras: []
  });

  useEffect(() => {
    const fetchMenuItems = async () => {
      const q = query(
        collection(db, 'menuItems'),
        where('active', '==', true)
      );
      const querySnapshot = await getDocs(q);

      const items = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as MenuItemType));

      const organizedItems = {
        sandwiches: items.filter(item => item.category === 'sandwiches'),
        drinks: items.filter(item => item.category === 'drinks'),
        extras: items.filter(item => item.category === 'extras')
      };

      setMenuItems(organizedItems);
    };

    fetchMenuItems();
  }, []);

  const addToCart = (item: MenuItemType) => {
    setCart([...cart, item]);

    setTimeout(() => {
      if (orderSummaryRef.current) {
        orderSummaryRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
        orderSummaryRef.current.focus();
      }
    }, 100);
  };

  const removeFromCart = (index: number) => {
    const newCart = [...cart];
    newCart.splice(index, 1);
    setCart(newCart);
  };

  const submitOrder = async (customerInfo: {
    finalTotal: number;
    name: string;
    address: string;
    contact: string;
    paymentMethod: string;
    changeAmount?: number | null;
  }) => {
    try {
      const order: Order = {
        items: cart,
        customerName: customerInfo.name,
        address: customerInfo.address,
        contact: customerInfo.contact,
        paymentMethod: customerInfo.paymentMethod as PaymentMethod,
        changeAmount: customerInfo.changeAmount,
        status: 'pending',
        finalTotal: customerInfo.finalTotal,
        total: cart.reduce((sum, item) => sum + item.price, 0),
        createdAt: serverTimestamp(),
      };

      await addDoc(collection(db, 'orders'), order);
      setOrderStatus('Pedido enviado com sucesso! Aguarde a confirmação.');
      setCart([]);
      setShowForm(false);

      setTimeout(() => {
        if (orderStatusRef.current) {
          orderStatusRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
          orderStatusRef.current.focus();
        }
      }, 100);
    } catch (error) {
      console.error('Erro ao enviar pedido:', error);
      setOrderStatus('Erro ao enviar pedido. Tente novamente.');

      setTimeout(() => {
        if (orderStatusRef.current) {
          orderStatusRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
          orderStatusRef.current.focus();
        }
      }, 100);
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      {orderStatus && (
        <div
          ref={orderStatusRef}
          className={`p-4 mb-6 rounded-lg ${orderStatus.includes('sucesso') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}
        >
          {orderStatus}
        </div>
      )}

      <h1 className="text-3xl font-bold mb-8 text-center">Cardápio</h1>

      <div className="grid md:grid-cols-3 sm:grid sm:grid-cols-3 grid-cols-1 gap-8">
        <div className="md:col-span-2">

          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-4 border-b-2 border-orange-500 pb-2">Sanduíches</h2>
            <div className="flex overflow-x-auto gap-4 max-w-full">
              {menuItems.sandwiches.map((item) => (
                <div key={item.id} className="shrink-0 w-[280px] mb-[15px]">
                  <MenuItem item={item} addToCart={addToCart} />
                </div>
              ))}
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-4 border-b-2 border-orange-500 pb-2">Bebidas</h2>
            <div className="flex overflow-x-auto gap-4 max-w-full">
              {menuItems.drinks.map(item => (
                <div key={item.id} className="flex-shrink-0 w-[280px] mb-[15px]">
                  <MenuItem item={item} addToCart={addToCart} />
                </div>
              ))}
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-4 border-b-2 border-orange-500 pb-2">Adicionais</h2>
            <div className="flex overflow-x-auto gap-4 max-w-full">
              {menuItems.extras.map(item => (
                <div key={item.id} className="flex-shrink-0 w-[280px] mb-[15px]">
                  <MenuItem item={item} addToCart={addToCart} />
                </div>
              ))}
            </div>
          </section>
        </div>

        <OrderSummary
          ref={orderSummaryRef}
          cart={cart}
          removeFromCart={removeFromCart}
          setShowForm={setShowForm}
        />
      </div>

      {showForm && (
        <OrderForm
          onSubmit={submitOrder}
          onCancel={() => setShowForm(false)}
          total={cart.reduce((sum, item) => sum + item.price, 0)}
        />
      )}
    </div>
  );
};

export default CustomerPage;