export default (imgBlob, w) => {
  return new Promise((resolve, reject) => {
    const image = new Image()
    image.onerror = reject
    // eslint-disable-next-line no-unused-vars
    image.onload = function (_imageEvent) {
      // Resize the image
      const maxSize = w || 1024
      const canvas = document.createElement('canvas')
      let width = image.width
      let height = image.height
      if (width > height) {
        if (width > maxSize) {
          height *= maxSize / width
          width = maxSize
        }
      } else {
        if (height > maxSize) {
          width *= maxSize / height
          height = maxSize
        }
      }
      canvas.width = width
      canvas.height = height
      canvas.getContext('2d').drawImage(image, 0, 0, width, height)
      canvas.toBlob(function (blob) {
        resolve(blob)
      }, 'image/jpeg', 0.85)
    }
    image.src = URL.createObjectURL(imgBlob)
  })
}
