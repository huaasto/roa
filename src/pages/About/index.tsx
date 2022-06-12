import React, { useEffect, useState } from 'react'
import { githubQuery } from '../../utils/common'

export default function About() {
  const [content, setContent] = useState()
  const queryAbout = async () => {
    const res = await githubQuery({
      url: "https://api.github.com/repos/huaasto/empty/issues/1",
      method: "GET",
    })
    setContent(res.data.content)
  }
  useEffect(() => {
    queryAbout()
  }, [])
  return (<>
    <div className='p-3 sm:p-10 bg-slate-400' style={{ height: '100vh' }}>
      <div className='sm:fixed left-0 right-1/2 top-0 bottom-0 px-3 py-10 text-white whitespace-nowrap'>
        <div className='flex justify-center items-center h-full'>
          <span className='font-bold text-4xl'>关于我</span>
        </div>
      </div>
      <div className='flex w-full flex-wrap sm:flex-nowrap'>
        <div className='flex-1 basis-80 w-1/2'></div>
        <div className=' flex-1 flex-shrink-0 basis-80'>
          <div className='bg-white p-4'>
            {content}
          </div>
        </div>
      </div>

    </div>
  </>)
}
