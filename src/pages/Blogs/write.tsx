import React, { MutableRefObject, useEffect, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { githubQuery, uploadImg } from '../../utils/common'
import './blog.css'

const useDropEvent = (parseUrl = (url: string) => { }) => {
  // 获得拖拽文件的回调函数
  const Imgwrap = useRef<HTMLTextAreaElement>(null)
  function getDropFileCallBack(dropFiles: any) {
    console.log(dropFiles, dropFiles.length);
    uploadImg(dropFiles[0]).then((res: any) => {
      if (!res.data) return alert('插入图片失败')
      const url = res.data.content.download_url.replace("https://raw.githubusercontent.com/huaasto/blogPics/main", "https://cdn.jsdelivr.net/gh/huaasto/blogPics@master")
      console.log(url)
      parseUrl(url)
    })
  }
  useEffect(() => {
    var dropZone: any = document.querySelector("#dropZone");

    dropZone.addEventListener("dragenter", function (e: DragEvent) {
      e.preventDefault();
      e.stopPropagation();
    }, false);

    dropZone.addEventListener("dragover", function (e: DragEvent) {
      e.dataTransfer && (e.dataTransfer.dropEffect = 'copy'); // 兼容某些三方应用，如圈点
      e.preventDefault();
      e.stopPropagation();
    }, false);

    dropZone.addEventListener("dragleave", function (e: DragEvent) {
      e.preventDefault();
      e.stopPropagation();
    }, false);

    dropZone.addEventListener("drop", function (e: DragEvent) {
      e.preventDefault();
      e.stopPropagation();

      var df = e.dataTransfer;
      var dropFiles: any[] = []; // 拖拽的文件，会放到这里
      var dealFileCnt = 0; // 读取文件是个异步的过程，需要记录处理了多少个文件了
      var allFileLen = df?.files.length; // 所有的文件的数量，给非Chrome浏览器使用的变量

      // 检测是否已经把所有的文件都遍历过了
      function checkDropFinish() {
        if (allFileLen && dealFileCnt === allFileLen - 1) {
          getDropFileCallBack(dropFiles);
        }
        dealFileCnt++;
      }

      if (df?.items !== undefined) {
        // Chrome拖拽文件逻辑
        for (var i = 0; i < df?.items.length; i++) {
          var item = df.items[i];
          if (item.kind === "file" && item?.webkitGetAsEntry()?.isFile) {
            var file = item.getAsFile();
            dropFiles.push(file);
            checkDropFinish()
          }
        }
      } else {
        // 非Chrome拖拽文件逻辑
        for (let i = 0; allFileLen && i < allFileLen; i++) {
          if (!df) continue;
          if (df.files[i]?.type) {
            dropFiles.push(df.files[i]);
            checkDropFinish();
          } else {
            try {
              var fileReader = new FileReader();
              fileReader.readAsDataURL(df.files[i].slice(0, 3));

              fileReader.addEventListener('load', function (e) {
                console.log(e, 'load');
                dropFiles.push(df?.files[i]);
                checkDropFinish();
              }, false);

              fileReader.addEventListener('error', function (e) {
                console.log(e, 'error，不可以上传文件夹');
                checkDropFinish();
              }, false);

            } catch (e) {
              console.log(e, 'catch error，不可以上传文件夹');
              checkDropFinish();
            }
          }
        }
      }
    }, false);
  }, [])
  return Imgwrap
}


export default function Write() {
  const route = useLocation()
  const navigate = useNavigate()
  const [bg, setBg] = useState('')
  const path = route.pathname.split('/')
  const [number, setNumber] = useState(+path[path.length - 1] ? path[path.length - 1] : '')
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const queryBing = () => {
    fetch('/api/proxy', {
      method: "POST",
      body: JSON.stringify({
        url: "https://cn.bing.com/HPImageArchive.aspx?format=js&idx=0&n=1&mkt=zh-CN",
        method: 'GET',
      })
    }).then(res => res.json()).then(res => {
      if (!(res && res.data)) return
      setBg('https://cn.bing.com' + res.data?.images?.[0]?.url)
    })
  }
  const queryBlogData = async () => {
    const res = await githubQuery({
      url: `https://api.github.com/repos/huaasto/sdfs/issues/${number}`,
      method: "GET",
    })
    var content
    try {
      content = JSON.parse(res.data.title)
      setTitle(content.title)
      setBg(content.img)
    } catch (error) {
      setTitle(res.data.title)
      queryBing()
    }
    setBody(res.data.body)
  }
  const Imgwrap = useDropEvent((url) => setBody(body + `![img](${url})`))
  useEffect(() => {
    window.location.href.match('create') ? queryBing() : queryBlogData()
  }, [])
  const createBlog = async () => {
    const res = await githubQuery({
      url: "https://api.github.com/repos/huaasto/sdfs/issues",
      method: "POST",
      data: {
        title: JSON.stringify({ title, img: bg }),
        body: body,
        labels: ['blog']
      }
    })
    if (res?.status < 400) {
      setTitle('')
      setBody('')
      navigate(`/blogs/${res.data.number}`)
    } else {
      alert('创建失败')
    }
  }
  const updateBlog = async () => {
    const res = await githubQuery({
      url: "https://api.github.com/repos/huaasto/sdfs/issues/" + number,
      method: "PATCH",
      data: {
        title: JSON.stringify({ title, img: bg }),
        body: body,
        labels: ['blog']
      }
    })
    if (res?.status < 400) {
      setTitle('')
      setBody('')
      navigate(`/blogs/${res.data.number}`)
    } else {
      alert('修改失败')
    }
  }
  return (
    <div>
      <img className='fixed -z-10 top-0 bottom-0 left-0 right-0 object-cover min-h-screen' src={bg} alt="" />
      <div className=' max-w-5xl m-auto'>
        <div className="page-wrap-outlined opacity-80" style={{ backgroundColor: 'inherit' }}>
          <input defaultValue={title} type="text" className=" mb-3" placeholder='title' onChange={(e) => setTitle(e.target.value)} />
          <textarea ref={Imgwrap} value={body} id="dropZone" name="comment" cols={30} rows={10} placeholder="body" onChange={(e) => setBody(e.target.value)}></textarea>
          <div style={{ textAlign: "right" }}>
            {title && body && <button className="primary" onClick={number ? updateBlog : createBlog}>submit</button>}
          </div>
        </div>
      </div>
    </div>

  )
}
