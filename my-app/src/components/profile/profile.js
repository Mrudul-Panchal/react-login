import React, {useContext, useState, useEffect} from 'react'
import {Col, Row} from 'react-bootstrap'


import {useDispatch, useSelector} from 'react-redux'
import {joiResolver} from '@hookform/resolvers/joi'
import {useForm, Controller} from 'react-hook-form'
import Joi from 'joi'
import {addUpdateProfile} from '../../action/user.action'

import {MY_PROFILE_DATA} from '../../action/reducer.types'
import {get, joiUpdatedMessage} from '../../Utils/AppUtill'
import UploadAdapter from '../UploadAdapter'
import {GlobalContext} from '../../context/globalContext'
import ErrorLabel from '../Widgets/ErrorLabel'

const schema = Joi.object({
  user_titles: Joi.string().required().label('titles').messages(joiUpdatedMessage),
  user_about: Joi.string().label('about').messages(joiUpdatedMessage),
  firstName: Joi.string().required().label('First name').messages(joiUpdatedMessage),
  lastName: Joi.string().required().label('Last name').messages(joiUpdatedMessage),
})

function MyCustomUploadAdapterPlugin(editor) {
  editor.plugins.get('FileRepository').createUploadAdapter = loader => {
    return new UploadAdapter(loader)
  }
}

const Profile = props => {
  const {myProfile} = useSelector(state => state.userReducer)
  const [isInputChange, setisInputChange] = useState(false)
  const [isEditorLoad, setIsEditorLoad] = useState(false)
  const {successLabels = []} = useSelector(state => state.apiReducer)
  const {userData: {userName} = {}} = useContext(GlobalContext)


  const {handleSubmit, errors, control, reset} = useForm({
    mode: 'onTouched',
    shouldFocusError: true,
    reValidateMode: 'onChange',
    submitFocusError: true,
    shouldUnregister: false,
    resolver: joiResolver(schema),
  })

  const dispatch = useDispatch()

  const handleUpdateProfile = data => {
    const payload = {...data}
    setisInputChange(false)
    dispatch(addUpdateProfile(payload))
  }

  useEffect(() => {
    if (successLabels.includes(MY_PROFILE_DATA)) {
      reset({
        firstName: get(['userData', 'firstName'], myProfile, ''),
        lastName: get(['userData', 'lastName'], myProfile, ''),
        user_titles: get(['profileData', 'user_titles'], myProfile, ''),
        user_about: get(['profileData', 'user_about'], myProfile, ''),
      })
    }
  }, [myProfile, reset, successLabels])

  return (
    <form className="def_form">
      <Row>
        <Col md={12} className="mb-3">
          <Row>
            <Col md={3}>
              <div className="form-group">
                <label className="control-label">First name</label>
                <Controller
                  name="firstName"
                  control={control}
                  render={({value, onChange, onBlur}) => (
                    <>
                      {' '}
                      <input type="text" className="form-control" value={value} onChange={e => {
                        setisInputChange(true)
                        onChange(e)}} />{' '}
                      <ErrorLabel msg={errors.firstName && errors.firstName.message} />
                    </>
                  )}
                />
              </div>
            </Col>
            <Col md={3}>
              <div className="form-group">
                <label className="control-label">Last name</label>
                <Controller
                  name="lastName"
                  control={control}
                  render={({value, onChange, onBlur}) => (
                    <>
                      {' '}
                      <input type="text" className="form-control" value={value} onChange={e => {
                        setisInputChange(true)
                        onChange(e)
                        }} />{' '}
                      <ErrorLabel msg={errors.lastName && errors.lastName.message} />
                    </>
                  )}
                />
              </div>
            </Col>
            <Col md={6}>
              <div className="form-group">
                <label className="control-label">Titles</label>
                <Controller
                  name="user_titles"
                  control={control}
                  render={({value, onChange, onBlur}) => (
                    <>
                      {' '}
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Entrepreneur, Founder etc."
                        value={value}
                        onChange={e => { 
                          setisInputChange(true)
                          onChange(e)
                        }}
                      />{' '}
                      <ErrorLabel msg={errors.user_titles && errors.user_titles.message} />
                    </>
                  )}
                />
              </div>
            </Col>
            <Col md={12}>
              <div className="form-group">
                <label className="control-label">About Me</label>
                <Controller
                  name="user_about"
                  control={control}
                  render={({value, onChange, onBlur}) => (
                    <>
                      <CKEditor
                        editor={CustomEditor}
                        config={{
                          extraPlugins: [MyCustomUploadAdapterPlugin],
                          toolbar: [
                            'heading',
                            'fontfamily',
                            'fontsize',
                            'alignment',
                            'fontColor',
                            'fontBackgroundColor',
                            'bold',
                            'italic',
                            'strikethrough',
                            'underline',
                            'subscript',
                            'superscript',
                            'link',
                            'outdent',
                            'indent',
                            'bulletedList',
                            'numberedList',
                            'todoList',
                            'code',
                            'codeBlock',
                            'insertTable',
                            'imageUpload',
                            'blockQuote',
                            'undo',
                            'redo',
                          ],
                          link: {
                            defaultProtocol: '//'
                          },
                        }}
                        data={value}
                        onChange={(event, editor) => {
                          const data = editor.getData()
                          if(!isEditorLoad) {
                            setIsEditorLoad(true)
                          }
                          if(isEditorLoad) {
                            setisInputChange(true)
                          }
                          onChange(data)
                        }}
                      />
                      <ErrorLabel msg={errors.user_about && errors.user_about.message} />
                    </>
                  )}
                />
              </div>
            </Col>
          </Row>
        </Col>
        <Col md={12} className="text-right mb-2 mt-1">
          <Row className="space-between">
            <Col md={4} className="text-left ">
              <a
                style={{padding: 5}}
                className="brdr_button mr-2"
                href={`/profile/${userName}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                Preview
              </a>
            </Col>
            <Col md={8}>
              <button
                type="button"
                className="cncl_btn mr-2"
                onClick={e => {
                  e.preventDefault()
                  reset({
                    firstName: get(['userData', 'firstName'], myProfile, ''),
                    lastName: get(['userData', 'lastName'], myProfile, ''),
                    user_titles: get(['profileData', 'user_titles'], myProfile, ''),
                    user_about: get(['profileData', 'user_about'], myProfile, ''),
                  })
                }}
              >
                Cancel
              </button>
              <button type="button" onClick={handleSubmit(handleUpdateProfile)} className="sbmt_btn mx-75" disabled={!isInputChange}>
                SAVE
              </button>
            </Col>
          </Row>
        </Col>
      </Row>
    </form>
  )
}

export default Profile