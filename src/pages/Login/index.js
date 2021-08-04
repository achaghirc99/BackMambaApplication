import React, {useEffect, useState} from 'react'
import Avatar from '@material-ui/core/Avatar'
import Button from '@material-ui/core/Button'
import CssBaseline from '@material-ui/core/CssBaseline'
import TextField from '@material-ui/core/TextField'
import Link from '@material-ui/core/Link'
import Grid from '@material-ui/core/Grid'
import LockOutlinedIcon from '@material-ui/icons/LockOutlined'
import Typography from '@material-ui/core/Typography'
import {makeStyles} from '@material-ui/core/styles'
import Container from '@material-ui/core/Container'
import backgroungSignUp from '../../static/images/backgroundSignUp.jpg'
import {useHistory, useLocation} from 'react-router'
import { Paper } from '@material-ui/core';
import useUser from '../../hooks/useUser'
import {Alert, AlertTitle} from '@material-ui/lab'
import Footer from "../../components/Footer";
import {Backdrop, CircularProgress} from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
    root: {
        height: '100vh',
        overflow: 'hidden'
    },
    paper: {
        marginTop: theme.spacing(8),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        marginBottom: '70%'
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
        marginTop: theme.spacing(1),
    },
    submit: {
        margin: theme.spacing(3, 0, 2),
        backgroundColor: theme.palette.warning.dark,
    },
    backdrop: {
        zIndex: theme.zIndex.drawer + 1,
        color: '#fff',
    },
    circularStyle : {
        color: theme.palette.warning.dark
    }
}))

export default function Login() {
    const history = useHistory()
    const classes = useStyles()

    const [formData, setFormData] = useState({})
    const [formErrors, setFormErrors] = useState({})
    const [loading, setLoading] = useState(false)

    const {isLogged, login, error} = useUser()

    useEffect(() => {
        if (isLogged) {
            history.push('/')
        }
    }, [isLogged, history])

    useEffect(() => {
        if (error) {
            setLoading(false)
        }
    }, [error])

    const handleChange = (e) => {
        setFormData({...formData, [e.target.name]: e.target.value})
        setFormErrors({})
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        setLoading(true)
        if (handleValidation()) {
            let nickName = formData.nickName
            let password = formData.password
            login({nickName, password})
        }
    }

    function handleValidation() {
        let valid = true
        let objErrors = {}
        if (!formData.nickName) {
            valid = false
            objErrors["nickName"] = "Este campo es obligatorio"
        }
        if (!formData.password) {
            valid = false
            objErrors["password"] = "Este campo es obligatorio"
        }
        setFormErrors(objErrors)
        return valid
    }

    function useQuery() {
        return new URLSearchParams(useLocation().search);
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
                                Iniciar sesión
                            </Typography>
                            {error && (
                                <Alert severity="error" style={{width: '100%', marginTop: 30}}>
                                    <AlertTitle>Ups! Falta porque...</AlertTitle>
                                    {error}
                                </Alert>
                            )}
                            {useQuery().get("registered") && (
                                <Alert severity="success" style={{width: '100%', marginTop: 30}}>
                                    <AlertTitle>Éxito</AlertTitle>
                                    Te has registrado correctamente. Ya puedes iniciar sesión.
                                </Alert>
                            )}
                            <form className={classes.form} onSubmit={handleSubmit}>
                                <TextField autoFocus required fullWidth
                                           id="nickName"
                                           name="nickName"
                                           label="Nombre de usuario"
                                           variant="outlined"
                                           margin="normal"
                                           autoComplete="nickName"
                                           error={formErrors.nickName !== null && formErrors.nickName !== undefined && formErrors.nickName !== ''}
                                           helperText={formErrors.nickName}
                                           onChange={(e) => handleChange(e)}
                                />
                                <TextField required fullWidth
                                           id="password"
                                           name="password"
                                           label="Contraseña"
                                           variant="outlined"
                                           margin="normal"
                                           type="password"
                                           autoComplete="current-password"
                                           error={formErrors.password !== null && formErrors.password !== undefined && formErrors.password !== ''}
                                           helperText={formErrors.password}
                                           onChange={(e) => handleChange(e)}
                                />
                                <Button
                                    type="submit"
                                    fullWidth
                                    variant="contained"
                                    className={classes.submit}
                                >
                                    Iniciar sesión
                                </Button>
                                <Grid container>
                                    <Grid item>
                                        <Link href="#/signup" variant="body2">
                                            Registrarse
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
    )
}

