import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import './App.css';
import Chat from './components/Chat';
import { auth } from './firebase';
import Login from './components/Login';
import Sidebar from './components/Sidebar';

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
