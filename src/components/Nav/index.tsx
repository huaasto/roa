import React, { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { IAggregate, IBlog, ICodepen, ILinks, IImage, IHome } from '../../icons'

export default function Nav() {
  const route = useLocation()
  const [area, setArea] = useState('')
  useEffect(() => {
    setArea(route.pathname.split('/')[1])
  }, [area, route])
  return <>
    <div className='fixed left-0 right-0 bg-black bg-opacity-75 rounded-b-2xl w-fit m-auto border-round px-5 text-center'>
      <Link to="/">
        <IHome className="m-2 hover:stroke-green-300" width="30" stroke={area ? '#fff' : '#86efac'} />
      </Link>
      <Link to="/blogs">
        <IBlog className="m-2 hover:stroke-green-300" width="30" stroke={area !== "blogs" ? '#fff' : '#86efac'} />
      </Link>
      <Link to="/images">
        <IImage className="m-2 hover:stroke-green-300" width="30" stroke={area !== 'images' ? '#fff' : '#86efac'} />
      </Link>
      <Link to="/links">
        <ILinks className="m-2 hover:stroke-green-300" width="30" stroke={area !== 'links' ? '#fff' : '#86efac'} />
      </Link>
      <Link to="/demos">
        <ICodepen className="m-2 hover:fill-green-300" width="30" fill={area !== 'demos' ? '#fff' : '#86efac'} />
      </Link>
      <Link to="/about-me">
        <IAggregate className="m-2 hover:stroke-green-300" width="30" stroke={area !== 'about-me' ? '#fff' : '#86efac'} />
      </Link>
    </div>
  </>
}
