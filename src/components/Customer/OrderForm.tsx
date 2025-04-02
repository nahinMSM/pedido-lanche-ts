import { useState } from 'react';
import { PaymentMethod } from '../../types/types';

interface OrderFormProps {
  onSubmit: (data: {
    name: string;
    address: string;
    contact: string;
    paymentMethod: PaymentMethod;
    changeAmount?: number | null;
    finalTotal: number;
  }) => void;
  onCancel: () => void;
  total: number;
}

const paymentMethods = [
  { id: 'pix', name: 'PIX' },
  { id: 'credit', name: 'Cartão de Crédito' },
  { id: 'debit', name: 'Cartão de Débito' },
  { id: 'cash', name: 'Dinheiro' }
];

const OrderForm = ({ onSubmit, onCancel, total }: OrderFormProps) => {
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    contact: '',
    paymentMethod: 'pix' as PaymentMethod,
    changeAmount: 0,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: name === 'changeAmount' ? Number(value) || null : value }));
  };

  const deliveryFee = 5.00;
  const isCreditCard = formData.paymentMethod === 'credit';
  const isCash = formData.paymentMethod === 'cash';
  const creditCardFee = isCreditCard ? total * 0.02 : 0;
  const finalTotal = total + deliveryFee + creditCardFee;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      finalTotal,
      changeAmount: formData.paymentMethod === 'cash' ? Number(formData.changeAmount) || null : null
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-screen overflow-y-auto">
        <div className="p-6">
          <h2 className="text-2xl font-bold mb-4">Finalizar Pedido</h2>

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Nome</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-lg"
                required
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Endereço</label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-lg"
                required
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Contato para Confirmação</label>
              <input
                type="text"
                name="contact"
                value={formData.contact}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-lg"
                required
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Forma de Pagamento</label>
              <select
                name="paymentMethod"
                value={formData.paymentMethod}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-lg"
                required
              >
                {paymentMethods.map(method => (
                  <option key={method.id} value={method.id}>{method.name}</option>
                ))}
              </select>
            </div>

            {isCash && (
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Troco para quanto?</label>
                <input
                  type="number"
                  name="changeAmount"
                  value={formData.changeAmount}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-lg"
                  placeholder="Informe o valor ou deixe em branco se não precisa de troco"
                />
              </div>
            )}

            <div className="border-t border-gray-200 pt-4 mb-4">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span>R$ {total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Taxa de Entrega:</span>
                <span>R$ {deliveryFee.toFixed(2)}</span>
              </div>
              {isCreditCard && (
                <div className="flex justify-between">
                  <span>Taxa do Cartão (+2%):</span>
                  <span>R$ {creditCardFee.toFixed(2)}</span>
                </div>
              )}

              <div className="flex justify-between font-bold text-lg">
                <span>Total:</span>
                <span>R$ {finalTotal.toFixed(2)}</span>
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={onCancel}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-orange-500 text-white rounded-lg font-semibold hover:bg-orange-600 transition cursor-pointer"
              >
                Confirmar Pedido
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default OrderForm;