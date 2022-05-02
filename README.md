# FacesRecognition

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 11.1.2.

## Libraries

Run the `npm install` command to install the libraries

## Desarrollo

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Carpetas

El proyecta tiene la siguiente estructura de carpetas:

faces-recognition
  -src
    -app
      -finalización-proceso
      -guards
      -image-document
      -recoknition
      -services
      -video-player
    -assets
    -environments

## componentes

<h1><img src="./src/assets/imgs/subir-doc-front.png"/></h1>
<h1><img src="./src/assets/imgs/subir-doc-back.png"/></h1>

el componente **imagen-documento** recibe una imagen y un número de documento de identidad, tanto frontal como posterior, y se envía a un endpoint donde el usuario se agregará a la plataforma de reconocimiento facial. Tenga en cuenta que en la url debe tener el número de documenrto de identidad y enviar `add-dni-person/CC${this.numeroCedula}` los encabezados necesarios para este punto final añadirlos para que permita el envío del documento`this.headersFront = {
        type: "FRONT",
        contentType: "image/jpg",
        extension: "jpg",
        documentType: "CC"
      }`
La respuesta de este endpoint devuelve una url de un bucket para usar en el otro endpoint que enviará la imagen, de esta forma:
`this.apiService.put(res.data.uploadUrl, img, httpOptionsPut)`. con su respectivo header.
Esto se hace tanto para la imagen frontal como posterior del documento de identidad.

<h1><img src="./src/assets/imgs/reconocimiento-facial.png"/></h1>

El componente de **recoknition** usa una librerías de tensorflow que están en la carpeta de assets/models que cuando se cargan inicia el proceso de verificación de vida. Aquí se toma la imagen del video y se inicia el proceso de reconocimiento de expresiones faciales. La función `listenerEvents` es la encargada de esta verificación.
En el componente **video-player** se usa la función `drawFace` quien esta haciendo el reconocimiento de expresiones tambien después de verificar la expresión neutral, verificará luego una expresión aleatoria y enviará una imagen de la persona que se registra a un nuevo endpoint de envío de imagen: `this.apiService.post('add-face-person/CC'+cedula, this.headersFront, httpOptions)`. Nuevamente se tiene en cuenta que en la url va el número de cédula y también los headers.

EL componente de **finalizacion-proceso** simplemente muestra la finalización de todo el proceso para luego devolverlo al inicio del mismo.

El servicio **face-api** se encarga de cargar los modelos de inteligencia artificial que se usarán, se trabaja con la librería `face-api.js`.

El servicio **video-player** se encarga de todo el proceso de reconocimiento facial usando la misma librería.
