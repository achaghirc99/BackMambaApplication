import React, { useState } from 'react'

const Context = React.createContext({})

export function UserContextProvider ({children}) {
    const [auth, setAuth] = useState(() => JSON.parse(window.sessionStorage.getItem('user')))
    const [currentComunity, setCurrentComunity] = useState(() => JSON.parse(window.sessionStorage.getItem('comunity')));
    const [currentTeam, setCurrentTeam] = useState(() => JSON.parse(window.sessionStorage.getItem('team')))
    return <Context.Provider value={{auth, setAuth, currentComunity, setCurrentComunity, currentTeam, setCurrentTeam}}>
        {children}
    </Context.Provider>
}

export default Context