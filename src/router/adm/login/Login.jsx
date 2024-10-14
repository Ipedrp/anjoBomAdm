import React, { useState, useEffect } from 'react';
import { Grid, Form, Button, Input, Image, FormInput } from 'semantic-ui-react';
import { useMediaQuery } from 'react-responsive';
import Logo from "../../../assets/logo.png";
import './Login.css';
import { Link } from 'react-router-dom';

const Login = () => {
    const [formValuesLogin, setFormValuesLogin] = useState({ 
        email: '', 
        senha: '' 
    });

    const [formDataArray, setFormDataArray] = useState([]);

    const isMobile = useMediaQuery({ maxWidth: 767 });

    useEffect(() => {
        console.log('dataArray foi atualizado:', formDataArray);
        // Aqui você pode realizar outras operações necessárias quando dataArray mudar
    }, [formDataArray]); // O array de dependências contém dataArray

    const handleChange = (e, { name, value }) => {
        setFormValuesLogin(prevValues => ({
            ...prevValues,
            [name]: value
        }));
    };
   
    
    const Entrar = () => {
        setFormDataArray([...formDataArray, formValuesLogin]);
    };

    return (
        <Grid className="login-grid" columns={isMobile ? 1 : 2}>
            {!isMobile && (
                <Grid.Column className="left-column" width={6}>
                    <Image src={Logo} className="centered-image" />
                    <p className="centered-text">
                        Bem-vindo(a) ao seu <br /> <span>portal!</span>
                    </p>
                </Grid.Column>
            )}

            <Grid.Column className="right-column" width={isMobile ? 16 : 10}>
                <div className="form-container">
                    {isMobile && <Image src={Logo} className="centered-image-form" />}
                    <h4>Logar</h4>
                    <Form className="login-form">
                        <Form.Field>
                            <label>Email</label>
                            <FormInput
                                type="email"
                                placeholder="Digite seu email"
                                icon={"mail"}
                                name="email"
                                value={formValuesLogin.email}
                                onChange={handleChange}
                            />
                        </Form.Field>
                        <Form.Field>
                            <label>Senha</label>
                            <FormInput
                                type="password"
                                placeholder="Digite sua senha"
                                icon={"lock"}
                                name="senha"
                                value={formValuesLogin.senha}
                                onChange={handleChange}
                            />
                        </Form.Field>
                        <Link to="/home">
                            <Button type="submit" className="btn-login" fluid onClick={Entrar}>
                                Entrar
                            </Button>
                        </Link>
                    </Form>
                </div>
            </Grid.Column>
        </Grid>
    );
};

export default Login;
