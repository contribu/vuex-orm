import * as Vuex from 'vuex'
import Container from '../container/Container'
import Database from '../database/Database'

export type Install = (database: Database, options?: Options) => Vuex.Plugin<any>

export interface Options {
  namespace?: string,
  customCopy?: any
}

export default (database: Database, options: Options = {}): Vuex.Plugin<any> => {
  const namespace = options.namespace || 'entities'
  const customCopy = options.customCopy

  return (store: Vuex.Store<any>): void => {
    Container.register(database)

    database.start(store, namespace, customCopy)
  }
}
