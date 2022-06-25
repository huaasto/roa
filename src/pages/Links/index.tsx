import React, { useContext, useEffect, useState } from 'react'
import { Context } from '../../content'
import { IAdd, IEdit, ISearch } from '../../icons'
import { githubQuery, query } from '../../utils/common'
import "./link.css"

type TLink = {
  img: string,
  title: string,
  desc: string,
  link: string,
  sha?: number
}

export default function Links() {
  const { state } = useContext(Context)
  const [showBg, setShowBg] = useState(false)
  const [currentLinkInfo, setCurrentLinkInfo] = useState<TLink>({
    img: '',
    title: '',
    desc: '',
    link: '',
  })
  const [datas, setDatas] = useState<TLink[]>([])
  const queryLink = () => {
    if (!currentLinkInfo.link) return
    query({ url: currentLinkInfo.link }).then((res: any) => {
      const data = res.data
      const info = { ...currentLinkInfo }
      info.title || (info.title = data.match(/<title>(.*)<\/title>/)?.[1] || '')
      info.img || (info.img = data.match(/<img[^src]*src="([^"]*)".*>/)?.[1] || '')
      info.img = info.img.slice(0, 4) === 'http' ? info.img.split('"')[0] : info.img ? info.link.split('/').slice(0, 3).join('/') + info.img : ''
      info.desc || (info.desc = data.match(/<meta name="description".*content="(.*)".*[(>)|(lt;)]/)?.[1] || '')
      info.desc = info.desc.split('"')[0]
      setCurrentLinkInfo(info)
    })
  }
  const queryLinks = async () => {
    const res = await githubQuery({
      url: "https://api.github.com/repos/huaasto/empty/issues",
      method: "GET",
      data: {
        labels: 'link'
      }
    })
    let links = []
    try {
      links = res.data.map((link: { number: number, body: string }) => ({
        ...JSON.parse(link.body),
        sha: link.number,
      }))
    } catch {
      links = []
    }
    setDatas(links)
  }
  useEffect(() => {
    queryLinks()
  }, [])
  const dealLink = () => {
    if (currentLinkInfo.sha) {
      editLink()
    } else {
      createLink()
    }
  }
  const editLink = async () => {
    const { sha, ...data } = currentLinkInfo
    const res = await githubQuery({
      url: "https://api.github.com/repos/huaasto/empty/issues/" + sha,
      method: "PATCH",
      data: {
        title: currentLinkInfo.title,
        body: JSON.stringify(data),
      }
    })
    if (res?.status === 200) {
      const newData = { ...JSON.parse(res.data.body), sha: res.data.number }
      const oldData = [...datas]
      const ind = oldData.findIndex(link => link.sha === newData.sha)
      oldData.splice(ind, 1, newData)
      setDatas(oldData)
      cancelInfo()
    } else {
      alert('修改失败')
    }

  }
  const createLink = async () => {
    const { sha, ...data } = currentLinkInfo
    const res = await githubQuery({
      url: "https://api.github.com/repos/huaasto/empty/issues",
      method: "POST",
      data: {
        title: currentLinkInfo.title,
        body: JSON.stringify(data),
        labels: ['link']
      }
    })
    if (res?.status === 201) {
      cancelInfo()
      const oldData = [...datas]
      setDatas([Object.assign(data, { sha: res.data.number }), ...oldData])
    } else {
      alert('创建失败')
    }
  }

  const cancelInfo = () => {
    setCurrentLinkInfo({
      img: '',
      title: '',
      desc: '',
      link: '',
    })
    setShowBg(false)
  }
  return (<>
    <div className="flex flex-wrap mt-10 justify-start max-w-5xl m-auto">
      {state?.userInfo?.login === "huaasto" && <div className="w-full sm:w-fit h-fit border-2 border-gray-600 border-dashed p-3 m-4 rounded text-center" onClick={() => setShowBg(true)}>
        <IAdd width="56" stroke="#000" />
      </div>}
      {
        datas.map(link => <div key={link.sha} className="w-full max-w-full overflow-hidden sm:flex h-fit border-2 border-gray-600 border-dashed p-3 m-4 rounded text-center box-border flex-1 sm:basis-2/5 min-w-300 items-center bg-gray-100">
          <a href={link.link}>
            {!link.img
              ? <div className='sm:max-h-14 max-w-full h-full p-3 basis-auto flex-grow-0 inline-block'>
                <ISearch width="32" stroke="#000" />
              </div>
              : <div className='flex justify-center items-center min-w-100'>
                <img className='w-full sm:w-fit sm:max-h-14 max-w-full h-full basis-auto flex-grow-0  max-w-100' src={link.img} alt="" />
              </div>
            }
          </a>
          <div className='relative flex flex-col justify-around mx-2 text-left w-full link-text-wrap sm:h-14'>
            <div className='flex items-center'>
              <a className='w-full sm:whitespace-nowrap overflow-hidden text-ellipsis break-all font-bold text-lg' target="_blank" href={link.link} rel="noreferrer">{link.title}</a>
              {state?.userInfo?.login === "huaasto" && <span className='bg-gray-100 pl-2' onClick={() => { setCurrentLinkInfo(link); setShowBg(true) }}>
                <IEdit width="28" stroke='#000' />
              </span>}
            </div>
            <div className='w-full sm:whitespace-nowrap overflow-hidden text-ellipsis break-all text-gray-400'>{link.desc}</div>

          </div>
        </div>)
      }


    </div>
    {showBg && <div className="imgBg fixed top-0 bottom-0 left-0 right-0 bg-black bg-opacity-80 flex justify-center items-center z-50 text-white">

      <div className='flex flex-col text-black mx-2'>
        <input type="text" defaultValue={currentLinkInfo.link} className='p-2 rounded my-2' name="" id="" placeholder='请输入链接地址' onChange={(e) => setCurrentLinkInfo(Object.assign({}, currentLinkInfo, { link: e.target.value }))} onBlur={queryLink} />
        {currentLinkInfo.img && <input type="text" defaultValue={currentLinkInfo.img} className='p-2 rounded my-2' name="" id="" placeholder='imgUrl' onChange={(e) => setCurrentLinkInfo(Object.assign({}, currentLinkInfo, { img: e.target.value }))} />}
        <div className='flex items-center'>
          {currentLinkInfo.img ?
            <img src={currentLinkInfo.img} alt="" className='h-9 mx-2' /> :
            <div className="h-fit border-2 border-white border-dashed p-1 mx-2 rounded text-center" onClick={() => setCurrentLinkInfo(Object.assign({}, currentLinkInfo, { img: " " }))}>
              <IAdd width="24" stroke="#fff" />
            </div>
          }
          <input type="text" defaultValue={currentLinkInfo.title} className='w-full p-2 rounded my-2' name="" id="" placeholder='Title' onChange={(e) => setCurrentLinkInfo(Object.assign({}, currentLinkInfo, { title: e.target.value }))} />
        </div>


        <textarea name="" id="" defaultValue={currentLinkInfo.desc} cols={30} rows={10} className='p-2 rounded my-2' placeholder='Description' onChange={(e) => setCurrentLinkInfo(Object.assign({}, currentLinkInfo, { desc: e.target.value }))}></textarea>
        <div className='flex justify-between my-2'>
          <button className='py-2 px-6 rounded bg-white text-black' onClick={dealLink}>确认</button>
          <button className='py-2 px-6 rounded bg-black text-white' onClick={cancelInfo}>取消</button>
        </div>
      </div>
    </div>}
  </>
  )
}
