import React, { useState, useEffect } from "react";
import { Button, Table, Icon, Label, Menu, MenuItem } from 'semantic-ui-react';
import { Link } from "react-router-dom";
import NavbarAcoes from "../../../components/navbarAcoes/NavbarAcoes";
import Header from "../../../components/header/Header";
import { useMediaQuery } from 'react-responsive';

import './ListaPontoColeta.css';

const pontosColetas = [
    { id: 1, nome: "Evento A", endereco: "Rua X, 123", data: "2024-10-12" },
    { id: 2, nome: "Evento B", endereco: "Rua Y, 456", data: "2024-10-13" },
    { id: 3, nome: "Evento C", endereco: "Rua Z, 789", data: "2024-10-14" },
    { id: 4, nome: "Evento D", endereco: "Rua W, 101", data: "2024-10-15" },
    { id: 5, nome: "Evento E", endereco: "Rua V, 202", data: "2024-10-16" },
    { id: 6, nome: "Evento F", endereco: "Rua U, 303", data: "2024-10-17" },
    { id: 7, nome: "Evento G", endereco: "Rua T, 404", data: "2024-10-18" },
    { id: 8, nome: "Evento H", endereco: "Rua S, 505", data: "2024-10-19" },
    { id: 9, nome: "Evento I", endereco: "Rua R, 606", data: "2024-10-20" },
    { id: 10, nome: "Evento J", endereco: "Rua Q, 707", data: "2024-10-21" },
    { id: 11, nome: "Evento K", endereco: "Rua Q, 707", data: "2024-10-21" },
];

