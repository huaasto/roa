import { ChangeEvent, useCallback, useEffect, useRef, useState } from "react"
import { IAdd } from "../../icons"
import Compressor from 'compressorjs';
import { Format, githubQuery } from "../../utils/common";
import "./index.css"

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
  fold?: boolean
}
type DatesObj = {
  [key: string]: Date[]
}


export default function Images() {
  const fileRef = useRef<HTMLInputElement | null>(null)
  const [total, setTotal] = useState(0)
  const [current, setCurrent] = useState(0)
  const [loading, setLoading] = useState(false)
  const [miniFiles, setMiniFiles] = useState<(File & { url: string; })[]>([])
  // const [currentDate, setCurrentDate] = useState('')
  const [imgDates, setImgDates] = useState<Date[]>([])
  const [datesImages, setDatesImages] = useState<DatesObj>({})
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

      let properImage: File
      if (!image.type.match('gif')) {
        properImage = await myCompressor(image, { quality: 0.8 })
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
      const data = await githubQuery({
        url: "https://api.github.com/repos/huaasto/empty/contents/mini/" + par.path + '/' + par.name,
        // url: "https://github.com/repos/huaasto/minipics/contents/" + par.path + '/' + par.name,
        method: "PUT",
        data: {
          content: dataURL,
          message: 'create mini img'
        }
      })
      reader.readAsDataURL(properImage) //将文件读取为 DataURL,也就是base64编码
      // }

      reader.onload = async function (ev) {
        if (typeof ev?.target?.result !== 'string') return
        var dataURL = ev.target.result.split(',')[1] //获得文件读取成功后的DataURL,也就是base64编码
        const data = await githubQuery({
          url: "https://api.github.com/repos/huaasto/empty/contents/pro/" + par.path + '/' + par.name,
          method: "PUT",
          data: {
            content: dataURL,
            message: 'create img'
          }
        })
        resolve(data)
      }
    })
  }, [])
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
  const initFile = () => {
    fileRef.current && (fileRef.current.files = null)
    setMiniFiles([])
    setLoading(false)
    setTotal(0)
    setCurrent(0)
  }
  const removePic = (e: React.MouseEvent<HTMLDivElement, MouseEvent>, i: number) => {
    e.stopPropagation()
    const files = [...miniFiles]
    files.splice(i, 1)
    setMiniFiles(files)
    setTotal(total - 1)
  }

  const queryOneDayImgs = useCallback(async (dates: string) => {
    const res = await githubQuery({
      url: "https://api.github.com/repos/huaasto/empty/contents/mini/" + dates,
      method: "GET",
    })
    const imgs = { ...datesImages }
    imgs[dates] = res.data.map((img: Date) => Object.assign(img, {
      pic_url: img.download_url?.replace("https://raw.githubusercontent.com/huaasto/empty/main", 'https://cdn.jsdelivr.net/gh/huaasto/empty@master')
    })).reverse()
    setDatesImages(imgs)
  }, [datesImages])

  const queryDates = async () => {
    const res = await githubQuery({
      url: "https://api.github.com/repos/huaasto/empty/contents/mini",
      method: "GET",
    })
    setImgDates(res.data.map((date: Object, i: number) => Object.assign(date, { fold: imgDates[i]?.fold || true })).reverse())
  }
  const toggleFold = async (i: number) => {
    const dates = [...imgDates]
    dates[i].fold = !dates[i].fold
    if (!dates[i].fold && !datesImages[dates[i].name]) {
      queryOneDayImgs(dates[i].name)
    }
    setImgDates(dates)
  }

  const startUpload = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.stopPropagation()
    if (!fileRef.current?.files?.length) return
    setLoading(true)
    for (let i = 0; i < miniFiles.length; i++) {
      setCurrent(i + 1)
      const pic = miniFiles[i]
      await uploader(pic as File & { url: string; })
    }
    queryDates()
    queryOneDayImgs(Format(new Date(), 'YYYY_MM_DD'))
    initFile()
    alert("已全部上传")
  }
  const removeCurrentPic = async (e: React.MouseEvent<HTMLDivElement, MouseEvent>, img: Date, i: number) => {
    e.stopPropagation()
    const res = githubQuery({
      url: "https://api.github.com/repos/huaasto/empty/contents/mini/" + imgDates[i].name + '/' + img.name,
      method: "DELETE",
      data: {
        sha: img.sha,
        message: "delete mini img"
      }
    })
    const data = await githubQuery({
      url: "https://api.github.com/repos/huaasto/empty/contents/pro/" + imgDates[i].name + '/' + img.name,
      method: "GET",
    })
    githubQuery({
      url: "https://api.github.com/repos/huaasto/empty/contents/pro/" + imgDates[i].name + '/' + img.name,
      method: "DELETE",
      data: {
        sha: data.data.sha,
        message: "delete img"
      }
    })
    queryOneDayImgs(imgDates[i].name)
    alert("删除成功")
  }
  useEffect(() => {
    queryDates()
  }, [])
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
      <input ref={fileRef} type="file" multiple accept="image/*" disabled={loading} className="hidden" onChange={queryImages} />
      <div className=" max-w-6xl m-auto overflow-x-hidden">
        {imgDates.map((date, i) => <div key={date.sha} className="my-2">
          <div>
            <div className={"relative date-davider" + (i % 2 ? " text-right" : '')}>
              <span className="inline-block bg-black text-white px-5 py-2 cursor-pointer"
                onClick={(e) => toggleFold(i)}>
                {date.name}
              </span>
            </div>
            {<div className={date.fold ? " hidden" : " block"}>
              {datesImages[date.name]?.map((img, j) => <div key={img.sha + img.name} className="inline-block h-20 m-2 relative">
                <img className=" h-full" src={img.pic_url} alt="" />
                <div className="absolute right-0 top-0 bg-black text-white p-1 cursor-pointer" onClick={(e) => removeCurrentPic(e, img, i)}>×</div>
              </div>)}
            </div>}
          </div>
        </div>)}
      </div>
    </>
  )
}
