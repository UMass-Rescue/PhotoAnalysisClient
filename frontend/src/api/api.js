const baseurl = 'http://localhost:5000';

const api = {
    login: '/auth/login',  // POST
    auth_status: '/auth/status',  // GET
    auth_profile: '/auth/profile', // GET
    model_predict_list: '/model/list', // GET
    model_predict: '/model/predict', // POST
    image_result: '/model/results', // GET
    model_result_list: '/model/all', // GET
    search_images: '/model/search', // POST
    search_image_download: '/model/search/download', // POST
    api_key_list: '/auth/key', // GET
    api_key_new: '/auth/key', // POST
    api_key_remove: '/auth/key', // DELETE
    training_statistics: '/training/detail',  // GET
    training_result: '/training/result',  // GET
    all_training_results: '/training/results',  // GET
};


export default api;
export {
  baseurl,
  api,
};
