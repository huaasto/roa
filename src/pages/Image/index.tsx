import { ChangeEvent, useCallback, useContext, useEffect, useRef, useState } from "react"
import { IAdd, ILinks, ITrash } from "../../icons"
import Compressor from 'compressorjs';
import { Format, githubQuery, isMobile } from "../../utils/common";
import "./index.css"
import { Context } from "../../content";
import ImgWrap from "./ImgWrap";

type CompressorOption = {
  quality: number,
  width?: number
}
type Date = {
  sha: string,
  name: string,
  path: string,
  download_url?: string,
  pic_url?: string,
  fold?: boolean,
  size?: number,
  content?: string,
  proSha?: string,
  proUrl?: string
}
type DatesObj = {
  [key: string]: Date[]
}




export default function Images() {
  const { state } = useContext(Context)
  const [showBg, setShowBg] = useState(false)
  const [currentInd, setCurrentInd] = useState(0)
  const [currentDate, setCurrentDate] = useState('')
  const [currentImgs, setCurrentImgs] = useState<Date[]>([])
  const fileRef = useRef<HTMLInputElement | null>(null)
  const [total, setTotal] = useState(0)
  const [current, setCurrent] = useState(0)
  const [loading, setLoading] = useState(false)
  const [isPublic, setIsPublic] = useState(true)
  const [miniFiles, setMiniFiles] = useState<(File & { url: string; })[]>([])
  // const [currentDate, setCurrentDate] = useState('')
  const [imgDates, setImgDates] = useState<Date[]>([])
  const [pubImgDates, setPubImgDates] = useState<Date[]>([])
  const [datesImages, setDatesImages] = useState<DatesObj>({})
  const [pubDatesImages, setPubDatesImages] = useState<DatesObj>({})
  function myCompressor(file: File, option: CompressorOption) {
    return new Promise(res => {
      new Compressor(
        file,
        Object.assign(
          {
            success(result: File) {
              res(result)
            },
            error(err: any) {
              console.log(err.message)
            }
          },
          option
        )
      )
    }) as Promise<File>
  }
  const uploader = useCallback((image: File & { url: string; }) => {
    return new Promise(async (resolve, reject) => {
      if (isMobile() && image.size > 1024 * 1024 * 3) {
        resolve({ status: 999 })
        return
      }
      let properImage: File
      if (!image.type.match('gif')) {
        properImage = (600 * 1024) / image.size > 1 ? await myCompressor(image, { quality: +((600 * 1024) / image.size / 2).toFixed(1) }) : image
      } else {
        properImage = image
      }
      // const miniImg = image.type.match('gif') ? image : await myCompressor(image, { quality: 0.1, width: 500 })
      var reader = new FileReader() //实例化文件读取对象
      // var readermini = new FileReader() //实例化文件读取对象

      // readermini.readAsDataURL(miniImg) //将文件读取为 DataURL,也就是base64编码
      const par = {
        name: 'pic' + Date.now() + String(Math.random()).slice(4, 7) + '.' + image.name.split('.').reverse()[0],
        path: Format(new Date(), 'YYYY_MM_DD')
      }
      // readermini.onload = async function (ev) {
      var dataURL = image.url.split(',')[1] //获得文件读取成功后的DataURL,也就是base64编码
      if (!isPublic) {

        const data = await githubQuery({
          url: "https://api.github.com/repos/huaasto/empty/contents/mini/" + par.path + '/' + par.name,
          // url: "https://github.com/repos/huaasto/minipics/contents/" + par.path + '/' + par.name,
          method: "PUT",
          data: {
            content: dataURL,
            message: 'create mini img'
          }
        })
      }
      reader.readAsDataURL(properImage) //将文件读取为 DataURL,也就是base64编码
      // }

      reader.onload = async function (ev) {
        if (typeof ev?.target?.result !== 'string') return
        var dataURL = ev.target.result.split(',')[1] //获得文件读取成功后的DataURL,也就是base64编码
        const data = await githubQuery({
          url: (isPublic ? 'https://api.github.com/repos/huaasto/empty/contents/public/' : "https://api.github.com/repos/huaasto/empty/contents/pro/") + par.path + '/' + par.name,
          method: "PUT",
          data: {
            content: dataURL,
            message: 'create img'
          },
          headers: state?.userInfo?.login !== "huaasto" ? {
            Authorization: window.atob('dG9rZW4gZ2hwX04xdVV3TUlRamVvUERlZ2NUWkptbWVtSEh6bENVRDA1TmtjWQ==')
          } : {}
        })
        resolve(data)
      }
    })
  }, [isPublic])
  const queryImages = useCallback(async (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return
    setMiniFiles([])
    setTotal(e.target.files.length)
    setCurrent(0)
    const files = [...Array.from(e.target.files).map(image => Object.assign(image, { url: '' }))]
    let ind = 0
    files.forEach(async (image) => {
      const miniImg = image.type.match('gif') ? image : await myCompressor(image, { quality: 0.1, width: 500 })
      let readermini = new FileReader() //实例化文件读取对象
      readermini.readAsDataURL(miniImg) //将文件读取为 DataURL,也就是base64编码
      readermini.onload = async function (ev) {
        if (typeof ev?.target?.result !== 'string') return
        var dataURL = ev.target.result //获得文件读取成功后的DataURL,也就是base64编码
        image.url = dataURL
        ind++
        if (ind !== files.length) return
        setMiniFiles(files)
      }
    })
  }, [])
  const initFile = (inds = [] as number[]) => {
    fileRef.current && (fileRef.current.files = null)
    setMiniFiles(inds.map(i => miniFiles[i]))
    setLoading(false)
    setTotal(inds.length)
    setCurrent(0)
  }
  const removePic = (e: React.MouseEvent<HTMLDivElement, MouseEvent>, i: number) => {
    e.stopPropagation()
    const files = [...miniFiles]
    files.splice(i, 1)
    setMiniFiles(files)
    setTotal(total - 1)
  }

  const queryOneImgs = async (imgs: DatesObj, date: string, name: string, i: number) => {
    const res = await githubQuery({
      url: "https://api.github.com/repos/huaasto/empty/contents/pro/" + date + '/' + name,
      method: "GET",
    })
    imgs[date][i].proUrl = res.data.download_url?.replace("https://raw.githubusercontent.com/huaasto/empty/main", 'https://cdn.jsdelivr.net/gh/huaasto/empty@master')
    imgs[date][i].content = res.data.content ? 'data:image/' + res.data.name.split('.').reverse()[0] + ';base64,' + res.data.content : imgs[date][i].proUrl
    imgs[date][i].proSha = res.data.sha
    return imgs[date][i]
  }

  const queryOneDayImgs = useCallback(async (dates: string) => {
    const res = await githubQuery({
      url: (isPublic ? "https://api.github.com/repos/huaasto/empty/contents/public/" : "https://api.github.com/repos/huaasto/empty/contents/mini/") + dates,
      method: "GET",
    })
    const imgs = { ...(isPublic ? pubDatesImages : datesImages) }
    const imgData = res.data.map((img: Date, i: number) => Object.assign(imgs[dates]?.[imgs[dates].length - i - 1] || {}, img, {
      pic_url: img.download_url?.replace("https://raw.githubusercontent.com/huaasto/empty/main", 'https://cdn.jsdelivr.net/gh/huaasto/empty@master'),
    })
    ).reverse()
    imgs[dates] = imgData;
    (isPublic ? setPubDatesImages : setDatesImages)(imgs)
    // isPublic || Promise.allSettled(imgs[dates].map((img, i) => img?.name?.split('.').reverse()[0] === 'gif' || img.proUrl ? Promise.resolve() : queryOneImgs(imgs, dates, img.name, i))).then(res => {
    //   const realImgs = JSON.parse(JSON.stringify(imgs));
    //   (isPublic ? setPubDatesImages : setDatesImages)(realImgs)
    // })
  }, [datesImages, isPublic, pubDatesImages])

  const queryDates = async () => {
    const res = await githubQuery({
      url: isPublic ? "https://api.github.com/repos/huaasto/empty/contents/public" : "https://api.github.com/repos/huaasto/empty/contents/mini",
      method: "GET",
    });
    (isPublic ? setPubImgDates : setImgDates)(res.data.reverse().map((date: Object, i: number) => Object.assign(date, { fold: typeof (isPublic ? pubImgDates : imgDates)[i]?.fold === 'boolean' ? (isPublic ? pubImgDates : imgDates)[i]?.fold : true })))
  }
  const toggleFold = async (i: number) => {
    const dates = [...(isPublic ? pubImgDates : imgDates)]
    dates[i].fold = !dates[i].fold
    if (!dates[i].fold && !(isPublic ? pubDatesImages : datesImages)[dates[i].name]) {
      queryOneDayImgs(dates[i].name)
    };
    (isPublic ? setPubImgDates : setImgDates)(dates)
  }

  const startUpload = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.stopPropagation()
    if (!fileRef.current?.files?.length) return
    setLoading(true)
    const newImgs = []
    const errInds = []
    for (let i = 0; i < miniFiles.length; i++) {
      setCurrent(i + 1)
      const pic = miniFiles[i]
      const newImg: any = await uploader(pic as File & { url: string; })
      if (!!{ 201: true, 200: true }[newImg.status as number]) {
        newImgs.push(Object.assign({}, { content: newImg.data.content }, {}))
      } else {
        errInds.push(i)
      }
    }
    queryDates()
    queryOneDayImgs(Format(new Date(), 'YYYY_MM_DD'))
    initFile(errInds)
    alert("已上传完成")
  }
  const removeCurrentPic = async (e: any, date: string, img: Date) => {
    e.stopPropagation()
    const res = githubQuery({
      url: (isPublic ? 'https://api.github.com/repos/huaasto/empty/contents/public/' : "https://api.github.com/repos/huaasto/empty/contents/mini/") + date + '/' + img.name,
      method: "DELETE",
      data: {
        sha: img.sha,
        message: "delete mini img"
      }
    })
    if (!isPublic) {
      const data = await githubQuery({
        url: "https://api.github.com/repos/huaasto/empty/contents/pro/" + date + '/' + img.name,
        method: "GET",
      })
      data?.data?.sha && githubQuery({
        url: "https://api.github.com/repos/huaasto/empty/contents/pro/" + date + '/' + img.name,
        method: "DELETE",
        data: {
          sha: data.data.sha,
          message: "delete img"
        }
      })
    }

    setShowBg(false)
    const imgs = JSON.parse(JSON.stringify((isPublic ? pubDatesImages : datesImages)))
    imgs[date].splice(currentInd, 1)
      (isPublic ? setPubDatesImages : setDatesImages)(imgs)
    alert("删除成功")
  }
  const parseImg = (pic: Date) => {
    return (pic.size && pic.size > 1024 * 600 ? (pic.content || pic.proUrl || pic.pic_url) : (pic.content || pic.proUrl || pic.pic_url)) || ''
  }
  const queryCurrentImgs = (date: string, i: number) => {
    setCurrentInd(i)
    setCurrentDate(date)
    setCurrentImgs([...(isPublic ? pubDatesImages : datesImages)[date]])
    setShowBg(true)
  }
  const [picLoad, setPicLoad] = useState(false)
  useEffect(() => {
    setPicLoad(true)
    if (isPublic || !datesImages[currentDate] || datesImages[currentDate][currentInd].content) {
      setPicLoad(false)
      return
    }
    queryOneImgs(datesImages, currentDate, datesImages[currentDate][currentInd].name, currentInd).then(res => {
      const realImgs = JSON.parse(JSON.stringify(datesImages));
      setDatesImages(realImgs)
      setCurrentImgs(realImgs[currentDate])
      setPicLoad(false)
    })
  }, [isPublic, currentInd, currentDate, datesImages])
  const copyLink = (img: Date) => {
    var textareaC = document.createElement('textarea');
    textareaC.setAttribute('readonly', 'readonly'); //设置只读属性防止手机上弹出软键盘
    textareaC.value = img.proUrl || img.pic_url || img.download_url || '';
    document.body.appendChild(textareaC); //将textarea添加为body子元素
    textareaC.select();
    var res = document.execCommand('copy');
    document.body.removeChild(textareaC);//移除DOM元素
    alert("复制成功");
    return res;
  }
  useEffect(() => {
    queryDates();
    // (isPublic ? setPubDatesImages : setDatesImages)({})
  }, [isPublic])
  useEffect(() => {
    if (!showBg || isPublic || datesImages[currentDate]?.[0].proUrl) return
    githubQuery({
      url: "https://api.github.com/repos/huaasto/empty/contents/pro/" + currentDate,
      method: "GET",
    }).then(res => {
      const data = JSON.parse(JSON.stringify(datesImages))
      data[currentDate] = res.data.reverse().map((date: any, i: number) => Object.assign(data[currentDate][i], { proUrl: date.download_url?.replace("https://raw.githubusercontent.com/huaasto/empty/main", 'https://cdn.jsdelivr.net/gh/huaasto/empty@master') }))
      setDatesImages(data)
      setCurrentImgs(data[currentDate])

    })
  }, [showBg, isPublic, currentDate, datesImages])
  return (
    <>
      <div className={"border-2 border-gray-600 border-dashed max-w-screen-md px-3 py-6 mx-auto my-4 rounded text-center relative" + (loading ? ' disabled' : '')} onClick={() => fileRef.current?.click()}>
        <IAdd width="50" stroke="#000" />
        <div className=" max-h-40 overflow-auto no-scroll">
          {miniFiles.map((image, i) => <span key={i} className="relative inline-block">
            <img src={image.url} alt="" className="inline-block h-20" />
            <div className="absolute right-0 top-0 bg-black text-white p-1 cursor-pointer" onClick={(e) => removePic(e, i)}>×</div>
          </span>
          )}
        </div>
        <button className="absolute bottom-3 right-3 bg-black text-white px-4" disabled={loading} onClick={startUpload}>Upload-{current}/{total}</button>
      </div>
      {state?.userInfo?.login === "huaasto" && <div className="text-center">
        <button className={"py-1 px-3 border border-black" + (isPublic ? ' bg-black text-white' : '')} onClick={() => setIsPublic(true)}>公共</button>
        <button className={"py-1 px-3 border border-black" + (isPublic ? '' : ' bg-black text-white')} onClick={() => setIsPublic(false)}>私有</button>
      </div>}
      <input ref={fileRef} type="file" multiple accept="image/*" disabled={loading} className="hidden" onChange={queryImages} />
      <div className={"max-w-6xl m-auto overflow-x-hidden" + (isPublic ? '' : ' hidden')}>
        {pubImgDates.map((date, i) => <div key={date.sha} className="my-2">
          <div>
            <div className={"relative date-davider" + (i % 2 ? " text-right  border-l-stone-300 border-l-2" : ' border-r-stone-300 border-r-2')}>
              <span className="inline-block bg-black text-white px-5 py-2 cursor-pointer"
                onClick={(e) => toggleFold(i)}>
                {date.name}
              </span>
            </div>
            {<div className={'text-center' + (date.fold ? " hidden" : " block")}>
              {pubDatesImages[date.name]?.map((img, j) => <ImgWrap
                key={'pp_' + j} url={img.content || img.download_url || ''}
                picClick={() => queryCurrentImgs(date.name, j)}
              />
                // <div key={'pp_' + j} className="inline-block h-20 m-2 relative">
                //   <img className={"h-full shadow-black" + (img.content ? " shadow-md" : "")} src={parseImg(img)} alt="" onClick={() => queryCurrentImgs(date.name, j)} />
                //   {!img.content && <div className="absolute right-0 top-0 bg-black text-white p-1 cursor-pointer" onClick={(e) => removeCurrentPic(e, date.name, img)}>×</div>}
                // </div>
              )}
            </div>}
          </div>
        </div>)}
      </div>
      <div className={"max-w-6xl m-auto overflow-x-hidden" + (isPublic ? ' hidden' : '')}>
        {imgDates.map((date, i) => <div key={date.sha} className="my-2">
          <div>
            <div className={"relative date-davider" + (i % 2 ? " text-right  border-l-stone-300 border-l-2" : ' border-r-stone-300 border-r-2')}>
              <span className="inline-block bg-black text-white px-5 py-2 cursor-pointer"
                onClick={(e) => toggleFold(i)}>
                {date.name}
              </span>
            </div>
            {<div className={"text-center" + (date.fold ? " hidden" : " block")}>
              {datesImages[date.name]?.map((img, j) => <ImgWrap
                key={'pp_' + j} url={img.content || img.download_url || ''}
                picClick={() => queryCurrentImgs(date.name, j)}
              />
              )}
              {/* {datesImages[date.name]?.map((img, j) => <div key={'pp_' + j} className="inline-block h-20 m-2 relative">
                <img className={"h-full shadow-black" + (img.content ? " shadow-md" : "")} src={img.content || img.download_url} alt="" onClick={() => queryCurrentImgs(date.name, j)} />
                {!img.content && <div className="absolute right-0 top-0 bg-black text-white p-1 cursor-pointer" onClick={(e) => removeCurrentPic(e, date.name, img)}>×</div>}
              </div>)} */}
            </div>}
          </div>
        </div>)}
      </div>
      {showBg && <div className="imgBg fixed top-0 bottom-0 left-0 right-0 bg-black bg-opacity-80 flex justify-center items-center z-50">
        <div className="fixed left-0 top-0 text-white p-2 text-3xl  cursor-pointer">
          {state?.userInfo?.login === "huaasto" && <span onClick={(e) => removeCurrentPic(e, currentDate, currentImgs[currentInd])}>
            <ITrash stroke="#fff" width="28" className="mr-4 align-baseline" />
          </span>}

          <span>{currentDate}</span>
          <span onClick={() => copyLink(currentImgs[currentInd])}>
            <ILinks stroke="#fff" width="28" className="ml-4 align-baseline" />
          </span>
        </div>
        <div className="fixed right-0 top-0 text-white p-2 text-3xl  cursor-pointer" onClick={() => setShowBg(false)}>×</div>
        <img src={currentImgs[currentInd].content || currentImgs[currentInd].download_url} className="max-h-full max-w-full" alt="" />
        <div className="fixed left-4 top-1/2 bottom-1/2 text-white m-auto text-3xl cursor-pointer min-h-fit min-w-fit p-2 bg-black rounded-md" onClick={() => setCurrentInd(currentInd !== 0 ? currentInd - 1 : currentImgs.length - 1)}>&lt;</div>
        <div className="fixed right-4 top-1/2 bottom-1/2 text-white m-auto text-3xl cursor-pointer  min-h-fit min-w-fit p-2 bg-black rounded-md" onClick={() => setCurrentInd(currentInd !== currentImgs.length - 1 ? currentInd + 1 : 0)}>&gt;</div>
        {picLoad && <div className=" fixed right-0 bottom-0 px-5 py-1 bg-black text-white">Loading... ...</div>}
      </div>}
    </>
  )
}
