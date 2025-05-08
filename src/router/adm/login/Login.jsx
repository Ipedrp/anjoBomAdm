import React, { useState } from 'react';
import { Grid, Form, Button, Image, FormInput } from 'semantic-ui-react';
import { useMediaQuery } from 'react-responsive';
import Logo from "../../../assets/logo.png";
import './Login.css';
import Swal from 'sweetalert2';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [formValuesLogin, setFormValuesLogin] = useState({
        email: '',
        password: ''
    });
    const [formErrors, setFormErrors] = useState({
        email: false,
        password: false
    });
    const [errorMessage, setErrorMessage] = useState('');

    const navigate = useNavigate();
    const isMobile = useMediaQuery({ maxWidth: 767 });

    const handleChange = (e, { name, value }) => {
        setFormValuesLogin(prevValues => ({
            ...prevValues,
            [name]: value
        }));

        // Resetar o erro ao alterar o valor
        setFormErrors(prevErrors => ({
            ...prevErrors,
            [name]: false
        }));

        setErrorMessage('');
    };

    const validateForm = () => {
        const errors = {
            email: formValuesLogin.email === '',
            password: formValuesLogin.password === ''
        };
        setFormErrors(errors);
        return !errors.email && !errors.password;
    };

    const Entrar = async () => {
        navigate('/home');

    }

    // const Entrar = async () => {
    //     if (!validateForm()) {
    //         return;
    //     }

    //     try {
    //         const response = await axios.post('https://apianjobom.victordev.shop/admin/auth', formValuesLogin, {
    //             headers: {
    //                 'Content-Type': 'application/json'
    //             }
    //         });

    //         if (response.status === 200) {
    //             localStorage.setItem('authorization', response.data.token);

    //             Swal.fire({
    //                 icon: 'success',
    //                 title: '<div class="login-ok"><p>Login bem-sucedido!</p></div>',
    //                 text: 'Você será redirecionado.',
    //                 timer: 1800,
    //                 showConfirmButton: false
    //             }).then(() => {
    //                 navigate('/home');
    //             });
    //         }
    //     } catch (error) {
    //         if (error.response && error.response.status === 400) {
    //             // Exibir erro nos campos
    //             setErrorMessage('E-mail ou senha inválidos.');
    //             setFormErrors({
    //                 email: true,
    //                 password: true
    //             });
    //         } else if (error.response && error.response.status === 401) {
    //             // Exibir erro nos campos
    //             setErrorMessage('E-mail ou senha inválidos');
    //             setFormErrors({
    //                 email: true,
    //                 password: true
    //             });
    //         } else if (error.response && error.response.status === 404) {
    //             // Exibir erro nos campos
    //             setErrorMessage('E-mail ou senha inválidos');
    //             setFormErrors({
    //                 email: true,
    //                 password: true
    //             });
    //         } else if (error.response && error.response.status === 500) {
    //             Swal.fire({
    //                 icon: 'error',
    //                 title: 'Erro 500',
    //                 text: 'Erro interno do servidor. Tente novamente mais tarde.',
    //             });
    //         } else {
    //             console.log(error);
    //         }
    //     }
    // };

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
                                placeholder="Digite seu email"
                                icon={"mail"}
                                iconPosition='left'
                                name="email"
                                type="email"
                                value={formValuesLogin.email}
                                onChange={handleChange}
                                error={formErrors.email && (formValuesLogin.email === '' ? "Email é obrigatório" : errorMessage)}
                            />
                        </Form.Field>
                        <Form.Field>
                            <label>Senha</label>
                            <FormInput
                                placeholder="Digite sua senha"
                                icon={"lock"}
                                iconPosition='left'
                                name="password"
                                type="password"
                                value={formValuesLogin.password}
                                onChange={handleChange}
                                error={formErrors.password && (formValuesLogin.password === '' ? "Senha é obrigatória" : errorMessage)}
                            />
                        </Form.Field>
                        <Button type="submit" className="btn-login" fluid onClick={Entrar}>
                            Entrar
                        </Button>
                    </Form>
                </div>
            </Grid.Column>
        </Grid>
    );
};

export default Login;
