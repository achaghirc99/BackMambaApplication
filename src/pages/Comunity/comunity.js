import React, { useState, useEffect, useContext} from 'react'
import PropTypes from 'prop-types';
import { makeStyles, useTheme } from '@material-ui/core/styles'
import Alert from '@material-ui/lab/Alert'
import { TextField, Button, Snackbar, Container, Grid, Typography, MenuItem, InputLabel,FormControl, Select, 
    ButtonBase, Card, CardContent, CardActionArea, CardMedia,Table,TableHead,TableBody, TableCell, TableContainer, TableFooter, TablePagination, TableRow,IconButton, Paper, Modal} from '@material-ui/core'
import FirstPageIcon from '@material-ui/icons/FirstPage';
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight';
import LastPageIcon from '@material-ui/icons/LastPage';
import { useHistory } from 'react-router'
import createComunidadImg from "../../static/images/createComunidad.png"
import joinComunityImg from "../../static/images/joinComunity.jpg"
import ComunityDataService from "../../services/Comunidad/comunity.service"
import {Backdrop, CircularProgress} from "@material-ui/core";
import Context from '../../context/UserContext';

const useStyles = makeStyles((theme) => ({
    root: {
        '& .MuiInputLabel-formControl': {
            top: '-5px',
        },
    },
    formControl: {
        margin: theme.spacing(1),
        minWidth: "16%",
    },
    cardAction: {
        width: '100%',
    },
    createComunity: { 

    }, 
    title : {
        margin : "5% 0px 0px 0px"
    },
    containerCards : {
        marginTop:"5%", 
        marginBottom:"5%"
    },
    formStyle: {
        marginTop: '50px', 
        marginBottom: '100px' 
    },
    nameGrid: {
        margin: "3% 0px 0px 0px"
    }, divForm :{
        margin: "0px 0px 0px 50px"
    },
    table: {
        minWidth: 500,
    },
    containerTable: {
        marginBottom:"5%"
    },
    buttonJoin : {
        backgroundColor: theme.palette.warning.dark,
    },
    paper: {
        position: 'absolute',
        width: 400,
        backgroundColor: theme.palette.background.paper,
        border: '1px solid #f17306',
        boxShadow: theme.shadows[5],
        padding: theme.spacing(2, 4, 3),
        margin: "20% 0% 20% 40%"
    },
    buttonFinalizar : {
        float: "rigth",
        backgroundColor: theme.palette.warning.dark,
        margin: "10px 10px 0px 0px"
    },
    backdrop: {
        zIndex: theme.zIndex.drawer + 1,
        color: '#fff',
    },
    circularStyle : {
        color: theme.palette.warning.dark
    }
}));

const columns = [
    {id: 'name', label: 'Nombre', minWidth: 170 },
    {id: 'numIntegrants', label: 'Número de Integrantes', minWidth: 100, align: 'right' },
    {id: 'budget', label: 'Presupuesto', minWidth: 170, align: 'right', format: (value) => value.toLocaleString('en-US')},
    {id: 'type',label: 'Tipo',minWidth: 170,align: 'right',format: (value) => value.toLocaleString('en-US')},
    {id: 'action',label: '',minWidth: 170,align: 'right'},
];

