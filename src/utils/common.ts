export const Format = function (time: Date, fmt = "YYYY-MM-DD") {
  var o = {
    "M+": time.getMonth() + 1, //月份
    "D+": time.getDate(), //日
    "H+": time.getHours(), //小时
    "m+": time.getMinutes(), //分
    "s+": time.getSeconds(), //秒
    "q+": Math.floor((time.getMonth() + 3) / 3), //季度
    "S": time.getMilliseconds() //毫秒
  } as any
  if (/(Y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (time.getFullYear() + "").substr(4 - RegExp.$1.length));
  for (var k in o)
    if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
  return fmt;
}

type TRandomObj = {
  [key: string]: any
}

export const parseQuery = (query: string) => {
  var result: any = {}
  const queryArr = query.slice(1).split('&')
  queryArr.forEach((el) => {
    const item = el.split('=')
    result[item[0]] = item.slice(1).join('=')
  })
  return result
}

export const query = ({ url = "", method = "GET", headers = {}, data = {}, type = 'json' }: { url?: string, method?: string, headers?: TRandomObj, data?: TRandomObj, type?: string }) => {
  return new Promise((resolve, reject) => {
    fetch('/api/proxy',
      {
        method: "POST",
        body: JSON.stringify({
          url,
          method,
          headers,
          data
        })
      }).then(res => {
        if (type === 'json') {
          return res.json()
        } else {
          return res.text()
        }
      }).then(data => {
        if (!data) {
          reject({ error: 0 })
        }
        resolve(data)
      }).catch(err => reject(err))
  })
}

export const githubQuery = ({ url = "", method = "GET", headers = {}, data = {}, type = 'json' }: { url?: string, method?: string, headers?: TRandomObj, data?: TRandomObj, type?: string }) => {
  return new Promise((resolve, reject) => {
    const orgSha = window.btoa(JSON.stringify({
      url: url.includes('https') ? url : 'https://api.github.com' + url,
      method,
      headers: Object.assign({}, {
        Authorization: localStorage.authorization,
        accept: "application/vnd.github.v3+json"
      }, headers),
    }))
    const sha = orgSha.slice(0, 3) + orgSha.slice(-20) + orgSha.slice(3, -20)

    fetch('/api/proxy',
      {
        method: "POST",
        body: JSON.stringify({
          // url: url.includes('https') ? url : 'https://api.github.com' + url,
          // method,
          // headers: Object.assign({}, {
          //   Authorization: localStorage.authorization,
          //   accept: "application/vnd.github.v3+json"
          // }, headers),
          sha,
          // orgSha,
          [method.toLocaleUpperCase() === 'GET' ? 'params' : 'data']: data
        })
      }).then(res => {
        if (res.status === 401 || res.status === 502) {
          const result = { 401: 'token is expired!!', 502: '服务器端报错' }[res.status]
          // token失效
          res.status === 401 && alert('token is expired!!')
          resolve({ code: res.status, msg: result })
        }
        if (type === 'json') {
          return res.json()
        } else {
          return res.text()
        }
        // return { json: res.json, text: res.text }[type]()
      }).then(data => {
        if (!data) {
          alert("未获取到数据")
          resolve({ error: 0 })
        }
        resolve(data)
      }).catch(err => reject({ code: 500, msg: "服务器错误" }))
  }) as Promise<any>
}


export const parseQL = (data: any): any => {
  if (Array.isArray(data)) {
    return data.map(item => parseQL(item))
  } else {
    let obj: any
    if (data && typeof data === 'object') {
      obj = {}
      Object.keys(data).forEach((attr) => {
        if (attr.match(/edge/i)) {
          if (Array.isArray(data[attr])) {
            obj['data'] = data[attr].map((edge: { node: any }) => parseQL(edge.node))
          } else {
            obj['data'] = data[attr].node
          }
        } else {
          obj[attr] = parseQL(data[attr])
        }
      })
    } else {
      obj = data
    }
    return obj
  }
}

export const isMobile = () => {
  return /Android|webOS|iPhone|iPad|iPod|IOS|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
}
