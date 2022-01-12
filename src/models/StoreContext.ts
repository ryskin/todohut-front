import { createContext, useContext } from "react"
import { RootStore } from "./RootStoreModel"

const StoreContext = createContext<RootStore>({} as RootStore)
export const useStore = () => useContext(StoreContext)
export const StoreProvider = StoreContext.Provider
