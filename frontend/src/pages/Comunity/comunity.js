import React, { useState, useEffect} from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Alert from '@material-ui/lab/Alert'
import { TextField, Button, Snackbar, Container, Grid, Typography, MenuItem, InputLabel,FormControl, Select, ButtonBase, Card, CardContent, CardActionArea, CardMedia } from '@material-ui/core'
import { useHistory } from 'react-router'
import useUser from '../../hooks/useUser'
import createComunidadImg from "../../static/images/createComunidad.png"
import joinComunityImg from "../../static/images/joinComunity.jpg"

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

    }
}));

export default function ManageComunity() {
    const classes = useStyles();
    const [comunity, setComunity] = useState({})
    const [type, setType] = useState('')
    const [actionToDo, setActionToDo] = useState({
        createComunity: false,
        joinComunity: false
    });
    const [openSubmitIncorrect, setOpenSubmitIncorrect] = useState(false)
    const history = useHistory()
    const { auth } = useUser()
    const admin = auth.rol === "USER"
    const [errors, setErrors] = useState({})

    useEffect(() => {
        if (!admin) history.push('/')
    }, [admin, history])

    const handleSubmit = (evt) => {
        evt.preventDefault();
        if (handleValidation()) {
            const object = {
                "name": comunity.name, "city": comunity.city, "stadiumName":comunity.stadiumName
            }
            // TeamService.createTeam(object).then(response => {
            //     if (response.status === 200) {
            //         auth.team = response.data;
            //         sessionStorage.removeItem("user");
            //         sessionStorage.setItem("user", JSON.stringify(auth));
            //         history.push({ pathname: '/team/' , state: { data: true } });
            //     } else {
            //         setOpenSubmitIncorrect(true)
            //     }
            // }).catch(error => {
            //     console.log("Error" + error)
            // })
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
        if(!comunity.city) {
            valid = false;
            objErrors['city'] = 'Tienes que rellenar este campo con un valor válido'
        }
        if(!comunity.stadiumName) {
            valid = false;
            objErrors['stadiumName'] = 'Tienes que rellenar este campo con un valor válido'
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
        setOpenSubmitIncorrect(false)
    };
    return (
        <div> 
            <Typography align="center" variant="h4"className={classes.createComunity} gutterBottom>
                Bienvenido {auth.firstName}, sigamos con el registro
            </Typography>
            <Container style={{marginTop:"10%", marginBottom:"10%"}}>
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
                    <div style={{ marginTop: '90px', marginBottom: '100px' }}>
                        <Typography align="center" className='h5' variant="h5" gutterBottom>
                            Crea tu Comunidad
                    </Typography>
                        <div style={{ margin:'0px 0px 0px 20px' }}>
                            <form onSubmit={(e) => handleSubmit(e)} className={classes.root}>
                                <Grid container justify="center" alignItems="center" >
                                    <div>
                                        <TextField className='input-title' id="name" label="Nombre"
                                            helperText={errors.name} variant="standard" InputLabelProps={{shrink: true}} name="name" onChange={(e) => handleChange(e)} />
                                    </div>
                                </Grid>
                                {type === "Private" && (
                                    <Grid container justify="center" alignItems="center" >
                                        <div style={{ marginTop: '20px' }}>
                                            <TextField required fullWidth id="password" name="password" label="Contraseña" variant="standard" margin="normal" type="password" 
                                                autoComplete="current-password" error={errors.password !== null && errors.password !== undefined && errors.password !== ''} 
                                                    helperText={errors.password} onChange={(e) => handleChange(e)}
                                            />
                                        </div>
                                    </Grid>
                                    )
                                }
                                <Grid container justify="center" alignItems="center" >
                                    <div style={{ marginTop: '20px' }}>
                                        <TextField id="numIntegrantes" label="Número de Integrantes" type="number" 
                                            InputLabelProps={{shrink: true}} min="1" max="10" step="2" variant="standard" onChange={(e) => handleChange(e)}/>
                                    </div>
                                </Grid>
                                <Grid container justify="center" alignItems="center" >
                                    <div style={{ marginTop: '20px' }}>
                                        <TextField id="budget" label="Presupuesto" type="number" 
                                            InputLabelProps={{shrink: true}} min="1" max="10" step="2" variant="standard" onChange={(e) => handleChange(e)}/>
                                    </div>
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
                <Container>

                </Container>
            )
            }
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