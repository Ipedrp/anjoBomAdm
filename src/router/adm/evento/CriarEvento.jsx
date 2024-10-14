import React, { useState, useEffect } from 'react';
import { FormField, Button, Form, FormGroup, TextArea, FormInput } from 'semantic-ui-react';
import Header from "../../../components/header/Header";
import NavbarAcoes from "../../../components/navbarAcoes/NavbarAcoes";
import axios from 'axios'; // Certifique-se de importar o axios
import './CriarEvento.css'; // Importa o CSS externo
import { Link } from 'react-router-dom';

const CriarEvento = () => {
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
        data_inicio: new Date().toISOString(),
        data_fim: new Date().toISOString(),
    });

    // const [dataArray, setDataArray] = useState([]);

    // useEffect(() => {
    //     console.log('dataArray foi atualizado:', dataArray);
    //     // Aqui você pode realizar outras operações necessárias quando dataArray mudar
    // }, [dataArray]); // O array de dependências contém dataArray

    const [erros, setErros] = useState({
        address: {
            cep: "",
            // outros campos de erro do endereço, se necessário
        },
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
                    if (value.length > 69) {
                        newErros.titulo = "Máximo 70 caracteres";
                    } else {
                        newErros.titulo = "";
                    }
                    break;
                case "descricao":
                    if (value.length > 10) {
                        newErros.descricao = "Máximo 15 caracteres";
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
                    if (value.length > 29) {
                        if (!newErros.address) newErros.address = {};
                        newErros.address.rua = "Máximo 30 caracteres";
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
                    if (value.length > 29) {
                        if (!newErros.address) newErros.address = {};
                        newErros.address.cidade = "Máximo 30 caracteres";
                    } else {
                        if (newErros.address) delete newErros.address.cidade;
                        if (Object.keys(newErros.address || {}).length === 0) delete newErros.address;
                    }
                    break;
                case "address.bairro":
                    if (value.length > 29) {
                        if (!newErros.address) newErros.address = {};
                        newErros.address.bairro = "Máximo 30 caracteres";
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
    const EnviarEvento = async () => {
        let newErros = { ...erros };
        let valid = true;


        // Validação dos campos fora do endereço
        if (formCriarEvento.titulo === "") {

            newErros = { titulo: "Descrição é obrigatório" };
            valid = false;
            console.log("ta vazio essa porra!")

        }
        else {
            delete newErros.titulo; // Limpa o erro se o título não estiver vazio
        }

        // Verifica se a descrição está vazia
        if (formCriarEvento.descricao === "") {
            newErros.descricao = "Descrição é obrigatória"; // Adiciona o erro à descrição
            valid = false;
        } else {
            delete newErros.descricao; // Limpa o erro se a descrição não estiver vazia
        }

        // Validação dos campos dentro de `address`
        if (!formCriarEvento.address.cep) {
            newErros.address = { cep: "CEP é obrigatório" };
            valid = false;
        }
        if (!formCriarEvento.address.estado) {
            newErros.address = { ...newErros.address, estado: "Estado é obrigatório" };
            valid = false;
        }
        if (!formCriarEvento.address.cidade) {
            newErros.address = { ...newErros.address, cidade: "Cidade é obrigatória" };
            valid = false;
        }
        if (!formCriarEvento.address.bairro) {
            newErros.address = { ...newErros.address, bairro: "Bairro é obrigatório" };
            valid = false;
        }
        if (!formCriarEvento.address.rua) {
            newErros.address = { ...newErros.address, rua: "Rua é obrigatória" };
            valid = false;
        }
        if (!formCriarEvento.address.numero) {
            newErros.address = { ...newErros.address, numero: "Número é obrigatório" };
            valid = false;
        }

        if (valid) {
            try {
                // Envia os dados para o backend via POST 
                const response = await axios.post('https://apianjobom.victordev.shop/admin/criarEvento', formCriarEvento, {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });

                // Exibe o SweetAlert para sucesso
                Swal.fire({
                    title: "Sucesso!",
                    text: "O evento foi criado!",
                    icon: "success",
                    customClass: {
                        confirmButton: 'swal2-confirm-custom'
                    }

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
                    data_inicio: new Date().toISOString(),
                    data_fim: new Date().toISOString(),
                });

            } catch (error) {
                if (error.response && error.response.status === 409) {
                    Swal.fire({
                        title: "Temos um pequeno problema!",
                        text: "O evento já está cadastrado.",
                        icon: "error",
                        customClass: {
                            confirmButton: 'swal2-confirm-custom'
                        }

                    });
                } else {
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
        }



        // Atualiza os erros

        // if (valid) {

        //     //Adiciona os dados ao array sem o campo id
        //     setDataArray((prevArray) => [...prevArray, { ...formCriarEvento }]);

        //     // Limpa o formulário
        //     setFormCriarEvento({
        //         titulo: '',
        //         descricao: '',
        //         address: {
        //             cep: '',
        //             estado: '',
        //             cidade: '',
        //             bairro: '',
        //             rua: '',
        //             numero: ''
        //         },
        //         data_inicio: new Date().toISOString(),
        //         data_fim: new Date().toISOString(),
        //     });
        // }

        setErros(newErros);
    }



    return (
        <>
            <NavbarAcoes />
            <Header title2={"Evento"} />
            <div className="form-container-criarEvento">
                {/* <h2>Evento</h2> */}
                <Form>

                    <FormInput
                        fluid
                        error={erros.titulo ? { content: erros.titulo } : null}
                        label={<label className="blue-label-criarEvento">Título do Evento</label>}
                        placeholder="Digite o título do evento"
                        name="titulo"
                        type="text"
                        maxLength={70}
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
                            maxLength={30}
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
                            maxLength={30}
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
                            maxLength={30}
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
                    <FormField
                        error={erros.descricao ? { content: erros.descricao } : null}
                        control={TextArea}
                        label={<label className="blue-label-criarEvento">Descrição do evento</label>}
                        placeholder="Descreva o que este evento irá realizar..."
                        name="descricao"
                        value={formCriarEvento.descricao}
                        onChange={handleChange}
                    />
                </Form>
                <div className="container-acoes-btnc-criarEvento">
                    <Link to="/listaEvento">
                        <Button type="button" className="voltar">Voltar</Button>
                    </Link>
                    <Button type="button" className="criarEvento" onClick={EnviarEvento}>Criar Evento</Button>
                </div>
            </div>
        </>
    );
}

export default CriarEvento;

