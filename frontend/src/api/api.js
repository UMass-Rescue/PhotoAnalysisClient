const baseurl = 'http://localhost:5000';

const api = {
    login: '/auth/login/',  // POST
    auth_status: '/auth/status/',  // GET
    auth_profile: '/auth/profile/', // GET
    model_list: '/model/list/', // GET
    model_predict: '/model/predict/', // POST
    image_result: '/model/predict/', // GET
};


export default api;
export {
  baseurl,
  api,
};
