import {
    LOGOUT,
    LOG_IN,
    NEAR_DETAILS,
    SIGN_UP,
    SOCIAL_LOG_IN,
    UPLOAD_MEDIA,
    VERIFY_FORGOT_PASSWORD,
  } from '../action/reducer.types'
  
  export default function (state = {}, action) {
    switch (action.type) {
      case LOG_IN:
        return {
          ...state,
          loginData: action.payload,
        }
      case SOCIAL_LOG_IN:
        return {
          ...state,
          loginData: action.payload,
        }
      case SIGN_UP:
        return {
          ...state,
          signupData: action.payload,
          signupMessage: action.message,
        }
  
      case LOGOUT:
        return {
          ...state,
          isLoggedOut: action.status === 200,
        }
      case 'CLEAR_LOGOUT':
        return {
          ...state,
          isLoggedOut: false,
        }
  
      case UPLOAD_MEDIA: {
        return {
          ...state,
          mediaUrl: action.payload,
          ...(action.extraParam && {[action.extraParam]: action.payload}),
        }
      }
  
      case NEAR_DETAILS:
        return {...state, nearDetailsData: action.payload}
      case VERIFY_FORGOT_PASSWORD:
        return {
          ...state,
          verifyForgotPasswordData: action.payload,
        }
  
      default:
        return state
    }
  }
  