import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const DetalhePontoColeta = () => {
    const { id } = useParams();
    const [pontoDeColeta, setPontoDeColeta] = useState(null);
    const token = localStorage.getItem('authorization');

    useEffect(() => {
        const fetchPontosDeColeta = async () => {
            try {
                const response = await axios.get('https://apianjobom.victordev.shop/coletas/buscarPontosDeColeta', {
                    headers: { Authorization: token },
                });
                // Filtra o ponto de coleta específico pelo `id`
                const ponto = response.data.find((ponto) => ponto.id === id);
                setPontoDeColeta(ponto);
            } catch (error) {
                console.error("Erro ao buscar pontos de coleta", error);
            }
        };

        fetchPontosDeColeta();
    }, [id]);

    if (!pontoDeColeta) {
        return <p>Carregando ou ponto não encontrado...</p>;
    }

    return (
        <div>
            <h2>Detalhes do Ponto de Coleta</h2>
            <p>ID: {pontoDeColeta.id}</p>
            <p>Nome: {pontoDeColeta.name}</p>
            <p>Endereço: {pontoDeColeta.address.rua}, {pontoDeColeta.address.numero}</p>
            {/* Adicione mais detalhes conforme necessário */}
        </div>
    );
};

export default DetalhePontoColeta;
