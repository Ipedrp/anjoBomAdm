import React from 'react';
import { Grid } from 'semantic-ui-react';
import { useMediaQuery } from 'react-responsive';
import 'semantic-ui-css/semantic.min.css';
import './NavbarAcoes.css';
import { Link } from 'react-router-dom';

const NavbarAcoes = () => {

    // Usando media queries para detectar se é mobile ou tablet
    const isMobileOrTablet = useMediaQuery({ query: '(max-width: 768px)' });

    return (
        <>
            {
                !isMobileOrTablet && (

                    <div className='supreme-div-acoes-navbar'>
                        <Grid centered className='container-grid-acoes-navbar'>
                            <Grid.Row columns={5}>
                                <Grid.Column>
                                    <Link to="/home">
                                        <div className="grid-column-content">HOME</div>
                                    </Link>
                                </Grid.Column>
                                <Grid.Column>
                                    <Link to="/listaDoacoesRetirar">
                                        <div className="grid-column-content">RETIRAR DOAÇÕES</div>
                                    </Link>
                                </Grid.Column>
                                <Grid.Column>
                                    <Link to="/listaPontoColeta">
                                        <div className="grid-column-content">PONTOS DE COLETA</div>
                                    </Link>
                                </Grid.Column>
                                <Grid.Column>
                                    <Link to="/prioridade">
                                        <div className="grid-column-content">PRIORIDADE</div>
                                    </Link>
                                </Grid.Column>
                                <Grid.Column>
                                    <Link to="/listaEvento">
                                        <div className="grid-column-content">EVENTO</div>
                                    </Link>
                                </Grid.Column>
                            </Grid.Row>
                        </Grid>
                    </div>
                )
            }
        </>
    );
};

export default NavbarAcoes;
