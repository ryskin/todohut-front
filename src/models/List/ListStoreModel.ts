import { resolveIdentifier, types } from "mobx-state-tree";
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
    tasks(listId: string) {
      return self.items.find(item => item.id === listId)?.tasks || [];
    },
    remove(listId: string) {
      const list = resolveIdentifier(ListModel, self, listId);
      if (list?.id === self?.selected?.id) {
        self.selected = undefined;
      }
      if (list) {
        console.log("list.tasks", list.tasks);
        list.tasks.forEach(task => task.remove());
        self.items.remove(list);
      }
    },
    setCurrentList(itemId: string) {
      self.selected = self.items.find(item => item.id === itemId);
    },
    findById(id: string) {
      return self.items.find((item) => item.id === id);
    },
  }))