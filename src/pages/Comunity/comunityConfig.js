import React, {useState, useEffect} from "react"
import { makeStyles, TextField, Grid, Typography, InputLabel, FormControl, Select, MenuItem, Button, CircularProgress, Backdrop, Card, Snackbar } from "@material-ui/core";
import Alert from '@material-ui/lab/Alert';
import useUser from "../../hooks/useUser";
import {useHistory} from "react-router-dom";
import ComunidadDataService from "../../services/Comunidad/comunity.service";

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
    },
    styleGripMarginTop : {
        marginTop: '50px',
    }, 
    styleMarginGripStandar: {
        marginTop: '20px'
    },
    buttons: {
        margin: '20px auto',
    },
    divTitle: {
        margin : "30px auto",
        textAlign: "center"
    },
    botonVerMas: {
        marginRight: '10px',
        background : 'linear-gradient(45deg, #f17306 70%, #000000 80%)'
    },
}));

export default function ComunityConfig(props) {
    const classes = useStyles();
    const [loading, setLoading] = useState(false)
    const [comunity, setComunity] = useState({})
    const [owner, setOwner] = useState({});
    const {auth} = useUser();
    const [errors, setErrors] = useState([]);
    const [type, setType] = useState('');
    const [openSuccess, setOpenSuccess] = useState(false);
    const [openErrors, setOpenErrors] = useState(false);
    const history = useHistory();
    useEffect(() => {
        if(!auth) {
            history.push('/signup')
        }
        if(auth.comunidad == null) {
            history.push('/signup')
        }
        else {
            setLoading(true)
            ComunidadDataService.getOneComunity(auth.id).then((response) => {
                const esOwner = response.data.owner._id === auth.id;
                if(!esOwner) {
                    history.goBack();
                }
                setType(response.data.type);
                setComunity(response.data);
                setOwner(response.data.owner);
                setLoading(false);
            })
        }
    }, [history, auth])
    
    const handleChange = (event) => {
        setComunity({ ...comunity, [event.target.name]: event.target.value });
    }
    const handleSnackbarClose = () => {
        setOpenSuccess(false);
        setOpenErrors(false);
    }

    const handleChangeType = (event) => {
        setComunity({
            ...comunity,
            status: event.target.value,
        });
        setType(event.target.value);
        if(event.target.value === 'Public'){
            setComunity({
                ...comunity,
                password: null,
            });
        }  
    };

    const handleValidation = () => {
        let objErrors = [];
        let valid = true;

        if(!comunity.name) {
            valid = false;
            objErrors['name'] = 'Tienes que rellenar este campo con un valor válido'
        }
        if(type === 'Private' && !comunity.password){
            valid = false;
            objErrors['password'] = 'Tienes que rellenar este campo con un valor válido'
        }
        if(!comunity.numIntegrants) {
            valid = false;
            objErrors['numIntegrantes'] = 'Tienes que rellenar este campo con un valor válido'
        }
        if(!comunity.budget) {
            valid = false;
            objErrors['budget'] = 'Tienes que rellenar este campo con un valor válido'
        }
        if(!comunity.maxPlayersOnMarket) {
            valid = false;
            objErrors['maxPlayersOnMarket'] = 'Tienes que rellenar este campo con un valor válido'
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

    const handleSubmitComunity = () => {
        const valid = handleValidation();
        if(valid == true){
            ComunidadDataService.updateComunity(comunity).then(res => {
                if(res.status === 200) {
                    setOpenSuccess(true);
                };
            });
        }else{ 
            setOpenErrors(true); 
        }   

    }

    const aplicarMaginTopIfPublic = type === "Public" ? classes.styleGripMarginTop : classes.styleMarginGripStandar;
    return (
        <div style={{ maxWidth: 1400, margin: '50px auto', marginBottom: "10%" }}>
            <Grid component={Card} container spacing={3} style={{ marginTop: '50px', backgroundColor:'#acacac2e'}}>
                <Grid item style={{ marginTop: '10px' }} align="center" sm={12}>
                    <div className = {classes.divTitle}>
                        <Typography variant="h4" component="h2">
                            {comunity.name}
                        </Typography>
                        <Typography variant="body2" component="p">
                            Creada por {owner.firstName}
                        </Typography>
                    </div>
                </Grid>
                <Grid item style={{ marginTop: '50px' }} align="center" sm={6}>
                    <div>
                        <TextField className='input-title' id="name" label="Nombre"
                            helperText={errors.name} variant="outlined" InputLabelProps={{shrink: true}} name="name" onChange={(e) => handleChange(e)} value={comunity.name}/>
                    </div>
                </Grid>
                {type === "Private" && (
                    <Grid align="center" style={{ marginTop: '50px' }} item sm={6} >
                        <div>
                            <TextField required id="password" name="password" label="Contraseña" variant="outlined" type="password" value={comunity.password}
                                autoComplete="current-password" error={errors.password !== null && errors.password !== undefined && errors.password !== ''} 
                                    helperText={errors.password} onChange={(e) => handleChange(e)}
                            />
                        </div>
                    </Grid>
                    )
                }
                <Grid item  align="center" sm={6}>
                    <div className={aplicarMaginTopIfPublic}>
                        <TextField id="numIntegrantes" name="numIntegrantes" label="Número de Integrantes" type="number" value={comunity.numIntegrants}
                            InputLabelProps={{shrink: true}} min="1" max="10" step="2" variant="outlined" onChange={(e) => handleChange(e)}/>
                    </div>
                </Grid>
                <Grid item  align="center" sm={6}>
                    <div className={classes.styleMarginGripStandar}>
                        <TextField id="budget" name="budget" label="Presupuesto" type="number" value={comunity.budget}
                            InputLabelProps={{shrink: true}} min="1" max="10" step="2" variant="outlined" onChange={(e) => handleChange(e)}/>
                    </div>
                </Grid>
                <Grid item align="center"  sm={12} md={6}>
                    <div className={classes.styleMarginGripStandar}>
                        <TextField id="maxDaysPlayerOnMarket" name="maxDaysPlayerOnMarket" label="Días máximos jugador en mercado" type="number" 
                            value={comunity.maxDaysPlayerOnMarket} InputLabelProps={{shrink: true}} min="1" max="10" step="2" variant="outlined" onChange={(e) => handleChange(e)}/>
                    </div>
                </Grid>
                <Grid align="center" item  sm={12} md={6}>
                    <div className={classes.styleMarginGripStandar}>
                        <TextField id="maxPlayersOnMarket" name="maxPlayersOnMarket" label="Jugadores máximos en mercado" type="number" 
                            value={comunity.maxPlayersOnMarket} InputLabelProps={{shrink: true}} min="1" max="10" step="2" variant="outlined" onChange={(e) => handleChange(e)}/>
                    </div>
                </Grid>
                <Grid item align="center" sm={12} md={6}>
                    <div className={classes.styleMarginGripStandar}>
                        <TextField id="playersForUserInMarket" name="playersForUserInMarket" label="Jugadores máximos en mercado para cada usuario" type="number" 
                            value={comunity.playersForUserInMarket} InputLabelProps={{shrink: true}} min="1" max="10" step="2" variant="outlined" onChange={(e) => handleChange(e)}/>
                    </div>
                </Grid>
                <Grid item align="center" sm={12} md={6}  style={{minWidth: '60px'}}>
                    <FormControl variant="outlined" style={{marginTop:'25px', minWidth: '60px'}} justify="center" alignItems="center">
                        <InputLabel shrink={true} id="typeSelectLabel">Tipo de Comunidad</InputLabel>
                        <Select
                          label="Tipo de Comunidad"
                          labelId="typeSelectLabel"
                          id="typeSelect"
                          value={type}
                          onChange={(e) => handleChangeType(e)}
                          style={{minWidth: '220px'}}
                        >
                          <MenuItem value="Private">Private</MenuItem>
                          <MenuItem value="Public">Public</MenuItem>
                        </Select>
                    </FormControl>
                </Grid>
                <Grid item align="center" sm={12} md={12}>
                    <div align="center" className={classes.buttons}>
                        <Button className={classes.botonVerMas}  variant="contained" color="primary" onClick={() => handleSubmitComunity()}>Guardar</Button> 
                        <Button  variant="contained"  onClick={() => history.goBack()}>Volver</Button> 
                    </div>
                </Grid>
            </Grid>
            <Backdrop className={classes.backdrop} open={loading}>
               <CircularProgress className={classes.circularStyle}/>
            </Backdrop>
            <Snackbar open={openSuccess} autoHideDuration={6000} onClose={handleSnackbarClose}>
              <Alert onClose={handleSnackbarClose} severity="success">
                Datos actualizados correctamente
              </Alert>
            </Snackbar>
            <Snackbar open={openErrors} autoHideDuration={6000} onClose={handleSnackbarClose}>
              <Alert onClose={handleSnackbarClose} severity="error">
                Se han producido un error, algún campo se encuentra vacío.
              </Alert>
            </Snackbar>
        </div>
    )


}