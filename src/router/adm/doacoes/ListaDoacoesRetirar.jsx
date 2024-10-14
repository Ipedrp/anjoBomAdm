import React, { useState } from "react";
import { Button, Table, Icon, Label, Menu, MenuItem } from 'semantic-ui-react';
import { Link } from "react-router-dom";
import NavbarAcoes from "../../../components/navbarAcoes/NavbarAcoes";
import Header from "../../../components/header/Header";
import { useMediaQuery } from 'react-responsive';

import './ListaDoacoesRetirar.css';

const doacoes = [
    { id: 1, nome: "Evento A", endereco: "Rua X, 123", data: "2024-10-12", status: "Pendente" },
    { id: 2, nome: "Evento B", endereco: "Rua Y, 456", data: "2024-10-13", status: "Retirado" },
    { id: 3, nome: "Evento C", endereco: "Rua Z, 789", data: "2024-10-14", status: "Retirado" },
    { id: 4, nome: "Evento D", endereco: "Rua W, 101", data: "2024-10-15", status: "Retirado" },
    { id: 5, nome: "Evento E", endereco: "Rua V, 202", data: "2024-10-16", status: "Pendente" },
    { id: 6, nome: "Evento F", endereco: "Rua U, 303", data: "2024-10-17", status: "Pendente" },
    { id: 7, nome: "Evento G", endereco: "Rua T, 404", data: "2024-10-18", status: "Pendente" },
    { id: 8, nome: "Evento H", endereco: "Rua S, 505", data: "2024-10-19", status: "Pendente" },
    { id: 9, nome: "Evento I", endereco: "Rua R, 606", data: "2024-10-20", status: "Retirado" },
    { id: 10, nome: "Evento J", endereco: "Rua S, 707", data: "2024-10-21", status: "Pendente" },
    { id: 11, nome: "Evento J", endereco: "Rua S, 707", data: "2024-10-21", status: "Pendente" },
    { id: 12, nome: "Evento J", endereco: "Rua S, 707", data: "2024-10-21", status: "Pendente" },
    { id: 13, nome: "Evento J", endereco: "Rua S, 707", data: "2024-10-21", status: "Pendente" },
    { id: 14, nome: "Evento J", endereco: "Rua S, 707", data: "2024-10-21", status: "Pendente" },

];

function ListaDoacoesRetirar() {
    
    const [paginaAtual, setPaginaAtual] = useState(1);
    const itensPorPagina = 5;
    const isMobile = useMediaQuery({ query: '(max-width: 768px)' });


    const indexUltimoItem = paginaAtual * itensPorPagina;
    const indexPrimeiroItem = indexUltimoItem - itensPorPagina;
    const doacoesPaginaAtual = doacoes.slice(indexPrimeiroItem, indexUltimoItem);

    const paginasTotais = Math.ceil(doacoes.length / itensPorPagina);

    const handlePaginaClick = (numeroPagina) => {
        setPaginaAtual(numeroPagina);
    };

    // Calcular quantas linhas extras precisam ser adicionadas
    const linhasExtras = itensPorPagina - doacoesPaginaAtual.length;

    return (
        <>
            <NavbarAcoes />
            <Header title1={"Doações à"} title2={"Retirar"} />
            <div className="lista-doacoesRetirar-container">
                {!doacoes.length ? (
                    <div className="array-vazio">
                        <h1>No momento não há doações! </h1>
                    </div>
                ) : isMobile ? (
                    // VERSÃO MOBILE
                    <div className="mobile-table-container">
                        {doacoesPaginaAtual.map((doacao) => (
                            <div key={doacao.id} className="mobile-table-row">
                                <div className="mobile-table-cell">
                                    <strong>ID:</strong> {doacao.id}
                                </div>
                                <div className="mobile-table-cell">
                                    <strong>Nome:</strong> {doacao.nome}
                                </div>
                                <div className="mobile-table-cell">
                                    <strong>Endereço:</strong> {doacao.endereco}
                                </div>
                                <div className="mobile-table-cell">
                                    <strong>Data:</strong> {doacao.data}
                                </div>
                                <div className="mobile-table-cell">
                                    <strong>Status:</strong> {doacao.status}
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
                                className="table-row-doacoesRetirar"
                            >
                                <Icon name="chevron right" />
                            </MenuItem>
                        </Menu>
                    </div>
                ) : (
                    // VERSÃO DESKTOP
                    <Table celled stackable>
                        <Table.Header>
                            <Table.Row className="table-row-doacoesRetirar">
                                <Table.HeaderCell className="table-row-doacoesRetirar">ID</Table.HeaderCell>
                                <Table.HeaderCell className="table-row-doacoesRetirar">Nome</Table.HeaderCell>
                                <Table.HeaderCell className="table-row-doacoesRetirar">Endereço</Table.HeaderCell>
                                <Table.HeaderCell className="table-row-doacoesRetirar">Data do Registro</Table.HeaderCell>
                                <Table.HeaderCell className="table-row-doacoesRetirar">Status</Table.HeaderCell>
                                <Table.HeaderCell className="table-row-doacoesRetirar">Ações</Table.HeaderCell>
                            </Table.Row>
                        </Table.Header>

                        <Table.Body className="table-body-fixed">
                            {doacoesPaginaAtual.map((doacao) => (
                                <Table.Row key={doacao.id}>
                                    <Table.Cell>{doacao.id}</Table.Cell>
                                    <Table.Cell>{doacao.nome}</Table.Cell>
                                    <Table.Cell>{doacao.endereco}</Table.Cell>
                                    <Table.Cell>{doacao.data}</Table.Cell>
                                    <Table.Cell>{doacao.status}</Table.Cell>
                                    <Table.Cell>
                                        <Icon name="pencil" color="yellow" size="large" />
                                        <Icon name="trash alternate outline" color="red" size="large" />
                                    </Table.Cell>
                                </Table.Row>
                            ))}

                            {/* Preencher linhas vazias */}
                            {Array.from({ length: linhasExtras }).map((_, index) => (
                                <Table.Row key={`extra-${index}`}>
                                    <Table.Cell colSpan="6" className="empty-row" />
                                </Table.Row>
                            ))}
                        </Table.Body>

                        <Table.Footer className="table-footer-fixed">
                            <Table.Row>
                                <Table.HeaderCell colSpan="6">
                                    <Menu floated="right" pagination>
                                        <MenuItem
                                            as="a"
                                            icon
                                            onClick={() => handlePaginaClick(Math.max(1, paginaAtual - 1))}
                                            className="table-row-doacoesRetirar"
                                            disabled={paginaAtual === 1}
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
                                            className="table-row-doacoesRetirar"
                                            disabled={paginaAtual === paginasTotais}
                                        >
                                            <Icon name="chevron right" />
                                        </MenuItem>
                                    </Menu>
                                </Table.HeaderCell>
                            </Table.Row>
                        </Table.Footer>
                    </Table>
                )}
                <Link to="/prioridade">
                    <Button type="submit" className="btn-doacoesRetirar">
                        Prioridade para doação
                    </Button>
                </Link>
            </div>
        </>
    );
}



export default ListaDoacoesRetirar;