export default function ManageComunity() {
    const classes = useStyles();
    const [loading, setLoading] = useState(false)
    const [comunity, setComunity] = useState({})
    const [comunitySelected, setComunitySelected] = useState({}) //The comunity we want to Join
    const [comunities, setComunities] = useState([]);
    const [type, setType] = useState('')
    const [password, setPassword] = useState('')
    const [openModalPassword, setOpenModalPassword] = useState(false);
    const [actionToDo, setActionToDo] = useState({
        createComunity: false,
        joinComunity: false
    });
    const [openSubmitIncorrect, setOpenSubmitIncorrect] = useState(false);
    const [showModalIncorrectPasswordComunity, setShowModalIncorrectPasswordComunity] = useState(false);
    const history = useHistory()
    const {setCurrentComunity} = useContext(Context);
    let auth = JSON.parse(window.sessionStorage.getItem('user'));
    const [errors, setErrors] = useState({})

    // Paginación tabla de comunidades
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const emptyRows = rowsPerPage - Math.min(rowsPerPage, comunities.length - page * rowsPerPage);
    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };
    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };
    /////////

    useEffect(() => {
        if (auth === "") {
            history.push('/')
        }else {
            if(auth.comunidad !== null){
                history.push('/')
            }
        }
    }, [history,auth])

    useEffect(() => {
        setLoading(true);
        ComunityDataService.getAllComunitys().then(response => {
            setComunities(response.data);
            setLoading(false);
        })
    }, [setComunities, history])


    const handleSubmit = (evt) => {
        setLoading(true)
        evt.preventDefault();
        let object = {}
        if (handleValidation()) {
            object = {
                "name": comunity.name, 
                "password" : "",
                "numIntegrants":comunity.numIntegrantes, 
                "budget": comunity.budget, 
                "type": type, 
                "jugadoresMaximosMercado" : comunity.jugadoresMaximosMercado,
                "maxDaysPlayerOnMarket" : comunity.maxDaysPlayerOnMarket,
                "playersForUserInMarket" : comunity.playersForUserInMarket
            }
            if(type === "Private"){
               object.password = comunity.password
            }else {
                object.password = null;
            }
            ComunityDataService.createComunity(object, auth.id).then(response => {
                if (response.status === 200) {
                    auth.comunidad = response.data;
                    sessionStorage.removeItem("user")
                    sessionStorage.setItem("user", JSON.stringify(auth));
                    setCurrentComunity(response.data);
                    history.push({ pathname: '/createTeam/', state: { data: true } });
                } else {
                    setOpenSubmitIncorrect(true)
                }
            }).catch(error => {
                console.log("Error" + error)
            })
        }
    }

    const handleChangeType = (event) => {
        setComunity({
            ...comunity,
            status: event.target.value,
        });
        setType(event.target.value)
    };

    function handleValidation() {
        let objErrors = {};
        let valid = true;

        if(!comunity.name) {
            valid = false;
            objErrors['name'] = 'Tienes que rellenar este campo con un valor válido'
        }
        if(!comunity.numIntegrantes) {
            valid = false;
            objErrors['numIntegrantes'] = 'Tienes que rellenar este campo con un valor válido'
        }
        if(!comunity.budget) {
            valid = false;
            objErrors['budget'] = 'Tienes que rellenar este campo con un valor válido'
        }
        if(!comunity.jugadoresMaximosMercado) {
            valid = false;
            objErrors['jugadoresMaximosMercado'] = 'Tienes que rellenar este campo con un valor válido'
        }
        if(!comunity.maxDaysPlayerOnMarket) {
            valid = false;
            objErrors['maxDaysPlayerOnMarket'] = 'Tienes que rellenar este campo con un valor válido'
        }
        if(!comunity.playersForUserInMarket) {
            valid = false;
            objErrors['playersForUserInMarket'] = 'Tienes que rellenar este campo con un valor válido'
        }
        setErrors(objErrors);
        return valid;
    }

    const handleChange = (event) => {
        setComunity({ ...comunity, [event.target.name]: event.target.value });
    }
    const handleChangeActionToDo = (event) => {
        if(event === "createComunity"){
            setActionToDo({ ...actionToDo, [event]: true, joinComunity: false });
        }else{
            setActionToDo({ ...actionToDo, [event]: true, createComunity: false });
        }
        
    }
    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpenSubmitIncorrect(false);
        setOpenModalPassword(false);
        setShowModalIncorrectPasswordComunity(false);
    };

    //UNIRME A UNA COMUNIDAD LÓGICA
    const handleFinishJoinComunity = (comunity) => {
        if(comunity.type === "Private"){
            //POPUP PARA RELLENAR LA CONTRASEÑA
            setComunitySelected(comunity);
            setOpenModalPassword(true)
        }else{
            //AQUÍ INTRODUCE DIRECTAMENTE AL USER EN LA COMUNIDAD
            handleJoinComunityLastStep(comunity);
        }
    }

    const handleJoinComunityLastStep = (comunity) => {

        if(comunity.type === "Private"){
            if(password === comunity.password){
                ComunityDataService.joinComunity(comunity, comunity._id, auth.id).then(res => {
                    auth.comunidad = res.data;
                    sessionStorage.removeItem("user")
                    sessionStorage.setItem("user", JSON.stringify(auth));
                    history.push("/createTeam")
                })
            }else{
                setShowModalIncorrectPasswordComunity(true)
            }
        }else{
            ComunityDataService.joinComunity(comunity, comunity._id, auth.id).then(res => {
                auth.comunidad = res.data;
                sessionStorage.removeItem("user")
                sessionStorage.setItem("user", JSON.stringify(auth));
                history.push("/createTeam")
            })
        }


    }

    return (
        <div> 
            <div>
                <Modal
                  open={openModalPassword}
                  onClose={handleClose}
                  aria-labelledby="simple-modal-title"
                  aria-describedby="simple-modal-description"
                >
                    <div className={classes.paper}>
                        <h2 id="simple-modal-title">Introduce la contraseña de la comunidad.</h2>
                        <TextField required id="password" name="password" label="Contraseña" variant="outlined" type="password" 
                            autoComplete="current-password" error={errors.password !== null && errors.password !== undefined && errors.password !== ''} 
                                helperText={errors.password} onChange={(e) => setPassword(e.target.value)}
                        />
                        <Button variant="contained" className={classes.buttonFinalizar} onClick={() => handleJoinComunityLastStep(comunitySelected)}>Finalizar</Button>
                    </div>
                </Modal>
            </div>
            <Typography align="center" variant="h4"className={classes.title} gutterBottom>
                Bienvenido {auth.firstName}, sigamos con el registro
            </Typography>
            <Container className={classes.containerCards}>
                <Grid container spacing={3}> 
                    <Grid item xs={12} sm={6} md={6} lg={6} >  
                        <Card variant="outlined">
                          <ButtonBase className={classes.cardAction} onClick={() => handleChangeActionToDo("createComunity")}>
                            <CardActionArea>
                              <CardMedia
                                component="img"
                                alt="Crear Comunidad"
                                height="150"
                                image={createComunidadImg}
                                title="Crear Comunidad"
                              />
                              <CardContent>
                                  <Typography className={classes.createComunity} gutterBottom>
                                      Crear una comunidad
                                  </Typography>
                              </CardContent>
                              </CardActionArea>
                          </ButtonBase>
                        </Card>
                    </Grid>
                    <Grid item xs={12} sm={6} md={6} >  
                        <Card variant="outlined">
                          <ButtonBase className={classes.cardAction} onClick={() => handleChangeActionToDo("joinComunity")}>
                          <CardActionArea>
                              <CardMedia
                                component="img"
                                alt="Crear Comunidad"
                                height="150"
                                image={joinComunityImg}
                                title="Crear Comunidad"
                              />
                              <CardContent>
                                  <Typography className={classes.createComunity} gutterBottom>
                                      Unirme a una comunidad
                                  </Typography>
                              </CardContent>
                              </CardActionArea>
                          </ButtonBase>
                        </Card>
                    </Grid>
                </Grid>
            </Container>
            {actionToDo.createComunity && (
                <Container fixed>
                    <div className = {classes.formStyle} >
                        <Typography className={classes.titleCrearComunidad} align="center" className='h5' variant="h5" gutterBottom>
                            Crea tu Comunidad
                        </Typography>
                        <div className={classes.divForm}>
                            <form onSubmit={(e) => handleSubmit(e)}>
                                <Grid container justify="center" alignItems="center">
                                    <Grid item  align="center"  sm={3}>
                                        <div>
                                            <TextField className='input-title' id="name" label="Nombre"
                                                helperText={errors.name} variant="outlined" InputLabelProps={{shrink: true}} name="name" onChange={(e) => handleChange(e)} />
                                        </div>
                                    </Grid>
                                    {type === "Private" && (
                                        <Grid align="center" item sm={3} >
                                            <div>
                                                <TextField required id="password" name="password" label="Contraseña" variant="outlined" type="password" 
                                                    autoComplete="current-password" error={errors.password !== null && errors.password !== undefined && errors.password !== ''} 
                                                        helperText={errors.password} onChange={(e) => handleChange(e)}
                                                />
                                            </div>
                                        </Grid>
                                        )
                                    }
                                </Grid>
                                <Grid container justify="center" alignItems="center" >
                                    <Grid item  align="center" sm={3}>
                                        <div style={{ marginTop: '20px' }}>
                                            <TextField id="numIntegrantes" name="numIntegrantes" label="Número de Integrantes" type="number" 
                                                InputLabelProps={{shrink: true}} min="1" max="10" step="2" variant="outlined" onChange={(e) => handleChange(e)}/>
                                        </div>
                                    </Grid>
                                    <Grid item  align="center" sm={3}>
                                        <div style={{ marginTop: '20px' }}>
                                            <TextField id="budget" name="budget" label="Presupuesto" type="number" 
                                                InputLabelProps={{shrink: true}} min="1" max="10" step="2" variant="outlined" onChange={(e) => handleChange(e)}/>
                                        </div>
                                    </Grid>
                                </Grid>
                                <Grid container justify="center" alignItems="center" >
                                    <Grid item align="center"  sm={3} md={3}>
                                        <div style={{ marginTop: '20px' }}>
                                            <TextField id="maxDaysPlayerOnMarket" name="maxDaysPlayerOnMarket" label="Días máximos jugador en mercado" type="number" 
                                                InputLabelProps={{shrink: true}} min="1" max="10" step="2" variant="outlined" onChange={(e) => handleChange(e)}/>
                                        </div>
                                    </Grid>
                                    <Grid align="center" item  sm={3} md={3}>
                                        <div style={{ marginTop: '20px' }}>
                                            <TextField id="jugadoresMaximosMercado" name="jugadoresMaximosMercado" label="Jugadores máximos en mercado" type="number" 
                                                InputLabelProps={{shrink: true}} min="1" max="10" step="2" variant="outlined" onChange={(e) => handleChange(e)}/>
                                        </div>
                                    </Grid>
                                    <Grid item align="center" sm={3} md={3}>
                                        <div style={{ marginTop: '20px' }}>
                                            <TextField id="playersForUserInMarket" name="playersForUserInMarket" label="Jugadores máximos en mercado para cada usuario" type="number" 
                                                InputLabelProps={{shrink: true}} min="1" max="10" step="2" variant="outlined" onChange={(e) => handleChange(e)}/>
                                        </div>
                                    </Grid>
                                </Grid>
                                <Grid container justify="center" alignItems="center" >
                                    <FormControl style={{marginTop:'25px'}} justify="center" alignItems="center" className={classes.formControl}>
                                        <InputLabel id="typeSelectLabel">Tipo de Comunidad</InputLabel>
                                        <Select
                                          label="Tipo de Comunidad"
                                          labelId="typeSelectLabel"
                                          id="typeSelectLabel"
                                          value={type}
                                          variant="standard"
                                          onChange={handleChangeType}
                                        >
                                          <MenuItem value="Private">Private</MenuItem>
                                          <MenuItem value="Public">Public</MenuItem>
                                        </Select>
                                    </FormControl>
                                </Grid>
                                <Button
                                    type="submit"
                                    variant="contained"
                                    color="primary"
                                    style={{ ...stylesComponent.buttonCrear }}>
                                    Enviar
                                </Button>
                                <div className={stylesComponent.snak}>
                                    <Snackbar open={openSubmitIncorrect} autoHideDuration={6000} onClose={handleClose}>
                                        <Alert onClose={handleClose} severity="error">
                                            Tienes que rellenar el formulario correctamente
                                    </Alert>
                                    </Snackbar>
                                </div>
                            </form>
                        </div>
                    </div>
                </Container>
                ) 
            }
            {actionToDo.joinComunity && (
                <Container className={classes.containerTable}>
                    <TableContainer component={Paper}>
                      <Table className={classes.table} aria-label="custom pagination table">
                        <TableHead>
                            <TableRow>
                              {columns.map((column) => (
                                <TableCell
                                  key={column.id}
                                  align={column.align}
                                  style={{ minWidth: column.minWidth }}
                                >
                                  {column.label}
                                </TableCell>
                              ))}
                            </TableRow>
                        </TableHead>
                        
                        <TableBody>
                          {(rowsPerPage > 0
                            ? comunities.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                            : comunities).map((row) => (
                            <TableRow key={row.name}>
                              <TableCell component="th" scope="row">
                                {row.name}
                              </TableCell>
                              <TableCell style={{ width: 160 }} align="right">
                                {row.numIntegrants}
                              </TableCell>
                              <TableCell style={{ width: 160 }} align="right">
                                {row.budget}
                              </TableCell>
                              <TableCell style={{ width: 160 }} align="right">
                                {row.type}
                              </TableCell>
                              <TableCell style={{ width: 160 }} align="right">
                                {row.users.length === row.numIntegrants ? <Button variant="contained" className={classes.buttonJoin} disabled>Completa</Button> 
                                                    : <Button variant="contained" className={classes.buttonJoin} onClick={() => handleFinishJoinComunity(row)}>Unirme</Button>}
                              </TableCell>
                            </TableRow>
                          ))}

                          {emptyRows > 0 && (
                            <TableRow style={{ height: 53 * emptyRows }}>
                              <TableCell colSpan={6} />
                            </TableRow>
                          )}
                        </TableBody>
                        <TableFooter>
                          <TableRow>
                            <TablePagination
                              rowsPerPageOptions={[5, 10, 25, { label: 'All', value: -1 }]}
                              colSpan={3}
                              count={comunities.length}
                              rowsPerPage={rowsPerPage}
                              page={page}
                              SelectProps={{
                                inputProps: { 'aria-label': 'rows per page' },
                                native: true,
                              }}
                              onChangePage={handleChangePage}
                              onChangeRowsPerPage={handleChangeRowsPerPage}
                              ActionsComponent={TablePaginationActions}
                            />
                          </TableRow>
                        </TableFooter>
                      </Table>
                    </TableContainer>
                </Container>
            )
            }
            <Backdrop className={classes.backdrop} open={loading}>
                <CircularProgress className={classes.circularStyle} />
            </Backdrop>
            <Snackbar open={showModalIncorrectPasswordComunity} autoHideDuration={6000} onClose={handleClose}>
                <Alert onClose={handleClose} severity="warning">
                    La contraseña introducida no es correcta para la comunidad.
                </Alert>
            </Snackbar>
        </div>

    )
}


