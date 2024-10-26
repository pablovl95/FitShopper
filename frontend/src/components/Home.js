// src/Home.js
import React, { useState } from 'react';
import Tesseract from 'tesseract.js';

const Home = () => {
  const [image, setImage] = useState(null);
  const [nutritionalInfo, setNutritionalInfo] = useState({});

  const handleImageChange = (e) => {
    setImage(URL.createObjectURL(e.target.files[0]));
  };

  const handleImageUpload = () => {
    if (image) {
      Tesseract.recognize(
        image,
        'eng',
        {
          logger: (m) => console.log(m),
        }
      ).then(({ data: { text } }) => {
        const extractedData = extractNutritionalInfo(text);
        console.log(text);
        setNutritionalInfo(extractedData);
      });
    }
  };

  const extractNutritionalInfo = (text) => {
    // Expresiones regulares para buscar proteínas, grasas y carbohidratos
    const proteinPattern = /proteínas?\s*:\s*(\d+)\s*grams?/i;
    const fatPattern = /grasas?\s*:\s*(\d+)\s*grams?/i;
    const carbPattern = /carbohidratos?\s*:\s*(\d+)\s*grams?/i;

    const matches = {
      proteínas: text.match(proteinPattern)?.[1] || 'No encontrado',
      grasas: text.match(fatPattern)?.[1] || 'No encontrado',
      carbohidratos: text.match(carbPattern)?.[1] || 'No encontrado',
    };

    return matches;
  };

  return (
    <div>
      <h2>Página de inicio</h2>
      <input type="file" accept="image/*" onChange={handleImageChange} />
      <button onClick={handleImageUpload}>Cargar Imagen</button>
      {nutritionalInfo && (
        <div>
          <h3>Información Nutricional</h3>
          <p>Proteínas: {nutritionalInfo.proteínas}</p>
          <p>Grasas: {nutritionalInfo.grasas}</p>
          <p>Carbohidratos: {nutritionalInfo.carbohidratos}</p>
        </div>
      )}
    </div>
  );
};

export default Home;
