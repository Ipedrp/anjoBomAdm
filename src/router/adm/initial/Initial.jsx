import React, { useState, useEffect } from "react";
import Header from "../../../components/header/Header";
import NavbarAcoes from "../../../components/navbarAcoes/NavbarAcoes";
import Chart from "react-apexcharts";
import axios from "axios";
import MediaQuery from "react-responsive";
import './Inital.css'

function Initial() {

    useEffect(() => {
        window.scrollTo(0, 0); // Rola para o topo ao montar o componente
    }, []);

    const [totalPontoColeta, setTotalPontoColeta] = useState([]);
    const [totalEvento, setTotalEvento] = useState([]);
    const [totalDoacao, setTotalDoacao] = useState([]);
    const token = localStorage.getItem("authorization");

    useEffect(() => {
        fetchTotalPontoColeta();
    }, []);

    useEffect(() => {
        fetchTotalEvento();
    }, []);


    useEffect(() => {
        window.scrollTo(0, 0); // Rola para o topo ao montar o componente
    }, []);


    useEffect(() => {
        fetchDoacoes();
    }, []);

    const fetchDoacoes = async () => {
        try {
            const response = await axios.get('https://apianjobom.victordev.shop/admin/cestas', {
                headers: { Authorization: token }
            });
            setTotalDoacao(response.data);

        } catch (error) {
            console.error('Erro ao buscar doações:', error);
        }
    };

    const fetchTotalPontoColeta = async () => {
        try {
            const response = await axios.get(
                "https://apianjobom.victordev.shop/coletas/buscarPontosDeColeta",
                { headers: { Authorization: token } }
            );
            setTotalPontoColeta(response.data);
        } catch (error) {
            console.error("Erro ao buscar as doações", error);
        }
    };

    const fetchTotalEvento = async () => {
        try {
            const response = await axios.get(
                "https://apianjobom.victordev.shop/eventos",
                { headers: { Authorization: token } }
            );
            setTotalEvento(response.data);
        } catch (error) {
            console.error("Erro ao buscar as doações", error);
        }
    };

    const state = {
        options: {
            chart: {
                id: "basic-bar",
            },
            xaxis: {
                categories: [''],
            },
            colors: ["#FF5733", "#33FF57", "#3357FF"], // Cores para cada barra
        },
        series: [
            {
                name: "Ponto de Coleta",
                data: [totalPontoColeta.length], // Apenas um valor
            },
            {
                name: "Eventos",
                data: [totalEvento.length], // Apenas um valor
            },
            {
                name: "Doações",
                data: [totalDoacao.length], // Apenas um valor
            },
        ],
    };

    // Processamento dos dados
    const produtoQuantidades = {};
    totalDoacao.forEach((doador) => {
        const items = doador.items?.produtos || []; // Evitar erros se items não existir
        items.forEach((item) => {
            if (produtoQuantidades[item.name]) {
                produtoQuantidades[item.name] += item.quantity;
            } else {
                produtoQuantidades[item.name] = item.quantity;
            }
        });
    });

    const categorias = Object.keys(produtoQuantidades); // Nomes dos produtos
    const valores = Object.values(produtoQuantidades); // Quantidades correspondentes
    console.log("Categorias (labels):", categorias);
    console.log("Valores (quantidades):", valores);

    const state3 = {
        options: {
            chart: {
                type: "pie",
            },
            labels: ['Alimentos', 'Bebidas', 'Brinquedos', 'Roupas', 'Medicamentos', 'Higiênicos'], // Nomes dos produtos
        },
        series: valores, // Quantidades dos produtos
    };

    return (
        <>
            <NavbarAcoes />
            <Header title2={"Home"} />

            <div className="mixed-chart" style={{ display: "flex", justifyContent: "center", margin: "90px auto" }}>
                <MediaQuery maxWidth={768}>
                    <Chart options={state.options} series={state.series} type="bar" width="100%" height="400" />
                </MediaQuery>
                <MediaQuery minWidth={769}>
                    <Chart options={state.options} series={state.series} type="bar" width="700" height="300" />
                </MediaQuery>
            </div>

           
            <h1 className="title-grafic">Doações</h1>
            

            <div style={{ display: "flex", justifyContent: "center", margin: "90px auto" }}>
                <Chart options={state3.options} series={state3.series} type="pie" width="500" />
            </div>


        </>
    );
}

export default Initial;
