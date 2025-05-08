
import React, { useState, useEffect } from 'react';
import { Grid, Card, Icon, Button, FormField, Select, Label, Form } from 'semantic-ui-react';
import { Link, useNavigate} from 'react-router-dom';
import Header from '../../../../../components/header/Header';
import NavbarAcoes from '../../../../../components/navbarAcoes/NavbarAcoes';
import 'semantic-ui-css/semantic.min.css';
import axios from 'axios';
import Swal from 'sweetalert2';

const EditarPrioridade = () => {
    // Dados estáticos de produtos
    const produtosIniciais = [
        { id: 1, name: "Alimentos Básicos", requirement: "ALTO", icon: "food" },
        { id: 2, name: "Bebidas", requirement: "MEDIO", icon: "coffee" },
        { id: 3, name: "Brinquedos", requirement: "BAIXO", icon: "gamepad" },
        { id: 4, name: "Roupas", requirement: "MEDIO", icon: "shopping bag" },
        { id: 5, name: "Produtos de Higiene", requirement: "ALTO", icon: "shower" },
        { id: 6, name: "Medicamentos", requirement: "ALTO", icon: "medkit" }
    ];

    // Estado para os produtos e prioridades
    const [produtos, setProdutos] = useState(produtosIniciais);
    const [prioridades, setPrioridades] = useState(
        produtosIniciais.reduce((acc, produto) => {
            acc[produto.name] = produto.requirement;
            return acc;
        }, {})
    );

    // Opções para o dropdown de prioridade
    const options = [
        { key: 'alto', value: 'ALTO', text: 'Alta' },
        { key: 'medio', value: 'MEDIO', text: 'Média' },
        { key: 'baixo', value: 'BAIXO', text: 'Baixa' }
    ];

    // Funções para classes CSS baseadas na prioridade
    const getPriorityClass = (requirement) => {
        switch (requirement) {
            case "ALTO": return 'nivel-prioridade-prioridade-alta';
            case "MEDIO": return 'nivel-prioridade-prioridade-media';
            case "BAIXO": return 'nivel-prioridade-prioridade-baixa';
            default: return '';
        }
    };

    const getPriorityClassBorder = (requirement) => {
        switch (requirement) {
            case "ALTO": return 'borda-alta';
            case "MEDIO": return 'borda-media';
            case "BAIXO": return 'borda-baixa';
            default: return '';
        }
    };

    const getPriorityClassIcon = (requirement) => {
        switch (requirement) {
            case "ALTO": return 'color-icon-star-alta';
            case "MEDIO": return 'color-icon-star-media';
            case "BAIXO": return 'color-icon-star-baixa';
            default: return '';
        }
    };

    // Função para salvar as alterações
    const salvarAlteracoes = () => {
        const produtosAtualizados = produtos.map(produto => ({
            ...produto,
            requirement: prioridades[produto.name] || produto.requirement
        }));
        setProdutos(produtosAtualizados);
        alert('Prioridades atualizadas com sucesso!');
    };

    return (
        <>
            <NavbarAcoes />
            <Header title1={"Editar Prioridade"} title2={"para Doação"} />
            <div className="container-caregoria-prioridade">
                <h1 className="title-prioridade">Categorias</h1>
                
                {produtos.length !== 0 ? (
                    <Grid container stackable columns={3} doubling>
                        {produtos.map((produto) => (
                            <Grid.Column key={produto.id}>
                                <Card centered className={getPriorityClassBorder(prioridades[produto.name] || produto.requirement)}>
                                    <Label className={getPriorityClassIcon(prioridades[produto.name] || produto.requirement)} corner="right">
                                        <Icon name='star' />
                                    </Label>
                                    <Card.Content textAlign="center">
                                        <Icon name={produto.icon} size="huge" color="blue" />
                                        <Card.Header className='cardHeader-prioridade'>{produto.name}</Card.Header>
                                    </Card.Content>
                                    <Card.Content extra>
                                        <Form>
                                            <Form.Field>
                                                <Select
                                                    className='select-prioridade'
                                                    options={options}
                                                    value={prioridades[produto.name] || produto.requirement}
                                                    onChange={(e, { value }) => setPrioridades(prev => ({
                                                        ...prev,
                                                        [produto.name]: value,
                                                    }))}
                                                />
                                            </Form.Field>
                                        </Form>
                                    </Card.Content>
                                </Card>
                            </Grid.Column>
                        ))}
                    </Grid>
                ) : (
                    <div className="array-vazio">
                        <h1>No momento não há produtos para edição! </h1>
                    </div>
                )}
            </div>
            
            <div className="container-button-prioridade-edit-next">
                <Button 
                    type='submit' 
                    className='btn-edit-next'
                    onClick={salvarAlteracoes}
                >
                    Salvar Alterações
                </Button>
            </div>
        </>
    );
};

export default EditarPrioridade;




