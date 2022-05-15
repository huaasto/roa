const axios = require('axios')

const queryPostData = (req) => {
  return new Promise(resolve => {
    let postData = ''
    req.on('data', chunk => {
      postData += chunk.toString()
    })
    req.on('end', () => {
      if (postData) {
        resolve(JSON.parse(postData))
      }
    })
  })
}

// const reqData = (option) => {
//   return new Promise(res => {
//     http.request(option, async (msg) => {
//       const data = await queryPostData(msg)
//       res(data)
//     })
//   })
// }


module.exports = async (req, res) => {
  const postData = await queryPostData(req)
  const data = await axios(postData)
  if (!data.data) {
    res.json({ err: '请求失败' })
  } else {
    res.json({ data: data.data, status: data.status })
  }

  // const postData = await queryPostData(req)
  // const { data } = await axios.post('https://github.com/login/oauth/access_token', postData, {
  //   headers: {
  //     "Content-Type": "application/json",
  //     'accept': 'application/vnd.github.v3+json'
  //   }
  // })
  // res.json(data)
  //   fetch('https://github.com/login/oauth/access_token', {
  //   method: 'POST',
  //   headers: {
  //     "Content-Type": "application/json",
  //     'accept': 'application/vnd.github.v3+json'
  //   },
  //   body: tts
  // }).then(res => res.json()).then(data => {
  // })



  // new Promise(resolve => {
  //   let postData = ''
  //   req.on('data', chunk => {
  //     postData += chunk.toString()
  //   })
  //   req.on('end', () => {
  //     if (postData) {
  //       resolve(JSON.parse(postData))
  //     }
  //   })
  // }).then(data => {
  //   const POST_OPTIONS = {
  //     host: "https://github.com",
  //     path: "/login/oauth/access_token",
  //     method: 'POST',
  //     body: data,
  //     headers: {
  //       "Content-Type": "application/json",
  //       'accept': 'application/vnd.github.v3+json'
  //     }
  //   };
  //   axios.post('https://github.com/login/oauth/access_token', data, {
  //     headers: {
  //       "Content-Type": "application/json",
  //       'accept': 'application/vnd.github.v3+json'
  //     }
  //   }).then(result => {
  //     res.json(result.data)
  //   })
  //   // res.json(POST_OPTIONS)


  // })


  // const result = await reqData(POST_OPTIONS)
  // res.json(data)
}