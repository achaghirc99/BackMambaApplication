import React, { useState, useEffect} from 'react'
import PropTypes from 'prop-types';
import { makeStyles, useTheme } from '@material-ui/core/styles'
import Alert from '@material-ui/lab/Alert'
import { TextField, Button, Snackbar, Container, Grid, Typography, 
    ButtonBase, Card, CardContent, CardActionArea, CardMedia, CardActions, Collapse, CircularProgress, Backdrop,
    Table,TableHead,TableBody, TableCell, TableContainer, TableFooter, TablePagination, TableRow,IconButton, Paper} from '@material-ui/core'
import joinComunityImg from "../../static/images/joinComunity.jpg"
import clsx from 'clsx';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import TeamDataService from "../../services/Team/team.service";
import AdminDataService from "../../services/Admin/admin.service";
import useUser from '../../hooks/useUser';
import {useHistory} from 'react-router';
import CustomPaginationActionsTable from '../../components/TableUsers';
import CustomPaginationActionsTableComunities from '../../components/TableComunities';


const useStyles = makeStyles((theme) => ({
    root: {
        '& .MuiInputLabel-formControl': {
            top: '-5px',
        },
    },
    expand: {
        transform: 'rotate(0deg)',
        marginLeft: 'auto',
        transition: theme.transitions.create('transform', {
          duration: theme.transitions.duration.shortest,
        }),
    },
    formControl: {
        margin: theme.spacing(1),
        minWidth: "16%",
    },
    cardAction: {
        width: '100%',
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
    },
    cardActionJornada : {
        justifyContent : 'center'
    },
    botonVerMas: {
        marginTop: '20px',
        background : 'linear-gradient(45deg, #f17306 70%, #000000 80%)',
        color: '#ffffff'
    },
}));




