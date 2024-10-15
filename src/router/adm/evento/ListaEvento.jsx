import React, { useState, useEffect } from "react";
import { Button, Table, Icon, Label, Menu, MenuItem } from 'semantic-ui-react';
import { Link } from "react-router-dom";
import NavbarAcoes from "../../../components/navbarAcoes/NavbarAcoes";
import Header from "../../../components/header/Header";
import axios from "axios";
import { useMediaQuery } from 'react-responsive';

import './ListaEvento.css';

function ListaEvento() {
    const [paginaAtual, setPaginaAtual] = useState(1);
    const itensPorPagina = 5;
    const [allEventos, setAllEventos] = useState([]);
    const isMobile = useMediaQuery({ query: '(max-width: 768px)' });
    const token = localStorage.getItem('authorization')

    useEffect(() => {
        const fetchEventos = async () => {
            try {
                const response = await axios.get('https://apianjobom.victordev.shop/eventos/', {
                    headers: {
                        Authorization: token
                    }
                });
                setAllEventos(response.data);
                console.log("EVENTOS aqui embaixo");
                console.log(response.data);
            } catch (error) {
                console.error('Erro ao buscar os EVENTOS:', error);
            }
        };

        fetchEventos();

    }, []);

    const deletarEvento = async (id) => {
        // console.log("eventoDELETADO")
        try {
            const response = await axios.delete(`https://apianjobom.victordev.shop/admin/deletarEvento/${id}`, {
                headers: {
                    Authorization: token
                }
            })
            localStorage.setItem('authorization', response.data.token)
            console.log(response, "essa é a resposta dessa porra")
        } catch (error) {
            console.error('Erro ao deletar os pontos de coleta:', error);

        }
    }

    console.log("todos os evcento dessa buceta", allEventos)

    const indexUltimoItem = paginaAtual * itensPorPagina;
    const indexPrimeiroItem = indexUltimoItem - itensPorPagina;
    const eventosPaginaAtual = allEventos.slice(indexPrimeiroItem, indexUltimoItem);

    const paginasTotais = Math.ceil(allEventos.length / itensPorPagina);

    const handlePaginaClick = (numeroPagina) => {
        setPaginaAtual(numeroPagina);
    };

    // Calcular quantas linhas extras precisam ser adicionadas
    const linhasExtras = itensPorPagina - eventosPaginaAtual.length;

    return (
        <>
            <NavbarAcoes />
            <Header title2={"Evento"} />
            <div className="lista-listaEvento-container">
                {!allEventos.length ? (
                    <div className="array-vazio">
                        <h1>No momento não há eventos! </h1>
                    </div>
                ) : isMobile ? (
                    // VERSÃO MOBILE
                    <div className="mobile-table-container">
                        {eventosPaginaAtual.map((evento) => (
                            <div key={evento.id} className="mobile-table-row">
                                <div className="mobile-table-cell">
                                    <strong>Título:</strong> {evento.titulo}
                                </div>
                                <div className="mobile-table-cell">
                                    <strong>Endereço:</strong> {evento.address.rua} - {evento.address.cidade} - {evento.address.estado}
                                </div>
                                <div className="mobile-table-cell">
                                    <strong>Data:</strong> {evento.data}
                                </div>
                                <div className="mobile-table-actions">
                                    <Icon name="pencil" color="yellow" size="large" />
                                    <Icon
                                        name="trash alternate outline"
                                        onClick={() => deletarEvento(id)}
                                        color="red"
                                        size="large"
                                    />
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
                                className="table-row-doacoesRetirar"
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
                                className="table-row-listaEvento"
                            >
                                <Icon name="chevron right" />
                            </MenuItem>
                        </Menu>
                    </div>
                ) : (
                    // VERSÃO DESKTOP
                    <Table celled>
                        <Table.Header>
                            <Table.Row className="table-row-listaEvento">
                                <Table.HeaderCell className="table-row-listaEvento">Título</Table.HeaderCell>
                                <Table.HeaderCell className="table-row-listaEvento">Endereço</Table.HeaderCell>
                                <Table.HeaderCell className="table-row-listaEvento">Data do Registro</Table.HeaderCell>
                                <Table.HeaderCell className="table-row-listaEvento">Ações</Table.HeaderCell>
                            </Table.Row>
                        </Table.Header>

                        <Table.Body className="table-body-fixed">
                            {eventosPaginaAtual.map((evento) => (
                                <Table.Row key={evento.id}>
                                    <Table.Cell>{evento.titulo}</Table.Cell>
                                    <Table.Cell>{evento.address.rua} - {evento.address.cidade} - {evento.address.estado}</Table.Cell>
                                    <Table.Cell>{evento.data_inicio}</Table.Cell>
                                    <Table.Cell>
                                        <Icon name="pencil" color="yellow" size="large" />
                                        <Icon name="trash alternate outline" color="red" size="large" />
                                    </Table.Cell>
                                </Table.Row>
                            ))}
                            {/* Preencher linhas vazias */}
                            {Array.from({ length: linhasExtras }).map((_, index) => (
                                <Table.Row key={`extra-${index}`}>
                                    <Table.Cell colSpan="" className="empty-row" />
                                </Table.Row>
                            ))}
                        </Table.Body>

                        <Table.Footer className="table-footer-fixed">
                            <Table.Row>
                                <Table.HeaderCell colSpan="4">
                                    <Menu floated="right" pagination>
                                        <MenuItem
                                            as="a"
                                            icon
                                            onClick={() => handlePaginaClick(Math.max(1, paginaAtual - 1))}
                                            className="table-row-listaEvento"

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
                                            className="table-row-listaEvento"
                                        >
                                            <Icon name="chevron right" />
                                        </MenuItem>
                                    </Menu>
                                </Table.HeaderCell>
                            </Table.Row>
                        </Table.Footer>
                    </Table>
                )}
                <Link to="/criarEvento">
                    <Button type="submit" className="btn-listaEvento">
                        Cadastrar Evento
                    </Button>
                </Link>
            </div>
        </>
    );
}

export default ListaEvento;
