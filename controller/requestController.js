import * as fs from 'fs/promises';
import { getContentTypeFrom }  from '../public/scripts/contentTypeUtil.js';
const BASE = 'http://localhost/';
/**
*  define a controller to retrieve static resources
*/
export default class RequestController {

  #request;
  #response;
  #url;

  constructor(request, response) {
    this.#request = request,
    this.#response = response;
    this.#url = new URL(this.request.url,BASE).pathname;   // on ne considère que le "pathname" de l'URL de la requête
  }

  get response() {
    return this.#response;
  }
  get request() {
    return this.#request;
  }
  get url() {
    return this.#url;
  }
  async handleRequest() { 
    this.response.setHeader("Content-Type" , getContentTypeFrom(this.url));
    let error = "./public/error.html";
    let filename= "" ;  
    switch( this.url){
      case  "/pfc" : 
        filename = "./public/pfc.html"; 
        break;
      case "/": 
        filename = "./public/acceuil.html"; 
        break; 
      case "/about": 
        filename  = "./public/infos.html";
        break;
      default :
        filename = `./public${this.url}` 
    }
    try {
       await fs.access(filename);
       const data = await fs.readFile(filename);
       this.response.statusCode =200 ; 
       this.response.write(data);
       
    }
    catch(err){
      this.response.statusCode = 404; 
      await fs.access(error);
      const  data =  await fs.readFile(error); 
      this.response.write(data);
     
    }
    this.response.end();
  }

    
   

}
