import pick from "lodash/pick";
import {
  getType,
  applySnapshot,
  addDisposer,
  onSnapshot,
} from "mobx-state-tree";
import { throttle } from "throttle-debounce";

type LocalStorageMixinOptions = {
  storage?: {
    getItem(key: string): string | null | Promise<string | null>;
    setItem(key: string, data: string): void;
  };
  throttle?: number; // How often the snapshot is written to local storage
  storageKey?: string;
  filter?: string[];
};
export function localStorageMixin(options: LocalStorageMixinOptions = {}) {
  const storage = window.localStorage;
  const throttleInterval = options.throttle || 1000;
  const storageKey = options.storageKey || "todohut";
  return (self: any) => ({
    actions: {
      async afterCreate() {
        const data = await storage.getItem(storageKey);
        if (data) {
          const json = JSON.parse(data);
          const selfType = getType(self);
          if (!selfType.is(json)) {
            console.warn(
              // eslint-disable-next-line max-len
              `Data in local storage does not conform the data shape specified by ${selfType.name}, ignoring the stored data`
            );
            return;
          }
          applySnapshot(self, json);
          self.setRehydrated();
          console.log("Loaded data from local storage", self);
        }
        addDisposer(
          self,
          onSnapshot(
            self,
            throttle(throttleInterval, (data: any) => {
              if (options.filter) {
                data = pick(data, options.filter);
              }
              storage.setItem(storageKey, JSON.stringify(data));
            })
          )
        );
      },
    },
  });
}