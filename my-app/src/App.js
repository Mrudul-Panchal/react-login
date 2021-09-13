import React, {useEffect, useState} from 'react'
import './App.css'

import {useSelector} from 'react-redux'
import {BrowserRouter as Router} from 'react-router-dom'

import {GlobalContext} from './context/globalContext'
import Routes from './routes/Routes'

import {get} from './Utils/AppUtill'
import {AppProvider} from './state/app'
import {LOG_IN} from './action/reducer.types'

const Express = require("express");
const BodyParser = require ("body-parser");
const Speakeasy = require("speakeasy");

var app = Express();

app.use(BodyParser.json());
app.use(BodyParser.urlencoded({ extended: true }));

app.post("/top-secret", (request, response, next) => {
  var secret = Speakeasy.generateSecret({ length: 20 });
  response.send({"secret": secret.base32 });
});

app.post("/totp-generate", (request, response, next) => {
  response.send({
    "token": Speakeasy.totp({
      secret: request.body.secret,
      encoding: "base32"
    })
    "remaining": (30 - Math.floor((new Date().getTime() / 1000.0 % 30)))
  });
});

app.post("/totp-validate", (request, response, next) => {
  response.send({
    "valid": Speakeasy.totp.verify({
      secret: request.body.secret,
      encoding: "base32",
      token: request.body.token,
      window: 0
    })
  })
});



const App = () => {

  const [isLoggedIn, setIsLoggedIn] = useState(
    window.localStorage.getItem('token') !== 'null' &&
      window.localStorage.getItem('token'),
  )
  const [userData, setUserData] = useState(
    JSON.parse(window.localStorage.getItem('userData') || '{}'),
  )
  const [appToken, setAppToken] = useState(
    window.localStorage.getItem('token'),
  )

  const setUserInfo = data => {
    setUserData(data)
    window.localStorage.setItem('userData', JSON.stringify(data))
  }
  const setUserToken = data => {
    setAppToken(data)
    window.localStorage.setItem('token', data)
  }

  const {successLabels = []} = useSelector(state => state.apiReducer)
  const {loginData = {}} = useSelector(state => state.authReducer)

  useEffect(() => {
    if (successLabels.includes(LOG_IN)) {
      setUserInfo(get(['user'], loginData))
      setUserToken(get(['jwt'], loginData))
      setIsLoggedIn(true)
    }
  }, [loginData, successLabels])

  return (
    <Router>
      <div className="App">
        <GlobalContext.Provider
          value={{
            isLoggedIn,
            setIsLoggedIn,
            setUserInfo,
            userData,
            appToken,
            setUserToken,
          }}
        >
          <AppProvider>
              <Routes />
          </AppProvider>
        </GlobalContext.Provider>
      </div>
    </Router>
  );
}

export default App;