// import React, { useState, useEffect } from 'react';
// import { Grid, Card, Icon, Button, FormField, Select } from 'semantic-ui-react';
// import { Link, useNavigate} from 'react-router-dom';
// import Header from '../../../../../components/header/Header';
// import NavbarAcoes from '../../../../../components/navbarAcoes/NavbarAcoes';
// import 'semantic-ui-css/semantic.min.css';
// import axios from 'axios';
// import Swal from 'sweetalert2';
// import './EditarPrioridade.css';

// const options = [
//     { key: 'a', text: 'ALTO', value: 'ALTO' },
//     { key: 'm', text: 'MEDIO', value: 'MEDIO' },
//     { key: 'b', text: 'BAIXO', value: 'BAIXO' },
// ];

// const EditarPrioridade = () => {

//     useEffect(() => {
//         window.scrollTo(0, 0); // Rola para o topo ao montar o componente
//     }, []);

//     const [todosProdutos, setProdutos] = useState([]);
//     const [prioridades, setPrioridades] = useState({});

//     useEffect(() => {
//         fetchProdutos();
//     }, []);

//     const navigate = useNavigate(); // Hook para navegação


//     const fetchProdutos = async () => {
//         try {
//             const response = await axios.get('https://apianjobom.victordev.shop/produtos');
//             setProdutos(response.data);

//             // Configurar as prioridades iniciais
//             const initialPriorities = {};
//             response.data.forEach(produto => {
//                 initialPriorities[produto.name] = produto.requirement;
//             });
//             setPrioridades(initialPriorities);
//         } catch (error) {
//             console.error('Erro ao buscar produtos:', error);
//         }
//     };

//     const token = localStorage.getItem('authorization');

//     if (!token) {
//         console.error('Token não encontrado.');
//         alert('Token de autenticação ausente.');
//         return;
//     }

//     const getIconByCategory = (categoria) => {
//         switch (categoria) {
//             case 'Alimentos':
//                 return 'food';
//             case 'Bebidas':
//                 return 'coffee';
//             case 'Brinquedos':
//                 return 'gamepad';
//             case 'Roupas':
//                 return 'shopping bag';
//             case 'Medicamentos':
//                 return 'medkit';
//             case '"Higiênicos"':
//                 return 'shower';
//             default:
//                 return 'shower';
//         }
//     };

//     const salvarAlteracoes = async (id, prioridade) => {
//         try {
//             await axios.put(
//                 `https://apianjobom.victordev.shop/admin/atualizarProduto/${id}`,
//                 { requirement: prioridade },
//                 {
//                     headers: {
//                         'Content-Type': 'application/json',
//                         Authorization: token,
//                     },
//                 }
//             );
//         } catch (error) {
//             console.log('Erro ao salvar as alterações para produto.');
//             throw error;
//         }
//     };

//     const handleSalvarAlteracoes = async () => {
//         try {

//             await Promise.all(
//                 todosProdutos.map(produto =>
//                     salvarAlteracoes(produto._id, prioridades[produto.name])
//                 )
//             );

//             Swal.fire({
//                 title: 'Sucesso!',
//                 text: 'Prioridades atualizadas!',
//                 icon: 'success',
//                 timer: 1300,
//                 showConfirmButton: false,
//             });
//             // Redireciona para recarregar jsx Prioridade.jsx
//             navigate("/prioridade"); 
//         } catch (error) {
//             Swal.fire({
//                 title: 'Erro!',
//                 text: 'Ocorreu um erro ao salvar as alterações.',
//                 icon: 'error',
//                 timer: 1500,
//                 showConfirmButton: false,
//             });
//         }
//     };

//     return (
//         <>
//             <NavbarAcoes />
//             <Header title1={'Prioridade para'} title2={'Doação'} />
//             <div className="container-caregoria-prioridade-2">
//                 <h1 className="title-prioridade-2">Categorias</h1>
//                 <Grid container stackable columns={3} doubling>
//                     {todosProdutos.map(produto => (
//                         <Grid.Column key={produto._id}>
//                             <Card centered>
//                                 <Card.Content textAlign="center">
//                                     <Icon name={getIconByCategory(produto.name)} size="huge" color="blue" />
//                                     <Card.Header className="cardHeader-prioridade-2">{produto.name}</Card.Header>
//                                 </Card.Content>
//                                 <Card.Content extra>
//                                     <div className="counter-controls-prioridade-2">
//                                         <FormField
//                                             className='brabobrabo'
//                                             control={Select}
//                                             options={options}
//                                             value={prioridades[produto.name]}
//                                             onChange={(e, { value }) => setPrioridades(prev => ({
//                                                 ...prev,
//                                                 [produto.name]: value,
//                                             }))}
//                                         />
//                                     </div>
//                                 </Card.Content>
//                             </Card>
//                         </Grid.Column>
//                     ))}
//                 </Grid>
//             </div>
//             <div className="container-button-prioridade-edit-next-2">
//                 <Button type="submit" className="btn-edit-next-2" onClick={handleSalvarAlteracoes}>
//                     Salvar Alterações
//                 </Button>

//                 <Link to="/prioridade">
//                     <Button type="submit" className="btn-edit-back-2">
//                         Voltar
//                     </Button>
//                 </Link>
//             </div>
//         </>
//     );
// };


// export default EditarPrioridade;
