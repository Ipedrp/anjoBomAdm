import React, { useState, useEffect } from 'react';
import { Grid, Card, Icon, Segment, Label, Button, FormField, Select } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import Header from '../../../../../components/header/Header';
import NavbarAcoes from '../../../../../components/navbarAcoes/NavbarAcoes'
import 'semantic-ui-css/semantic.min.css';
import './EditarPrioridade.css';


const options = [
    { key: 'a', text: 'Alto', value: 'Alto' },
    { key: 'm', text: 'Médio', value: 'Médio' },
    { key: 'b', text: 'Baixo', value: 'Baixo' },
]

const EditarPrioridade = () => {


    return (
        <>
            <NavbarAcoes/>
            <Header title1={"Prioridade para"} title2={"Doação"} />
            <div className="container-caregoria-prioridade-2">
                <h1 className="title-prioridade-2">Categorias</h1>
                <Grid container stackable columns={3} doubling>
                    <Grid.Column>
                        <Card centered className='uiii1'>
                            {/* <Label color='green' corner="right"><Icon name='star' /></Label> */}
                            <Card.Content textAlign="center">
                                <Icon name="food" size="huge" color="blue" />
                                <Card.Header className='cardHeader-prioridade-2'>Alimentos</Card.Header>
                            </Card.Content>
                            <Card.Content extra>
                                <div className="counter-controls-prioridade-2">
                                    <FormField
                                        control={Select}
                                        options={options}

                                    />
                                </div>
                            </Card.Content>
                        </Card>
                    </Grid.Column>

                    <Grid.Column>
                        <Card centered>
                            <Card.Content textAlign="center">
                                <Icon name="coffee" size="huge" color="blue" />
                                <Card.Header className='cardHeader-prioridade-2'>Bebidas</Card.Header>
                            </Card.Content>
                            <Card.Content extra>
                                <div className="counter-controls-prioridade-2">
                                    <FormField
                                        control={Select}
                                        options={options}

                                    />
                                </div>
                            </Card.Content>
                        </Card>
                    </Grid.Column>

                    <Grid.Column>
                        <Card centered>
                            <Card.Content textAlign="center">
                                <Icon name="gamepad" size="huge" color="blue" />
                                <Card.Header className='cardHeader-prioridade-2'>Brinquedos</Card.Header>
                            </Card.Content>
                            <Card.Content extra>
                                <div className="counter-controls-prioridade-2">
                                    <FormField
                                        control={Select}
                                        options={options}

                                    />
                                </div>
                            </Card.Content>
                        </Card>
                    </Grid.Column>

                    <Grid.Column>
                        <Card centered>
                            <Card.Content textAlign="center">
                                <Icon name="shopping bag" size="huge" color="blue" />
                                <Card.Header className='cardHeader-prioridade-2'>Roupas</Card.Header>
                            </Card.Content>
                            <Card.Content extra>
                                <div className="counter-controls-prioridade-2">
                                    <FormField
                                        control={Select}
                                        options={options}

                                    />
                                </div>
                            </Card.Content>
                        </Card>
                    </Grid.Column>

                    <Grid.Column>
                        <Card centered>
                            {/* <Label color='blue' corner="right"><Icon name='star' /></Label> */}
                            <Card.Content textAlign="center">
                                <Icon name="medkit" size="huge" color="blue" />
                                <Card.Header className='cardHeader-prioridade-2'>Medicamentos</Card.Header>
                            </Card.Content>
                            <Card.Content extra>
                                <div className="counter-controls-prioridade-2">
                                    <FormField
                                        control={Select}
                                        options={options}

                                    />
                                </div>
                            </Card.Content>
                        </Card>
                    </Grid.Column>

                    <Grid.Column>
                        <Card centered>
                            <Card.Content textAlign="center">
                                <Icon name="shower" size="huge" color="blue" />
                                <Card.Header className='cardHeader-prioridade-2'>Higiênicos</Card.Header>
                            </Card.Content>
                            <Card.Content extra>
                                <div className="counter-controls-prioridade-2">
                                    <FormField
                                        control={Select}
                                        options={options}

                                    />
                                </div>
                            </Card.Content>
                        </Card>
                    </Grid.Column>
                </Grid>
            </div>
            <div className="container-button-prioridade-edit-next-2">
                <Button type='submit' className='btn-edit-next-2'>
                    Salvar edição de prioridade
                </Button>
                <Link to="/prioridade">
                    <Button type='submit' className='btn-edit-back-2'>
                        Voltar
                    </Button>
                </Link>
            </div>
        </>
    );
};

export default EditarPrioridade;