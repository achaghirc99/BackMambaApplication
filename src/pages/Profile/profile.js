import React, { useState, useEffect, useContext } from 'react';
import {useHistory} from 'react-router-dom';
import useUser from '../../hooks/useUser';
import {makeStyles} from '@material-ui/core/styles';
import { Paper, Typography, Grid, Avatar, TextField, Button, Backdrop, CircularProgress, Snackbar } from '@material-ui/core';
import PersonOutlineOutlinedIcon from '@material-ui/icons/PersonOutlineOutlined';
import DeleteSweepIcon from '@material-ui/icons/DeleteSweep';
import SaveOutlinedIcon from '@material-ui/icons/SaveOutlined';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import VisibilityIcon from '@material-ui/icons/Visibility';
import VisibilityOffIcon from '@material-ui/icons/VisibilityOff';
import CachedIcon from '@material-ui/icons/Cached';
import userDataService from '../../services/Authentication/user.service'
import { Alert } from '@material-ui/lab';
import { red } from '@material-ui/core/colors'
import Context from '../../context/UserContext';
const useStyles = makeStyles((theme) => ({
    root: {

    },
    paper: {
        margin: '10% auto',
        display: 'flex',
        maxWidth: '50%'
    },
    avatar: {
        display:' flex',
        margin: '0 auto',
        backgroundColor: '#f17306'
    },
    divComunidad: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center'
    },
    divNombreUsuario: {
        display: 'flex',
        justifyContent: 'center'
    },
    divContraseña: { 
        display : 'flex',
        justifyContent: 'center',
        width: '16em'
    },
    button : {
        background : 'linear-gradient(180deg, #cdc9c961 70%, #cc3c0a 80%)',
        minWidth: '16em'
    },
    buttonNewPassword : {
        background : 'linear-gradient(180deg, #cdc9c961 70%, #f27407 80%)',
        minWidth: '16em'
    },
    buttonSave : {
        marginRight: '13px',
        background : 'linear-gradient(180deg, #cdc9c961 70%, #21b826 80%)'
    },
    buttonBack : {
        marginLeft: '5px',
        background : 'linear-gradient(180deg, #cdc9c961 70%, #a8a39e 80%)'
    },
    backdrop: {
        zIndex: theme.zIndex.drawer + 1,
        color: '#fff',
    },
    circularStyle : {
        color: theme.palette.warning.dark
    },
    formControl: {},
    eye: {
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        marginLeft: '15px'
    },
    
}))


