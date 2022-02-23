import { types } from "mobx-state-tree";
import { ListModel } from "./ListModel";

// generate random string id
const randomId = () => String(Math.floor(Math.random() * 1000000));

export const ListStoreModel = types.model("ListStore", {
  items: types.optional(types.array(ListModel), []),
  selected: types.maybe(types.late(() => types.reference(ListModel))),
})
  .actions(self => ({
    add(item: any) {
      self.items.push({ ...item, id: randomId() });
    },
    remove(item: any) {
      self.items.remove(item);
    },
    setCurrentList(itemId: string) {
      self.selected = self.items.find(item => item.id === itemId);
    },
    findById(id: string) {
      return self.items.find((item) => item.id === id);
    },
  }))