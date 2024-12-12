import React, { useState, useEffect } from 'react';
import { Grid, Card, Icon, Segment, Label, Button } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import Header from '../../../../components/header/Header';
import NavbarAcoes from '../../../../components/navbarAcoes/NavbarAcoes';
import axios from 'axios';
import 'semantic-ui-css/semantic.min.css';
import './Prioridade.css';


const Prioridade = () => {

    useEffect(() => {
        window.scrollTo(0, 0); // Rola para o topo ao montar o componente
    }, []);

    const [todosProdutos, setProdutos] = useState([]);


    useEffect(() => {
        fetchProdutos();
    }, []);

    const fetchProdutos = async () => {
        try {
            const response = await axios.get('https://apianjobom.victordev.shop/produtos');
            setProdutos(response.data);
        } catch (error) {
            console.error('Erro ao bsucar produtos:', error);
        }
    };

    console.log("todos aqui, ", todosProdutos)

    // Função para retornar a classe CSS com base no nível de prioridade
    const getPriorityClass = (requirement) => {
        switch (requirement) {
            case "ALTO":
                return 'nivel-prioridade-prioridade-alta';
            case "MEDIO":
                return 'nivel-prioridade-prioridade-media';
            case "BAIXO":
                return 'nivel-prioridade-prioridade-baixa';
            default:
                return '';
        }
    };

    // Função para retornar a classe CSS com base no nível de prioridade
    const getPriorityClassBorder = (requirement) => {
        switch (requirement) {
            case "ALTO":
                return 'borda-alta';
            case "MEDIO":
                return 'borda-media';
            case "BAIXO":
                return 'borda-baixa';
            default:
                return '';
        }
    };

    // Função para retornar a classe CSS com base no nível de prioridade
    const getPriorityClassIcon = (requirement) => {
        switch (requirement) {
            case "ALTO":
                return 'color-icon-star-alta';
            case "MEDIO":
                return 'color-icon-star-media';
            case "BAIXO":
                return 'color-icon-star-baixa';
            default:
                return '';
        }
    };

    return (
        <>
            <NavbarAcoes />
            <Header title1={"Prioridade para"} title2={"Doação"} />
            <div className="container-caregoria-prioridade">
                <h1 className="title-prioridade">Categorias</h1>
                {todosProdutos.length != 0 ?
                    <Grid container stackable columns={3} doubling>
                        <Grid.Column>
                            <Card centered className={getPriorityClassBorder(todosProdutos[1].requirement)}>
                                <Label className={getPriorityClassIcon(todosProdutos[1].requirement)} corner="right">
                                    <Icon name='star' />
                                </Label>
                                <Card.Content textAlign="center">
                                    <Icon name="food" size="huge" color="blue" />
                                    <Card.Header className='cardHeader-prioridade'>{todosProdutos[1].name}</Card.Header>
                                </Card.Content>
                                <Card.Content extra>
                                    <div className="counter-controls-prioridade">
                                        <div className={getPriorityClass(todosProdutos[1].requirement)}>
                                            <p>{todosProdutos[1].requirement}</p>
                                        </div>
                                    </div>
                                </Card.Content>
                            </Card>
                        </Grid.Column>

                        <Grid.Column>
                            <Card centered className={getPriorityClassBorder(todosProdutos[2].requirement)}>
                                <Label className={getPriorityClassIcon(todosProdutos[2].requirement)} corner="right">
                                    <Icon name='star' />
                                </Label>
                                <Card.Content textAlign="center">
                                    <Icon name="coffee" size="huge" color="blue" />
                                    <Card.Header className='cardHeader-prioridade'>{todosProdutos[2].name}</Card.Header>
                                </Card.Content>
                                <Card.Content extra>
                                    <div className="counter-controls-prioridade">
                                        <div className={getPriorityClass(todosProdutos[2].requirement)}>
                                            <p>{todosProdutos[2].requirement}</p>
                                        </div>
                                    </div>
                                </Card.Content>
                            </Card>
                        </Grid.Column>

                        <Grid.Column>
                            <Card centered className={getPriorityClassBorder(todosProdutos[0].requirement)}>
                                <Label className={getPriorityClassIcon(todosProdutos[0].requirement)} corner="right">
                                    <Icon name='star' />
                                </Label>
                                <Card.Content textAlign="center">
                                    <Icon name="gamepad" size="huge" color="blue" />
                                    <Card.Header className='cardHeader-prioridade'>{todosProdutos[0].name}</Card.Header>
                                </Card.Content>
                                <Card.Content extra>
                                    <div className="counter-controls-prioridade">
                                        <div className={getPriorityClass(todosProdutos[0].requirement)}>
                                            <p>{todosProdutos[0].requirement}</p>
                                        </div>
                                    </div>
                                </Card.Content>
                            </Card>
                        </Grid.Column>

                        <Grid.Column>
                            <Card centered className={getPriorityClassBorder(todosProdutos[3].requirement)}>
                                <Label className={getPriorityClassIcon(todosProdutos[3].requirement)} corner="right">
                                    <Icon name='star' />
                                </Label>
                                <Card.Content textAlign="center">
                                    <Icon name="shopping bag" size="huge" color="blue" />
                                    <Card.Header className='cardHeader-prioridade'>{todosProdutos[3].name}</Card.Header>
                                </Card.Content>
                                <Card.Content extra>
                                    <div className="counter-controls-prioridade">
                                        <div className={getPriorityClass(todosProdutos[3].requirement)}>
                                            <p>{todosProdutos[3].requirement}</p>
                                        </div>
                                    </div>
                                </Card.Content>
                            </Card>
                        </Grid.Column>

                        <Grid.Column>
                            <Card centered className={getPriorityClassBorder(todosProdutos[4].requirement)}>
                                <Label className={getPriorityClassIcon(todosProdutos[4].requirement)} corner="right">
                                    <Icon name='star' />
                                </Label>
                                <Card.Content textAlign="center">
                                    <Icon name="medkit" size="huge" color="blue" />
                                    <Card.Header className='cardHeader-prioridade'>{todosProdutos[4].name}</Card.Header>
                                </Card.Content>
                                <Card.Content extra>
                                    <div className="counter-controls-prioridade">
                                        <div className={getPriorityClass(todosProdutos[4].requirement)}>
                                            <p>{todosProdutos[4].requirement}</p>
                                        </div>
                                    </div>
                                </Card.Content>
                            </Card>
                        </Grid.Column>

                        <Grid.Column>
                            <Card centered className={getPriorityClassBorder(todosProdutos[5].requirement)}>
                                <Label className={getPriorityClassIcon(todosProdutos[5].requirement)} corner="right">
                                    <Icon name='star' />
                                </Label>
                                <Card.Content textAlign="center">
                                    <Icon name="shower" size="huge" color="blue" />
                                    <Card.Header className='cardHeader-prioridade'>{todosProdutos[5].name}</Card.Header>
                                </Card.Content>
                                <Card.Content extra>
                                    <div className="counter-controls-prioridade">
                                        <div className={getPriorityClass(todosProdutos[5].requirement)}>
                                            <p>{todosProdutos[5].requirement}</p>
                                        </div>
                                    </div>
                                </Card.Content>
                            </Card>
                        </Grid.Column>
                    </Grid> : <div className="array-vazio">
                        <h1>No momento não há produtos em prioridade! </h1>
                    </div>}
            </div>
            <div className="container-button-prioridade-edit-next">
                <Link to="/editarPrioridade">
                    <Button type='submit' className='btn-edit-next'>
                        Editar prioridade
                    </Button>
                </Link>
            </div>
        </>
    );
};

export default Prioridade;