import React, { useState, useEffect } from 'react';
import '../css/Alimentacion.css';

const Alimentacion = () => {

    return (
        <div className="total-macros">
            <h5>Calorias restantes</h5>
            <div className='goal-bar'>
                <div>
                    <p>3450</p>
                    <p>Objetivo</p>
                </div>
                <div>
                    <p>-</p>
                    <p></p>
                </div>
                <div>
                    <p>1000</p>
                    <p>Alimentos</p>
                </div>
                <div>
                    <p>=</p>
                    <p></p>
                </div>
                <div>
                    <p>2450</p>
                    <p>Restantes</p>
                </div>

            </div>
            <div>
                <div>
                    <h5>Comida 1</h5>
                    <h5>189 kcal</h5>
                    <div>
                        <h5>Carne picada, 180 gr</h5>
                        <h5>189 kcal</h5>
                    </div>
                    <div>
                        <h5>Arroz, 200 gr</h5>
                        <h5>189 kcal</h5>
                    </div>
                    <div>
                        <h5>Gallina, 200 gr</h5>
                        <h5>189 kcal</h5>
                    </div>
                    <div>
                        <h5>Pavo, 200 gr</h5>
                        <h5>189 kcal</h5>
                    </div>
                    <div>
                        <h3>Agregar alimento</h3>
                    </div>
                </div>
                <div>
                    <h5>Comida 2</h5>
                    <h5>189 kcal</h5>
                </div>
                <div>
                    <h5>Gallina, 200 gr</h5>
                    <h5>189 kcal</h5>
                </div>
                <div>
                    <h5>Pavo, 200 gr</h5>
                    <h5>189 kcal</h5>
                </div>
                <div>
                    <h3>Agregar alimento</h3>
                </div>
            </div>
            <div><h3>Añadir nueva comida</h3></div>
        </div>
    );
};

export default Alimentacion;
