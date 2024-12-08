import React, { useState, useEffect } from "react";
import { Button, Table, Icon, Menu, MenuItem, Form, Input, FormInput, FormGroup } from 'semantic-ui-react';
import { Link, useNavigate } from "react-router-dom";
import NavbarAcoes from "../../../components/navbarAcoes/NavbarAcoes";
import Header from "../../../components/header/Header";
import axios from "axios";
import Swal from "sweetalert2";
import { useMediaQuery } from 'react-responsive';

import './ListaPontoColeta.css';

function ListaPontoColeta() {
    const [paginaAtual, setPaginaAtual] = useState(1);
    const itensPorPagina = 5;
    const [pontos, setPontos] = useState([]);
    const [editando, setEditando] = useState(false); // Controle do modo de edição
    const [pontoParaEditar, setPontoParaEditar] = useState(null); // Dados do ponto a ser editado
    const [formCriarPontoColeta, setFormCriarPontoColeta] = useState({
        name: '',
        urlMap: '',
        address: {
            cep: '',
            estado: '',
            cidade: '',
            bairro: '',
            rua: '',
            numero: ''
        }
    });

    const isMobile = useMediaQuery({ query: '(max-width: 768px)' });
    const token = localStorage.getItem('authorization');
    const navigate = useNavigate(); // Hook para navegação


    // Estado para armazenar os erros de validação
    const [erros, setErros] = useState({
        name: '',
        cep: '',
        estado: '',
        cidade: '',
        bairro: '',
        rua: '',
        numero: '',
        urlMap: ''
    });


    useEffect(() => {
        console.log("Executando fetchPontos na montagem do componente");
        fetchPontos();
    }, []);

    const fetchPontos = async () => {
        console.log("Iniciando fetchPontos...");
        try {
            const response = await axios.get('https://apianjobom.victordev.shop/coletas/buscarPontosDeColeta', {
                headers: { Authorization: token }
            });
            console.log("Resposta de fetchPontos:", response.data); // Log para ver os dados retornados
            setPontos(response.data);
        } catch (error) {
            if (error.response?.status === 404) {
                console.warn("Nenhum ponto encontrado (404). Configurando 'pontos' como vazio.");
                setPontos([]); // Define o estado como vazio se o erro for 404
            } else {
                console.error("Erro ao buscar os pontos de coleta:", error);
            }
        }
    };

    const deletarPontoColeta = async (id) => {
        try {
            console.log("Iniciando exclusão do ponto de coleta com ID:", id);
            await axios.delete(`https://apianjobom.victordev.shop/admin/deletarPontoDeColeta/${id}`, {
                headers: { Authorization: token }
            });
            Swal.fire({
                icon: 'success',
                title: 'Deletado!',
                text: 'O ponto de coleta foi deletado.',
                timer: 1300,
                showConfirmButton: false
            });

            console.log("Exclusão concluída, chamando fetchPontos...");
            fetchPontos(); // Atualiza os pontos de coleta
            console.log("fetchPontos chamado após exclusão.");
        } catch (error) {
            console.error("Erro ao deletar Ponto de Coleta:", error);
        }
    };

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
                console.log("Confirmação de deleção recebida para ID:", id);
                deletarPontoColeta(id);
            }
        });
    };


    const verMais = async (id) => {
        try {
            const response = await axios.get('https://apianjobom.victordev.shop/coletas/buscarPontosDeColeta', {
                headers: { Authorization: token },
            });

            const ponto = response.data.find((ponto) => ponto.id === id);

            if (ponto) {
                Swal.fire({
                    title: `${ponto.name}`,
                    html: `  
                            <div class="ponto-coleta-details">
                                <p> <span>CEP:</span> ${ponto.address.cep}</p>
                                <p><span>Cidade:</span> ${ponto.address.cidade}</p>
                                <p><span>Rua:</span> ${ponto.address.rua}</p>
                                <p><span>Estado:</span> ${ponto.address.estado}</p>
                                <p><span>Bairro:</span> ${ponto.address.bairro}</p>
                                <p><span>Número:</span> ${ponto.address.numero}</p>
                                <p><span>UrlMap:</span> ${ponto.urlMap}</p>
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
                setFormCriarPontoColeta((prevState) => ({
                    ...prevState,
                    address: {
                        ...prevState.address,
                        rua: response.data.logradouro,
                        bairro: response.data.bairro,
                        cidade: response.data.localidade,
                        estado: response.data.uf,
                    },
                }));
                // Limpa o erro do CEP se for válido
                setErros((prevErros) => {
                    const { cep, ...restErros } = prevErros;
                    return restErros;
                });
            } else {
                // Atualiza o erro se o CEP for inválido
                setErros((prevErros) => ({
                    ...prevErros,
                    cep: "CEP inválido, por favor verifique.",
                }));
            }
        } catch (error) {
            console.error("Erro ao buscar o CEP:", error);
            // Opcional: exibir uma mensagem de erro geral se a busca falhar
            setErros((prevErros) => ({
                ...prevErros,
                cep: "Erro ao validar o CEP. Tente novamente mais tarde.",
            }));
        }
    };



    // Função para carregar os dados do ponto de coleta no formulário
    const handleEditarPonto = (ponto) => {
        const cepFormatado = formatCEP(ponto.address.cep);
        setFormCriarPontoColeta({
            name: ponto.name,
            urlMap: ponto.urlMap,
            address: {
                cep: cepFormatado,
                estado: ponto.address.estado,
                cidade: ponto.address.cidade,
                bairro: ponto.address.bairro,
                rua: ponto.address.rua,
                numero: ponto.address.numero
            }
        });

        validateCep(cepFormatado);
        setPontoParaEditar(ponto);
        setEditando(true);
    };

    // Função para cancelar a edição
    const cancelarEdicao = () => {
        setEditando(false);
        setPontoParaEditar(null);
        setErros('');
    };

    // Função para enviar o formulário editado
    const enviarEdicao = async () => {
        const { name, urlMap, address } = formCriarPontoColeta;
        const { cep, estado, cidade, bairro, rua, numero } = address;
        let encontrouErros = false;
        const novosErros = {};

        // Validação dos campos
        if (name.trim() === '') {
            novosErros.name = 'Nome do ponto de coleta é obrigatório';
            encontrouErros = true;
        }
        if (cep.trim() === '') {
            novosErros.cep = 'CEP é obrigatório';
            encontrouErros = true;
        } else if (cep.length < 9) {
            novosErros.cep = 'CEP inválido, deve conter 9 caracteres';
            encontrouErros = true;
        }
        if (estado.trim() === '') {
            novosErros.estado = 'O estado é obrigatório';
            encontrouErros = true;
        }
        if (cidade.trim() === '') {
            novosErros.cidade = 'A cidade é obrigatória';
            encontrouErros = true;
        }
        if (bairro.trim() === '') {
            novosErros.bairro = 'O bairro é obrigatório';
            encontrouErros = true;
        }
        if (rua.trim() === '') {
            novosErros.rua = 'A rua é obrigatória';
            encontrouErros = true;
        }
        if (numero.trim() === '') {
            novosErros.numero = 'O número é obrigatório';
            encontrouErros = true;
        }
        if (urlMap.trim() === '') {
            novosErros.urlMap = 'A URL do mapa é obrigatória';
            encontrouErros = true;
        }

        // Verifica e valida o CEP antes de enviar
        await validateCep(formCriarPontoColeta.address.cep);

        // Checa se o campo CEP possui erro
        if (erros.cep) {
            console.log("Erro ao atualizar: CEP inválido.");
            return; // Interrompe o envio se o CEP for inválido
        }

        if (encontrouErros) {
            setErros(novosErros);
            return;
        }

        // Se não houver erros, continue com o envio
        try {
            await axios.put(`https://apianjobom.victordev.shop/admin/atualizarPontoDeColeta/${pontoParaEditar.id}`, formCriarPontoColeta, {
                headers: { Authorization: token }
            });
            Swal.fire({
                icon: 'success',
                title: 'Atualizado!',
                text: 'O ponto de coleta foi atualizado.',
                timer: 1300,
                showConfirmButton: false
            });
            fetchPontos();
            setEditando(false); // Volta para a tabela
        } catch (error) {
            console.error('Erro ao editar o ponto de coleta:', error);
        }
    };

    console.log("todos os pontos", pontos)



    const indexUltimoItem = paginaAtual * itensPorPagina;
    const indexPrimeiroItem = indexUltimoItem - itensPorPagina;
    const pontoColetaPaginaAtual = pontos.slice(indexPrimeiroItem, indexUltimoItem);
    const paginasTotais = Math.ceil(pontos.length / itensPorPagina);

    const handlePaginaClick = (numeroPagina) => setPaginaAtual(numeroPagina);

    // Calcular quantas linhas extras precisam ser adicionadas
    const linhasExtras = itensPorPagina - pontoColetaPaginaAtual.length;
    return (
        <>
            <NavbarAcoes />
            <Header title1={"Ponto de"} title2={"Coleta"} />

            <div className="lista-listaPontoColeta-container">
                {!editando ? (
                    <>
                        {!pontos.length ? (
                            <div className="array-vazio">
                                <h1>No momento não há pontos de coleta! </h1>
                            </div>
                        ) : isMobile ? (
                            // VERSÃO MOBILE
                            <div className="mobile-table-container">
                                {pontoColetaPaginaAtual.map((ponto) => (
                                    <div key={ponto.id} className="mobile-table-row">
                                        <div className="mobile-table-cell">
                                            <strong>Nome:</strong> {ponto.name}
                                        </div>
                                        <div className="mobile-table-cell">
                                            <strong>Endereço:</strong> {ponto.address.rua}
                                        </div>
                                        <div className="mobile-table-actions">
                                            <Icon
                                                name="pencil"
                                                color="yellow"
                                                size="large"
                                                onClick={() => handleEditarPonto(ponto)} />
                                            <Icon
                                                name="trash alternate outline"
                                                color="red"
                                                size="large"
                                                onClick={() => confirmarDelecao(ponto.id)} />
                                            <Icon
                                                name="eye"
                                                color="blue"
                                                size="large"
                                                onClick={() => verMais(ponto.id)}
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
                                        <Table.HeaderCell className="table-row-listaPontoColeta">Nome</Table.HeaderCell>
                                        <Table.HeaderCell className="table-row-listaPontoColeta">Endereço</Table.HeaderCell>
                                        <Table.HeaderCell className="table-row-listaPontoColeta">Ações</Table.HeaderCell>
                                    </Table.Row>
                                </Table.Header>

                                <Table.Body className="table-body-fixed">
                                    {pontoColetaPaginaAtual.map((ponto) => (
                                        <Table.Row key={ponto.id}>
                                            <Table.Cell>{ponto.name}</Table.Cell>
                                            <Table.Cell>{ponto.address.cidade}</Table.Cell>
                                            <Table.Cell>
                                                <Icon
                                                    name="pencil"
                                                    color="yellow"
                                                    size="large"
                                                    onClick={() => handleEditarPonto(ponto)}
                                                    style={{ cursor: 'pointer' }} />
                                                <Icon
                                                    name="trash alternate outline"
                                                    color="red"
                                                    size="large"
                                                    onClick={() => confirmarDelecao(ponto.id)}
                                                    style={{ cursor: 'pointer' }} />
                                                <Icon
                                                    name="eye"
                                                    color="blue"
                                                    size="large"
                                                    onClick={() => verMais(ponto.id)}
                                                    style={{ cursor: 'pointer' }} />


                                            </Table.Cell>
                                        </Table.Row>
                                    ))}

                                    {/* Preencher linhas vazias */}
                                    {Array.from({ length: linhasExtras }).map((_, index) => (
                                        <Table.Row key={`extra-${index}`}>
                                            <Table.Cell colSpan="3" className="empty-row" />
                                        </Table.Row>
                                    ))}
                                </Table.Body>

                                <Table.Footer className="table-footer-fixed">
                                    <Table.Row>
                                        <Table.HeaderCell colSpan="3">
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


                    </>
                ) : (
                    // Formulário de Edição
                    <div className="form-container-criarPontoColeta">
                        <div className="input-area-criarPontoColeta">
                            <Form>
                                {/* Nome do Ponto de Coleta */}
                                <FormInput
                                    fluid
                                    label={<label className="blue-label-criarPontoColeta">Nome do Ponto de Coleta</label>}
                                    value={formCriarPontoColeta.name}
                                    maxLength={70} // Limite máximo de 50 caracteres
                                    error={erros.name ? { content: erros.name } : undefined} // Exibe o erro se houver
                                    onChange={(e) => {
                                        const novoNome = e.target.value;
                                        setFormCriarPontoColeta({ ...formCriarPontoColeta, name: novoNome });

                                        // Validação: o nome não pode estar vazio
                                        if (novoNome.trim() === '') {
                                            setErros({ ...erros, name: 'Nome do ponto de coleta é obrigatório' });
                                        } else if (novoNome.length > 69) {
                                            setErros({ ...erros, name: 'Nome deve ter no máximo 70 caracteres' });
                                        } else {
                                            const { name, ...restErros } = erros;
                                            setErros(restErros); // Remove o erro do nome se o valor for válido
                                        }
                                    }}
                                />

                                {/* URL do Mapa */}
                                <FormInput
                                    fluid
                                    label={<label className="blue-label-criarPontoColeta">URL do Mapa</label>}
                                    value={formCriarPontoColeta.urlMap}
                                    maxLength={255}
                                    error={erros.urlMap ? { content: erros.urlMap } : undefined} // Exibe o erro se houver
                                    onChange={(e) => {
                                        const novaUrlMap = e.target.value;
                                        setFormCriarPontoColeta({
                                            ...formCriarPontoColeta,
                                            urlMap: novaUrlMap
                                        });

                                        // Validação: a URL não pode estar vazia
                                        if (novaUrlMap.trim() === '') {
                                            setErros({ ...erros, urlMap: 'A URL do mapa é obrigatória' });
                                        } else if (novaUrlMap.length > 254) {
                                            setErros({ ...erros, urlMap: 'A URL do mapa deve ter no máximo 255 caracteres' });
                                        } else {
                                            const { urlMap, ...restErros } = erros;
                                            setErros(restErros); // Remove o erro da URL se o valor for válido
                                        }
                                    }}
                                />

                                {/* CEP */}
                                <FormInput
                                    fluid
                                    label={<label className="blue-label-criarPontoColeta">CEP</label>}
                                    maxLength={9} // Limita para 9 caracteres (99999-999)
                                    value={formCriarPontoColeta.address.cep}
                                    error={erros.cep ? { content: erros.cep } : undefined} // Exibe o erro se houver
                                    onChange={(e) => {
                                        const cepComMascara = formatCEP(e.target.value);
                                        setFormCriarPontoColeta({
                                            ...formCriarPontoColeta,
                                            address: { ...formCriarPontoColeta.address, cep: cepComMascara }
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

                                <FormGroup widths="equal">

                                    {/* Estado */}
                                    <FormInput
                                        fluid
                                        label={<label className="blue-label-criarPontoColeta">Estado</label>}
                                        value={formCriarPontoColeta.address.estado}
                                        maxLength={2}
                                        error={erros.estado ? { content: erros.estado } : undefined} // Exibe o erro se houver
                                        onChange={(e) => {
                                            const novoEstado = e.target.value.toUpperCase(); // Convertendo para maiúsculo
                                            setFormCriarPontoColeta({
                                                ...formCriarPontoColeta,
                                                address: { ...formCriarPontoColeta.address, estado: novoEstado }
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
                                        fluid
                                        label={<label className="blue-label-criarPontoColeta">Cidade</label>}
                                        maxLength={50}
                                        value={formCriarPontoColeta.address.cidade}
                                        error={erros.cidade ? { content: erros.cidade } : undefined} // Exibe o erro se houver
                                        onChange={(e) => {
                                            const novaCidade = e.target.value;
                                            setFormCriarPontoColeta({
                                                ...formCriarPontoColeta,
                                                address: { ...formCriarPontoColeta.address, cidade: novaCidade }
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
                                        fluid
                                        label={<label className="blue-label-criarPontoColeta">Bairro</label>}
                                        maxLength={50}
                                        value={formCriarPontoColeta.address.bairro}
                                        error={erros.bairro ? { content: erros.bairro } : undefined} // Exibe o erro se houver
                                        onChange={(e) => {
                                            const novoBairro = e.target.value;
                                            setFormCriarPontoColeta({
                                                ...formCriarPontoColeta,
                                                address: { ...formCriarPontoColeta.address, bairro: novoBairro }
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
                                </FormGroup>

                                <FormGroup widths="equal">


                                    {/* Rua */}
                                    <FormInput
                                        fluid
                                        label={<label className="blue-label-criarPontoColeta">Rua</label>}
                                        maxLength={50}
                                        value={formCriarPontoColeta.address.rua}
                                        error={erros.rua ? { content: erros.rua } : undefined} // Exibe o erro se houver
                                        onChange={(e) => {
                                            const novaRua = e.target.value;
                                            setFormCriarPontoColeta({
                                                ...formCriarPontoColeta,
                                                address: { ...formCriarPontoColeta.address, rua: novaRua }
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
                                        fluid
                                        label={<label className="blue-label-criarPontoColeta">Número</label>}
                                        value={formCriarPontoColeta.address.numero}
                                        maxLength={6}
                                        error={erros.numero ? { content: erros.numero } : undefined} // Exibe o erro se houver
                                        onChange={(e) => {
                                            const novoNumero = e.target.value;
                                            setFormCriarPontoColeta({
                                                ...formCriarPontoColeta,
                                                address: { ...formCriarPontoColeta.address, numero: novoNumero }
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
                                </FormGroup>




                            </Form>
                        </div>
                        {/* Botões de ação */}
                        <div className="container-acoes-btnc-criarPontoColeta">
                            <Button type="button" color="red" onClick={cancelarEdicao}>Cancelar</Button>
                            <Button type="submit" className="salvarAtualizacao" onClick={enviarEdicao}>Salvar atualização</Button>
                        </div>


                    </div>
                )}
            </div >
        </>
    );
}

export default ListaPontoColeta;
