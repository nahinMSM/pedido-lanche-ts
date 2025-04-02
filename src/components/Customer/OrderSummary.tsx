import { forwardRef } from 'react';
import { MenuItem } from '../../types/types';

interface OrderSummaryProps {
  cart: MenuItem[];
  removeFromCart: (index: number) => void;
  setShowForm: (show: boolean) => void;
}

const OrderSummary = forwardRef<HTMLDivElement, OrderSummaryProps>(
  ({ cart, removeFromCart, setShowForm }, ref) => {
    const total = cart.reduce((sum, item) => sum + item.price, 0);

    return (
      <div ref={ref} tabIndex={-1} className="bg-white p-6 rounded-lg shadow-md sticky top-4">
        <h2 className="text-xl font-bold mb-4 border-b-2 border-orange-500 pb-2">Seu Pedido</h2>

        {cart.length === 0 ? (
          <p className="text-gray-500">Seu carrinho está vazio</p>
        ) : (
          <>
            <ul className="mb-4 max-h-64 overflow-y-auto">
              {cart.map((item, index) => (
                <li key={index} className="flex justify-between items-center py-2 border-b border-gray-100">
                  <div>
                    <p className="font-medium">{item.name}</p>
                    <p className="text-sm text-gray-500">R$ {item.price.toFixed(2)}</p>
                  </div>
                  <button
                    onClick={() => removeFromCart(index)}
                    className="text-red-500 hover:text-red-700 cursor-pointer"
                  >
                    Remover
                  </button>
                </li>
              ))}
            </ul>

            <div className="border-t border-gray-200 pt-4 mb-4">
              <div className="flex justify-between font-bold text-lg">
                <span>Total:</span>
                <span>R$ {total.toFixed(2)}</span>
              </div>
            </div>

            <button
              onClick={() => setShowForm(true)}
              className="w-full py-2 bg-orange-500 text-white rounded-lg font-semibold hover:bg-orange-600 transition cursor-pointer"
              disabled={cart.length === 0}
            >
              Finalizar Pedido
            </button>
          </>
        )}
      </div>
    );
  }
);

export default OrderSummary;