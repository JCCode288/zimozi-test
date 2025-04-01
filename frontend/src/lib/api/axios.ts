import axios from "axios";

const Axios = axios.create();

Axios.interceptors.request.use((req) => {
   const url = req.url;

   return req;
});

Axios.interceptors.response.use(
   async (res) => {
      const url = res.config.url;

      return Promise.resolve(res);
   },
   (err) => {
      console.error(err, "<<< ERROR INTERCEPTOR");

      throw err;
   }
);

export default Axios;
