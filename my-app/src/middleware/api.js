import axios from 'axios'
import {API} from '../action/reducer.types'
import {accessDenied, apiError, apiStart, apiEnd, apiSuccess} from '../action/api.action'
import {get} from '../Utils/AppUtill'

const apiMiddleware =
  ({dispatch}) =>
  next =>
  action => {
    if (action) next(action)
    if (action && action.type !== API) return
    
    const {
      url = '',
      method = 'GET',
      data = null,
      params = null,
      label = '',
      isTokenSkipped = false,
      contentType = null,
      cancelToken = null,
      showToast = false,
      showLoader = false,
      successMessage = null,
      crossDomain = false,
      extraParam = null,
    } = action.payload

    const authorizationKey = {
      Authorization: !isTokenSkipped ? `Bearer ${window.localStorage.getItem('token')}` : null,
      'Content-Type': contentType || 'application/json',
    }

    const setData = data => {
      if (!contentType) {
        return data
      }
      if (contentType === 'multipart/form-data') {
        const keys = Object.keys(data)

        const form = new FormData()

        for (let i = 0; i < keys.length; i + 1) {
          if (keys[i] === 'file') {
            for (let j = 0; j < data[keys[i]].length; j + 1) {
              form.append(`files[${j}]`, data[keys[i]][j])
            }
          } else {
            form.append(keys[i], data[keys[i]])
          }
        }

        return form
      }
      return data
    }

    if (label) {
      dispatch(apiStart(label, showLoader, extraParam))
    }

    const request = {
      url,
      method,
      headers: authorizationKey,
      onUploadProgress: ProgressEvent => {
        const {loaded, total} = ProgressEvent
        const percent = Math.floor((loaded * 100) / total)

        dispatch({
          type: 'API_PROGRESS',
          payload: {loaded, total, percent},
        })
      },
      data: setData(data),
      params,
      cancelToken: cancelToken && cancelToken.token,
      crossDomain,
    }

    axios
      .request(request)
      .then(({data}) => {
        const responseData = {
          payload: get(['data', 'response', 'data'], data) || get(['response', 'result'], data),
          message: get(['data', 'response', 'responseMessage'], data) || get(['response', 'responseMessage'], data),
          status:
            Number(get(['data', 'response', 'responseCode'], data)) ||
            Number(get(['response', 'statusCode'], data)) ||
            Number(get(['error', 'errors', 'statusCode'], data)),
          extraParam,
          totalPages: get(['response', 'totalPages'], data, 1),
        }

        if ([200].includes(responseData.status)) {
          // setting data to respective action label only if api is success
          dispatch({
            type: label,
            payload: get(['data', 'response', 'data'], data) || get(['response', 'result'], data),
            message: get(['data', 'response', 'responseMessage'], data) || get(['response', 'responseMessage'], data),
            status:
              Number(get(['data', 'response', 'responseCode'], data)) ||
              Number(get(['response', 'statusCode'], data)) ||
              Number(get(['error', 'errors', 'statusCode'], data)),
            extraParam,
            totalPages: get(['response', 'totalPages'], data, 1),
          })

          // setting msgs, toast of respective api on success
          dispatch(
            apiSuccess({
              status: 200,
              showToast,
              successMessage:
                get(['data', 'response', 'responseMessage'], data) ||
                get(['response', 'responseMessage'], data) ||
                successMessage ||
                'Success',
              label,
            })
          )
        } else if ([400, 208, 404, 500, 401].includes(responseData.status)) {
          // setting msgs, toast of respective api on failure
          // it is included in then because even on failure scenario, api is giving status 200 with internal Status code error

          dispatch(
            apiError({
              status: 400,
              showToast: true,
              errorMessage:
                get(['data', 'response', 'responseMessage'], data) ||
                get(['response', 'responseMessage'], data) ||
                get(['response', 'result'], data) ||
                get(['error', 'errors', 'message'], data, 'Error'),
              label,
            })
          )
        }

        // token expired scenario
        if (responseData.status === 401) {
          dispatch(accessDenied(window.location.pathname))
        }
      })
      .catch(error => {
        // setting msgs, toast of respective api on failure

        dispatch(
          apiError({
            status: 400,
            showToast: true,
            errorMessage: get(['response', 'data', 'message'], error, 'Error'),
            label,
          })
        )
      })
      .finally(() => {
        if (label) {
          dispatch(apiEnd(label))
        }
      })
  }

export default apiMiddleware