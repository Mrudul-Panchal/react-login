import Axios from 'axios'

class UploadAdapter {
  constructor(loader) {
    this.loader = loader
  }

  upload() {
    return this.loader.file.then(uploadedFile => {
      return new Promise((resolve, reject) => {
        const data = new FormData()
        data.append('media', uploadedFile)

        Axios({
          url: `${process.env.REACT_APP_URL}/userTourDataDetail/uploadTrail_file_media`,
          method: 'post',
          data,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Headers': '*',
            'Content-Type': 'multipart/form-data',
            'X-Content-Type-Options': 'nosniff',
            'Access-Control-Allow-Methods': 'POST',
            Accept: 'application/json, text/plain, */*',
            Authorization: `Bearer ${window.localStorage.getItem('token')}`,
          },
          withCredentials: false,
        })
          .then(response => {
            if (response.data.response.statusCode === '200') {
              resolve({
                default: response.data.response.result.fileUrl,
              })
            } else {
              reject(response.data.message)
            }
          })
          .catch(response => {
            // eslint-disable-next-line prefer-promise-reject-errors
            reject('Upload failed')
          })
      })
    })
  }

  // eslint-disable-next-line class-methods-use-this
  abort() {}
}

export default UploadAdapter
