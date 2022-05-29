import { ChangeEvent, useCallback, useRef } from "react"
import { IAdd } from "../../icons"



export default function Images() {
  const fileRef = useRef<HTMLInputElement | null>(null)
  const queryImages = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    console.log(e.target.files)
  }, [])
  return (
    <>
      <div className="border-2 border-gray-600 border-dashed max-w-screen-md px-3 py-6 mx-auto my-4 rounded text-center" onClick={() => fileRef.current?.click()}>
        <IAdd width="50" stroke="#000" />
      </div>
      <input ref={fileRef} type="file" multiple accept="image/*" className="hidden" onChange={queryImages} />
    </>
  )
}
