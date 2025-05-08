import React, { useState, useEffect } from "react";
import Header from "../../../components/header/Header";
import NavbarAcoes from "../../../components/navbarAcoes/NavbarAcoes";
import Chart from "react-apexcharts";
import axios from "axios";
import MediaQuery from "react-responsive";
import './Inital.css'

function Initial() {

    // useEffect(() => {
    //     window.scrollTo(0, 0); 
    // }, []);

    // const [totalPontoColeta, setTotalPontoColeta] = useState([]);
    // const [totalEvento, setTotalEvento] = useState([]);
    // const [totalDoacao, setTotalDoacao] = useState([]);
    // const token = localStorage.getItem("authorization");

    // useEffect(() => {
    //     fetchTotalPontoColeta();
    // }, []);

    // useEffect(() => {
    //     fetchTotalEvento();
    // }, []);


    // useEffect(() => {
    //     window.scrollTo(0, 0); 
    // }, []);


    // useEffect(() => {
    //     fetchDoacoes();
    // }, []);

    // const fetchDoacoes = async () => {
    //     try {
    //         const response = await axios.get('https://apianjobom.victordev.shop/admin/cestas', {
    //             headers: { Authorization: token }
    //         });
    //         setTotalDoacao(response.data);

    //     } catch (error) {
    //         console.error('Erro ao buscar doações:', error);
    //     }
    // };

    // const fetchTotalPontoColeta = async () => {
    //     try {
    //         const response = await axios.get(
    //             "https://apianjobom.victordev.shop/coletas/buscarPontosDeColeta",
    //             { headers: { Authorization: token } }
    //         );
    //         setTotalPontoColeta(response.data);
    //     } catch (error) {
    //         console.error("Erro ao buscar as doações", error);
    //     }
    // };

    // const fetchTotalEvento = async () => {
    //     try {
    //         const response = await axios.get(
    //             "https://apianjobom.victordev.shop/eventos",
    //             { headers: { Authorization: token } }
    //         );
    //         setTotalEvento(response.data);
    //     } catch (error) {
    //         console.error("Erro ao buscar as doações", error);
    //     }
    // };

    // const state = {
    //     options: {
    //         chart: {
    //             id: "basic-bar",
    //         },
    //         xaxis: {
    //             categories: [''],
    //         },
    //         colors: ["#FF5733", "#33FF57", "#3357FF"], // Cores para cada barra
    //     },
    //     series: [
    //         {
    //             name: "Ponto de Coleta",
    //             data: [totalPontoColeta.length], // Apenas um valor
    //         },
    //         {
    //             name: "Eventos",
    //             data: [totalEvento.length], // Apenas um valor
    //         },
    //         {
    //             name: "Doações",
    //             data: [totalDoacao.length], // Apenas um valor
    //         },
    //     ],
    // };

    // // Processamento dos dados
    // const produtoQuantidades = {};
    // totalDoacao.forEach((doador) => {
    //     const items = doador.items?.produtos || []; 
    //     items.forEach((item) => {
    //         if (produtoQuantidades[item.name]) {
    //             produtoQuantidades[item.name] += item.quantity;
    //         } else {
    //             produtoQuantidades[item.name] = item.quantity;
    //         }
    //     });
    // });

    // const categorias = Object.keys(produtoQuantidades); 
    // const valores = Object.values(produtoQuantidades); 
    // console.log("Categorias (labels):", categorias);
    // console.log("Valores (quantidades):", valores);

    // const state3 = {
    //     options: {
    //         chart: {
    //             type: "pie",
    //         },
    //         labels: ['Alimentos', 'Bebidas', 'Brinquedos', 'Roupas', 'Medicamentos', 'Higiênicos'], 
    //         responsive: [
    //             {
    //                 breakpoint: 100, 
    //                 options: {
    //                     chart: {
    //                         width: 500, 
    //                     },
    //                 },
    //             },
    //             {
    //                 breakpoint: 768, 
    //                 options: {
    //                     chart: {
    //                         width: 400, 
    //                     },
    //                 },
    //             },
    //         ],
    //     },
    //     series: valores, 
    // };

    const [state, setState] = React.useState({

        series: [44, 55, 41, 17, 15],
        options: {
            chart: {
                type: 'donut',
            },
            responsive: [{
                breakpoint: 480,
                options: {
                    chart: {
                        width: 500
                    },
                    legend: {
                        position: 'bottom'
                    }
                }
            }]
        },


    });

    return (
        <>
            <NavbarAcoes />
            <Header title2={"Home"} />
            <div className="container-before-grafic">
                <div style={{ display: "flex", justifyContent: "center", margin: "90px auto" }}>
                    <Chart options={state.options} series={state.series} type="donut" width={500} />
                </div>
            </div>


        </>
    );
}

export default Initial;
