import React, { MouseEventHandler, useEffect, useState } from 'react'

type TPicItem = {
  url: string,
  className?: string,
  picClick?: MouseEventHandler<HTMLImageElement>,
  [key: string]: any
}

export default function ImgWrap({ url, className, picClick, ...args }: TPicItem) {
  const [realUrl, setRealUrl] = useState(url)
  const showError = () => {
    setRealUrl('https://i.postimg.cc/zvQNCY13/d4p259-Bwqj.png')
  }
  useEffect(() => {
    setRealUrl(url)
  }, [url])
  return (
    <div className={"inline-block h-36 w-18 m-2 relative bg-gray-600" + (className || '')} {...args}>
      <img className="h-full w-full shadow-black object-cover" src={realUrl} alt="" onError={showError} onClick={picClick} />
    </div>
  )
}
