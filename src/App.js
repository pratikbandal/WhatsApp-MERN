import React, { useEffect, useState } from 'react';
import './App.css';
import Chat from './Chat';
import Sidebar from './Sidebar';
import { auth } from './firebase';
import Login from './Login';
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom'

function App() {
  const [user, setUser]= useState(null)

  useEffect(() => {
    const unsubscribe= auth.onAuthStateChanged(authUser => {
      if(authUser) {
        setUser(authUser)
      }
    })

    return () => {
      unsubscribe()
    }
  }, [])
  
  return (
    <div className="app">
      {!user ? (
        <Login/>
      ) : (
        <div className= 'app__body'>
          <Router>
            <Switch>
              <Route exact path= '/'>
                <Sidebar setUser= {setUser} />
              </Route>
              <Route exact path= '/rooms/:roomId'>
                <Sidebar setUser= {setUser} />
                <Chat user= {user} />
              </Route>
            </Switch>
          </Router>
        </div>
      )}
    </div>
  );
}

export default App;
