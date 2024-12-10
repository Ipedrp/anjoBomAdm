import React, { useState, useEffect } from 'react';
import { FormField, Button, Form, FormGroup, TextArea, FormInput } from 'semantic-ui-react';
import Header from "../../../components/header/Header";
import NavbarAcoes from "../../../components/navbarAcoes/NavbarAcoes";
import axios from 'axios'; // Certifique-se de importar o axios
import './CriarEvento.css'; // Importa o CSS externo
import { Link, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2'

const CriarEvento = () => {
    // Estado principal do formulário de criação de evento
    const [formCriarEvento, setFormCriarEvento] = useState({
        titulo: '', // Título do evento
        descricao: '', // Descrição do evento
        address: { // Endereço do evento
            cep: '',
            estado: '',
            cidade: '',
            bairro: '',
            rua: '',
            numero: ''
        },
        data_inicio: '', // Data de início do evento
        data_fim: '', // Data de término do evento
    });

    // Estado para armazenar os arquivos selecionados
    const [files, setFiles] = useState([]);

    const token = localStorage.getItem('authorization');

    const navigate = useNavigate(); // Hook para navegação


    // Estado para gerenciar mensagens de erro nos campos
    const [erros, setErros] = useState({
        titulo: "", // Erro relacionado ao título
        descricao: "", // Erro relacionado à descrição
        address: { // Erros relacionados ao endereço
            cep: "",
            estado: "",
            cidade: "",
            bairro: "",
            rua: "",
            numero: "",
        },
        data_inicio: "", // Erro relacionado à data de início
        data_fim: "", // Erro relacionado à data de término
        arquivos: "", // Novo campo para erros de arquivos
    });

    const [errorCep, setErrorCep] = useState(""); // Para o erro de CEP

    const formatCEP = (cep) => {
        const cleaned = ('' + cep).replace(/\D/g, ''); // Remove qualquer caractere não numérico
        // Aplica a máscara para CEP no formato "99999-999"
        const match = cleaned.match(/^(\d{5})(\d{3})$/);
        return match ? `${match[1]}-${match[2]}` : cleaned;
    };

    const validateCep = async (value) => {
        if (!value) {
            setErrorCep("CEP é obrigatório");
            return;
        }

        if (value.length > 9) {
            setErrorCep("Máximo 9 caracteres");
            return;
        }

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
                setErrorCep(""); // Limpa o erro se for válido
            } else {
                setErrorCep("CEP inválido"); // Atualiza o erro se o CEP for inválido
            }
        } catch (error) {
            console.error("Erro ao buscar o CEP:", error);
        }
    };

    // Função para lidar com a mudança de input
    const handleChange = async (e) => {
        const { name, value } = e.target;

        // Verifica se o campo que está sendo alterado é o CEP
        if (name === "address.cep") {
            setFormCriarEvento((prevState) => ({
                ...prevState,
                address: {
                    ...prevState.address,
                    cep: formatCEP(value) // Aplica a formatação ao CEP
                }
            }));

            // Se o CEP tiver o tamanho certo (geralmente 8 caracteres), faz a requisição para a API
            if (value.replace(/\D/g, '').length === 8) {
                await validateCep(value.replace(/\D/g, '')); // Chame a função de validação do CEP
            }
        } else if (name.startsWith('address.')) {
            const field = name.split('.')[1];
            setFormCriarEvento((prevState) => ({
                ...prevState,
                address: {
                    ...prevState.address,
                    [field]: value
                }
            }));
        } else {
            setFormCriarEvento((prevState) => ({
                ...prevState,
                [name]: value // Corrigido para usar prevState
            }));
        }



        // Validação de erros

        setErros(prevState => {
            const newErros = { ...prevState };
            switch (name) {
                case "titulo":
                    if (value.length > 99) {
                        newErros.titulo = "Máximo 100 caracteres";
                    } else {
                        newErros.titulo = "";
                    }
                    break;
                case "descricao":
                    if (value.length > 3999) {
                        newErros.descricao = "Máximo 4000 caracteres";
                    } else {
                        newErros.descricao = "";
                    }
                    break;
                case "address.cep":
                    if (value.length > 9) {
                        if (!newErros.address) newErros.address = {};
                        newErros.address.cep = "Máximo 9 caracteres";
                    } else {
                        if (newErros.address) delete newErros.address.cep;
                        if (Object.keys(newErros.address || {}).length === 0) delete newErros.address;
                    }
                    break;
                case "address.rua":
                    if (value.length > 99) {
                        if (!newErros.address) newErros.address = {};
                        newErros.address.rua = "Máximo 100 caracteres";
                    } else {
                        if (newErros.address) delete newErros.address.rua;
                        if (Object.keys(newErros.address || {}).length === 0) delete newErros.address;
                    }
                    break;
                case "address.estado":
                    if (value.length > 2) {
                        if (!newErros.address) newErros.address = {};
                        newErros.address.estado = "Máximo 2 caracteres";
                    } else {
                        if (newErros.address) delete newErros.address.estado;
                        if (Object.keys(newErros.address || {}).length === 0) delete newErros.address;
                    }
                    break;
                case "address.cidade":
                    if (value.length > 99) {
                        if (!newErros.address) newErros.address = {};
                        newErros.address.cidade = "Máximo 100 caracteres";
                    } else {
                        if (newErros.address) delete newErros.address.cidade;
                        if (Object.keys(newErros.address || {}).length === 0) delete newErros.address;
                    }
                    break;
                case "address.bairro":
                    if (value.length > 99) {
                        if (!newErros.address) newErros.address = {};
                        newErros.address.bairro = "Máximo 100 caracteres";
                    } else {
                        if (newErros.address) delete newErros.address.bairro;
                        if (Object.keys(newErros.address || {}).length === 0) delete newErros.address;
                    }
                    break;
                case "address.numero":
                    if (value.length > 6) {
                        if (!newErros.address) newErros.address = {};
                        newErros.address.numero = "Máximo 6 caracteres";
                    } else {
                        if (newErros.address) delete newErros.address.numero;
                        if (Object.keys(newErros.address || {}).length === 0) delete newErros.address;
                    }
                    break;
                default:
                    break;
            }

            return newErros;
        });        // Validação de erros

    };

    // Função para lidar com a mudança dos arquivos selecionados
    const onFileChange = (e) => {
        setFiles(Array.from(e.target.files)); // Convertendo a lista de arquivos em um array
    };

    const enviarFormulario = async () => {
        let newErros = { titulo: "", descricao: "", address: {}, arquivos: "" };
        let valid = true;

        // Validação dos campos do formulário
        if (!formCriarEvento.titulo) {
            newErros.titulo = "Título é obrigatório";
            valid = false;
        } else if (formCriarEvento.titulo.length > 99) {
            newErros.titulo = "Máximo 100 caracteres";
            valid = false;
        }

        if (!formCriarEvento.descricao) {
            newErros.descricao = "Descrição é obrigatória";
            valid = false;
        } else if (formCriarEvento.descricao.length > 4000) {
            newErros.descricao = "Máximo 4000 caracteres";
            valid = false;
        }


        // Validação do campo 'data_inicio'
        if (!formCriarEvento.data_inicio) {
            newErros.data_inicio = "Data de início é obrigatória";
            valid = false;
        }

        // Validação do campo 'data_fim'
        if (!formCriarEvento.data_fim) {
            newErros.data_fim = "Data de fim é obrigatória";
            valid = false;
        }

        // Verificação de datas: se a data de fim for anterior à data de início
        if (formCriarEvento.data_inicio && formCriarEvento.data_fim) {
            const dataInicio = new Date(formCriarEvento.data_inicio);
            const dataFim = new Date(formCriarEvento.data_fim);

            if (dataFim < dataInicio) {
                newErros.data_fim = "A data de fim deve ser igual ou posterior à data de início";
                valid = false;
            }
        }

        // Validação do restante dos campos do formulário (como já está implementado)

        const { cep, estado, cidade, bairro, rua, numero } = formCriarEvento.address;

        // Validação do campo 'cep'
        if (!cep) {
            newErros.address.cep = "CEP é obrigatório";
            valid = false;
        } else if (cep.length > 9) {
            newErros.address.cep = "Máximo 9 caracteres";
            valid = false;
        } else {
            // Valida o CEP usando a API
            try {
                const response = await axios.get(`https://viacep.com.br/ws/${cep.replace(/\D/g, '')}/json/`);
                if (!response.data || response.data.erro) {
                    newErros.address.cep = "CEP inválido";
                    valid = false;
                }
            } catch (error) {
                console.error("Erro ao buscar o CEP:", error);
                newErros.address.cep = "Erro na verificação do CEP";
                valid = false;
            }
        }
        // Validação do campo 'estado'
        if (!estado) {
            newErros.address.estado = "Estado é obrigatório";
            valid = false;
        } else if (estado.length > 2) {
            newErros.address.estado = "Máximo 2 caracteres";
            valid = false;
        }

        // Validação do campo 'cidade'
        if (!cidade) {
            newErros.address.cidade = "Cidade é obrigatória";
            valid = false;
        } else if (cidade.length > 99) {
            newErros.address.cidade = "Máximo 100 caracteres";
            valid = false;
        }

        // Validação do campo 'bairro'
        if (!bairro) {
            newErros.address.bairro = "Bairro é obrigatório";
            valid = false;
        } else if (bairro.length > 99) {
            newErros.address.bairro = "Máximo 100 caracteres";
            valid = false;
        }

        // Validação do campo 'rua'
        if (!rua) {
            newErros.address.rua = "Rua é obrigatória";
            valid = false;
        } else if (rua.length > 99) {
            newErros.address.rua = "Máximo 100 caracteres";
            valid = false;
        }

        // Validação do campo 'numero'
        if (!numero) {
            newErros.address.numero = "Número é obrigatório";
            valid = false;
        } else if (numero.length > 6) {
            newErros.address.numero = "Máximo 6 caracteres";
            valid = false;
        }

        // Validação dos arquivos
        if (files.length === 0) {
            newErros.arquivos = "Ao menos uma foto deve ser selecionada.";
            valid = false;
        }



        // Atualiza os erros
        setErros(newErros);

        // Se todos os campos forem válidos, continua com o envio do formulário


        if (valid) {

            const formData = new FormData();

            // Adding form data (text inputs)
            formData.append('titulo', formCriarEvento.titulo);
            formData.append('descricao', formCriarEvento.descricao);
            formData.append('data_inicio', formCriarEvento.data_inicio);
            formData.append('data_fim', formCriarEvento.data_fim);
            formData.append('address', JSON.stringify(formCriarEvento.address)); // Convertendo o endereço para JSON

            // Adicionando os arquivos ao FormData
            files.forEach((file) => {
                formData.append('photos_event', file);
            });

            try {
                // Enviando os dados para o servidor usando Axios
                const response = await axios.post('https://apianjobom.victordev.shop/admin/criarEvento', formData, {
                    headers: {
                        Authorization: token // Especificando o tipo de conteúdo
                    }

                });

                // Exibe o SweetAlert para sucesso com tempo de 3 segundos
                Swal.fire({
                    title: "Sucesso!",
                    text: "O evento foi criado!",
                    icon: "success",
                    timer: 3000, // 3 segundos
                    showConfirmButton: false, // Remove o botão de confirmação
                    customClass: {
                        popup: 'swal2-popup-custom',
                    },
                });


                console.log('Resposta do servidor:', response.data);

                // Limpa o formulário após o envio
                setFormCriarEvento({
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
                });

                setFiles([]);

                // Redireciona para recarregar o formulário
                navigate("/criarEvento"); // Ajuste a rota para corresponder à do formulário

            } catch (error) {
                console.error('Erro na requisição:', error);
                Swal.fire({
                    title: "Erro",
                    text: "Erro ao enviar dados para o servidor.",
                    icon: "error",
                    customClass: {
                        confirmButton: 'swal2-confirm-custom'
                    }
                });
            }
        }

        setErros(newErros);

    };


    return (
        <>
            <NavbarAcoes />
            <Header title2={"Evento"} />
            <div className="form-container-criarEvento">
                <div className="input-area-criarEvento">
                    <Form>

                        <FormInput
                            fluid
                            error={erros.titulo ? { content: erros.titulo } : null}
                            label={<label className="blue-label-criarEvento">Título do Evento</label>}
                            placeholder="Digite o título do evento"
                            name="titulo"
                            type="text"
                            maxLength={100}
                            value={formCriarEvento.titulo}
                            onChange={handleChange}
                        />
                        <FormInput
                            fluid
                            error={!!errorCep || (erros.address && erros.address.cep) ? { content: errorCep || erros.address.cep } : null}
                            label={<label className="blue-label-criarEvento">CEP</label>}
                            placeholder="Digite seu CEP"
                            name="address.cep"
                            type="text"
                            maxLength={9}
                            value={formCriarEvento.address.cep}
                            onChange={handleChange}
                        />
                        <FormGroup widths="equal">
                            <FormInput
                                fluid
                                error={!!(erros.address && erros.address.estado) && { content: erros.address.estado }}
                                label={<label className="blue-label-criarEvento">Estado</label>}
                                placeholder="Digite seu estado"
                                name="address.estado"
                                type="text"
                                maxLength={2}
                                value={formCriarEvento.address.estado}
                                onChange={handleChange}
                            />
                            <FormInput
                                fluid
                                error={!!(erros.address && erros.address.cidade) && { content: erros.address.cidade }}
                                label={<label className="blue-label-criarEvento">Cidade</label>}
                                placeholder="Digite sua cidade"
                                name="address.cidade"
                                type="text"
                                maxLength={100}
                                value={formCriarEvento.address.cidade}
                                onChange={handleChange}
                            />
                            <FormInput
                                fluid
                                error={!!(erros.address && erros.address.bairro) && { content: erros.address.bairro }}
                                label={<label className="blue-label-criarEvento">Bairro</label>}
                                placeholder="Digite seu bairro"
                                name="address.bairro"
                                type="text"
                                maxLength={100}
                                value={formCriarEvento.address.bairro}
                                onChange={handleChange}
                            />
                        </FormGroup>
                        <FormGroup widths="equal">
                            <FormInput
                                fluid
                                error={!!(erros.address && erros.address.rua) && { content: erros.address.rua }}
                                label={<label className="blue-label-criarEvento">Rua</label>}
                                placeholder="Digite sua rua"
                                name="address.rua"
                                type="text"
                                maxLength={100}
                                value={formCriarEvento.address.rua}
                                onChange={handleChange}
                            />
                            <FormInput
                                fluid
                                error={!!(erros.address && erros.address.numero) && { content: erros.address.numero }}
                                label={<label className="blue-label-criarEvento">Número</label>}
                                placeholder="Digite o número de sua residência"
                                name="address.numero"
                                type="text"
                                maxLength={6}
                                value={formCriarEvento.address.numero}
                                onChange={handleChange}
                            />

                        </FormGroup>
                        <FormGroup widths="equal">
                            <Form.Input
                                fluid
                                error={erros.data_inicio ? { content: erros.data_inicio } : null}
                                label={<label className="blue-label-criarEvento">Data de Início</label>}
                                placeholder="Selecione a data de início"
                                name="data_inicio"
                                type="date"
                                value={formCriarEvento.data_inicio}
                                onChange={handleChange}
                            />
                            <Form.Input
                                fluid
                                error={erros.data_fim ? { content: erros.data_fim } : null}
                                label={<label className="blue-label-criarEvento">Data de Fim</label>}
                                placeholder="Selecione a data de fim"
                                name="data_fim"
                                type="date"
                                value={formCriarEvento.data_fim}
                                onChange={handleChange}
                            />
                        </FormGroup>

                        <Form.Input
                            type="file"
                            label={<label className="blue-label-criarEvento">Fotos do evento</label>}
                            multiple
                            onChange={onFileChange}
                            error={erros.arquivos ? { content: erros.arquivos } : null}
                        />
                        <FormField
                            error={erros.descricao ? { content: erros.descricao } : null}
                            control={TextArea}
                            label={<label className="blue-label-criarEvento">Descrição do evento</label>}
                            placeholder="Descreva o que este evento irá realizar..."
                            name="descricao"
                            maxLength={4000}
                            value={formCriarEvento.descricao}
                            onChange={handleChange}
                            style={{ resize: "none" }}
                        />
                    </Form>
                </div>
                <div className="container-acoes-btnc-criarEvento">
                    <Link to="/listaEvento">
                        <Button type="button" className="voltar">Voltar</Button>
                    </Link>
                    <Button type="button" className="criarEvento" onClick={enviarFormulario}>Criar Evento</Button>
                </div>
            </div>
        </>
    );
}

export default CriarEvento;