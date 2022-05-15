import React, { useEffect, useState } from 'react'
import { Format } from '../../utils/commen'



export default function Home() {
  const [bg, setBg] = React.useState('')
  const [sentence, setSentence] = useState({
    id: "",
    content: "",
    trans: "",
    smallPic: "",
    hugePic: "",
    time: ""
  })
  useEffect(() => {
    if (Math.random() > 0.7) {
      fetch('https://api.123home.page/api.php?category=bing', {
        method: 'GET',
        mode: 'cors',
      }).then(res => {
        setBg(res.url)
      })
    } else {
      Math.random() > 0.5 ? setBg('https://picsum.photos/' + (window.innerWidth > 769 ? '1920/1080' : '750/1334') + '?random=1') :
        setBg('https://source.unsplash.com/random/' + (window.innerWidth > 769 ? '1920x1080' : '750x1334'))
    }
  }, [])
  useEffect(() => {
    fetch('/api/proxy',
      {
        method: "POST",
        body: JSON.stringify({
          url: "https://open.iciba.com/dsapi/?date=" + Format(new Date()),
          method: 'GET',
        })
      }).then(res => res.json()).then(res => {
        if (!(res && res.data)) return
        setSentence(Object.assign(res.data, {
          id: res.data.sid,
          content: res.data.content,
          trans: res.data.note,
          smallPic: res.data.picture,
          hugePic: res.data.picture4,
          time: res.data.dateline
        }))
      })
  }, [])

  return <>
    <div className="main-bg fixed top-0 bottom-0 left-0 right-0 text-center bg-center bg-no-repeat bg-cover -z-10 text-white" style={{ backgroundImage: "url(" + bg + ")" }}>
      {sentence.time && <div className='fixed right-0 bottom-0 w-full md:w-fit bg-black bg-opacity-30 text-white px-5 py-2'>
        <div className='text-left'>{sentence.content}</div>
        <div className='text-right'>——{sentence.trans}</div>
      </div>}
    </div>
  </>


}
