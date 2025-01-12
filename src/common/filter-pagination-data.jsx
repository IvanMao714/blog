import axios from "axios";

export const filterPaginationData = async ({ create_new_arr = false, state, data, page, countRoute, data_to_send = { } , user = undefined}) => {

    let obj; 

    let headers = {};

    if(user){
        headers.headers = {
            'Authorization': `Bearer ${user}`
        }
    }

    if(state != null && !create_new_arr){
        obj = { ...state, results: [ ...state.results, ...data ], page: page }
    } else{

        await axios.post(import.meta.env.VITE_SERVER_DOMAIN + countRoute, data_to_send, headers)
        .then(({ data: { totalDocs } }) => {
            obj = { results: data, page: 1, totalDocs }
        })
        .catch(err => {
            console.log(err)
        })
        // let mockTotalDocs = 50;
        // if (countRoute === "/search-blogs-count") {
        // mockTotalDocs = 15;  // 比如搜索结果少一些
        // } else if (countRoute === "/all-latest-blogs-count") {
        // mockTotalDocs = 100; // 最新博客总数量
        // }

        // obj = {
        // results: data,
        // page: 1,
        // totalDocs: mockTotalDocs,
        // };

    }

    return obj;

}