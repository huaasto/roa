import React, { useContext, useEffect, useState } from 'react'
import { Context } from '../../content'
import { githubQuery } from '../../utils/common'

export default function About() {
  const { state } = useContext(Context)
  const [content, setContent] = useState<string>('')
  const queryAbout = async () => {
    const ql = `query {
      repository(owner:"huaasto", name:"empty") {
        issue(number: 10) {
          bodyHTML
          body
          createdAt 
          title
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
    console.log(res.data?.data?.repository?.issue?.bodyHTML)
    setContent(res.data?.data?.repository?.issue?.bodyHTML)
  }
  useEffect(() => {
    queryAbout()
  }, [])
  return (<div className='p-3 sm:p-10 bg-slate-400 h-full min-h-screen'>
    <div className='sm:fixed left-0 right-1/2 top-0 bottom-0 px-3 py-10 text-white whitespace-nowrap'>
      <div className='flex justify-center items-center h-full'>
        <span className='font-bold text-4xl'>且听当世多变化</span>
      </div>
    </div>
    <div className='flex w-full flex-wrap sm:flex-nowrap'>
      <div className='flex-1 basis-80 w-1/2'></div>
      <div className=' flex-1 flex-shrink-0 basis-80'>
        <div className='bg-white p-4' dangerouslySetInnerHTML={{ __html: content?.replaceAll("https://raw.githubusercontent.com/huaasto/blogPics/main", "https://cdn.jsdelivr.net/gh/huaasto/blogPics@master") || '' }}>
        </div>
      </div>
    </div>
  </div>)
}