//FUNCIÓN DE PAGINACIÓN DE LA TABLA.
const useStyles1 = makeStyles((theme) => ({
    root: {
      flexShrink: 0,
      marginLeft: theme.spacing(2.5),
    },
}));

function TablePaginationActions(props) {
    const classes = useStyles1();
    const theme = useTheme();
    const { count, page, rowsPerPage, onChangePage } = props;
  
    const handleFirstPageButtonClick = (event) => {
      onChangePage(event, 0);
    };
  
    const handleBackButtonClick = (event) => {
      onChangePage(event, page - 1);
    };
  
    const handleNextButtonClick = (event) => {
      onChangePage(event, page + 1);
    };
  
    const handleLastPageButtonClick = (event) => {
      onChangePage(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
    };
  
    return (
      <div className={classes.root}>
        <IconButton
          onClick={handleFirstPageButtonClick}
          disabled={page === 0}
          aria-label="first page"
        >
          {theme.direction === 'rtl' ? <LastPageIcon /> : <FirstPageIcon />}
        </IconButton>
        <IconButton onClick={handleBackButtonClick} disabled={page === 0} aria-label="previous page">
          {theme.direction === 'rtl' ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
        </IconButton>
        <IconButton
          onClick={handleNextButtonClick}
          disabled={page >= Math.ceil(count / rowsPerPage) - 1}
          aria-label="next page"
        >
          {theme.direction === 'rtl' ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
        </IconButton>
        <IconButton
          onClick={handleLastPageButtonClick}
          disabled={page >= Math.ceil(count / rowsPerPage) - 1}
          aria-label="last page"
        >
          {theme.direction === 'rtl' ? <FirstPageIcon /> : <LastPageIcon />}
        </IconButton>
      </div>
    );
  }
  
  TablePaginationActions.propTypes = {
    count: PropTypes.number.isRequired,
    onChangePage: PropTypes.func.isRequired,
    page: PropTypes.number.isRequired,
    rowsPerPage: PropTypes.number.isRequired,
  };
  

const stylesComponent = {
    buttonCrear: {
        backgroundColor: '#006e85',
        textTransform: 'none',
        letterSpacing: 'normal',
        fontSize: '15px',
        fontWeight: '600',
        textAlign: 'center',
        margin: 'auto',
        display: 'block',
        marginTop: '30px'
    },
    snak: {
        marginBottom: '20px',
    }
}