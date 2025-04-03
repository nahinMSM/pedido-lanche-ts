import { useState, useEffect, useRef } from 'react';
import { collection, addDoc, getDocs, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../../services/firebase';
import { Category, MenuItem } from '../../types/types';

const AdminControl = () => {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [formData, setFormData] = useState<Omit<MenuItem, 'id'> & { imageFile?: File }>({
    name: '',
    description: '',
    price: 0,
    category: 'sandwiches',
    active: true,
    imageUrl: ''
  });
  const [editMode, setEditMode] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const categories: Category[] = ['sandwiches', 'drinks', 'extras'];

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      setLoading(true);
      const querySnapshot = await getDocs(collection(db, 'menuItems'));
      const itemsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as MenuItem));
      setItems(itemsData);
    } catch (error) {
      console.error('Error fetching items:', error);
    } finally {
      setLoading(false);
    }
  };

  const uploadImageToImgBB = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('image', file);

    try {
      const response = await fetch(
        'https://api.imgbb.com/1/upload?key=d4b1e4d29777da61a68ce0583309cf64',
        {
          method: 'POST',
          body: formData,
        }
      );

      const data = await response.json();
      if (!data.success) throw new Error('Upload failed');
      return data.data.url;
    } catch (error) {
      console.error('Erro no upload:', error);
      throw error;
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setPreviewImage(URL.createObjectURL(file));

    try {
      const imageUrl = await uploadImageToImgBB(file);
      setFormData(prev => ({
        ...prev,
        imageUrl
      }));
    } catch (error) {
      console.error('Upload failed:', error);
      alert(
        error instanceof Error
          ? `Erro no upload: ${error.message}`
          : 'Não foi possível enviar a imagem. Tente novamente.'
      );
      setPreviewImage(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? Number(value) :
        type === 'checkbox' ? (e.target as HTMLInputElement).checked :
          value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const itemData = {
        name: formData.name,
        description: formData.description,
        price: formData.price,
        category: formData.category,
        active: formData.active,
        imageUrl: formData.imageUrl
      };

      if (editMode) {
        await updateDoc(doc(db, 'menuItems', editMode), itemData);
      } else {
        await addDoc(collection(db, 'menuItems'), itemData);
      }

      fetchItems();
      resetForm();
    } catch (error) {
      console.error('Error saving item:', error);
      alert('Erro ao salvar item');
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: 0,
      category: 'sandwiches',
      active: true,
      imageUrl: ''
    });
    setPreviewImage(null);
    setEditMode(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleEdit = (item: MenuItem) => {
    setFormData(item);
    setEditMode(item.id);
    setPreviewImage(item.imageUrl || null);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir este item?')) {
      try {
        await deleteDoc(doc(db, 'menuItems', id));
        fetchItems();
      } catch (error) {
        console.error('Error deleting item:', error);
      }
    }
  };

  const toggleActive = async (id: string, currentStatus: boolean) => {
    try {
      await updateDoc(doc(db, 'menuItems', id), { active: !currentStatus });
      fetchItems();
    } catch (error) {
      console.error('Error toggling item status:', error);
    }
  };

  if (loading) {
    return <div className="text-center py-8">Carregando itens...</div>;
  }

  return (
    <div className="grid md:grid-cols-2 gap-8">
      <div>
        <h3 className="text-xl font-medium mb-4">
          {editMode ? 'Editar Item' : 'Adicionar Novo Item'}
        </h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="mb-4">
            <label className="block text-gray-700 mb-1">Imagem do Item</label>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
              className="hidden"
            />

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="px-4 py-2 bg-gray-200 rounded-lg mb-2 cursor-pointer"
            >
              {formData.imageUrl ? 'Alterar Imagem' : 'Selecionar Imagem'}
            </button>

            {previewImage && (
              <div className="mt-2">
                <img
                  src={previewImage}
                  alt="Pré-visualização"
                  className="h-32 object-cover rounded"
                />
                <p className="text-sm text-green-600 mt-1">
                  {formData.imageUrl ? 'Imagem pronta para salvar' : 'Enviando imagem...'}
                </p>
              </div>
            )}

            <input
              type="hidden"
              name="imageUrl"
              value={formData.imageUrl || ''}
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-1">Nome</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-1">Descrição</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg"
              rows={3}
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-1">Preço (R$)</label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              step="0.01"
              min="0"
              className="w-full px-3 py-2 border rounded-lg"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-1">Categoria</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg"
              required
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>
                  {cat === 'sandwiches' ? 'Sanduíches' :
                    cat === 'drinks' ? 'Bebidas' : 'Adicionais'}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              name="active"
              checked={formData.active}
              onChange={handleChange}
              id="activeCheckbox"
              className="mr-2"
            />
            <label htmlFor="activeCheckbox" className="text-gray-700">
              Item ativo no cardápio
            </label>
          </div>

          <div className="flex justify-end gap-3">
            {editMode && (
              <button
                type="button"
                onClick={resetForm}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition cursor-pointer"
              >
                Cancelar
              </button>
            )}
            <button
              type="submit"
              className="px-4 py-2 bg-orange-500 text-white rounded-lg font-semibold hover:bg-orange-600 transition cursor-pointer"
            >
              {editMode ? 'Atualizar Item' : 'Adicionar Item'}
            </button>
          </div>
        </form>
      </div>

      <div>
        <h3 className="text-xl font-medium mb-4">Itens do Cardápio</h3>

        <div className="space-y-4 max-h-[600px] overflow-y-auto">
          {items.map(item => (
            <div key={item.id} className={`p-4 border rounded-lg ${item.active ? 'bg-white' : 'bg-gray-100'}`}>
              {item.imageUrl && (
                <img
                  src={item.imageUrl}
                  alt={item.name}
                  className="h-24 w-full object-cover rounded mb-2"
                />
              )}
              <div>
                <div>
                  <h4 className="font-bold">{item.name}</h4>
                  <p className="text-sm text-gray-600 mb-1">{item.description}</p>
                  <div className="flex gap-4 text-sm">
                    <span className="font-medium">R$ {item.price.toFixed(2)}</span>
                    <span className="text-gray-500 capitalize">
                      {item.category === 'sandwiches' ? 'Sanduíche' :
                        item.category === 'drinks' ? 'Bebida' : 'Adicional'}
                    </span>
                    <span className={item.active ? 'text-green-500' : 'text-red-500'}>
                      {item.active ? 'Ativo' : 'Inativo'}
                    </span>
                  </div>
                </div>
                <div className="flex gap-2 mt-4">
                  <button
                    onClick={() => handleEdit(item)}
                    className="p-1 text-blue-500 hover:text-blue-700 cursor-pointer"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => toggleActive(item.id, item.active)}
                    className="p-1 text-yellow-500 hover:text-yellow-700 cursor-pointer"
                  >
                    {item.active ? 'Desativar' : 'Ativar'}
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="p-1 text-red-500 hover:text-red-700 cursor-pointer"
                  >
                    Excluir
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminControl;