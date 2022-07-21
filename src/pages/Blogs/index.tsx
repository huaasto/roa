import React, { useContext, useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Context } from '../../content'
import { IEdit } from '../../icons'
import { Format, githubQuery, randomString } from '../../utils/common'
import "./blog.css"

type TBlog = {
  img: string,
  title: string,
  desc: string,
  blog: string,
  bodyText?: string,
  id?: number,
  number?: number,
  updatedAt
  ?: string,
  comment?: {
    author: {
      login: string,
      avatarUrl: string
    },
    bodyText: string
  }
}

export default function Blogs() {
  const { state } = useContext(Context)
  const [datas, setDatas] = useState<TBlog[]>([])
  const navigate = useNavigate()
  const queryBlogs = async () => {
    const ql = `query {
      repository(owner:"huaasto", name:"sdfs") {
        issues(labels: ["blog"], first: 100, orderBy: {direction: DESC, field: UPDATED_AT}) {
          edges{
            node{
              bodyText
              body
              createdAt 
              title
              id
              updatedAt
              labels(first: 6) {
                edges {
                  node {
                    id
                    name
                    color
                  }
                }
              }
              number
              comments(last: 1){
                edges{
                  node{
                    author{
                      login
                      avatarUrl
                    }
                    bodyText
                  }
                }
              }
            }
          }
        }
      }
    }`
    const res = await githubQuery({
      url: "https://api.github.com/graphql",
      method: "POST",
      data: { query: ql },
      headers: state?.userInfo?.login !== "huaasto" ? {
        Authorization: window.atob('dG9rZW4gZ2hwX04xdVV3TUlRamVvUERlZ2NUWkptbWVtSEh6bENVRDA1TmtjWQ==')
      } : {}
    })
    let blogs = []
    blogs = res.data.data.repository.issues.edges.map((blog: any) => {
      var obj = {
        title: '',
        img: 'https://s3.bmp.ovh/imgs/2022/07/21/6334e8dc7e29efb3.jpg'
      }
      try {
        obj = JSON.parse(blog.node.title)
      } catch (err) {
        obj.title = blog.node.title
      }
      return Object.assign(blog.node, {
        ...obj,
        comment: blog.node.comments?.edges?.[0]?.node || null,
        labels: blog.node.labels.edges.map((label: any) => label.node)
      })
    })
    setDatas(blogs)
  }
  const editBlog = (e: any, blog: TBlog) => {
    e.stopPropagation()
    e.preventDefault()
    navigate(`/blogs/edit/${blog.number}`)
  }
  useEffect(() => {
    queryBlogs()
  }, [])
  return (<>
    <div className="flex flex-wrap mt-10 justify-start max-w-5xl m-auto py-2">
      {
        datas.map((blog, i) => <Link to={"/blogs/" + blog.number} key={blog.id} className="block w-full p-2">
          <div className="relative flex h-40 overflow-hidden rounded-2xl flex-wrap sm:flex-nowrap">
            {<div className={'flex-1 basis-full sm:flex-shrink-0 sm:basis-7/12 h-full bg-center bg-cover' + (i % 2 ? ' md:order-1' : '')} style={{ backgroundImage: `url("${blog.img || '	https://s3.bmp.ovh/imgs/2022/07/21/6334e8dc7e29efb3.jpg'}")` }}></div>}
            <div className='absolute left-0 right-0 sm:static flex-1 basis-full h-full p-2 overflow-hidden bg-black bg-opacity-25 sm:bg-transparent text-white sm:text-inherit flex flex-col'>
              <div className=' flex-shrink-0'>
                {state?.userInfo?.login === "huaasto" && <span className=' mx-3 stroke-current' onClick={(e) => editBlog(e, blog)}>
                  <IEdit width="20" />
                </span>}
                <span className='w-full sm:whitespace-nowrap overflow-hidden text-ellipsis break-all font-bold text-lg'>{blog.title}</span>
              </div>
              <div className=' w-full flex-1 overflow-hidden text-ellipsis break-all text-gray-400 several-line'>
                <span className='hidden sm:block'>{blog.bodyText}</span>
              </div>
              {blog.comment && <span className='hidden sm:block one-line'>
                <img src={blog.comment?.author?.login !== 'huaasto' ? blog.comment.author.avatarUrl : `https://ui-avatars.com/api/?name=${randomString()}`} className="hidde inline-block w-5 h-5 mx-3 align-middle rounded-full" alt="" />
                {blog.comment?.bodyText}
              </span>}
              <div className=' text-right text-sm'>——更新于{Format(new Date(String(blog.updatedAt
              )), 'YYYY-MM-DD HH:mm:ss')}</div>
            </div>
          </div>
        </Link>)
      }
      {state?.userInfo?.login === "huaasto" && <Link to="/blogs/create"><div className="fixed bottom-2 right-2 w-fit h-fit border-2 border-gray-600 p-1 m-4 rounded text-center">
        <IEdit width="32" stroke="#666" />
      </div></Link>}
    </div>
  </>
  )
}

