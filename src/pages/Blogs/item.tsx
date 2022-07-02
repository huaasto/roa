import { useCallback, useContext, useEffect, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { Context } from '../../content'
import { Format, githubQuery, parseQL, randomString } from '../../utils/common'
import './blog.css'

type comment = {
  bodyHTML: string,
  author: {
    login: string,
    avatarUrl: string,
  }
  publishedAt: string
}

type Issue = {
  id: string,
  databaseId: number,
  number: number,
  title: string,
  url: string,
  author: {
    login: string,
    avatarUrl: string,
  },
  body?: string,
  bodyHTML: string,
  locked?: boolean,
  publishedAt: string,
  labels: { data: { name: string, color: string }[] },
  comments: {
    data: comment[]
  }
}

// markup
const BlogItem = () => {


  const route = useLocation()
  const path = route.pathname.split('/')
  const [data, setData] = useState<Issue>()
  const [loading, setLoading] = useState<boolean>(false)
  const comment = useRef<HTMLTextAreaElement>(null)
  const { state } = useContext(Context)
  const [bg, setBg] = useState('')
  const queryData = useCallback(() => {
    const ql = `query {
        repository(owner:"huaasto", name:"sdfs") {
          issue(number: ${+path[path.length - 1]}) {
            databaseId
            number
            id
            title
            author {
              login
              avatarUrl
            }
            body
            bodyHTML
            locked
            publishedAt
            labels(first:5) {
              edges {
                node {
                  name
                  color
                }
              }
            }
            comments(last: 30) {
              edges {
                node {
                  bodyHTML
                  author {
                    login
                    avatarUrl
                  }
                  publishedAt
                }
              }
            }
          }
        }
      }`
    githubQuery({
      url: "https://api.github.com/graphql",
      method: "POST",
      data: { query: ql },
      headers: state?.userInfo?.login !== "huaasto" ? {
        Authorization: window.atob('dG9rZW4gZ2hwX04xdVV3TUlRamVvUERlZ2NUWkptbWVtSEh6bENVRDA1TmtjWQ==')
      } : {}
    }).then((res: any) => {
      if (!res.data) return
      const data = parseQL(res.data.data)
      const issue = data?.repository.issue
      var content
      try {
        content = JSON.parse(issue.title)
        issue.title = content.title
        setBg(content.img)
      } catch {
        console.log('暂无图片')
      }
      // issue.title =
      issue.comments.data = issue.comments.data.length ? issue.comments.data.reverse() : []
      setData(issue)
    })
  }, [path, state?.userInfo?.login])

  const addComment = useCallback(() => {
    if (!comment.current?.value) return;
    setLoading(true)
    // return
    githubQuery({
      url: `https://api.github.com/repos/huaasto/sdfs/issues/${+path[path.length - 1]}/comments`,
      method: "POST",
      data: { body: comment.current?.value },
      headers: state?.userInfo?.login ? {} : { Authorization: window.atob('dG9rZW4gZ2hwX04xdVV3TUlRamVvUERlZ2NUWkptbWVtSEh6bENVRDA1TmtjWQ==') }
    }).then((res: any) => {
      setLoading(false)
      if (!res.data) return
      comment.current && (comment.current.value = '')
      queryData()
    })
  }, [comment, path, state?.userInfo?.login, queryData])


  useEffect(() => {
    queryData()
  }, [])

  return (
    <main>
      <title>😆Blog</title>
      <img className='fixed -z-10 top-0 bottom-0 left-0 right-0 object-cover min-h-screen' src={bg} alt="" />
      <div className="issue-detail-wrap flex mobile-wrap">
        <div className="left-line">
          <div className="page-wrap-outlined">
            <h2>{data?.title}</h2>
            <div>
              <ul>
                {data?.labels?.data?.map((label, i) => <li key={i} className="label" style={{ backgroundColor: '#' + label.color }}>{label?.name}</li>)}
              </ul>
            </div>
          </div>
          <div className="page-wrap-outlined">
            {data?.bodyHTML && <div dangerouslySetInnerHTML={{ __html: data.bodyHTML }}>
            </div>}
          </div>
          <div className="page-wrap-outlined">
            <textarea ref={comment} name="comment" cols={30} rows={10}></textarea>
            <div style={{ textAlign: "right" }}>
              {data?.id && <button className="primary" disabled={loading} onClick={() => { addComment() }}>submit</button>}
            </div>
          </div>
        </div>
        <div className="right-line">
          <div className="page-wrap sticky" style={{ backgroundColor: state.color, marginBottom: 0, top: 0 }}>
            <strong>评论</strong>
          </div>
          <div className="comment-items-wrap no-scroll">
            {data && data.comments.data.length ?
              data.comments.data.map((comment, i) =>
                <div key={i} className="page-wrap-outlined comment-item-wrap">
                  <div>
                    {/* http://api.btstu.cn/sjtx/api.php?lx=a1&format=images */}
                    <img src={comment?.author?.login === 'huaasto' ? `https://ui-avatars.com/api/?name=${randomString()}` : comment.author.avatarUrl} className="comment-login-avatar" alt="" />
                    <span className="comment-author-name line-normal">{comment.author.login === 'huaasto' ? '匿名用户' : comment.author.login}</span>
                    <span className="text-small f-right line-normal">{Format(new Date(String(comment.publishedAt)), 'YYYY-MM-DD HH:mm:ss')}</span>
                  </div>
                  <div className="zoom" dangerouslySetInnerHTML={{ __html: comment.bodyHTML }}></div>
                </div>
              ) :
              <div className="page-wrap-outlined comment-item-wrap no-result" style={{ backgroundColor: "#fff" }}>
                <div>来为评论区添砖加瓦吧</div>
              </div>
            }
          </div>


        </div>

      </div>


    </main >
  )
}

export default BlogItem
