import { useEffect, useRef, useState } from "react";
import { uploadImg } from "../../utils/common";

export const useDropEvent = (parseUrl = (url: string) => url) => {
  // 获得拖拽文件的回调函数
  const [update, setUpdate] = useState(false)
  const Imgwrap = useRef<HTMLTextAreaElement>(null)
  function getDropFileCallBack(dropFiles: any) {
    uploadImg(dropFiles[0]).then((res: any) => {
      // if (!res.data) return alert('插入图片失败')
      const url = res.data.content?.download_url.replace("https://raw.githubusercontent.com/huaasto/blogPics/main", "https://cdn.jsdelivr.net/gh/huaasto/blogPics@master") || ''
      Imgwrap.current && url && (Imgwrap.current.value += parseUrl(url))
      setUpdate(!update)
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