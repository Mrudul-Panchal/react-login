import {
    CHANGE_PASSWORD,
    LOG_IN,
    SIGN_UP,
    SOCIAL_LOG_IN,
    UPLOAD_MEDIA,
    NEAR_DETAILS,
    RESEND_VERIFICATION,
    SEND_FORGOT_PASSWORD,
    RESET_PASSWORD,
    VERIFY_FORGOT_PASSWORD,
    LOGOUT,
  } from './reducer.types'
  import {apiAction} from './api.action'
  import {platformUrl, trailEndpoints, url} from './endpoint'
  
  export function socialLogin(data) {
    return apiAction({
      url: `${platformUrl + trailEndpoints.socialLogin}/${data}`,
      method: 'post',
      label: SOCIAL_LOG_IN,
      isTokenSkipped: true,
      crossDomain: true,
    })
  }
  
  export function nearDetails() {
    return apiAction({
      url: platformUrl + trailEndpoints.nearDetails,
      method: 'get',
  
      label: NEAR_DETAILS,
    })
  }
  
  export function loginUser(data) {
    return apiAction({
      url: platformUrl + trailEndpoints.login,
      method: 'post',
      label: LOG_IN,
      isTokenSkipped: true,
      showLoader: true,
      showToast: true,
      data,
    })
  }
  
  export function signup(data) {
    return apiAction({
      url: platformUrl + trailEndpoints.signup,
      method: 'post',
  
      label: SIGN_UP,
      isTokenSkipped: true,
      data,
      showToast: true,
      crossDomain: true,
    })
  }
  
  export function changePassword(data) {
    return apiAction({
      url: `${platformUrl}/user/changePassword`,
      method: 'post',
  
      label: CHANGE_PASSWORD,
      data,
      crossDomain: true,
    })
  }
  
  export function uploadMedia(data, extraParam) {
    return apiAction({
      url: `${process.env.REACT_APP_URL}${trailEndpoints.uploadMedia}`,
      method: 'post',
      label: UPLOAD_MEDIA,
      data,
      showLoader: true,
      extraParam,
    })
  }
  
  export function resendVerification(data) {
    return apiAction({
      url: platformUrl + trailEndpoints.resendVerificationEmail,
      method: 'post',
      label: RESEND_VERIFICATION,
      data,
      showLoader: true,
      showToast: true,
    })
  }
  
  export function sendForgotPasswordEmail(data) {
    return apiAction({
      url: platformUrl + trailEndpoints.sendForgotPasswordMail,
      method: 'post',
      label: SEND_FORGOT_PASSWORD,
      data,
      showLoader: true,
      showToast: true,
    })
  }
  
  export function resetPassword(data) {
    return apiAction({
      url: platformUrl + trailEndpoints.resetPassword,
      method: 'post',
      label: RESET_PASSWORD,
      data,
      showLoader: true,
      showToast: true,
    })
  }
  
  export function verifyForgotPassword(token) {
    return apiAction({
      url: `${platformUrl + trailEndpoints.verifyForgotPassword}/${token}`,
      method: 'get',
      label: VERIFY_FORGOT_PASSWORD,
      showLoader: true,
    })
  }
  
  export function logoutFromWebapp() {
    return apiAction({
      url: platformUrl + trailEndpoints.logoutFromApp,
      method: 'get',
      label: LOGOUT,
      showLoader: true,
    })
  }
  