import React, { useState } from 'react'

const Context = React.createContext({})

export function UserContextProvider ({children}) {
    const [auth, setAuth] = useState(() => JSON.parse(window.sessionStorage.getItem('user')))
    const [currentComunity, setCurrentComunity] = useState(undefined);
    
    return <Context.Provider value={{auth, setAuth, currentComunity, setCurrentComunity}}>
        {children}
    </Context.Provider>
}

export default Context