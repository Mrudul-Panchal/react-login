import React from 'react'
import {removeDoubleQuotes} from '../../Utils/AppUtill'

const ErrorLabel = ({msg = '', style = {}}) => {
  msg = msg.charAt(0).toUpperCase() + msg.slice(1);
  return (
    <div style={style} className="errorLabel">
      {removeDoubleQuotes(msg)}
    </div>
  )
}

export default ErrorLabel
     