export default function Profile (props) {
    const classes = useStyles();
    const history = useHistory();
    const [user, setUser] = useState(JSON.parse(sessionStorage.getItem('user'))); 
    const [userData, setUserData] = useState({});
    const [comunity, setComunity] = useState();
    const {auth} = useUser(); 
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState('');
    const {setAuth} = useContext(Context);
    const [showErrorLeavingComunity, setShowErrorLeavingComunity] = useState(false); 
    const [showUserUpdated, setShowUserUpdated] = useState(false); 
    const [showUserUpdatedError, setShowUserUpdatedError] = useState(false); 
    const [errorPassword, setErrorPassword] = useState(false);
    const [errorPasswordText, setErrorPasswordText] = useState('');
    const [passwordShown, setPasswordShown] = useState(false);
    const [newPasswordShown, setNewPasswordShown] = useState(false);
    const [showInputNewPassword, setShowInputNewPassword] = useState(false);

    useEffect(() => {
        if(!auth) { 
            history.push('/signup')
        }else{
            setLoading(true);
            const id = auth.id;
            userDataService.getCurrentUserBackEnd(id).then((res) => {
                setUser(res.data);
                setComunity(res.data.comunidad);
                res.data.password = '';
                setUserData(res.data); 
                setLoading(false);
            })
        }
    }, [])

    const handleChange = (event) => {
        setUserData({...userData, [event.target.name] : event.target.value})
        setErrorPassword(false);
    }

    const abandonarComunidad = () => {
        setLoading(true)
        if(userData.password !== '') {
            if(userData.comunidad.name === comunity.name) {
                const data = {
                    password: userData.password
                }
                userDataService.leaveComunity(userData.id, comunity._id, data).then((res) => {
                    if(res.status === 200){
                        sessionStorage.clear()
                        history.push('/')
                        setAuth(null);
                    }else if(res.status === 204){
                        setShowErrorLeavingComunity(true);
                        setErrorPassword(true);
                        setErrorPasswordText('Contraseña incorrecta.');
                    }
                })
            
            }else{
                //No se trata de la misma comunidad. Refresque la pagina.
                setShowErrorLeavingComunity(true);
            }
        }else{
            setErrorPassword(true);
            setErrorPasswordText('Obligatorio para esta acción');
        }
        setLoading(false);
    }

    const actualizarUsuario = () => {
        setLoading(true)
        if(userData.password !== '') {
            if(userData.comunidad.name === comunity.name) {
                userDataService.updateUser(userData.id, userData).then((res) => {
                    if(res.status === 200){
                        setShowUserUpdated(true);
                    }
                    if(res.status === 204) {
                        setErrorPassword(true);
                        setErrorPasswordText('Contraseña incorrecta.');
                    }
                    if(res.status === 203) {
                        setShowUserUpdatedError(true);
                    }
                })
            }else {
                setShowErrorLeavingComunity(true);
            }      
        }else{
            setErrorPassword(true);
            setErrorPasswordText('Obligatorio para esta acción');
        }
        setLoading(false);

    }

    const togglePasswordVisiblity = (option) => {
        if(option === 'newPassword'){
            setNewPasswordShown(newPasswordShown ? false : true);
        }else {
            setPasswordShown(passwordShown ? false : true);
            
        }
    }
    const toggleChangePassword = () => {
        if(showInputNewPassword === true) {
            setShowInputNewPassword(false);
        }else{
            setShowInputNewPassword(true);
        }
    }

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setShowErrorLeavingComunity(false);
        setShowUserUpdated(false);
        setShowUserUpdatedError(false);
      };

    return (
        <div> 
            <Paper className={classes.paper}>
                <Grid container justifyContent='center' alignItems='center' spacing={3}>
                    <Grid item xs={12}>
                        <Typography variant='h5' component='h5' align='center'> 
                            Perfil 
                        </Typography>
                        <Avatar alt={auth.name} className={classes.avatar}><PersonOutlineOutlinedIcon /></Avatar>
                    </Grid>
                    <Grid item xs={12} align='center' >
                        <div>
                            <TextField className='input-title' id="firstName" label="Nombre" 
                                helperText={errors.name} variant="outlined" InputLabelProps={{shrink: true}} name="firstName" onChange={(e) => handleChange(e)} value={userData.firstName}/>
                        </div>
                    </Grid>
                    <Grid item xs={12} align='center' >
                        <div>
                            <TextField className='input-title' id="lastName" label="Apellidos"
                                helperText={errors.apellidos} variant="outlined" InputLabelProps={{shrink: true}} name="lastName" onChange={(e) => handleChange(e)} value={userData.lastName}/>
                        </div>
                    </Grid>   
                    <Grid item xs={12} align='center' >
                        <div>   
                            <TextField className='input-title' id="email" label="Email"
                                helperText={errors.email} variant="outlined" InputLabelProps={{shrink: true}} name="email" onChange={(e) => handleChange(e)} value={userData.email}/>
                        </div>
                    </Grid> 
                    <Grid item xs={12} md={12} lg={12} align='center'>
                        <div className={classes.divNombreUsuario}>
                            <TextField className='input-title' id="nickName" label="Nombre de Usuario"
                                helperText={errors.nickName} variant="outlined" InputLabelProps={{shrink: true}} name="nickName" onChange={(e) => handleChange(e)} value={userData.nickName}/>                            
                        </div>
                    </Grid>
                    <Grid item xs={12} md={12} lg={12} align='center'>
                        <div className={classes.divContraseña}>
                            <TextField className='input-title' id="password" label="Contraseña" type={passwordShown ? "text" : "password"}
                                helperText={errorPassword && (<p style={{color: red[500]}}>{errorPasswordText}</p>)} variant="outlined" InputLabelProps={{shrink: true}} name="password" onChange={(e) => handleChange(e)} placeholder='Contraseña'/>
                        <div className={classes.eye} >
                            <i onClick={() => togglePasswordVisiblity('password')}>{passwordShown ? <VisibilityIcon/> :
                            <VisibilityOffIcon/>}</i>
                        </div>
                        </div>
                    </Grid>
                    {showInputNewPassword && (
                        <Grid item xs={12} md={12} lg={12} align='center'>
                            <div className={classes.divContraseña}>
                                <TextField className='input-title' id="newPassword" label="Nueva Contraseña" type={newPasswordShown ? "text" : "password"}
                                    helperText={errors.newPassword} variant="outlined" InputLabelProps={{shrink: true}} name="newPassword" onChange={(e) => handleChange(e)} placeholder='Nueva contraseña'/>                            
                            <div className={classes.eye} >
                                <i onClick={() => togglePasswordVisiblity('newPassword')}>{newPasswordShown ? <VisibilityIcon/> :
                                <VisibilityOffIcon/>}</i>
                            </div>
                            </div>
                        </Grid>  
                    )}
                    <Grid item xs={12} md={12} lg={12} align='center' >
                        <div>
                            <Button className = {classes.buttonNewPassword} startIcon={<CachedIcon/>} onClick={() => toggleChangePassword()}>Cambiar contraseña</Button>
                        </div>
                    </Grid> 
                    <Grid item xs={12} md={12} lg={12} align='center' >
                        <div>
                            <Button className = {classes.button} startIcon={<DeleteSweepIcon/>} onClick={() => abandonarComunidad()}>Abandonar Comunidad</Button>
                        </div>
                    </Grid> 

                    <Grid item xs={12} style={{marginBottom: '30px'}}>
                        <div className={classes.divComunidad}> 
                            <Button className={classes.buttonSave} onClick={() => actualizarUsuario()} startIcon={<SaveOutlinedIcon/>}>Guardar</Button>
                            <Button className={classes.buttonBack} onClick={() => history.goBack()} startIcon={<ArrowBackIcon/>}>Volver</Button>
                        </div>
                    </Grid>
                </Grid>
            </Paper>

            <Backdrop className={classes.backdrop} open={loading}>
                <CircularProgress className={classes.circularStyle}color="secondary" />
            </Backdrop>
            <Snackbar open={showErrorLeavingComunity} autoHideDuration={6000} onClose={handleClose}>
                <Alert onClose={handleClose} severity="error">
                    No se ha podido abandonar la comunidad. Intentelo de nuevo. 
                </Alert>
            </Snackbar>
            <Snackbar open={showUserUpdated} autoHideDuration={6000} onClose={handleClose}>
                <Alert onClose={handleClose} severity="info">
                    Usuario actualizado correctamente
                </Alert>
            </Snackbar>
            <Snackbar open={showUserUpdatedError} autoHideDuration={6000} onClose={handleClose}>
                <Alert onClose={handleClose} severity="error">
                    El usuario no se ha actualizado correctamente
                </Alert>
            </Snackbar>
      </div>
    );

}



