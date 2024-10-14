import React from 'react';
import { Grid, Image, Icon, Container } from 'semantic-ui-react';
import 'semantic-ui-css/semantic.min.css';
import logo from '../../assets/logo.png';
import './Footer.css';

const Footer = () => {
    return (
        <div className="footer">
            <Container>
                <Grid stackable columns={16} verticalAlign="middle">
                    <Grid.Column className="footer-image" width={4}>
                        <Image src={logo} size='small' centered />
                    </Grid.Column>
                    <Grid.Column className="footer-text" width={8}>
                        <p>Rua Juá, n° 264 - Bosque da Saúde - São Paulo - SP - Cep:04138-020</p>
                        <p>Informações sobre agendamento de doações: 4003 2299</p>
                        <p>Informações sobre demais assuntos: (11) 5591 7074 (não atende aos fins de semana)</p>
                        <p>2024 - Assistência e Promoção Social Anjo Bom</p>
                        <p>Política de Cookies | Política de Privacidade</p>
                    </Grid.Column>
                    <Grid.Column className="footer-icons" width={4} textAlign="right">
                        <Icon name="facebook" size="large" />
                        <Icon name="twitter" size="large" />
                        <Icon name="instagram" size="large" />
                    </Grid.Column>
                </Grid>
            </Container>
        </div>
    );
};

export default Footer;