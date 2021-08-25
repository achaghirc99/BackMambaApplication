  import axios from 'axios'

export default axios.create({
  //baseURL: 'https://blackmambaback.oa.r.appspot.com/api/',
  baseURL: 'http://localhost:3000/api/',
  headers: {
    'Content-type': 'application/json',
  },
})