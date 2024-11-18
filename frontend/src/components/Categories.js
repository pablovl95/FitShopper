import React, { useState, useEffect } from 'react';
import '../css/Categories.css';

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedCategoryId, setExpandedCategoryId] = useState(null);
  const [loadingsubCategories, setLoadingsubCategories] = useState(false);
  const [subCategories, setSubCategories] = useState([]);
  const [categorySelectetdName, setCategorySelectetdName] = useState(null);
  const [selectedProductInfo, setSelectedProductInfo] = useState(null);
  const backendUrl = 'http://localhost:5000';
  

  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true);
      try {
        const response = await fetch( backendUrl + "/api/v1/categories");
        const data = await response.json();
        setCategories(data.results || []);
        setLoading(false);
      } catch (error) {
        console.error("Error al obtener categorías:", error);
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  function calculatePrice(product) {
    const priceInstructions = product.price_instructions;
    let price = 0;

    if (priceInstructions.bulk_price) {
      if (priceInstructions.unit_size) {
        price = priceInstructions.unit_price;
      } else if (priceInstructions.drained_weight) {
        price = priceInstructions.bulk_price * priceInstructions.drained_weight;
      } else {
        price = priceInstructions.bulk_price * priceInstructions.increment_bunch_amount;
      }
    } else {
      price = priceInstructions.unit_price;
    }

    return parseFloat(price).toFixed(2);
  }

  function formatPackaging(product) {
    const priceInstructions = product.price_instructions;
    let packaging = "";

    if (product.packaging && !product.packaging.startsWith("Pack")) {
      packaging += product.packaging + " ";
    }

    let totalUnits = "";
    if (priceInstructions.total_units) {
      totalUnits += priceInstructions.total_units;
    }

    let unitName = "";
    if (priceInstructions.unit_name) {
      unitName += priceInstructions.unit_name;
    }

    let unitSize = "";
    if (priceInstructions.unit_size >= 1.0) {
      unitSize += priceInstructions.unit_size + priceInstructions.reference_format;
    } else {
      const sizeInGramsOrMl = priceInstructions.unit_size * 1000;
      unitSize += sizeInGramsOrMl + (priceInstructions.reference_format === "kg" ? " gr" : " ml");
    }

    return `${packaging}${totalUnits} ${unitName} (${unitSize})`;
  }

  const fetchProductsByCategories = async (CategoryID) => {
    setLoadingsubCategories(true);
    try {
      const response = await fetch(backendUrl+`/api/v1/categories/${CategoryID}`);
      const data = await response.json();
      setCategorySelectetdName(data.name);
      setSubCategories(data.categories || []);
      setLoadingsubCategories(false);
    } catch (error) {
      console.error("Error al obtener productos:", error);
      setLoadingsubCategories(false);
    }
  };

  const handleCategoryClick = (categoryId) => {
    setExpandedCategoryId(prevId => (prevId === categoryId ? null : categoryId));
  };

  const handleSubCategoryClick = async (subCategoryId) => {
    fetchProductsByCategories(subCategoryId);
  };

  const handleProductClick = async (productId) => {
    try {
      const response = await fetch(backendUrl+`/api/v1/nutritional-info/${productId}`);
      const data = await response.json();
      setSelectedProductInfo(data);
    } catch (error) {
      console.error("Error al obtener información nutricional:", error);
    }
  };

  const closeModal = () => {
    setSelectedProductInfo(null);
  };

  return (
    <div className="price-comparator">
      <div className="sidebar">
        <h1>Productos por categoría</h1>
        {loading ? (
          <p>Cargando categorías...</p>
        ) : (
          <div>
            <h2>Categorías</h2>
            {Array.isArray(categories) && categories.map((category) => (
              <div key={category.id}>
                <div
                  onClick={() => handleCategoryClick(category.id)}
                  className="category-item"
                >
                  {category.name}
                </div>
                {expandedCategoryId === category.id && (
                  <div className="subcategories">
                    {Array.isArray(category.categories) && category.categories.map((subCategory) => (
                      <div key={subCategory.id}>
                        <div
                          onClick={() => handleSubCategoryClick(subCategory.id)}
                          className="subcategory-item"
                        >
                          {subCategory.name}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="products">
        <h1>{categorySelectetdName}</h1>
        {loadingsubCategories ? (
          <p>Cargando productos...</p>
        ) : (
          <div>
            {Array.isArray(subCategories) && subCategories.length > 0 ? (
              subCategories.map((category) => (
                <div key={category.id}>
                  <h2>{category.name}</h2>
                  {Array.isArray(category.products) && category.products.length > 0 ? (
                    category.products.map((product) => (
                      <div key={product.id} className="product-item" onClick={() => handleProductClick(product.id)}>
                        <img src={product.thumbnail} alt={product.display_name} className="product-image" />
                        <h3>{product.display_name}</h3>
                        <p>{calculatePrice(product)} €</p>
                        <p>
                          {formatPackaging(product)} | {product.price_instructions.bulk_price} €/{product.price_instructions.reference_format}
                        </p>
                        <p>
                          Enlace: <a href={product.share_url} target="_blank" rel="noopener noreferrer">Ver producto</a>
                        </p>
                      </div>
                    ))
                  ) : (
                    <p>No se encontraron productos</p>
                  )}
                </div>
              ))
            ) : (
              <p>No se encontraron productos</p>
            )}
          </div>
        )}
      </div>

      {/* Modal para mostrar información nutricional */}
      {selectedProductInfo && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>Información Nutricional</h2>
            <table>
              <thead>
                <tr>
                  <th>Producto</th>
                  <th>Calorías</th>
                  <th>Grasas</th>
                  <th>Carbohidratos</th>
                  <th>Proteínas</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>{selectedProductInfo.product_name || 'N/A'}</td>
                  <td>{selectedProductInfo.nutriments?.["energy-kcal_100g"] || 'N/A'} kcal</td>
                  <td>{selectedProductInfo.nutriments?.fat_100g || 'N/A'} g</td>
                  <td>{selectedProductInfo.nutriments?.carbohydrates_100g || 'N/A'} g</td>
                  <td>{selectedProductInfo.nutriments?.proteins_100g || 'N/A'} g</td>
                </tr>
              </tbody>
            </table>
            <button onClick={closeModal}>Cerrar</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Categories;
