  import axios from 'axios'

export default axios.create({
  baseURL: 'https://superb-garden-333619.ew.r.appspot.com//api/',
  //baseURL: 'http://localhost:3000/api/',
  headers: {
    'Content-type': 'application/json',
  },
})