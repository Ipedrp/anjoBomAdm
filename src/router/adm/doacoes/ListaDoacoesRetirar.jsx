import React, { useState, useEffect } from "react";
import { Button, Table, Icon, Label, Menu, MenuItem } from 'semantic-ui-react';
import { Link } from "react-router-dom";
import NavbarAcoes from "../../../components/navbarAcoes/NavbarAcoes";
import Header from "../../../components/header/Header";
import axios from "axios";
import Swal from "sweetalert2";
import { useMediaQuery } from 'react-responsive';

import './ListaDoacoesRetirar.css';

function ListaDoacoesRetirar() {

    useEffect(() => {
        window.scrollTo(0, 0); // Rola para o topo ao montar o componente
    }, []);

    const [doacoes, setDoacoes] = useState([]);

    const token = localStorage.getItem('authorization')

    useEffect(() => {
        fetchDoacoes();
    }, []);

    const fetchDoacoes = async () => {
        try {
            const response = await axios.get('https://apianjobom.victordev.shop/admin/cestas', {
                headers: { Authorization: token }
            });
            setDoacoes(response.data);

        } catch (error) {
            console.error('Erro ao buscar doações:', error);
        }
    };

    console.log("veja essas doacoes: ", doacoes)

    const atualizarCesta = async (id) => {
        console.log("esse é o id da doacao: ", id)
        try {
            const response = await axios.put(
                `https://apianjobom.victordev.shop/admin/cestas/${id}`, { id },
                { headers: { Authorization: token } }
            );
            if (response.status === 200) {
                alert('Cesta atualizada com sucesso!');
                fetchDoacoes(); // Recarregar as doações após a atualização
            }
            Swal.fire({
                title: 'Cesta atualizada com sucesso!',
                icon: 'success', 
                showConfirmButton: false,  // Remove o botão de confirmação
                timer: 1500,  // (Opcional) Adiciona um timer de 1.5 segundos antes de fechar automaticamente
            });

            fetchDoacoes();
            window.scrollTo(0, 0);
        } catch (error) {
            console.error('Erro ao atualizar a cesta:', error);
            alert('Erro ao atualizar a cesta.');
        }
    };

    const confirmarAtualizacao = (id) => {
        Swal.fire({
            title: 'Tem certeza?',
            text: "Essa cesta foi coletada?",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sim, coletada!',
            cancelButtonText: 'Cancelar',
        }).then((result) => {
            if (result.isConfirmed) {
                atualizarCesta(id);
            }
        });
    };

    const verMais = async (id) => {
        try {
            const response = await axios.get('https://apianjobom.victordev.shop/admin/cestas', {
                headers: { Authorization: token },
            });

            const doacao = response.data.find((doacao) => doacao.id === id);

            if (doacao) {
                Swal.fire({
                    title: `${doacao.doador.name}`,
                    html: `  
                        <div class="doacao-details">    
                            <p><strong>CEP:</strong> ${doacao.doador.address.cep || 'Não informado'}</p>
                            <p><strong>Cidade:</strong> ${doacao.doador.address.cidade || 'Não informado'}</p>
                            <p><strong>Rua:</strong> ${doacao.doador.address.rua || 'Não informado'}</p>
                            <p><strong>Bairro:</strong> ${doacao.doador.address.bairro || 'Não informado'}</p>
                            <p><strong>Estado:</strong> ${doacao.doador.address.estado || 'Não informado'}</p>
                            <p><strong>Telefone:</strong> ${doacao.doador.telefone || 'Não informado'}</p>
                            <p><strong>Status:</strong> ${doacao.status}</p>
                            <table style="width: 100%; border-collapse: collapse; margin-top: 10px;">
                                <thead>
                                    <tr style="background-color: #f1f1f1;">
                                        <th style="padding: 8px; text-align: left; border: 1px solid #ddd;">Produto</th>
                                        <th style="padding: 8px; text-align: left; border: 1px solid #ddd;">Quantidade</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    ${doacao.items.produtos.map(produto => `
                                        <tr>
                                            <td style="padding: 8px; border: 1px solid #ddd;">${produto.name}</td>
                                            <td style="padding: 8px; border: 1px solid #ddd;">${produto.quantity}</td>
                                        </tr>
                                    `).join('')}
                                </tbody>
                            </table>
                        </div>
                    `,
                    confirmButtonText: 'Fechar',
                    background: '#f0f0f0',
                    padding: '20px',
                });
                

            } else {
                Swal.fire({
                    title: 'Ponto de Coleta não encontrado',
                    icon: 'error',
                    confirmButtonText: 'Fechar',
                });
            }
        } catch (error) {
            console.error("Erro ao buscar pontos de coleta", error);
            Swal.fire({
                title: 'Erro ao buscar dados',
                text: 'Não foi possível carregar os detalhes.',
                icon: 'error',
                confirmButtonText: 'Fechar',
            });
        }
    };


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
                                    <strong>Nome: </strong> {doacao.doador.name}
                                </div>
                                <div className="mobile-table-cell">
                                    <strong>Telefone: </strong> {doacao.doador.telefone || 'Não informado'}
                                </div>
                                <div className="mobile-table-cell">
                                    <strong>Produtos: </strong>
                                    {doacao.items.produtos.map((produto) => produto.name).join(', ')}
                                </div>
                                <div className="mobile-table-cell">
                                    <strong>Quantidade Total: </strong>
                                    {/* Calculando o total de produtos */}
                                    {doacao.items.produtos.reduce((total, produto) => total + produto.quantity, 0)}
                                </div>
                                <div className="mobile-table-cell">
                                    <strong>Status:</strong> {doacao.status}
                                </div>
                                <div className="mobile-table-actions">
                                    {doacao.status === "PENDENTE" &&
                                        <Icon
                                            name="dolly"
                                            color="green"
                                            size="large"
                                            style={{ cursor: 'pointer' }}
                                            onClick={() => confirmarAtualizacao(doacao.id)}
                                        />}
                                    <Icon
                                        name="eye"
                                        color="blue"
                                        size="large"
                                        onClick={() => verMais(doacao.id)}
                                        style={{ cursor: 'pointer' }} />
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
                                <Table.HeaderCell className="table-row-doacoesRetirar">Nome</Table.HeaderCell>
                                <Table.HeaderCell className="table-row-doacoesRetirar">Telefone</Table.HeaderCell>
                                <Table.HeaderCell className="table-row-doacoesRetirar">Produtos</Table.HeaderCell>
                                <Table.HeaderCell className="table-row-doacoesRetirar">Quantidade Total</Table.HeaderCell>
                                <Table.HeaderCell className="table-row-doacoesRetirar">Status</Table.HeaderCell>
                                <Table.HeaderCell className="table-row-doacoesRetirar">Ações</Table.HeaderCell>
                            </Table.Row>
                        </Table.Header>

                        <Table.Body className="table-body-fixed">
                            {doacoesPaginaAtual.map((doacao) => (
                                <Table.Row key={doacao.id}>
                                    <Table.Cell>{doacao.doador.name}</Table.Cell>
                                    <Table.Cell>{doacao.doador.telefone || 'Não informado'}</Table.Cell>
                                    <Table.Cell>
                                        {doacao.items.produtos.map((produto) => produto.name).join(', ')}
                                    </Table.Cell>
                                    <Table.Cell>
                                        {/* Soma as quantidades de todos os produtos da doação */}
                                        {doacao.items.produtos.reduce((total, produto) => total + produto.quantity, 0)}
                                    </Table.Cell>
                                    <Table.Cell>{doacao.status}</Table.Cell>
                                    <Table.Cell>
                                        {doacao.status === "PENDENTE" &&
                                            <Icon
                                                name="dolly"
                                                color="green"
                                                size="large"
                                                style={{ cursor: 'pointer' }}
                                                onClick={() => confirmarAtualizacao(doacao.id)}
                                            />}
                                        <Icon
                                            name="eye"
                                            color="blue"
                                            size="large"
                                            onClick={() => verMais(doacao.id)}
                                            style={{ cursor: 'pointer' }} />
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
