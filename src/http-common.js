  import axios from 'axios'

export default axios.create({
  baseURL: 'https://blackmambaback.oa.r.appspot.com/api/',
  headers: {
    'Content-type': 'application/json',
  },
})