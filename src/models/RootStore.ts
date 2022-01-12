import { RootStore, RootStoreModel } from "./RootStoreModel"
import { connectReduxDevtools } from "mst-middlewares"

export const createStore = (): RootStore => {
    const env = {}
    const rootStore = RootStoreModel.create({}, env)
    connectReduxDevtools(require("remotedev"), rootStore)
    return rootStore
  }