import request from "request";

class CrudService {
  constructor() {
    this.API_URL = process.env.API_URL;
    this.$match = {};
    this.$limit = 50;
    this.$skip = 0;
  }

   ExternalBooks(query) {
    console.log('before :', `${this.API_URL}/books/${query ? query : ''}`);
    
    const result = request.get(`${this.API_URL}/books/${query ? query : ''}`, (error, response, body) => {
      let data;
      if (error) {
        // data = "Whooops Something Went wrong"
      } else if (response) {
        return body;
        // console.log('body' , body)
      }
      return data;
    });

    return result
    
    // console.log('env data', `${this.API_URL}/books/${query ? query : ''}`);
  }

}

export default CrudService;
