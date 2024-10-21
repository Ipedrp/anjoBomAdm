import React, { useState, useEffect } from "react";
import { Button, Table, Icon, Label, Menu, MenuItem, Form, Input, FormInput } from 'semantic-ui-react';
import { Link } from "react-router-dom";
import NavbarAcoes from "../../../components/navbarAcoes/NavbarAcoes";
import Header from "../../../components/header/Header";
import axios from "axios";
import Swal from "sweetalert2";
import { useMediaQuery } from 'react-responsive';

import './ListaEvento.css';

function ListaEvento() {
    const [paginaAtual, setPaginaAtual] = useState(1);
    const itensPorPagina = 5;
    const [allEventos, setAllEventos] = useState([]);
    const [editando, setEditando] = useState(false); // Controle do modo de edição
    const [eventoParaEditar, setEventoParaEditar] = useState(null); // Dados do ponto a ser editado
    const [formCriarEvento, setFormCriarEvento] = useState({
        titulo: '',
        descricao: '',
        address: {
            cep: '',
            estado: '',
            cidade: '',
            bairro: '',
            rua: '',
            numero: ''
        },
        data_inicio: '11-11-2012',
        data_fim: '11-12-2024',
        // photos_event: [],
    });


    const isMobile = useMediaQuery({ query: '(max-width: 768px)' });
    const token = localStorage.getItem('authorization');

    // Estado para armazenar os erros de validação
    const [erros, setErros] = useState({
        titulo: '',
        descricao: '',
        cep: '',
        estado: '',
        cidade: '',
        bairro: '',
        rua: '',
        numero: ''

        // photos_event: [],
    });

    useEffect(() => {
        fetchEventos();
    }, [])


    const fetchEventos = async () => {
        try {
            const response = await axios.get('https://apianjobom.victordev.shop/eventos/', {
                headers: {
                    Authorization: token
                }
            });
            setAllEventos(response.data);
            console.log("EVENTOS aqui embaixo");
            console.log(allEventos);
        } catch (error) {
            console.error('Erro ao buscar os EVENTOS:', error);
        }
    };



    const deletarEvento = async (id) => {
        // console.log("eventoDELETADO")
        try {
            const response = await axios.delete(`https://apianjobom.victordev.shop/admin/deletarEvento/${id}`, {
                headers: {
                    Authorization: token
                }
            })
            localStorage.setItem('authorization', response.data.token)
            console.log(response.data, "essa é a resposta dessa porra")
            Swal.fire({
                icon: 'success',
                title: 'Deletado!',
                text: 'O Evento foi deletado.',
                timer: 1300,
                showConfirmButton: false
            });
            fetchEventos();
        } catch (error) {
            console.error('Erro ao deletar oEvento:', error);
            fetchEventos();
        }
    }


    const confirmarDelecao = (id) => {
        Swal.fire({
            title: 'Tem certeza?',
            text: "Você não poderá reverter isso!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#1a7b37',
            cancelButtonColor: '#882020',
            confirmButtonText: 'Sim, deletar!',
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.isConfirmed) {
                deletarEvento(id);
            }
        });
    };

    //Área de Edição    

    const formatCEP = (cep) => {
        const cleaned = ('' + cep).replace(/\D/g, ''); // Remove qualquer caractere não numérico
        // Aplica a máscara para CEP no formato "99999-999"
        const match = cleaned.match(/^(\d{5})(\d{3})$/);
        return match ? `${match[1]}-${match[2]}` : cleaned;
    }


    const validateCep = async (value) => {

        try {
            const response = await axios.get(`https://viacep.com.br/ws/${value}/json/`);
            if (response.data && !response.data.erro) {
                // Se o CEP for válido
                setFormCriarEvento((prevState) => ({
                    ...prevState,
                    address: {
                        ...prevState.address,
                        rua: response.data.logradouro,
                        bairro: response.data.bairro,
                        cidade: response.data.localidade,
                        estado: response.data.uf,
                    },
                }));
                console.log(""); // Limpa o erro se for válido
            } else {
                console.log("CEP inválido"); // Atualiza o erro se o CEP for inválido
            }
        } catch (error) {
            console.error("Erro ao buscar o CEP:", error);
        }
    };



    // Função para carregar os dados do Evento no formulário
    const handleEditarEvento = (evento) => {
        const cepFormatado = formatCEP(evento.address.cep);
        setFormCriarEvento({
            titulo: evento.titulo,
            descricao: evento.descricao,
            name: evento.name,
            urlMap: evento.urlMap,
            address: {
                cep: cepFormatado,
                estado: evento.address.estado,
                cidade: evento.address.cidade,
                bairro: evento.address.bairro,
                rua: evento.address.rua,
                numero: evento.address.numero
            }
        });

        validateCep(cepFormatado);
        setEventoParaEditar(evento);
        setEditando(true);
    };

    // Função para cancelar a edição
    const cancelarEdicao = () => {
        setEditando(false);
        setEventoParaEditar(null);
        setErros('');
    };

    // Função para enviar o formulário editado
    const enviarEdicao = async () => {


        const { name, cep, estado } = formCriarEvento;
        let encontrouErros = false;
        const novosErros = {};

        if (name.trim() === '') {
            novosErros.titulo = 'Título do evento é obrigatório';
            encontrouErros = true;
        }
        if (cep.length < 9) {
            novosErros.cep = 'CEP inválido, deve conter 9 caracteres';
            encontrouErros = true;
        }
        if (estado.trim() === '') {
            novosErros.estado = 'O estado é obrigatório';
            encontrouErros = true;
        }

        if (encontrouErros) {
            setErros(novosErros);
            return;
        }

        // Se não houver erros, continue com o envio
        // Sua lógica de envio...
        try {
            await axios.put(`https://apianjobom.victordev.shop/admin/editarPontoDeColeta/${eventoParaEditar.id}`, formCriarEvento, {
                headers: { Authorization: token }
            });
            fetchEventos();
            setEditando(false); // Volta para a tabela
        } catch (error) {
            console.error('Erro ao editar evento:', error);
        }


    };

    //Fim área de Edição


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
                {!editando ? (
                    <>
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
                                            <Icon name="pencil" color="yellow" size="large"
                                                onClick={() => handleEditarEvento(evento)} />
                                            <Icon
                                                name="trash alternate outline"
                                                color="red"
                                                size="large"
                                                onClick={() => confirmarDelecao(evento.id)} />
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
                                                <Icon name="pencil" color="yellow" size="large"
                                                    onClick={() =>
                                                        handleEditarEvento(evento)}
                                                    style={{ cursor: 'pointer' }}
                                                />
                                                <Icon name="trash alternate outline" color="red" size="large" onClick={() => confirmarDelecao(evento.id)}
                                                    style={{ cursor: 'pointer' }} />
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
                    </>

                ) : (
                    // Formulário de Edição
                    <div className="form-container-criarPontoColeta">
                        <Form>
                            {/* Nome do Ponto de Coleta */}
                            <FormInput
                                label={<label className="blue-label-criarPontoColeta">Título do Evento</label>}
                                value={formCriarEvento.titulo}
                                maxLength={70} // Limite máximo de 50 caracteres
                                error={erros.titulo ? { content: erros.titulo } : undefined} // Exibe o erro se houver
                                onChange={(e) => {
                                    const novoTitulo = e.target.value;
                                    setFormCriarEvento({ ...formCriarEvento, titulo: novoTitulo });

                                    // Validação: o Título não pode estar vazio
                                    if (novoTitulo.trim() === '') {
                                        setErros({ ...erros, name: 'Título do Evento é obrigatório' });
                                    } else if (novoTitulo.length > 69) {
                                        setErros({ ...erros, name: 'Título deve ter no máximo 70 caracteres' });
                                    } else {
                                        const { titulo, ...restErros } = erros;
                                        setErros(restErros); // Remove o erro do nome se o valor for válido
                                    }
                                }}
                            />

                            {/* CEP */}
                            <FormInput
                                label={<label className="blue-label-criarPontoColeta">CEP</label>}
                                maxLength={9} // Limita para 9 caracteres (99999-999)
                                value={formCriarEvento.address.cep}
                                error={erros.cep ? { content: erros.cep } : undefined} // Exibe o erro se houver
                                onChange={(e) => {
                                    const cepComMascara = formatCEP(e.target.value);
                                    setFormCriarEvento({
                                        ...formCriarEvento,
                                        address: { ...formCriarEvento.address, cep: cepComMascara }
                                    });

                                    // Validação: o CEP precisa ter 9 caracteres
                                    if (cepComMascara.length < 9) {
                                        setErros({ ...erros, cep: 'CEP inválido, deve conter 9 caracteres' });
                                    } else {
                                        const { cep, ...restErros } = erros;
                                        setErros(restErros); // Remove o erro do CEP se for válido
                                    }

                                    // Se o CEP estiver completo, faça a validação extra
                                    if (cepComMascara.length === 9) {
                                        validateCep(cepComMascara);
                                    }
                                }}
                            />

                            {/* Estado */}
                            <FormInput
                                label={<label className="blue-label-criarPontoColeta">Estado</label>}
                                value={formCriarEvento.address.estado}
                                maxLength={2}
                                error={erros.estado ? { content: erros.estado } : undefined} // Exibe o erro se houver
                                onChange={(e) => {
                                    const novoEstado = e.target.value.toUpperCase(); // Convertendo para maiúsculo
                                    setFormCriarEvento({
                                        ...formCriarEvento,
                                        address: { ...formCriarEvento.address, estado: novoEstado }
                                    });

                                    // Validação: o estado não pode estar vazio
                                    if (novoEstado.trim() === '') {
                                        setErros({ ...erros, estado: 'O estado é obrigatório' });
                                    } else if (novoEstado.length > 2) {
                                        setErros({ ...erros, estado: 'O estado deve ter no máximo 2 caracteres' });
                                    } else {
                                        const { estado, ...restErros } = erros;
                                        setErros(restErros); // Remove o erro do estado se o valor for válido
                                    }
                                }}
                            />

                            {/* Cidade */}
                            <FormInput
                                label={<label className="blue-label-criarPontoColeta">Cidade</label>}
                                maxLength={50}
                                value={formCriarEvento.address.cidade}
                                error={erros.cidade ? { content: erros.cidade } : undefined} // Exibe o erro se houver
                                onChange={(e) => {
                                    const novaCidade = e.target.value;
                                    setFormCriarEvento({
                                        ...formCriarEvento,
                                        address: { ...formCriarEvento.address, cidade: novaCidade }
                                    });

                                    // Validação: a cidade não pode estar vazia
                                    if (novaCidade.trim() === '') {
                                        setErros({ ...erros, cidade: 'A cidade é obrigatória' });
                                    } else if (novaCidade.length > 49) {
                                        setErros({ ...erros, cidade: 'A cidade deve ter no máximo 50 caracteres' });
                                    } else {
                                        const { cidade, ...restErros } = erros;
                                        setErros(restErros); // Remove o erro da cidade se o valor for válido
                                    }
                                }}
                            />

                            {/* Bairro */}
                            <FormInput
                                label={<label className="blue-label-criarPontoColeta">Bairro</label>}
                                maxLength={50}
                                value={formCriarEvento.address.bairro}
                                error={erros.bairro ? { content: erros.bairro } : undefined} // Exibe o erro se houver
                                onChange={(e) => {
                                    const novoBairro = e.target.value;
                                    setFormCriarEvento({
                                        ...formCriarEvento,
                                        address: { ...formCriarEvento.address, bairro: novoBairro }
                                    });

                                    // Validação: o bairro não pode estar vazio
                                    if (novoBairro.trim() === '') {
                                        setErros({ ...erros, bairro: 'O bairro é obrigatório' });
                                    } else if (novoBairro.length > 49) {
                                        setErros({ ...erros, bairro: 'O bairro deve ter no máximo 50 caracteres' });
                                    } else {
                                        const { bairro, ...restErros } = erros;
                                        setErros(restErros); // Remove o erro do bairro se o valor for válido
                                    }
                                }}
                            />

                            {/* Rua */}
                            <FormInput
                                label={<label className="blue-label-criarPontoColeta">Rua</label>}
                                maxLength={50}
                                value={formCriarEvento.address.rua}
                                error={erros.rua ? { content: erros.rua } : undefined} // Exibe o erro se houver
                                onChange={(e) => {
                                    const novaRua = e.target.value;
                                    setFormCriarEvento({
                                        ...formCriarEvento,
                                        address: { ...formCriarEvento.address, rua: novaRua }
                                    });

                                    // Validação: a rua não pode estar vazia
                                    if (novaRua.trim() === '') {
                                        setErros({ ...erros, rua: 'A rua é obrigatória' });
                                    } else if (novaRua.length > 49) {
                                        setErros({ ...erros, rua: 'A rua deve ter no máximo 50 caracteres' });
                                    } else {
                                        const { rua, ...restErros } = erros;
                                        setErros(restErros); // Remove o erro da rua se o valor for válido
                                    }
                                }}
                            />

                            {/* Número */}
                            <FormInput
                                label={<label className="blue-label-criarPontoColeta">Número</label>}
                                value={formCriarEvento.address.numero}
                                maxLength={6}
                                error={erros.numero ? { content: erros.numero } : undefined} // Exibe o erro se houver
                                onChange={(e) => {
                                    const novoNumero = e.target.value;
                                    setFormCriarEvento({
                                        ...formCriarEvento,
                                        address: { ...formCriarEvento.address, numero: novoNumero }
                                    });

                                    // Validação: o número não pode estar vazio
                                    if (novoNumero.trim() === '') {
                                        setErros({ ...erros, numero: 'O número é obrigatório' });
                                    } else if (novoNumero.length > 6) {
                                        setErros({ ...erros, numero: 'O número deve ter no máximo 6 caracteres' });
                                    } else {
                                        const { numero, ...restErros } = erros;
                                        setErros(restErros); // Remove o erro do número se o valor for válido
                                    }
                                }}
                            />
                            {/* URL do Mapa */}
                            <FormInput
                                label={<label className="blue-label-criarPontoColeta">URL do Mapa</label>}
                                value={formCriarEvento.descricao}
                                maxLength={255} 
                                error={erros.urlMap ? { content: erros.urlMap } : undefined} // Exibe o erro se houver
                                onChange={(e) => {
                                    const novaDescricao = e.target.value;
                                    setFormCriarEvento({
                                        ...formCriarEvento,
                                        descricao: novaDescricao
                                    });

                                    // Validação: a descricao não pode estar vazia
                                    if (novaDescricao.trim() === '') {
                                        setErros({ ...erros, descricao: 'Descrição do Evento é obrigatória' });
                                    } else if (novaDescricao.length > 254) {
                                        setErros({ ...erros, descricao: 'A Descrição do Evento deve ter no máximo 255 caracteres' });
                                    } else {
                                        const { descricao, ...restErros } = erros;
                                        setErros(restErros); // Remove o erro da URL se o valor for válido
                                    }
                                }}
                            />



                            {/* Botões de ação */}
                            <div className="container-acoes-btnc-ataualizarPontoColeta">
                                <Button type="button" color="red" onClick={cancelarEdicao}>Cancelar</Button>
                                <Button type="submit" className="salvarAtualizacao" onClick={enviarEdicao}>Salvar atualização</Button>
                            </div>
                        </Form>


                    </div>
                )}

            </div>
        </>
    );
}

export default ListaEvento;
