import React, { useState, useEffect } from 'react';

const PriceComparator = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Simulamos una URL de API
  const API_URL = "https://tienda.mercadona.es/api/categories/112/"; 

  // Función para obtener productos de la API (simulada)
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const response = await fetch(API_URL);
        const data = await response.json();
        console.log(data);
        // Extraemos los productos de las categorías que has dado
        // setProducts(data.categories.flatMap(category => category.products));
        // setLoading(false);
      } catch (error) {
        console.error("Error al obtener productos:", error);
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // Función para manejar el cambio en el campo de búsqueda
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  // Filtrado de productos basado en el término de búsqueda
  const filteredProducts = products.filter(product =>
    product.display_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <h1>Price Comparator</h1>
      <input
        type="text"
        placeholder="Buscar producto..."
        value={searchTerm}
        onChange={handleSearch}
      />
      
      {loading ? (
        <p>Cargando productos...</p>
      ) : (
        <div>
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product) => (
              <div key={product.id} style={{ border: '1px solid #ccc', margin: '10px', padding: '10px' }}>
                <h2>{product.display_name}</h2>
                <img src={product.thumbnail} alt={product.display_name} style={{ width: '100px', height: '100px' }} />
                <p>Precio: ${product.price_instructions.unit_price}</p>
                <p>Formato: {product.size_format}</p>
                <p>Enlace: <a href={product.share_url} target="_blank" rel="noopener noreferrer">Ver producto</a></p>
              </div>
            ))
          ) : (
            <p>No se encontraron productos</p>
          )}
        </div>
      )}
    </div>
  );
};

export default PriceComparator;