function ListaPontoColeta() {

    const [paginaAtual, setPaginaAtual] = useState(1);
    const itensPorPagina = 5;
    const [pontos, setPontos] = useState([]);

    const isMobile = useMediaQuery({ query: '(max-width: 768px)' });

    useEffect(() => {
        const fetchPontos = async () => {
            try {
                const response = await axios.get('https://apianjobom.victordev.shop/coletas/buscarPontosDeColeta', {
                    headers: {
                        Authorization: token
                    }
                });
                setPontos(response.data);
                console.log("Pontos aqui embaixo");
                console.log(response.data); 
            } catch (error) {
                console.error('Erro ao buscar os pontos de coleta:', error);
            }
        };

        fetchPontos();

    }, []); 

    const deletarPontoColeta = async (id) => {
        // console.log("pontodeleteado")
        try {
            const response = await axios.delete(`https://apianjobom.victordev.shop/admin/deletarPontoDeColeta/${id}`, {
                headers: {
                    Authorization: token
                }
            })

            console.log(response, "essa é a resposta")
        } catch (error) {
            console.error('Erro ao deletar os pontos de coleta:', error);

        }
    }

    const indexUltimoItem = paginaAtual * itensPorPagina;
    const indexPrimeiroItem = indexUltimoItem - itensPorPagina;
    const pontoColetaPaginaAtual = pontosColetas.slice(indexPrimeiroItem, indexUltimoItem);

    const paginasTotais = Math.ceil(pontosColetas.length / itensPorPagina);

    const handlePaginaClick = (numeroPagina) => {
        setPaginaAtual(numeroPagina);
    };

    // Calcular quantas linhas extras precisam ser adicionadas
    const linhasExtras = itensPorPagina - pontoColetaPaginaAtual.length;

    return (
        <>
            <NavbarAcoes />
            <Header title1={"Ponto de"} title2={"Coleta"} />
            <div className="lista-listaPontoColeta-container">
                {!pontosColetas.length ? (
                    <div className="array-vazio">
                        <h1>No momento não há doações! </h1>
                    </div>
                ) : isMobile ? (
                    // VERSÃO MOBILE
                    <div className="mobile-table-container">
                        {pontoColetaPaginaAtual.map((ponto) => (
                            <div key={ponto.id} className="mobile-table-row">
                                <div className="mobile-table-cell">
                                    <strong>ID:</strong> {ponto.id}
                                </div>
                                <div className="mobile-table-cell">
                                    <strong>Nome:</strong> {ponto.nome}
                                </div>
                                <div className="mobile-table-cell">
                                    <strong>Endereço:</strong> {ponto.endereco}
                                </div>
                                <div className="mobile-table-cell">
                                    <strong>Data:</strong> {ponto.data}
                                </div>
                                <div className="mobile-table-actions">
                                    <Icon name="pencil" color="yellow" size="large" />
                                    <Icon name="trash alternate outline" color="red" size="large" />
                                </div>
                            </div>
                        ))}

                        {/* Adicionando a navegação para versão mobile */}
                        <Menu pagination color="red" className="nav-pag">
                            <MenuItem
                                as="a"
                                icon
                                onClick={() => handlePaginaClick(Math.max(1, paginaAtual - 1))}
                                disabled={paginaAtual === 1}
                                className="table-row-listaPontoColeta"
                            >
                                <Icon name="chevron left" />
                            </MenuItem>

                            {[...Array(paginasTotais)].map((_, index) => (
                                <MenuItem
                                    as="a"
                                    key={index + 1}
                                    active={paginaAtual === index + 1}
                                    onClick={() => handlePaginaClick(index + 1)}
                                    color="blue"
                                >
                                    {index + 1}
                                </MenuItem>
                            ))}

                            <MenuItem
                                as="a"
                                icon
                                onClick={() => handlePaginaClick(Math.min(paginasTotais, paginaAtual + 1))}
                                disabled={paginaAtual === paginasTotais}
                                className="table-row-listaPontoColeta"
                            >
                                <Icon name="chevron right" />
                            </MenuItem>
                        </Menu>
                    </div>
                ) : (
                    // VERSÃO DESKTOP
                    <Table celled>
                        <Table.Header>
                            <Table.Row className="table-row-listaPontoColeta">
                                <Table.HeaderCell className="table-row-listaPontoColeta">ID</Table.HeaderCell>
                                <Table.HeaderCell className="table-row-listaPontoColeta">Nome</Table.HeaderCell>
                                <Table.HeaderCell className="table-row-listaPontoColeta">Endereço</Table.HeaderCell>
                                <Table.HeaderCell className="table-row-listaPontoColeta">Data do Registro</Table.HeaderCell>
                                <Table.HeaderCell className="table-row-listaPontoColeta">Ações</Table.HeaderCell>
                            </Table.Row>
                        </Table.Header>

                        <Table.Body className="table-body-fixed">
                            {pontoColetaPaginaAtual.map((ponto) => (
                                <Table.Row key={ponto.id}>
                                    <Table.Cell>{ponto.id}</Table.Cell>
                                    <Table.Cell>{ponto.nome}</Table.Cell>
                                    <Table.Cell>{ponto.endereco}</Table.Cell>
                                    <Table.Cell>{ponto.data}</Table.Cell>
                                    <Table.Cell>
                                        <Icon name="pencil" color="yellow" size="large" />
                                        <Icon 
                                            name="trash alternate outline" 
                                            onClick={() => deletarPontoColeta(id)} 
                                            color="red" 
                                            size="large" 
                                        />
                                    </Table.Cell>
                                </Table.Row>
                            ))}

                            {/* Preencher linhas vazias */}
                            {Array.from({ length: linhasExtras }).map((_, index) => (
                                <Table.Row key={`extra-${index}`}>
                                    <Table.Cell colSpan="5" className="empty-row" />
                                </Table.Row>
                            ))}
                        </Table.Body>

                        <Table.Footer className="table-footer-fixed">
                            <Table.Row>
                                <Table.HeaderCell colSpan="5">
                                    <Menu floated="right" pagination>
                                        <MenuItem
                                            as="a"
                                            icon
                                            onClick={() => handlePaginaClick(Math.max(1, paginaAtual - 1))}
                                            className="table-row-listaPontoColeta"

                                        >
                                            <Icon name="chevron left" />

                                        </MenuItem>

                                        {[...Array(paginasTotais)].map((_, index) => (
                                            <MenuItem
                                                as="a"
                                                key={index + 1}
                                                active={paginaAtual === index + 1}
                                                onClick={() => handlePaginaClick(index + 1)}
                                                color="blue"
                                            >
                                                {index + 1}
                                            </MenuItem>
                                        ))}

                                        <MenuItem
                                            as="a"
                                            icon
                                            onClick={() => handlePaginaClick(Math.min(paginasTotais, paginaAtual + 1))}
                                            className="table-row-listaPontoColeta"
                                        >
                                            <Icon name="chevron right" />
                                        </MenuItem>
                                    </Menu>
                                </Table.HeaderCell>
                            </Table.Row>
                        </Table.Footer>
                    </Table>
                )}
                <Link to="/criarPontoColeta">
                    <Button type="submit" className="btn-listaPontoColeta">
                        Cadastrar Ponto de Coleta
                    </Button>
                </Link>
            </div>
        </>
    );
}

export default ListaPontoColeta;
