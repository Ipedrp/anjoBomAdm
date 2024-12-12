import React, { useState, useEffect } from 'react';
import { Grid, Card, Icon, Button, FormField, Select } from 'semantic-ui-react';
import { Link, useNavigate} from 'react-router-dom';
import Header from '../../../../../components/header/Header';
import NavbarAcoes from '../../../../../components/navbarAcoes/NavbarAcoes';
import 'semantic-ui-css/semantic.min.css';
import axios from 'axios';
import Swal from 'sweetalert2';
import './EditarPrioridade.css';

const options = [
    { key: 'a', text: 'ALTO', value: 'ALTO' },
    { key: 'm', text: 'MEDIO', value: 'MEDIO' },
    { key: 'b', text: 'BAIXO', value: 'BAIXO' },
];

const EditarPrioridade = () => {

    useEffect(() => {
        window.scrollTo(0, 0); // Rola para o topo ao montar o componente
    }, []);

    const [todosProdutos, setProdutos] = useState([]);
    const [prioridades, setPrioridades] = useState({});

    useEffect(() => {
        fetchProdutos();
    }, []);

    const navigate = useNavigate(); // Hook para navegação


    const fetchProdutos = async () => {
        try {
            const response = await axios.get('https://apianjobom.victordev.shop/produtos');
            setProdutos(response.data);

            // Configurar as prioridades iniciais
            const initialPriorities = {};
            response.data.forEach(produto => {
                initialPriorities[produto.name] = produto.requirement;
            });
            setPrioridades(initialPriorities);
        } catch (error) {
            console.error('Erro ao buscar produtos:', error);
        }
    };

    const token = localStorage.getItem('authorization');

    if (!token) {
        console.error('Token não encontrado.');
        alert('Token de autenticação ausente.');
        return;
    }

    const getIconByCategory = (categoria) => {
        switch (categoria) {
            case 'Alimentos':
                return 'food';
            case 'Bebidas':
                return 'coffee';
            case 'Brinquedos':
                return 'gamepad';
            case 'Roupas':
                return 'shopping bag';
            case 'Medicamentos':
                return 'medkit';
            case '"Higiênicos"':
                return 'shower';
            default:
                return 'shower';
        }
    };

    const salvarAlteracoes = async (id, prioridade) => {
        try {
            await axios.put(
                `https://apianjobom.victordev.shop/admin/atualizarProduto/${id}`,
                { requirement: prioridade },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: token,
                    },
                }
            );
        } catch (error) {
            console.log('Erro ao salvar as alterações para produto.');
            throw error;
        }
    };

    const handleSalvarAlteracoes = async () => {
        try {

            await Promise.all(
                todosProdutos.map(produto =>
                    salvarAlteracoes(produto._id, prioridades[produto.name])
                )
            );

            Swal.fire({
                title: 'Sucesso!',
                text: 'Prioridades atualizadas!',
                icon: 'success',
                timer: 1300,
                showConfirmButton: false,
            });
            // Redireciona para recarregar jsx Prioridade.jsx
            navigate("/prioridade"); 
        } catch (error) {
            Swal.fire({
                title: 'Erro!',
                text: 'Ocorreu um erro ao salvar as alterações.',
                icon: 'error',
                timer: 1500,
                showConfirmButton: false,
            });
        }
    };

    return (
        <>
            <NavbarAcoes />
            <Header title1={'Prioridade para'} title2={'Doação'} />
            <div className="container-caregoria-prioridade-2">
                <h1 className="title-prioridade-2">Categorias</h1>
                <Grid container stackable columns={3} doubling>
                    {todosProdutos.map(produto => (
                        <Grid.Column key={produto._id}>
                            <Card centered>
                                <Card.Content textAlign="center">
                                    <Icon name={getIconByCategory(produto.name)} size="huge" color="blue" />
                                    <Card.Header className="cardHeader-prioridade-2">{produto.name}</Card.Header>
                                </Card.Content>
                                <Card.Content extra>
                                    <div className="counter-controls-prioridade-2">
                                        <FormField
                                            className='brabobrabo'
                                            control={Select}
                                            options={options}
                                            value={prioridades[produto.name]}
                                            onChange={(e, { value }) => setPrioridades(prev => ({
                                                ...prev,
                                                [produto.name]: value,
                                            }))}
                                        />
                                    </div>
                                </Card.Content>
                            </Card>
                        </Grid.Column>
                    ))}
                </Grid>
            </div>
            <div className="container-button-prioridade-edit-next-2">
                <Button type="submit" className="btn-edit-next-2" onClick={handleSalvarAlteracoes}>
                    Salvar Alterações
                </Button>

                <Link to="/prioridade">
                    <Button type="submit" className="btn-edit-back-2">
                        Voltar
                    </Button>
                </Link>
            </div>
        </>
    );
};


export default EditarPrioridade;
