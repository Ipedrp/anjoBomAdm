import React, { useState, useEffect } from "react";
import { Button, Table, Icon, Label, Menu, MenuItem, Form, FormGroup, FormInput, FormField, TextArea, Image } from 'semantic-ui-react';
import { Link } from "react-router-dom";
import { useNavigate } from 'react-router-dom';
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
        data_inicio: '',
        data_fim: '',
        // photos_event: [],
    });

    // Estado para armazenar os arquivos selecionados
    const [files, setFiles] = useState([]);
    const [existingPhotos, setExistingPhotos] = useState(eventoParaEditar?.photosUrl || []); // Fotos já salvas


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

    const [errorCep, setErrorCep] = useState(""); // Para o erro de CEP


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
            console.log(allEventos);
        } catch (error) {
            console.error('Erro ao buscar os EVENTOS:', error);
        }
    };


    const deletarEvento = async (id) => {
        try {
            await axios.delete(`https://apianjobom.victordev.shop/admin/deletarEvento/${id}`, {
                headers: {
                    Authorization: token
                }
            })
            Swal.fire({
                icon: 'success',
                title: 'Deletado!',
                text: 'O Evento foi deletado.',
                timer: 1300,
                showConfirmButton: false
            });
            fetchEventos();
        } catch (error) {
            console.error('Erro ao deletar Evento:', error);
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

    const verMais = async (id) => {
        try {
            const response = await axios.get('https://apianjobom.victordev.shop/eventos/', {
                headers: { Authorization: token },
            });

            const evento = response.data.find((evento) => evento.id === id);

            if (evento) {
                // Gerando as imagens como tags HTML
                const imagensHtml = evento.photosUrl.map(
                    (url) => `<img src="${url}" alt="Imagem do evento" style="width: 100%; max-width: 100px; margin: 10px 0; border-radius: 5px;">`
                ).join('');

                Swal.fire({
                    title: `${evento.titulo}`,
                    html: `  
                        <div class="evento-details">
                            <p><span>CEP:</span> ${evento.address.cep}</p>
                            <p><span>Cidade:</span> ${evento.address.cidade}</p>
                            <p><span>Rua:</span> ${evento.address.rua}</p>
                            <p><span>Estado:</span> ${evento.address.estado}</p>
                            <p><span>Bairro:</span> ${evento.address.bairro}</p>
                            <p><span>Número:</span> ${evento.address.numero}</p>
                            <p><span>Descrição:</span> ${evento.descricao}</p>
                            ${imagensHtml} <!-- Adicionando as imagens aqui -->
                        </div>
                    `,
                    confirmButtonText: 'Fechar',
                    background: '#f0f0f0',
                    padding: '20px',
                });
            } else {
                Swal.fire({
                    title: 'Evento não encontrado',
                    icon: 'error',
                    confirmButtonText: 'Fechar',
                });
            }
        } catch (error) {
            console.error("Erro ao buscar evento", error);
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
        const novosErros = { ...erros }; // Clona os erros existentes

        try {
            const response = await axios.get(`https://viacep.com.br/ws/${value}/json/`);
            if (response.data && !response.data.erro) {
                // Se o CEP for válido, limpa o erro do CEP
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
                setErrorCep(""); // Limpa o erro se for válido
            } else {
                // Atualiza com a mensagem de erro
                
                setErrorCep('CEP inválido');
            }
        } catch (error) {
            console.error("Erro ao buscar o CEP:", error);
        }

        setErros(novosErros); // Atualiza o estado de erros
    };



    // Função para carregar os dados do Evento no formulário, incluindo imagens
    const handleEditarEvento = (evento) => {
        const cepFormatado = formatCEP(evento.address.cep);

        // Atualiza o estado com os dados do evento e as imagens associadas
        setFormCriarEvento({
            titulo: evento.titulo,
            descricao: evento.descricao,
            address: {
                cep: cepFormatado,
                estado: evento.address.estado,
                cidade: evento.address.cidade,
                bairro: evento.address.bairro,
                rua: evento.address.rua,
                numero: evento.address.numero
            },
            data_inicio: evento.data_inicio,
            data_fim: evento.data_fim,
        });

        // Carrega as imagens existentes no estado `files`
        setFiles(evento.imagens || []);
        // Popula o estado das fotos existentes
        setExistingPhotos(evento.photosUrl || []);

        // Valida o CEP formatado
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

    // Adiciona novas imagens ao estado `files`
    const handleAdicionarImagens = (event) => {
        const novasImagens = Array.from(event.target.files);
        setFiles((prevFiles) => [...prevFiles, ...novasImagens]);
    };


    const handleRemoverImagemExistente = (index) => {
        const novasImagens = existingPhotos.filter((_, i) => i !== index); // Remove pelo índice
        setExistingPhotos(novasImagens); // Atualiza o estado
        console.log("Novo estado de existingPhotos:", novasImagens); // Verifique o novo estado
    };

    const validarFormulario = async () => {
        const novosErros = {};

        // Validação: Título
        if (!formCriarEvento.titulo.trim()) {
            novosErros.titulo = 'Título do Evento é obrigatório';
        } else if (formCriarEvento.titulo.length < 10) {
            novosErros.titulo = 'Mínimo 10 caracteres';
        } else if (formCriarEvento.titulo.length > 99) {
            novosErros.titulo = 'Máximo 100 caracteres';
        }

        // Validação: CEP
        if (!formCriarEvento.address.cep.trim()) {
            novosErros.cep = 'CEP é obrigatório';
        } else if (formCriarEvento.address.cep.length !== 9) {
            novosErros.cep = 'CEP inválido, deve conter 9 caracteres';
        } else if(errorCep){
            novosErros.cep = 'CEP inválido';
        }

        // Validação: Estado
        if (!formCriarEvento.address.estado.trim()) {
            novosErros.estado = 'O estado é obrigatório';
        } else if (formCriarEvento.address.estado.length !== 2) {
            novosErros.estado = 'O estado deve ter exatamente 2 caracteres';
        }

        // Validação: Cidade
        if (!formCriarEvento.address.cidade.trim()) {
            novosErros.cidade = 'A cidade é obrigatória';
        } else if (formCriarEvento.address.cidade.length < 3) {
            novosErros.cidade = 'Mínimo 3 caracteres';
        } else if (formCriarEvento.address.cidade.length > 99) {
            novosErros.cidade = 'Máximo 100 caracteres';
        }

        // Validação: Bairro
        if (!formCriarEvento.address.bairro.trim()) {
            novosErros.bairro = 'O bairro é obrigatório';
        } else if (formCriarEvento.address.bairro.length < 3) {
            novosErros.bairro = 'Mínimo 3 caracteres';
        } else if (formCriarEvento.address.bairro.length > 99) {
            novosErros.bairro = 'Máximo 100 caracteres';
        }

        // Validação: Rua
        if (!formCriarEvento.address.rua.trim()) {
            novosErros.rua = 'A rua é obrigatória';
        } else if (formCriarEvento.address.rua.length < 3) {
            novosErros.rua = 'Mínimo 3 caracteres';
        } else if (formCriarEvento.address.rua.length > 99) {
            novosErros.rua = 'Máximo 100 caracteres';
        }

        // Validação: Número
        if (!formCriarEvento.address.numero.trim()) {
            novosErros.numero = 'O número é obrigatório';
        } else if (formCriarEvento.address.numero.length > 6) {
            novosErros.numero = 'O número deve ter no máximo 6 caracteres';
        }

        // Validação: Data de Início
        if (!formCriarEvento.data_inicio.trim()) {
            novosErros.data_inicio = 'A data de início é obrigatória';
        }

        // Validação: Data de Fim
        if (!formCriarEvento.data_fim.trim()) {
            novosErros.data_fim = 'A data de fim é obrigatória';
        } else if (new Date(formCriarEvento.data_fim) < new Date(formCriarEvento.data_inicio)) {
            novosErros.data_fim = 'A data de fim não pode ser anterior à data de início';
        }

        // Validação: Descrição
        if (!formCriarEvento.descricao.trim()) {
            novosErros.descricao = 'Descrição do Evento é obrigatória';
        } else if (formCriarEvento.descricao.length < 10) {
            novosErros.descricao = 'Mínimo 10 caracteres';
        } else if (formCriarEvento.descricao.length > 3999) {
            novosErros.descricao = 'Máximo 4000 caracteres';
        }

        setErros(novosErros);
        return Object.keys(novosErros).length === 0; // Retorna true se não houver erros
    };


    // Função para enviar o formulário editado
    const enviarEdicao = async () => {
        // Aguarde a validação do formulário
        const formValido = await validarFormulario();

        // Bloqueia a submissão se o formulário for inválido ou o CEP for inválido
        if (!formValido) {
            console.log("Formulário inválido ou CEP inválido. Não foi enviado.");
            return;
        }

        const formData = new FormData();

        // Adicionando campos do formulário ao FormData
        formData.append('titulo', formCriarEvento.titulo);
        formData.append('descricao', formCriarEvento.descricao);
        formData.append('data_inicio', formCriarEvento.data_inicio);
        formData.append('data_fim', formCriarEvento.data_fim);
        formData.append('address', JSON.stringify(formCriarEvento.address));

        // Determinando quais imagens existentes foram removidas
        const fotosRemovidas = eventoParaEditar.photosUrl.filter(
            (url) => !existingPhotos.includes(url)
        );

        // Adicionar URLs das imagens a serem removidas
        formData.append('fotos_remove[]', fotosRemovidas);
        console.log(fotosRemovidas)

        // Adicionando novas imagens carregadas
        files.forEach((file) => {
            formData.append('fotos_adicionadas', file);
        });

        try {
            // Envio para o backend
            await axios.put(
                `https://apianjobom.victordev.shop/admin/atualizarEvento/${eventoParaEditar.id}`,
                formData,
                {
                    headers: {
                        Authorization: token,
                        'Content-Type': 'multipart/form-data', // Garantindo o cabeçalho correto
                    },
                }
            );

            Swal.fire({
                icon: 'success',
                title: 'Atualizado!',
                text: 'O Evento foi atualizado.',
                timer: 1300,
                showConfirmButton: false,
            });

            fetchEventos(); // Atualiza os dados após a edição
            setEditando(false); // Volta para o estado inicial (não editando)
        } catch (error) {
            console.error('Erro ao editar o evento:', error.response?.data || error.message);
            Swal.fire({
                icon: 'error',
                title: 'Erro!',
                text: 'Não foi possível atualizar o evento. Verifique os dados.',
            });
        }

    };

    //Fim área de Edição

    console.log("todos os evcento dessa buceta", allEventos)
    console.log("img aqui ", files)

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
                                            <Icon
                                                name="eye"
                                                color="blue"
                                                size="large"
                                                onClick={() => verMais(evento.id)}
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
                                            <Table.Cell>
                                                {new Date(evento.data_inicio).toLocaleDateString('pt-BR')}
                                            </Table.Cell>
                                            <Table.Cell>
                                                <Icon name="pencil" color="yellow" size="large"
                                                    onClick={() =>
                                                        handleEditarEvento(evento)}
                                                    style={{ cursor: 'pointer' }}
                                                />
                                                <Icon name="trash alternate outline" color="red" size="large" onClick={() => confirmarDelecao(evento.id)}
                                                    style={{ cursor: 'pointer' }} />
                                                <Icon
                                                    name="eye"
                                                    color="blue"
                                                    size="large"
                                                    onClick={() => verMais(evento.id)}
                                                    style={{ cursor: 'pointer' }} />
                                            </Table.Cell>
                                        </Table.Row>

                                    ))}
                                    {/* Preencher linhas vazias */}
                                    {Array.from({ length: linhasExtras }).map((_, index) => (
                                        <Table.Row key={`extra-${index}`}>
                                            <Table.Cell colSpan="4" className="empty-row" />
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
                    <div className="form-container-criarEvento-edit">
                        <div className="input-area-criarEvento">
                            <Form>
                                {/* Nome do Ponto de Coleta */}
                                <FormInput
                                    label={<label className="blue-label-criarPontoColeta">Título do Evento</label>}
                                    value={formCriarEvento.titulo}
                                    maxLength={100} // Limite máximo de 50 caracteres
                                    minLength={10}
                                    error={erros.titulo ? { content: erros.titulo } : undefined} // Exibe o erro se houver
                                    onChange={(e) => {
                                        const novoTitulo = e.target.value;
                                        setFormCriarEvento({ ...formCriarEvento, titulo: novoTitulo });

                                        const novosErros = { ...erros };

                                        if (novoTitulo.trim() === '') {
                                            novosErros.titulo = 'Título do Evento é obrigatório';
                                        } else if (novoTitulo.length > 99) {
                                            novosErros.titulo = 'Máximo 100 caracteres';
                                        } else {
                                            delete novosErros.titulo; // Remove o erro se for válido
                                        }

                                        setErros(novosErros);
                                    }}
                                />
                                {/* CEP */}
                                <FormInput
                                    label={<label className="blue-label-criarPontoColeta">CEP</label>}
                                    maxLength={9} // Limita para 9 caracteres (99999-999)
                                    minLength={9}
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

                                <FormGroup widths="equal">
                                    {/* Estado */}
                                    <FormInput
                                        fluid
                                        label={<label className="blue-label-criarPontoColeta">Estado</label>}
                                        value={formCriarEvento.address.estado}
                                        maxLength={2}
                                        minLength={2}
                                        error={erros.estado ? { content: erros.estado } : undefined}
                                        onChange={(e) => {
                                            const novoEstado = e.target.value.toUpperCase();
                                            setFormCriarEvento({
                                                ...formCriarEvento,
                                                address: { ...formCriarEvento.address, estado: novoEstado },
                                            });

                                            const novosErros = { ...erros };

                                            if (novoEstado.trim() === '') {
                                                novosErros.estado = 'O estado é obrigatório';
                                            } else {
                                                delete novosErros.estado;
                                            }

                                            setErros(novosErros);
                                        }}
                                    />

                                    {/* Cidade */}
                                    <FormInput
                                        fluid
                                        label={<label className="blue-label-criarPontoColeta">Cidade</label>}
                                        maxLength={100}
                                        minLength={3}
                                        value={formCriarEvento.address.cidade}
                                        error={erros.cidade ? { content: erros.cidade } : undefined}
                                        onChange={(e) => {
                                            const novaCidade = e.target.value;
                                            setFormCriarEvento({
                                                ...formCriarEvento,
                                                address: { ...formCriarEvento.address, cidade: novaCidade },
                                            });

                                            const novosErros = { ...erros };

                                            if (novaCidade.trim() === '') {
                                                novosErros.cidade = 'A cidade é obrigatória';
                                            } else if (novaCidade.length > 99) {
                                                novosErros.cidade = 'Máximo 100 caracteres';
                                            } else {
                                                delete novosErros.cidade;
                                            }

                                            setErros(novosErros);
                                        }}
                                    />

                                    {/* Bairro */}
                                    <FormInput
                                        fluid
                                        label={<label className="blue-label-criarPontoColeta">Bairro</label>}
                                        maxLength={100}
                                        minLength={3}
                                        value={formCriarEvento.address.bairro}
                                        error={erros.bairro ? { content: erros.bairro } : undefined}
                                        onChange={(e) => {
                                            const novoBairro = e.target.value;
                                            setFormCriarEvento({
                                                ...formCriarEvento,
                                                address: { ...formCriarEvento.address, bairro: novoBairro },
                                            });

                                            const novosErros = { ...erros };

                                            if (novoBairro.trim() === '') {
                                                novosErros.bairro = 'O bairro é obrigatório';
                                            } else if (novoBairro.length > 99) {
                                                novosErros.bairro = 'Máximo 100 caracteres';
                                            } else {
                                                delete novosErros.bairro;
                                            }

                                            setErros(novosErros);
                                        }}
                                    />
                                </FormGroup>
                                <FormGroup widths="equal">
                                    {/* Rua */}
                                    <FormInput
                                        fluid
                                        label={<label className="blue-label-criarPontoColeta">Rua</label>}
                                        maxLength={100}
                                        minLength={3}
                                        value={formCriarEvento.address.rua}
                                        error={erros.rua ? { content: erros.rua } : undefined}
                                        onChange={(e) => {
                                            const novaRua = e.target.value;
                                            setFormCriarEvento({
                                                ...formCriarEvento,
                                                address: { ...formCriarEvento.address, rua: novaRua },
                                            });

                                            const novosErros = { ...erros };

                                            if (novaRua.trim() === '') {
                                                novosErros.rua = 'A rua é obrigatória';
                                            } else if (novaRua.length > 99) {
                                                novosErros.rua = 'Máximo 100 caracteres';
                                            } else {
                                                delete novosErros.rua;
                                            }

                                            setErros(novosErros);
                                        }}
                                    />

                                    {/* Número */}
                                    <FormInput
                                        fluid
                                        label={<label className="blue-label-criarPontoColeta">Número</label>}
                                        maxLength={6}
                                        minLength={1}
                                        value={formCriarEvento.address.numero}
                                        error={erros.numero ? { content: erros.numero } : undefined}
                                        onChange={(e) => {
                                            const novoNumero = e.target.value;
                                            setFormCriarEvento({
                                                ...formCriarEvento,
                                                address: { ...formCriarEvento.address, numero: novoNumero },
                                            });

                                            const novosErros = { ...erros };

                                            if (novoNumero.trim() === '') {
                                                novosErros.numero = 'O número é obrigatório';
                                            } else if (novoNumero.length > 6) {
                                                novosErros.numero = 'Máximo 6 caracteres';
                                            } else {
                                                delete novosErros.numero;
                                            }

                                            setErros(novosErros);
                                        }}
                                    />
                                </FormGroup>
                                <FormGroup widths="equal">
                                    {/* Campo de Data de Início */}
                                    <FormInput
                                        fluid
                                        type="date"
                                        label={<label className="blue-label-criarPontoColeta">Data de Início</label>}
                                        value={formCriarEvento.data_inicio ? new Date(formCriarEvento.data_inicio).toISOString().slice(0, 10) : ''} // Converte para YYYY-MM-DD
                                        error={erros.data_inicio ? { content: erros.data_inicio } : undefined} // Exibe o erro se houver
                                        onChange={(e) => {
                                            const novaDataInicio = e.target.value;
                                            setFormCriarEvento({
                                                ...formCriarEvento,
                                                data_inicio: novaDataInicio
                                            });

                                            // Validação: a data de início não pode estar vazia
                                            if (novaDataInicio.trim() === '') {
                                                setErros({ ...erros, data_inicio: 'A data de início é obrigatória' });
                                            } else {
                                                const { data_inicio, ...restErros } = erros;
                                                setErros(restErros); // Remove o erro se o valor for válido
                                            }
                                        }}
                                    />
                                    <FormInput
                                        fluid
                                        type="date"
                                        label={<label className="blue-label-criarPontoColeta">Data de Fim</label>}
                                        value={formCriarEvento.data_fim ? new Date(formCriarEvento.data_fim).toISOString().slice(0, 10) : ''} // Converte para YYYY-MM-DD
                                        error={erros.data_fim ? { content: erros.data_fim } : undefined} // Exibe o erro se houver
                                        onChange={(e) => {
                                            const novaDataFim = e.target.value;
                                            setFormCriarEvento({
                                                ...formCriarEvento,
                                                data_fim: novaDataFim
                                            });

                                            // Validação: a data de fim não pode ser menor que a data de início
                                            if (novaDataFim.trim() === '') {
                                                setErros({ ...erros, data_fim: 'A data de fim é obrigatória' });
                                            } else if (new Date(novaDataFim) < new Date(formCriarEvento.data_inicio)) {
                                                setErros({ ...erros, data_fim: 'A data de fim não pode ser anterior à data de início' });
                                            } else {
                                                const { data_fim, ...restErros } = erros;
                                                setErros(restErros); // Remove o erro se o valor for válido
                                            }
                                        }}
                                    />

                                </FormGroup>

                                <Form.Field>
                                    <label className="blue-label-criarPontoColeta">Imagens do Evento</label>
                                    <div className="image-edit-container">
                                        {/* Renderizar imagens existentes */}
                                        {existingPhotos.map((url, index) => (
                                            <div key={`existing-${index}`} className="image-wrapper">
                                                <img
                                                    src={url}
                                                    alt={`Imagem existente ${index + 1}`}
                                                    className="image-preview-thumbnail"
                                                    style={{ width: '150px', height: '150px', objectFit: 'cover' }}
                                                />
                                                <Button
                                                    icon="trash"
                                                    color="red"
                                                    onClick={() => handleRemoverImagemExistente(index)}
                                                    size="small"
                                                    title="Remover imagem existente"
                                                />
                                            </div>
                                        ))}
                                    </div>
                                </Form.Field>



                                {/* Input para adicionar nova imagem */}
                                <Form.Field>
                                    <label className="blue-label-criarPontoColeta">Adicionar Novas Imagens</label>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        multiple // Permite selecionar várias imagens de uma vez
                                        onChange={handleAdicionarImagens}
                                    />
                                </Form.Field>
                                <FormInput
                                    label={<label className="blue-label-criarPontoColeta">Descrição</label>}
                                    value={formCriarEvento.descricao}
                                    maxLength={4000}
                                    minLength={10}
                                    control={TextArea}
                                    style={{ resize: "none" }}
                                    error={erros.descricao ? { content: erros.descricao } : undefined} // Exibe o erro se houver
                                    onChange={(e) => {
                                        const novaDescricao = e.target.value;
                                        setFormCriarEvento({
                                            ...formCriarEvento,
                                            descricao: novaDescricao
                                        });

                                        // Validação: a descricao não pode estar vazia
                                        if (novaDescricao.trim() === '') {
                                            setErros({ ...erros, descricao: 'Descrição do Evento é obrigatória' });
                                        } else if (novaDescricao.length > 3999) {
                                            setErros({ ...erros, descricao: 'Máximo 4000 caracteres' });
                                        } else {
                                            const { descricao, ...restErros } = erros;
                                            setErros(restErros); // Remove o erro da URL se o valor for válido
                                        }
                                    }}
                                />
                            </Form>
                        </div>
                        {/* Botões de ação */}
                        <div className="container-acoes-btnc-criarEvento">
                            <Button type="button" color="red" onClick={cancelarEdicao}>Cancelar</Button>
                            <Button type="submit" className="salvarAtualizacao" onClick={enviarEdicao}>Salvar atualização</Button>
                        </div>
                    </div>
                )}

            </div >
        </>
    );
}

export default ListaEvento;


