import React, { lazy, Suspense, useCallback, useEffect, useReducer } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom'

// import Home from './pages/Home';
// import Blogs from './pages/Blogs';
// import Images from './pages/Image';
// import Links from './pages/Links';
// import Demos from './pages/Demos';
// import About from './pages/About';
import Nav from './components/Nav';
import { Context, initialState, reducer } from './content';
import { githubQuery, parseQuery } from './utils/common';
// import BlogItem from './pages/Blogs/item';
// import Write from './pages/Blogs/write';

const Home = lazy(() => import('./pages/Home'))
const Blogs = lazy(() => import('./pages/Blogs'))
const Images = lazy(() => import('./pages/Image'))
const Links = lazy(() => import('./pages/Links'))
const Demos = lazy(() => import('./pages/Demos'))
const About = lazy(() => import('./pages/About'))
const BlogItem = lazy(() => import('./pages/Blogs/item'))
const Write = lazy(() => import('./pages/Blogs/write'))

function App() {
  const location = useLocation()
  const [state, dispatch] = useReducer(reducer, initialState)

  const fetchData = useCallback(async () => {
    const query = parseQuery(location.search)
    if (query.code && !localStorage.authorization) {
      const res = await githubQuery({
        url: "https://github.com/login/oauth/access_token",
        data: {
          client_id: process.env.REACT_APP_CLIENT_ID || '',
          client_secret: process.env.REACT_APP_CLIENT_SECRET || '',
          code: query.code
        }
      });
      res.data?.access_token && localStorage.setItem("authorization", 'token ' + res.data?.access_token)
    }
    localStorage.authorization && dispatch({ type: "update", value: { authorization: localStorage.authorization } })
    githubQuery({ url: '/user' }).then(res => {
      res.data && dispatch({ type: "update", value: { userInfo: res.data } })
    }).catch(err => {
      alert('暂未登录，当前为游客权限')
      // if (err.code === 401 || err.code === 500) {
      //   window.localStorage.removeItem("authorization")
      //   // alert("未连接到Github")
      //   window.location.href = "https://github.com/login/oauth/authorize?scope=repo&client_id=" + process.env.REACT_APP_CLIENT_ID
      // }
    })
  }, [location.search])

  useEffect(() => {
    fetchData()
  }, [fetchData])
  return <>
    <Context.Provider value={{ state, dispatch }}>
      <Nav />
      <Suspense fallback={<div>loading。。。</div>}>
        <Routes>

          <Route path="/" element={<Home />}></Route>
          <Route path="/blogs" element={<Blogs />}></Route>
          <Route path="/blogs/create" element={<Write />}></Route>
          <Route path="/blogs/edit/:no" element={<Write />}></Route>
          <Route path="/blogs/:no" element={<BlogItem />}></Route>
          <Route path="/images" element={<Images />}></Route>
          <Route path="/links" element={<Links />}></Route>
          <Route path="/demos" element={<Demos />}></Route>
          <Route path="/about" element={<About />}></Route>
        </Routes>
      </Suspense>
    </Context.Provider>

  </>
}

export default App;
