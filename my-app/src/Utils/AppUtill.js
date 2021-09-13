export const get = (a, b, c) => {
    const retValue = c !== undefined ? c : null
    return a.reduce((obj, key) => (obj && key && obj[key] !== null && obj[key] !== undefined ? obj[key] : retValue), b)
  }
  
  export const getQueryStringObj = () => {
    const url = new URL(window.location.href)
    return Object.fromEntries(new URLSearchParams(url.search))
  }
  
  export function getQuery(params) {
    const keys = Object.keys(params || {})
    const query = keys
      .filter(key => params[key])
      .map(key => `${key}=${params[key]}`)
      .join('&')
    return query
  }
  
  export function copyStringToClipboard(str) {
    // Create new element
    if (str) {
      const el = document.createElement('textarea')
  
      // Set value (string to be copied)
      el.value = str
  
      // Set non-editable to avoid focus and move outside of view
      el.setAttribute('readonly', '')
      el.style = {position: 'absolute', left: '-9999px'}
      document.body.appendChild(el)
  
      // Select text inside element
      el.select()
  
      // Copy text to clipboard
      document.execCommand('copy')
  
      // Remove temporary element
      document.body.removeChild(el)
      alert('Successfully copied')
    } else {
      alert('No steps to copy')
    }
  }
  
  export const numberAbbreviation = (number, precision) => {
    const abbrev = ['', 'k', 'M', 'G', 'T', 'P', 'E', 'Z', 'Y']
    const unrangifiedOrder = Math.floor(Math.log10(Math.abs(number)) / 3)
    const order = Math.max(0, Math.min(unrangifiedOrder, abbrev.length - 1))
    const suffix = abbrev[order]
  
    // return (number / Math.pow(10, order * 3)).toFixed(precision) + suffix;
  
    return Number((number / 10 ** (order * 3)).toFixed(precision)) + suffix
  }
  
  export const getTrailUrl = (
    data,
    currentUserId,
    stepNumber = 1,
    previewUserId,
    redirectUrl,
    singleStepPreview,
    trailDataId
  ) => {
    if (data[0]) {
      const trailId = data[0].trail_id
      const URL = data[0].url
      const qryString = URL.split('?').length > 1 ? '&' : '?'
      return `https://go.trialit.co/live/${URL}${qryString}trailUserId=${currentUserId}&trailId=${trailId}&trailPreview=true&tourStep=${stepNumber}&singleStepPreview=${singleStepPreview}&trailDataId=${trailDataId}&previewUserId=${previewUserId}&redirectUrl=${redirectUrl}`
    }
  }
  
  const createImage = url =>
    new Promise((resolve, reject) => {
      const image = new Image()
      image.addEventListener('load', () => resolve(image))
      image.addEventListener('error', error => reject(error))
      image.setAttribute('crossOrigin', 'anonymous') // needed to avoid cross-origin issues on CodeSandbox
      image.src = url
    })
  
  function getRadianAngle(degreeValue) {
    return (degreeValue * Math.PI) / 180
  }
  
  export default async function getCroppedImg(imageSrc, pixelCrop, rotation = 0) {
    const image = await createImage(imageSrc)
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
  
    const maxSize = Math.max(image.width, image.height)
    const safeArea = 2 * ((maxSize / 2) * Math.sqrt(2))
  
    // set each dimensions to double largest dimension to allow for a safe area for the
    // image to rotate in without being clipped by canvas context
    canvas.width = safeArea
    canvas.height = safeArea
  
    // translate canvas context to a central location on image to allow rotating around the center.
    ctx.translate(safeArea / 2, safeArea / 2)
    ctx.rotate(getRadianAngle(rotation))
    ctx.translate(-safeArea / 2, -safeArea / 2)
  
    // draw rotated image and store data.
    ctx.drawImage(image, safeArea / 2 - image.width * 0.5, safeArea / 2 - image.height * 0.5)
    const data = ctx.getImageData(0, 0, safeArea, safeArea)
  
    // set canvas width to final desired crop size - this will clear existing context
    canvas.width = pixelCrop.width
    canvas.height = pixelCrop.height
  
    // paste generated rotate image with correct offsets for x,y crop values.
    ctx.putImageData(
      data,
      Math.round(0 - safeArea / 2 + image.width * 0.5 - pixelCrop.x),
      Math.round(0 - safeArea / 2 + image.height * 0.5 - pixelCrop.y)
    )
  
    // As Base64 string
    // return canvas.toDataURL('image/jpeg');
  
    // As a blob
    return new Promise(resolve => {
      canvas.toBlob(file => {
        resolve(file)
  
        // resolve(URL.createObjectURL(file));
      })
    })
  }
  
  export function blobToFile(theBlob, fileName) {
    // A Blob() is almost a File() - it's just missing the two properties below which we will add
    const image = new File([theBlob], fileName, {
      lastModified: new Date(),
    })
  
    return image
  }
  
  export function windowOpen(url, name, specs) {
    if (!url.match(/^https?:\/\//i)) {
      url = `http://${url}`
    }
    return window.open(url, name, specs)
  }
  
  export const joiUpdatedMessage = {
    'string.empty': `{{#label}} is required.`,
    'string.min': `{#label} should have a minimum length of {#limit}`,
    'string.max': `{#label} should have a max length of {#limit}`,
    'any.required': `{#label} is required`,
    'string.email': `Please enter a valid email address.`,
  }
  
  export const removeDoubleQuotes = string => {
    return string.replace(/"/g, '')
  }
  