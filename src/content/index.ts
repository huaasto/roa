import { createContext } from "react"

type State = {
  [key: string]: any
}

type Action = {
  type: string,
  fn?: (state: State, action: Action) => State,
  [key: string]: any
}

type ReducerFn = {
  [key: string]: (state: State, action: Action) => State
}

type UContext = {
  state: State,
  dispatch: React.Dispatch<Action>
}

const initialState: State = {
  userInfo: {},
  authorization: '',
  color: '#' + Math.floor(Math.random() * 0xffffff).toString(16).padEnd(6, '0'),
}

const actions: ReducerFn = {
  change: (state, action) => {
    state.name = action.value || state.name + String(Math.random()).slice(3, 8)
    return state
  },
  update: (state, action) => {
    return Object.assign(state, { ...action.value })
  },
  fn: (state, action) => {
    const newState = action.fn && typeof action.fn === 'function' ? action.fn(state, action) : state
    return newState
  }
}

const reducer = (state: State, action: Action) => {
  const newState = { ...state }
  return actions[action.type](newState, action) || newState
}

const Context = createContext<UContext>({
  state: {},
  dispatch: () => { }
})

export {
  initialState,
  actions,
  reducer,
  Context
}