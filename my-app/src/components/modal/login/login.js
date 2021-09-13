import React, {useContext} from 'react'
import {Button, Form, Col} from 'react-bootstrap'
import {useDispatch} from 'react-redux'
import Joi from 'joi'
import {Controller, useForm} from 'react-hook-form'
import {joiResolver} from '@hookform/resolvers/joi'
import {NearContext} from '../../../context/nearContext'
import {loginUser} from '../../../action/auth.action'
import {joiUpdatedMessage} from '../../../Utils/AppUtill'
import ErrorLabel from '../../Widgets/ErrorLabel'

const LoginForm = props => {
  const dispatch = useDispatch()
  const {wallet, NearConfig} = useContext(NearContext)
  const {handleSubmit, errors, control} = useForm({
    resolver: joiResolver(
      Joi.object({
        password: Joi.string().min(8).max(20).required().messages(joiUpdatedMessage),
        email: Joi.string()
          .email({tlds: {allow: false}})
          .required()
          .messages(joiUpdatedMessage),
      })
    ),
  })

  const onClickToSubmit = data => {
    dispatch(loginUser(data))
  }

  const requestSignIn = async () => {
    const appTitle = 'Trail Web App'
    await wallet.requestSignIn(NearConfig.contractName, appTitle)
  }

  return (
    <>
      <div className="p-2 p-md-5">
        <Form className="row border_form" noValidate onSubmit={handleSubmit(onClickToSubmit)}>
          <Col md={12}>
            {/* <button type="button" className="trailit_facebook">
              Sign In with Facebook
            </button>
            <button type="button" className="trailit_google">
              Sign In with Google
            </button> */}
            <button type="button" className="trailit_near" onClick={requestSignIn}>
              Sign In with Near
            </button>
            <hr className="trailit_dark trail_or" />
          </Col>

          <Col md={12}>
            <Form.Group>
              <Controller
                name="email"
                control={control}
                render={({value, onChange}) => (
                  <>
                    <input
                      type="email"
                      className="form-control"
                      placeholder="Enter email"
                      value={value}
                      onChange={e => {
                        onChange(e)
                      }}
                    />
                    <ErrorLabel msg={errors.email && errors.email.message} />
                  </>
                )}
              />
            </Form.Group>
          </Col>
          <Col md={12}>
            <Form.Group>
              <Controller
                name="password"
                control={control}
                render={({value, onChange}) => (
                  <>
                    <input
                      type="password"
                      className="form-control"
                      placeholder="Enter password"
                      value={value}
                      onChange={e => {
                        onChange(e)
                      }}
                    />
                    <ErrorLabel msg={errors.password && errors.password.message} />
                  </>
                )}
              />
            </Form.Group>
          </Col>
          <Col md={12}>
            <Button
              variant="link"
              className="trailit_11_400 p-0 text-dark"
              onClick={() => props.setCurrentStep(props.steps[2])}
            >
              Forgot Password?
            </Button>
          </Col>
          <Col md={12} className="text-center mb-3">
            <Button variant="pink" type="submit" className="py-2 px-3 btn-sm">
              Sign in
            </Button>
          </Col>
          <Col md={12} className="text-center">
            <div className="text-center trailit_16_400 d-flex justify-content-center">
              Don’t have an account?{' '}
              <Button
                variant="link"
                onClick={() => props.setCurrentStep(props.steps[1])}
                className="trailit_16_400 p-0 text-dark ml-1"
              >
                Sign up
              </Button>
            </div>
            <hr className="trailit_dark my-2" />
            <div className="text-center trailit_11_400 trailit_login_ftr">
              By signing in you agree to Trailit's Terms of Service and Privacy Policy. This page is protected by
              reCAPTCHA and is subject to Google's Terms of Service and Privacy Policy.
            </div>
          </Col>
        </Form>
      </div>
    </>
  )
}
export default LoginForm