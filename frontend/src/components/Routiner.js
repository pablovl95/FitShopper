// src/components/Routiner.js
import React, { useState } from "react";
import exercisesData from "../data/exercises.json";
import "../css/Routiner.css";

const muscleImages = [
  { muscle: "bíceps", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c2/Biceps_brachii.png/300px-Biceps_brachii.png" },
  { muscle: "pectorales", image: "https://upload.wikimedia.org/wikipedia/commons/6/6c/Pectoralis_major.png" },
  { muscle: "espalda", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTwIs-O80tSdtTdwamVIvi9WSU707k9D8pZ1Q&s" },
  { muscle: "tríceps", image: "https://cdn.shopify.com/s/files/1/0425/7667/4983/files/2_31b20275-5f35-4a42-bd4e-38b6b9eaa8a1.png?v=1706011557" },
  { muscle: "hombros", image: "https://camde.es/wp-content/uploads/2020/11/anatomia-del-hombro-1.jpg" },
  { muscle: "gemelos", image: "https://pymstatic.com/96763/conversions/Gastrocnemio-default.jpg" },
  { muscle: "abdominales", image: "https://upload.wikimedia.org/wikipedia/commons/9/95/Rectus_abdominis.png" },
  { muscle: "cuádriceps", image: "https://pmedic.es/wp-content/uploads/2023/05/Quadriceps-muscles-e1660481667161-pt94479g84lgtxwid7byvpxbpswzq758ltel76ee9k.png" },
];

const Routiner = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState([]);
  const [workout, setWorkout] = useState({}); // Modificado para almacenar la rutina por días
  const [savedWorkout, setSavedWorkout] = useState([]);
  const [lastWeights, setLastWeights] = useState({}); // Para guardar el último peso levantado por ejercicio

  // Función para buscar ejercicios por músculo
  const searchExercisesByMuscle = (muscle) => {
    const filteredResults = exercisesData.filter((exercise) =>
      exercise.muscles_worked.includes(muscle)
    );
    setResults(filteredResults);
  };

  // Añadir ejercicio a la lista seleccionada
  const handleAddExercise = (exercise, day) => {
    const updatedWorkout = { ...workout };
    if (!updatedWorkout[day]) {
      updatedWorkout[day] = [];
    }
    updatedWorkout[day].push({ ...exercise, sets: 1, reps: 10, weight: 0 });
    setWorkout(updatedWorkout);
  };

  // Actualizar series, repeticiones y peso
  const updateExercise = (day, index, field, value) => {
    const updatedWorkout = { ...workout };
    updatedWorkout[day][index][field] = value;
    setWorkout(updatedWorkout);

    // Actualizar el peso levantado
    if (field === "weight") {
      const exerciseId = updatedWorkout[day][index].id;
      setLastWeights((prev) => ({ ...prev, [exerciseId]: value }));
    }
  };

  // Guardar la rutina
  const handleSaveWorkout = () => {
    setSavedWorkout(workout);
  };

  // Mostrar detalles del ejercicio
  const handleShowExerciseDetails = (exercise) => {
    const lastWeight = lastWeights[exercise.id] || "No data";
    alert(`Last weight lifted: ${lastWeight}kg\nSets: ${exercise.sets}\nReps: ${exercise.reps}`);
  };

  return (
    <div className="Routiner">
      <h1>Workout Planner - Routiner</h1>
      <h2>Select a Muscle</h2>
      <div className="muscle-selector">
        {muscleImages.map(({ muscle, image }) => (
          <div key={muscle} onClick={() => searchExercisesByMuscle(muscle)}>
            <img src={image} alt={muscle} width={100} height={100} />
            <p>{muscle.charAt(0).toUpperCase() + muscle.slice(1)}</p>
          </div>
        ))}
      </div>

      {/* Sección de búsqueda de ejercicios */}
      <div className="exercise-search">
        <h2>Search for Exercises</h2>
        <input
          type="text"
          placeholder="Enter exercise name"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button onClick={() => setSearchTerm("")}>Clear Search</button>
        <ul>
          {results.map((exercise) => (
            <li key={exercise.id}>
              {exercise.name}
              <button onClick={() => handleAddExercise(exercise, "monday")}>Add to Monday</button>
              <button onClick={() => handleAddExercise(exercise, "tuesday")}>Add to Tuesday</button>
              {/* Añadir más días según sea necesario */}
            </li>
          ))}
        </ul>
      </div>

      {/* Sección de creación de rutina */}
      <div className="workout-creator">
        <h2>Create Your Workout</h2>
        {["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"].map((day) => (
          <div key={day}>
            <h3>{day.charAt(0).toUpperCase() + day.slice(1)}</h3>
            {workout[day] && workout[day].map((exercise, index) => (
              <div key={exercise.id}>
                <h4>{exercise.name}</h4>
                <button onClick={() => handleShowExerciseDetails(exercise)}>Show Details</button>
                <label>
                  Sets:
                  <input
                    type="number"
                    value={exercise.sets}
                    onChange={(e) => updateExercise(day, index, "sets", parseInt(e.target.value, 10))}
                  />
                </label>
                <label>
                  Reps:
                  <input
                    type="number"
                    value={exercise.reps}
                    onChange={(e) => updateExercise(day, index, "reps", parseInt(e.target.value, 10))}
                  />
                </label>
                <label>
                  Weight:
                  <input
                    type="number"
                    value={exercise.weight}
                    onChange={(e) => updateExercise(day, index, "weight", parseFloat(e.target.value))}
                  />
                </label>
              </div>
            ))}
          </div>
        ))}
        <button onClick={handleSaveWorkout}>Save Workout</button>
      </div>

      {/* Sección de lista de rutina guardada */}
      <div className="workout-list">
        <h2>Your Saved Workout</h2>
        {savedWorkout.length === 0 ? (
          <p>No exercises added yet.</p>
        ) : (
          <ul>
            {Object.keys(savedWorkout).map((day) => (
              <li key={day}>
                <h3>{day.charAt(0).toUpperCase() + day.slice(1)}</h3>
                <ul>
                  {savedWorkout[day].map((exercise, index) => (
                    <li key={index}>
                      {exercise.name}: {exercise.sets} sets of {exercise.reps} reps, {exercise.weight}kg
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Routiner;
