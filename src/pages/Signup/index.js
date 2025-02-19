import React, {useEffect, useState} from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import VisibilityIcon from '@material-ui/icons/Visibility';
import VisibilityOffIcon from '@material-ui/icons/VisibilityOff';
import Typography from '@material-ui/core/Typography';
import {makeStyles} from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import FormControl from '@material-ui/core/FormControl';
import FormGroup from '@material-ui/core/FormGroup';
import FormHelperText from '@material-ui/core/FormHelperText';
import backgroungSignUp from '../../static/images/backgroundSignUp.jpg'
import {useHistory} from 'react-router'

import useUser from '../../hooks/useUser'
import {Alert, AlertTitle} from '@material-ui/lab'
import Footer from "../../components/Footer";
import { Paper, Backdrop, CircularProgress } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
    root: {
        height: '100vh',
        overflow: 'hidden'
    },
    paper: {
        marginTop: theme.spacing(8,4),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        marginBottom: '10%',
    },
    image: {
        backgroundImage: `url(${backgroungSignUp})`,
        backgroundRepeat: 'no-repeat',
        backgroundColor:
          theme.palette.type === 'light' ? theme.palette.grey[50] : theme.palette.grey[900],
        backgroundSize: 'cover',
    },
    avatar: {
        margin: theme.spacing(1),
        backgroundColor: theme.palette.warning.dark,
    },
    form: {
        width: '100%', // Fix IE 11 issue.
        marginTop: theme.spacing(3),
    },
    submit: {
        margin: theme.spacing(3, 0, 2),
    },
    formControl: {},
    eye: {
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
    },
    backdrop: {
        zIndex: theme.zIndex.drawer + 1,
        color: '#fff',
    },
    circularStyle : {
        color: theme.palette.warning.dark
    }
}));

