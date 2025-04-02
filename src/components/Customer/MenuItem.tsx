import { MenuItem as MenuItemType } from '../../types/types';
import { DEFAULT_FOOD_IMAGE } from './constants/images';

interface MenuItemProps {
  item: MenuItemType;
  addToCart: (item: MenuItemType) => void;
}

const MenuItem = ({ item, addToCart }: MenuItemProps) => {

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition">
      <div className="h-48 bg-gray-200 overflow-hidden relative">
        <img
          src={item.imageUrl || DEFAULT_FOOD_IMAGE}
          alt={item.name}
          className="w-full h-full object-cover"
          onError={(e) => {
            (e.target as HTMLImageElement).src = DEFAULT_FOOD_IMAGE;
          }}
        />
      </div>
      <div className="p-4">
        <h3 className="font-bold text-lg mb-1">{item.name}</h3>
        <p className="text-gray-600 text-sm mb-2">{item.description}</p>
        <div className="flex justify-between items-center">
          <span className="font-bold text-orange-500">R$ {item.price.toFixed(2)}</span>
          <button
            onClick={() => addToCart(item)}
            className="px-3 py-1 bg-orange-500 text-white rounded hover:bg-orange-600 transition cursor-pointer"
          >
            Adicionar
          </button>
        </div>
      </div>
    </div>
  );
};

export default MenuItem;