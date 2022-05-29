import React, { useContext, useEffect } from 'react'
import { Context } from '../../content'

export default function Demos() {
  const { state, dispatch } = useContext(Context)
  const change = (value: string) => {
    console.log(value)
    dispatch({ type: "update", value: { name: value } })
  }
  useEffect(() => {
    const value = {
      name: "ttt"
    }
    dispatch({ type: "update", value })
  }, [dispatch])
  return (
    <>
      <div>{state.name}</div>
      {state.name && <input
        type="text"
        value={state.name}
        className="border-gray-100 border-2"
        onChange={(e) => change(e.target.value)}
      />}
      <br />
      <button
        className="bg-black text-white px-4 py-1"
        onClick={(e) => change(state.name + String(Math.random()).slice(3, 8))}
      >
        testChange
      </button>
    </>
  )
}
