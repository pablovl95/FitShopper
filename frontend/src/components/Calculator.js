import React, { useState } from 'react';
import '../css/Calculator.css';

const Calculator = () => {
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [age, setAge] = useState('');
  const [activityLevel, setActivityLevel] = useState('');
  const [goal, setGoal] = useState('');
  const [speed, setSpeed] = useState('');
  const [sex, setSex] = useState('male');
  const [result, setResult] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();

    const BMR = calculateBMR();
    const TDEE = calculateTDEE(BMR);
    const macros = calculateMacros(TDEE);

    setResult(macros);
  };

  const calculateBMR = () => {
    if (weight && height && age) {
      if (sex === 'male') {
        return 10 * parseFloat(weight) + 6.25 * parseFloat(height) - 5 * parseInt(age) + 5;
      } else {
        return 10 * parseFloat(weight) + 6.25 * parseFloat(height) - 5 * parseInt(age) - 161;
      }
    }
    return 0;
  };

  const calculateTDEE = (BMR) => {
    let activityFactor = 1.2;
    switch (activityLevel) {
      case 'sedentary':
        activityFactor = 1.2;
        break;
      case 'moderate':
        activityFactor = 1.55;
        break;
      case 'active':
        activityFactor = 1.75;
        break;
      case 'very_active':
        activityFactor = 1.9;
        break;
      default:
        activityFactor = 1.2;
    }
    return BMR * activityFactor;
  };

  const calculateMacros = (TDEE) => {
    let calorieGoal = TDEE;

    if (goal === 'gain') {
      calorieGoal += speed === 'fast' ? 500 : 300;
    } else if (goal === 'lose') {
      calorieGoal -= speed === 'fast' ? 500 : 300;
    }

    const protein = (calorieGoal * 0.3) / 4;
    const fats = (calorieGoal * 0.25) / 9;
    const carbs = (calorieGoal * 0.45) / 4;

    return {
      calories: calorieGoal,
      protein,
      fats,
      carbs,
    };
  };

  const saveToLocalStorage = () => {
    if (result) {
      localStorage.setItem('macros', JSON.stringify(result));
      alert('Los macros se han guardado en la memoria.');
    }
  };

  const loadFromLocalStorage = () => {
    const savedMacros = localStorage.getItem('macros');
    if (savedMacros) {
      setResult(JSON.parse(savedMacros));
      alert('Los macros se han cargado desde la memoria.');
    } else {
      alert('No se encontraron macros guardados.');
    }
  };

  return (
    <div>
      <h1>Calculadora de Macros</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Peso (kg):</label>
          <input type="number" value={weight} onChange={(e) => setWeight(e.target.value)} required />
        </div>
        <div>
          <label>Altura (cm):</label>
          <input type="number" value={height} onChange={(e) => setHeight(e.target.value)} required />
        </div>
        <div>
          <label>Edad:</label>
          <input type="number" value={age} onChange={(e) => setAge(e.target.value)} required />
        </div>
        <div>
          <label>Sexo:</label>
          <select value={sex} onChange={(e) => setSex(e.target.value)} required>
            <option value="male">Masculino</option>
            <option value="female">Femenino</option>
          </select>
        </div>
        <div>
          <label>Nivel de actividad:</label>
          <select value={activityLevel} onChange={(e) => setActivityLevel(e.target.value)} required>
            <option value="sedentary">Sedentario</option>
            <option value="moderate">Moderado</option>
            <option value="active">Activo</option>
            <option value="very_active">Muy activo</option>
          </select>
        </div>
        <div>
          <label>Objetivo:</label>
          <select value={goal} onChange={(e) => setGoal(e.target.value)} required>
            <option value="maintain">Mantener</option>
            <option value="gain">Ganar peso</option>
            <option value="lose">Perder peso</option>
          </select>
        </div>
        {(goal === 'gain' || goal === 'lose') && (
          <div>
            <label>¿Qué tan rápido quieres lograrlo?</label>
            <select value={speed} onChange={(e) => setSpeed(e.target.value)} required>
              <option value="slow">Lento</option>
              <option value="fast">Rápido</option>
            </select>
          </div>
        )}
        <button type="submit">Calcular</button>
      </form>

      {result && (
        <div>
          <h2>Resultados:</h2>
          <p>Calorías necesarias: {result.calories} kcal</p>
          <p>Proteínas: {result.protein.toFixed(2)} g</p>
          <p>Grasas: {result.fats.toFixed(2)} g</p>
          <p>Carbohidratos: {result.carbs.toFixed(2)} g</p>

          <button onClick={saveToLocalStorage}>Guardar en memoria</button>
          <button onClick={loadFromLocalStorage}>Cargar desde memoria</button>
        </div>
      )}
    </div>
  );
};

export default Calculator;
