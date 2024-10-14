import React, { useState, useEffect } from 'react';
import { Grid, Card, Icon, Segment, Label, Button } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import Header from '../../../../components/header/Header';
import NavbarAcoes from '../../../../components/navbarAcoes/NavbarAcoes';
import 'semantic-ui-css/semantic.min.css';
import './Prioridade.css';


const Prioridade = () => {


    return (
        <>
            <NavbarAcoes />
            <Header title1={"Prioridade para"} title2={"Doação"} />
            <div className="container-caregoria-prioridade">
                <h1 className="title-prioridade">Categorias</h1>
                <Grid container stackable columns={3} doubling>
                    <Grid.Column>
                        <Card centered className='uiii1'>
                            {/* <Label color='green' corner="right"><Icon name='star' /></Label> */}
                            <Card.Content textAlign="center">
                                <Icon name="food" size="huge" color="blue" />
                                <Card.Header className='cardHeader-prioridade'>Alimentos</Card.Header>
                            </Card.Content>
                            <Card.Content extra>
                                <div className="counter-controls-prioridade">
                                    <div className='nivel-prioridade-prioridade-baixa'>
                                        <p>Baixa</p>
                                    </div>
                                </div>
                            </Card.Content>
                        </Card>
                    </Grid.Column>

                    <Grid.Column>
                        <Card centered>
                            <Card.Content textAlign="center">
                                <Icon name="coffee" size="huge" color="blue" />
                                <Card.Header className='cardHeader-prioridade'>Bebidas</Card.Header>
                            </Card.Content>
                            <Card.Content extra>
                                <div className="counter-controls-prioridade">
                                    <div className='nivel-prioridade-prioridade-alta'>
                                        <p>Alto</p>
                                    </div>
                                </div>
                            </Card.Content>
                        </Card>
                    </Grid.Column>

                    <Grid.Column>
                        <Card centered>
                            <Card.Content textAlign="center">
                                <Icon name="gamepad" size="huge" color="blue" />
                                <Card.Header className='cardHeader-prioridade'>Brinquedos</Card.Header>
                            </Card.Content>
                            <Card.Content extra>
                                <div className="counter-controls-prioridade">
                                    <div className='nivel-prioridade-prioridade-baixa'>
                                        <p>Baixa</p>
                                    </div>
                                </div>
                            </Card.Content>
                        </Card>
                    </Grid.Column>

                    <Grid.Column>
                        <Card centered>
                            <Card.Content textAlign="center">
                                <Icon name="shopping bag" size="huge" color="blue" />
                                <Card.Header className='cardHeader-prioridade'>Roupas</Card.Header>
                            </Card.Content>
                            <Card.Content extra>
                                <div className="counter-controls-prioridade">
                                    <div className='nivel-prioridade-prioridade-alta'>
                                        <p>Alto</p>
                                    </div>
                                </div>
                            </Card.Content>
                        </Card>
                    </Grid.Column>

                    <Grid.Column>
                        <Card centered>
                            {/* <Label color='blue' corner="right"><Icon name='star' /></Label> */}
                            <Card.Content textAlign="center">
                                <Icon name="medkit" size="huge" color="blue" />
                                <Card.Header className='cardHeader-prioridade'>Medicamentos</Card.Header>
                            </Card.Content>
                            <Card.Content extra>
                                <div className="counter-controls-prioridade">
                                    <div className='nivel-prioridade-prioridade-alta'>
                                        <p>Alto</p>
                                    </div>
                                </div>
                            </Card.Content>
                        </Card>
                    </Grid.Column>

                    <Grid.Column>
                        <Card centered>
                            <Card.Content textAlign="center">
                                <Icon name="shower" size="huge" color="blue" />
                                <Card.Header className='cardHeader-prioridade'>Higiênicos</Card.Header>
                            </Card.Content>
                            <Card.Content extra>
                                <div className="counter-controls-prioridade">
                                    <div className='nivel-prioridade-prioridade-media'>
                                        <p>Média</p>
                                    </div>
                                </div>
                            </Card.Content>
                        </Card>
                    </Grid.Column>
                </Grid>
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