module.exports = {

 response: (jsonHandler) => {
   return {
    status: (code) => {
    return {
     json : jsonHandler
    }
   }
  }
 }
}
