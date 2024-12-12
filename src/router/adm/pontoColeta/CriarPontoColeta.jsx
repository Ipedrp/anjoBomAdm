import React, { useState } from "react";
import { Button, Form, FormGroup, TextArea, FormInput } from 'semantic-ui-react';
import Header from "../../../components/header/Header";
import NavbarAcoes from "../../../components/navbarAcoes/NavbarAcoes";
import axios from 'axios';
import './CriarPontoColeta.css';
import { Link, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2'

const CriarPontoColeta = () => {

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

    const navigate = useNavigate(); // Hook para navegação
    const token = localStorage.getItem('authorization')
    const [erros, setErros] = useState({
        address: {
            cep: '',
            // outros campos de erro do endereço, se necessário
        }
    });
    const [errorCep, setErrorCep] = useState(""); // Para o erro de CEP

    const formatCEP = (cep) => {
        const cleaned = ('' + cep).replace(/\D/g, ''); // Remove qualquer caractere não numérico
        // Aplica a máscara para CEP no formato "99999-999"
        const match = cleaned.match(/^(\d{5})(\d{3})$/);
        return match ? `${match[1]}-${match[2]}` : cleaned;
    }

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
            setFormCriarPontoColeta((prevState) => ({
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
            setFormCriarPontoColeta((prevState) => ({
                ...prevState,
                address: {
                    ...prevState.address,
                    [field]: value
                }
            }));
        } else {
            setFormCriarPontoColeta((prevState) => ({
                ...prevState,
                [name]: value // Corrigido para usar prevState
            }));
        }

        // Validação de erros
        setErros(prevState => {
            const newErros = { ...prevState };
            switch (name) {
                case "name":
                    if (value.length > 99) {
                        newErros.name = "Máximo 100 caracteres";
                    } else {
                        newErros.name = "";
                    }
                    break;
                case "urlMap":
                    if (value.length > 499) {
                        newErros.urlMap = "Máximo 500 caracteres";
                    } else {
                        newErros.urlMap = "";
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

    // Função para enviar o formulário
    const EnviarPontoColeta = async () => {
        let newErros = {};
        let valid = true;

        // Validação do nome do ponto de coleta
        if (!formCriarPontoColeta.name || formCriarPontoColeta.name.trim() === '') {
            newErros.name = "Nome do ponto de coleta é obrigatório";
            valid = false;
        } else if (formCriarPontoColeta.name.length < 10) {
            newErros.name = "Nome deve ter no mínimo 10 caracteres";
            valid = false;
        } else if (formCriarPontoColeta.name.length > 99) {
            newErros.name = "Nome deve ter no máximo 100 caracteres";
            valid = false;
        }

        // Validação da URL do mapa
        if (!formCriarPontoColeta.urlMap || formCriarPontoColeta.urlMap.trim() === '') {
            newErros.urlMap = "O link do mapa é obrigatório";
            valid = false;
        } else if (formCriarPontoColeta.urlMap.length < 10) {
            newErros.urlMap = "URL deve ter no mínimo 10 caracteres";
            valid = false;
        } else if (formCriarPontoColeta.urlMap.length > 499) {
            newErros.urlMap = "URL deve ter no máximo 500 caracteres";
            valid = false;
        }

        // Validação dos campos do endereço
        const addressFields = {
            cep: { min: 9, max: 9, required: true },
            estado: { min: 2, max: 2, required: true },
            cidade: { min: 3, max: 100, required: true },
            bairro: { min: 3, max: 100, required: true },
            rua: { min: 3, max: 100, required: true },
            numero: { min: 1, max: 6, required: true },
        };

        newErros.address = {};

        for (const field in addressFields) {
            const { min, max, required } = addressFields[field];
            const value = formCriarPontoColeta.address[field];

            if (required && (!value || value.trim() === '')) {
                newErros.address[field] = `${field.charAt(0).toUpperCase() + field.slice(1)} é obrigatório`;
                valid = false;
            } else if (value.length < min) {
                newErros.address[field] = `${field.charAt(0).toUpperCase() + field.slice(1)} deve ter no mínimo ${min} caracteres`;
                valid = false;
            } else if (value.length > max) {
                newErros.address[field] = `${field.charAt(0).toUpperCase() + field.slice(1)} deve ter no máximo ${max} caracteres`;
                valid = false;
            }
        }

        // Remove a chave `address` se não houver erros em seus campos
        if (Object.keys(newErros.address).length === 0) {
            delete newErros.address;
        }

        // Verifica se o CEP é inválido
        if (errorCep) {
            valid = false;
            console.log("Erro no CEP:", errorCep);
        }

        // Atualiza os erros
        setErros(newErros);

        // Impede o envio se houver erros
        if (!valid) {
            console.log("Erros detectados: ", newErros);
            return;
        }

        // Envio dos dados ao backend
        try {
            const response = await axios.post(
                'https://apianjobom.victordev.shop/admin/criarPontoDeColeta',
                formCriarPontoColeta,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: token,
                    },
                }
            );

            // Exibe mensagem de sucesso
            Swal.fire({
                title: "Sucesso!",
                text: "O ponto de coleta foi criado!",
                icon: "success",
                timer: 1300,
                showConfirmButton: false,
            });

            // Reseta o formulário
            setFormCriarPontoColeta({
                name: '',
                urlMap: '',
                address: {
                    cep: '',
                    estado: '',
                    cidade: '',
                    bairro: '',
                    rua: '',
                    numero: '',
                },
                data_inicio: new Date().toISOString(),
                data_fim: new Date().toISOString(),
            });

            // Redireciona para recarregar o formulário
            navigate("/listaPontoColeta"); // Ajuste a rota para corresponder à do formulário

        } catch (error) {
            if (error.response && error.response.status === 409) {
                Swal.fire({
                    title: "Erro!",
                    text: "O ponto de coleta já está cadastrado.",
                    icon: "error",
                });
            } else {
                Swal.fire({
                    title: "Erro!",
                    text: "Erro ao enviar dados para o servidor.",
                    icon: "error",
                });
            }
        }
    };


    return (
        <>
            <NavbarAcoes />
            <Header title1={"Ponto de"} title2={"Coleta"} />
            <div className="form-container-criarPontoColeta">
                <div className="input-area-criarPontoColeta">
                    <Form>
                        <FormInput
                            fluid
                            error={erros.name ? { content: erros.name } : null}
                            label={<label className="blue-label-criarPontoColeta">Nome do Ponto de Coleta</label>}
                            placeholder="Digite o nome do ponto de coleta"
                            name="name"
                            type="text"
                            maxLength={100}
                            minLength={10}
                            value={formCriarPontoColeta.name}
                            onChange={handleChange}
                        />
                        <FormInput
                            fluid
                            error={erros.urlMap ? { content: erros.urlMap } : null}
                            label={<label className="blue-label-criarPontoColeta">URL do Mapa</label>}
                            placeholder="Insira a URL do mapa"
                            name="urlMap"
                            type="text"
                            maxLength={500}
                            minLength={10}
                            value={formCriarPontoColeta.urlMap}
                            onChange={handleChange}
                        />
                        <FormInput
                            fluid
                            error={!!errorCep || (erros.address && erros.address.cep) ? { content: errorCep || erros.address.cep } : null}
                            label={<label className="blue-label-criarPontoColeta">CEP</label>}
                            placeholder="Digite o CEP"
                            name="address.cep"
                            type="text"
                            maxLength={9}
                            minLength={9}
                            value={formCriarPontoColeta.address.cep}
                            onChange={handleChange}
                        />
                        <FormGroup widths="equal">
                            <FormInput
                                fluid
                                error={!!(erros.address && erros.address.estado) && { content: erros.address.estado }}
                                label={<label className="blue-label-criarPontoColeta">Estado</label>}
                                placeholder="Digite o estado"
                                name="address.estado"
                                type="text"
                                maxLength={2}
                                minLength={2}
                                value={formCriarPontoColeta.address.estado}
                                onChange={handleChange}
                            />
                            <FormInput
                                fluid
                                error={!!(erros.address && erros.address.cidade) && { content: erros.address.cidade }}
                                label={<label className="blue-label-criarPontoColeta">Cidade</label>}
                                placeholder="Digite a cidade"
                                name="address.cidade"
                                type="text"
                                maxLength={100}
                                minLength={3}
                                value={formCriarPontoColeta.address.cidade}
                                onChange={handleChange}
                            />
                            <FormInput
                                fluid
                                error={!!(erros.address && erros.address.bairro) && { content: erros.address.bairro }}
                                label={<label className="blue-label-criarPontoColeta">Bairro</label>}
                                placeholder="Digite o bairro"
                                name="address.bairro"
                                type="text"
                                maxLength={100}
                                minLength={3}
                                value={formCriarPontoColeta.address.bairro}
                                onChange={handleChange}
                            />
                        </FormGroup>
                        <FormGroup widths="equal">
                            <FormInput
                                fluid
                                error={!!(erros.address && erros.address.rua) && { content: erros.address.rua }}
                                label={<label className="blue-label-criarPontoColeta">Rua</label>}
                                placeholder="Digite a rua"
                                name="address.rua"
                                type="text"
                                maxLength={100}
                                minLength={3}
                                value={formCriarPontoColeta.address.rua}
                                onChange={handleChange}
                            />
                            <FormInput
                                fluid
                                error={!!(erros.address && erros.address.numero) && { content: erros.address.numero }}
                                label={<label className="blue-label-criarPontoColeta">Número</label>}
                                placeholder="Digite o número"
                                name="address.numero"
                                type="text"
                                maxLength={6}
                                value={formCriarPontoColeta.address.numero}
                                onChange={handleChange}
                            />
                        </FormGroup>
                    </Form>
                </div>
                <div className="container-acoes-btnc-criarPontoColeta">
                    <Link to="/listaPontoColeta">
                        <Button type="button" className="voltar">Voltar</Button>
                    </Link>
                    <Button type="button" className="criarPontoColeta" onClick={EnviarPontoColeta}>Criar Ponto de Coleta</Button>
                </div>
            </div>

        </>
    )
}


export default CriarPontoColeta;