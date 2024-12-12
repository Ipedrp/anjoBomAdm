import React, { useState, useEffect } from "react";
import Header from "../../../components/header/Header";
import NavbarAcoes from "../../../components/navbarAcoes/NavbarAcoes";
import Chart from "react-apexcharts";
import axios from "axios";
import MediaQuery from "react-responsive";

function Initial() {

    useEffect(() => {
        window.scrollTo(0, 0); // Rola para o topo ao montar o componente
    }, []);
    
    const [totalPontoColeta, setTotalPontoColeta] = useState([]);
    const [totalEvento, setTotalEvento] = useState([]);
    const token = localStorage.getItem("authorization");

    useEffect(() => {
        fetchTotalPontoColeta();
    }, []);

    useEffect(() => {
        fetchTotalEvento();
    }, []);

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
                data: [2], // Apenas um valor
            },
        ],
    };
    
    

    return (
        <>
            <NavbarAcoes />
            <Header title2={"Home"} />

            <div className="mixed-chart" style={{ display: "flex", justifyContent: "center", margin: "90px auto"} }>
                <MediaQuery maxWidth={768}>
                    <Chart options={state.options} series={state.series} type="bar" width="100%" height="400" />
                </MediaQuery>
                <MediaQuery minWidth={769}>
                    <Chart options={state.options} series={state.series} type="bar" width="700" height="300" />
                </MediaQuery>
            </div>

        </>
    );
}

export default Initial;