export default function AdminView() {
    const classes = useStyles();
    const [loading, setLoading] = useState(false)
    const [expanded, setExpanded] = useState(false);
    const [showRefreshMarketCorrect, setShowRefreshMarketCorrect] = useState(false);
    const [showRefreshMarketIncorrect, setShowRefreshMarketIncorrect] = useState(false);
    const [showReqError, setShowReqError] = useState(false);
    const [errors, setErrors] = useState({})
    const [jornada, setJornada] = useState();
    const [users, setUsers] = useState([]);
    const [comunities, setComunities] = useState([]);
    const {auth} = useUser();
    const history = useHistory();
    const [actionToDo, setActionToDo] = useState({
        manageUsers: false,
        manageComunities: false
    });
    const handleExpandClick = () => {
      setExpanded(!expanded);
    };
    
    const handleChangeJornada = (event) => {
      setJornada(parseInt(event.target.value));
    };

    
    useEffect(() => {
        if(!auth) {
            history.push("/")
        }
        if(auth.rol !== 'ADMINISTRADOR'){
            history.push("/")
        }
        AdminDataService.getAllUsersFromSystem().then((res) => {
            if(res.status === 200){ 
                setUsers(res.data);
                AdminDataService.getAllComunitiesFromSystem().then((resC) => {
                    if(res.status === 200){ 
                        setComunities(resC.data);
                    }
                })
            }else{
                setShowReqError(true);
            }
        })
    }, [])

    const generarJornada = () => {
        setLoading(true);
        TeamDataService.cargarPuntosJornada(jornada).then((result1) => {
            if(result1.status === 200){
                TeamDataService.actualizaJugadoresComunidad(jornada).then((res) => {
                    if(res.status === 200){
                        TeamDataService.actualizaJugadoresEquipo(jornada).then((res) => {
                            if(res.status === 200){
                                console.log("Todo realizado correctamente");
                                setLoading(false);
                            }
                        })
                    }
                })
            }
        })
    }
    const refreshMarket = () => {
        setLoading(true);
        AdminDataService.refreshMarkets().then((res) => {
            if(res.status === 200) {
                setShowRefreshMarketCorrect(true);
            }else {
                setShowRefreshMarketIncorrect(true);
            }
        })
        setLoading(false);
    }
    const manageOffers = () => {
        setLoading(true);
        AdminDataService.manageAdminOffers().then((res) => {
            if(res.status === 200) {
                setShowRefreshMarketCorrect(true);
            }else {
                setShowRefreshMarketIncorrect(true);
            }
        })
        setLoading(false);
    }

    const manageUsers = () => { 
        setLoading(true);
        setActionToDo({ ...actionToDo,  manageUsers: true,manageComunities: false});
        setLoading(false);
    }
    const manageComunities = () => { 
        setLoading(true); 
        setActionToDo({ ...actionToDo, manageComunities: true, manageUsers:false });
        setLoading(false);
    }
    
    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setShowRefreshMarketCorrect(false);
        setShowRefreshMarketIncorrect(false);
        setShowReqError(false);
      };


    return (
        <div>
            <Container className={classes.containerCards}>
                <Grid container spacing={3}> 
                    <Grid align="center" item xs={12} sm={3} md={4}  >  
                        <Card variant="outlined">
                            <CardMedia
                              component="img"
                              alt="Crear Comunidad"
                              height="150"
                              image={joinComunityImg}
                              title="Crear Comunidad"
                            />
                            <CardActions className={classes.cardActionJornada}>
                                <Typography gutterBottom>
                                    Generar Jornada
                                </Typography>
                                <IconButton
                                className={clsx(classes.expand, {
                                  [classes.expandOpen]: expanded,
                                })}
                                onClick={handleExpandClick}
                                aria-expanded={expanded}
                                aria-label="show more"
                              >
                                <ExpandMoreIcon />
                              </IconButton>
                            </CardActions>
                            <Collapse in={expanded} timeout="auto" unmountOnExit>
                              <CardContent>
                                    <div>
                                        <TextField className='input-title' id="jornada" label="Número de Jornada" type="number"
                                            helperText={errors.jornada} variant="outlined" InputLabelProps={{shrink: true}} name="jornada" onChange={(e) => handleChangeJornada(e)} 
                                            maxLength={1}/>
                                    </div>
                                    <div>
                                        <Button className={classes.botonVerMas} variant="contained" onClick = {() => generarJornada()}>Generar</Button>
                                    </div>
                              </CardContent>
                            </Collapse>
                        </Card>
                    </Grid>
                    <Grid align="center" item xs={12} sm={3} md={4} >  
                        <Card variant="outlined">
                          <ButtonBase className={classes.cardAction} onClick={() => manageOffers()}>
                          <CardActionArea>
                              <CardMedia
                                component="img"
                                alt="Gestionar Ofertas"
                                height="150"
                                image={joinComunityImg}
                                title=" Gestionar Ofertas"
                              />
                              <CardContent>
                                  <Typography className={classes.createComunity} gutterBottom>
                                      Gestionar Ofertas
                                  </Typography>
                              </CardContent>
                              </CardActionArea>
                          </ButtonBase>
                        </Card>
                    </Grid>
                    <Grid align="center" item xs={12} sm={3} md={4} >  
                        <Card variant="outlined">
                          <ButtonBase className={classes.cardAction} onClick={() => refreshMarket()}>
                          <CardActionArea>
                              <CardMedia
                                component="img"
                                alt="Refrescar Mercado"
                                height="150"
                                image={joinComunityImg}
                                title="Refrescar Mercado"
                              />
                              <CardContent>
                                  <Typography className={classes.createComunity} gutterBottom>
                                      Refrescar Mercado
                                  </Typography>
                              </CardContent>
                              </CardActionArea>
                          </ButtonBase>
                        </Card>
                    </Grid>
                    <Grid align="center" item xs={12} sm={3} md={4} >  
                        <Card variant="outlined">
                          <ButtonBase className={classes.cardAction} onClick={() => manageUsers()}>
                          <CardActionArea>
                              <CardMedia
                                component="img"
                                alt="Gestionar Usuarios"
                                height="150"
                                image={joinComunityImg}
                                title="Gestionar Usuarios"
                              />
                              <CardContent>
                                  <Typography className={classes.createComunity} gutterBottom>
                                      Gestionar Usuarios
                                  </Typography>
                              </CardContent>
                              </CardActionArea>
                          </ButtonBase>
                        </Card>
                    </Grid>
                    <Grid align="center" item xs={12} sm={3} md={4} >  
                        <Card variant="outlined">
                          <ButtonBase className={classes.cardAction} onClick={() => manageComunities()}>
                          <CardActionArea>
                              <CardMedia
                                component="img"
                                alt="Gestionar Comunidades"
                                height="150"
                                image={joinComunityImg}
                                title="Gestionar Comunidades"
                              />
                              <CardContent>
                                  <Typography className={classes.createComunity} gutterBottom>
                                      Gestionar Comunidades
                                  </Typography>
                              </CardContent>
                              </CardActionArea>
                          </ButtonBase>
                        </Card>
                    </Grid>
                </Grid>
                <Backdrop className={classes.backdrop} open={loading}>
                   <CircularProgress className={classes.circularStyle}/>
                </Backdrop>
                <Snackbar open={showRefreshMarketCorrect} autoHideDuration={6000} onClose={handleClose}>
                    <Alert onClose={handleClose} severity="info">
                        Se ha refrescado correctamente el mercado de las comunidades.
                    </Alert>
                </Snackbar>
                <Snackbar open={showRefreshMarketIncorrect} autoHideDuration={6000} onClose={handleClose}>
                    <Alert onClose={handleClose} severity="error">
                        No se ha refrescado correctamente el mercado de las comunidades.
                    </Alert>
                </Snackbar>
                <Snackbar open={showReqError} autoHideDuration={6000} onClose={handleClose}>
                    <Alert onClose={handleClose} severity="error">
                        Fallo en la consulta para recuperar datos
                    </Alert>
                </Snackbar>
            </Container>
            <Container>
                {actionToDo.manageUsers && (
                    <Container className={classes.containerTable}>
                       <CustomPaginationActionsTable users={users}/>
                    </Container>
                )
                }    
            </Container>
            <Container>
                {actionToDo.manageComunities && (
                    <Container className={classes.containerTable}>
                       <CustomPaginationActionsTableComunities comunities={comunities}/>
                    </Container>
                )
                }    
            </Container>
        </div>    
    )
}

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