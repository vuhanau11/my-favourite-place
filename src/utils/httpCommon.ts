import axios from 'axios'

export default axios.create({
  baseURL: process.env.API_PLACES,
  headers: {
    'Content-type': 'application/json',
  },
})