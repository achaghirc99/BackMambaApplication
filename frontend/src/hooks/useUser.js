import { useCallback, useContext, useState } from "react";
import Context from '../context/UserContext'
import * as authService from '../services/Authentication/auth'
import { useHistory } from 'react-router'

export default function useUser() {
    const { auth, setAuth, currentComunity, setCurrentComunity, currentTeam, setCurrentTeam } = useContext(Context)
    const [state, setState] = useState({ loading: false, error: false })
    const [isUpdate, setUpdate] = useState(false)
    
    const history = useHistory()

    const login = useCallback(({ nickName, password }) => {
        setState({ loading: true, error: false })
        authService.login({ nickName, password })
            .then(res => {
                const user = res.dataUser;
                window.sessionStorage.setItem('user', JSON.stringify(user))
                setState({ loading: false, error: false })
                if(user.comunidad){
                    setCurrentComunity(user.comunidad);
                    setAuth(user)
                }else{
                    history.push("/community")
                }
                
            })
            .catch(err => {
                window.sessionStorage.removeItem('user')

                const status = err.response.status
                if (status === 401) {
                    setState({ loading: false, error: "Usuario o contraseña incorrectos." })
                } else {
                    history.push("/pageNotFound")
                }
            })
    }, [setAuth, history])

    const signup = useCallback(({ nickName, email, rol, password, firstName, lastName }) => {
        setState({ loading: true, error: false })
        authService.register({ nickName, email, rol, password, firstName, lastName })
            .then(() => {
                history.push({
                    pathname: '/login',
                    search: '?registered=true'
                })
            })
            .catch(err => {
                if (err.response.status === 400) {
                    let errmessage = err.response.data.message
                    if (!errmessage) {
                        errmessage = "Por favor, revise los datos introducidos e inténtelo de nuevo."
                    }
                    setState({ loading: false, error: errmessage })
                } else {
                    history.push("/pageNotFound")
                }
            })
    }, [history])

    const update = useCallback(({ username, email, oldPassword, password, confirmPassword }) => {
        setState({ loading: true, error: false })
        authService.update({ username, email, oldPassword, password, confirmPassword })
            .then(() => {
                setUpdate(true)
            })
            .catch(err => {
                setUpdate(false)
                if (err.response.status === 400) {
                    let errmessage = err.response.data.message
                    if (!errmessage) {
                        errmessage = "Contraseña incorrecta."
                    }
                    setState({ loading: false, error: errmessage })
                } else {
                    history.push("/pageNotFound")
                }
            })
    }, [history])

    const checkToken = useCallback(() => {
        authService.checkToken()
            .then(() => {
                console.log("Valid token")
            })
            .catch((err) => {
                window.localStorage.removeItem('user')
                setAuth(null)
            })
    }, [setAuth])

    const logout = useCallback(() => {
        history.push("/")
        window.localStorage.removeItem('user')
        setAuth(null)
    }, [setAuth, history])
 
    const updateCurrentComunity = useCallback((comunity) => {
        setCurrentComunity(comunity)
    }, [setCurrentComunity])

    return {
        isLogged: Boolean(auth),
        isUpdate,
        login,
        signup,
        update,
        logout,
        auth,
        currentComunity,
        updateCurrentComunity,
        checkToken,
        error: state.error
    }

}