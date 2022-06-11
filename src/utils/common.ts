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
    fetch('/api/proxy',
      {
        method: "POST",
        body: JSON.stringify({
          url: url.includes('https') ? url : 'https://api.github.com' + url,
          method,
          headers: Object.assign(headers, {
            Authorization: localStorage.authorization,
            accept: "application/vnd.github.v3+json"
          }),
          [method.toLocaleUpperCase() === 'GET' ? 'params' : 'data']: data
        })
      }).then(res => {
        if (res.status === 401 || res.status === 502) {
          // token失效
          reject({ code: 401, msg: "token is expired!!" })
        }
        if (type === 'json') {
          return res.json()
        } else {
          return res.text()
        }
        // return { json: res.json, text: res.text }[type]()
      }).then(data => {
        if (!data) {
          reject({ error: 0 })
        }
        resolve(data)
      }).catch(err => reject({ code: 500, msg: "服务器错误" }))
  }) as Promise<any>
}
