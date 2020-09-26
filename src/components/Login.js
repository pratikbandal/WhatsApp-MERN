import { Button } from '@material-ui/core'
import React from 'react'
import { auth, provider } from '../firebase'
import './Login.css'

function Login() {

    const signIn = e => {
        e.preventDefault()
        auth.signInWithPopup(provider)
            .catch(error => alert(error.message))
    }

    return (
        <div className= 'login'>
            <div className= 'login__container'>
                <img 
                    src= 'https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg'
                    alt= ''
                />
                <div className= 'login__text'>
                    Sign in
                </div>
                
                <Button type= 'submit' onClick= {signIn}>
                    <img className='login__gImg' src= 'https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg' alt= '' />
                    Sign In With Google
                </Button>
            </div>
        </div>
    )
}

export default Login
