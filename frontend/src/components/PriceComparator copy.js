import React, { useState, useEffect } from 'react';
import '../css/PriceComparator.css'; // Importa el archivo CSS

const PriceComparator = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedCategoryId, setExpandedCategoryId] = useState(null);
  const [expandedSubCategoryId, setExpandedSubCategoryId] = useState(null);
  const [thirdCategories, setThirdCategories] = useState(null);
  const [expandedThirdCategoryId, setExpandedThirdCategoryId] = useState(null); // Nuevo estado para manejar la tercera categoría
  const [subCategories, setSubCategories] = useState([]);
  const [loadingsubCategories, setLoadingsubCategories] = useState(false);
  const [products, setProducts] = useState([]); // Estado para manejar los productos

  const API_URL = "http://localhost:5000/api/categories";

  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true);
      try {
        const response = await fetch(API_URL);
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
  const fetchSubCategories = async (thirdCategoryId) => {

    setLoadingsubCategories(true);
    try {
      const response = await fetch(`http://localhost:5000/api/categories/${thirdCategoryId}`);
      const data = await response.json();
      setThirdCategories(data.categories || []); // Asumiendo que los productos vienen aquí
      setLoadingsubCategories(false);
    } catch (error) {
      console.error("Error al obtener productos:", error);
      setLoadingsubCategories(false);
    }
  };
  const handleCategoryClick = (categoryId) => {
    setExpandedCategoryId(prevId => (prevId === categoryId ? null : categoryId));
    setSubCategories(categories.filter(category => category.id === categoryId)[0].categories);
    setExpandedSubCategoryId(null); // Resetear subcategoría expandida
    setProducts([]); // Limpiar productos
  };

  const handleSubCategoryClick = async (subCategoryId) => {
    fetchSubCategories(subCategoryId);
    console.log("Buscando subcategorías de la categoría", subCategoryId);
    setExpandedSubCategoryId(prevId => (prevId === subCategoryId ? null : subCategoryId));
  };

  const handleThirdCategoryClick = async (thirdCategoryId) => {
    setProducts(thirdCategories.filter(thirdCategory => thirdCategory.id === thirdCategoryId)[0].products);
    console.log(thirdCategories.filter(thirdCategory => thirdCategory.id === thirdCategoryId)[0].products);
  };



  return (
    <div className="price-comparator">
      <div className="sidebar">
        <h1>Productos por categoria</h1>

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
                          onClick={() => handleSubCategoryClick(subCategory.id)} // Pasar subcategorías
                          className="subcategory-item"
                        >
                          {subCategory.name}
                        </div>
                        {expandedSubCategoryId === subCategory.id && (
                          <div className="third-categories">
                            {Array.isArray(thirdCategories) && thirdCategories.map((thirdCategory) => (
                              <div
                                key={thirdCategory.id}
                                onClick={() => handleThirdCategoryClick(thirdCategory.id)} // Buscar productos de la tercera categoría
                                className="third-category-item"
                              >
                                {thirdCategory.name}
                              </div>
                            ))}
                          </div>
                        )}
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
        <h2>Productos</h2>
        {loadingsubCategories ? (
          <p>Cargando productos...</p>
        ) : (
          <div>
            {Array.isArray(products) && products.length > 0 ? (
              products.map((product) => (
                <div key={product.id} className="product-item">
                  <h3>{product.display_name}</h3>
                  <h3>{product.id}</h3>
                  <img src={product.thumbnail} alt={product.display_name} className="product-image" />
                  <p>{calculatePrice(product)} €</p>
                  <p>
                    {formatPackaging(product)} | {product.price_instructions.bulk_price} €/{product.price_instructions.reference_format}
                  </p>
                  <p>Enlace: <a href={product.share_url} target="_blank" rel="noopener noreferrer">Ver producto</a></p>
                </div>
              ))
            ) : (
              <p>No se encontraron productos</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default PriceComparator;