export default function SignUp() {
    const classes = useStyles();
    const history = useHistory();
    const [loading] = useState(false)
    const [formData, setFormData] = useState({})
    const [checkData, setCheckData] = useState({})
    const [formErrors, setFormErrors] = useState({})
    const [passwordShown, setPasswordShown] = useState(false);
    const rol  = 'USER';
    const emailPatt = new RegExp(/^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/i)
    const {isLogged, signup, error} = useUser()

    useEffect(() => {
        if (isLogged) {
            history.push('/')
        }
    }, [isLogged, history])

    const togglePasswordVisiblity = () => {
        setPasswordShown(passwordShown ? false : true);
    }

    const handleChange = (e) => {
        setFormData({...formData, [e.target.name]: e.target.value})
        setFormErrors({})
    }

    const handleCheckChange = (e) => {
        setCheckData({...checkData, [e.target.name]: e.target.checked})
        setFormErrors({})
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        if (handleValidation()) {
            let nickName = formData.nickName
            let firstName = formData.firstName
            let lastName = formData.lastName
            let email = formData.email
            let password = formData.password
            signup({nickName, email, rol, password, firstName, lastName })
        }
    }

    function handleValidation() {
        let valid = true
        let objErrors = {}
        if (!formData.nickName || formData.nickName.length < 3 || formData.nickName.length > 20) {
            valid = false
            objErrors["nickName"] = "El nombre de usuario debe tener más de 3 caracteres y menos de 20"
        }
        if (!formData.email || !emailPatt.test(formData.email) || formData.email.length > 50) {
            valid = false
            objErrors["email"] = "Se debe introducir un correo electrónico válido y no mayor de 50 caracteres"
        }
        if (!formData.password || formData.password.length < 6 || formData.password.length > 40) {
            valid = false
            objErrors["password"] = "La contraseña debe tener más de 6 caracteres y menos de 40"
        }
        if (!formData.firstName) {
            valid = false
            objErrors["firstName"] = "El nombre no puede estar vacío"
        }
        if (!formData.lastName) {
            valid = false
            objErrors["lastName"] = "El apellido no puede estar vacío"
        }
        if (!checkData.serviceTerms) {
            valid = false
            objErrors["serviceTerms"] = "Obligatorio"
        }
        setFormErrors(objErrors)
        return valid
    }

    return (
        <div>
        <Grid container component="main" className={classes.root}>
                <CssBaseline/>
                <Grid item xs={false} sm={4} md={7} className={classes.image} />
                    <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
                        <Container component="main" maxWidth="xs">
                        <div className={classes.paper}>
                            <Avatar className={classes.avatar}>
                                <LockOutlinedIcon/>
                            </Avatar>
                            <Typography component="h1" variant="h5">
                                Registrarse
                            </Typography>
                            {error && (
                                <Alert severity="error" style={{width: '100%', marginTop: 30}}>
                                    <AlertTitle>Ups! Fallaste la canasta porque...</AlertTitle>
                                    {error}
                                </Alert>
                            )}
                            <form className={classes.form} onSubmit={handleSubmit}>
                                <Grid container spacing={2}>
                                    <Grid item xs={12}>
                                        <TextField fullWidth required autoFocus
                                                   id={"nickName"}
                                                   name={"nickName"}
                                                   label={"Nombre de usuario"}
                                                   autoComplete={"nickName"}
                                                   variant={"outlined"}
                                                   error={formErrors.nickName !== null && formErrors.nickName !== undefined && formErrors.nickName !== ''}
                                                   helperText={formErrors.nickName}
                                                   onChange={(e) => handleChange(e)}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField required fullWidth
                                                   id="firstName"
                                                   name="firstName"
                                                   label="Nombre"
                                                   autoComplete="fname"
                                                   variant="outlined"
                                                   error={formErrors.firstName !== null && formErrors.firstName !== undefined && formErrors.firstName !== ''}
                                                   helperText={formErrors.firstName}
                                                   onChange={(e) => handleChange(e)}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField required fullWidth
                                                   id="lastName"
                                                   name="lastName"
                                                   label="Apellido"
                                                   variant="outlined"
                                                   autoComplete="lname"
                                                   error={formErrors.lastName !== null && formErrors.lastName !== undefined && formErrors.lastName !== ''}
                                                   helperText={formErrors.lastName}
                                                   onChange={(e) => handleChange(e)}
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <TextField required fullWidth
                                                   id="email"
                                                   name="email"
                                                   label="Email"
                                                   autoComplete="email"
                                                   variant="outlined"
                                                   placeholder="example@mail.com"
                                                   error={formErrors.email !== null && formErrors.email !== undefined && formErrors.email !== ''}
                                                   helperText={formErrors.email}
                                                   onChange={(e) => handleChange(e)}
                                        />
                                    </Grid>
                                    <Grid item xs>
                                        <TextField required fullWidth
                                                   id="password"
                                                   name="password"
                                                   label="Contraseña"
                                                   variant="outlined"
                                                   type={passwordShown ? "text" : "password"}
                                                   autoComplete="current-password"
                                                   error={formErrors.password !== null && formErrors.password !== undefined && formErrors.password !== ''}
                                                   helperText={formErrors.password}
                                                   onChange={(e) => handleChange(e)}
                                        />
                                    </Grid>
                                    <Grid item xs={"auto"} className={classes.eye}>
                                        <i onClick={togglePasswordVisiblity}>{passwordShown ? <VisibilityIcon/> :
                                            <VisibilityOffIcon/>}</i>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <FormControl
                                            error={formErrors.serviceTerms !== null && formErrors.serviceTerms !== undefined && formErrors.serviceTerms !== ''}
                                            component="fieldset" className={classes.formControl}>
                                            <FormGroup>
                                                <FormControlLabel
                                                    control={<Checkbox checked={checkData.serviceTerms}
                                                                       onChange={(e) => handleCheckChange(e)}
                                                                       name="serviceTerms"
                                                                       color="primary"/>}
                                                    label={<label>He leído y acepto los <Link href='#/terms'>términos y
                                                        condiciones de uso</Link>.</label>}
                                                />
                                            </FormGroup>
                                            <FormHelperText>{formErrors.serviceTerms}</FormHelperText>
                                        </FormControl>
                                    </Grid>
                                </Grid>
                                <Button
                                    type="submit"
                                    fullWidth
                                    variant="contained"
                                    color="primary"
                                    className={classes.submit}
                                >
                                    Registrarse
                                </Button>
                                <Grid container justify="flex-end">
                                    <Grid item>
                                        <Link href="#/login" variant="body2">
                                            Inicia sesión
                                        </Link>
                                    </Grid>
                                </Grid>
                            </form>
                        </div>
                    </Container>
                    <Backdrop className={classes.backdrop} open={loading}>
                        <CircularProgress className={classes.circularStyle}color="secondary" />
                    </Backdrop>
                </Grid>  
            </Grid>
        <Footer/>
        </div>

    );
}