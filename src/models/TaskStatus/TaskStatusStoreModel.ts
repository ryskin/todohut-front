import { getRoot, types } from "mobx-state-tree";
import { RootStore } from "../RootStoreModel";
import { TaskStatusModel } from "./TaskStatusModel";

const randomId = () => String(Math.floor(Math.random() * 1000000));

export const TaskStatusStoreModel = types.model("TaskStatusStore", {
  items: types.optional(types.array(TaskStatusModel), [])
})
  .views((self) => ({
    get statuses() {
      return self.items.map(status => status.name)
    },
  }))
  .actions(self => ({
    add(item: any) {
      const seletedList = getRoot<RootStore>(self).list.selected
      if (!seletedList) alert("Please select a list")
      self.items.push({ ...item, list: seletedList, id: randomId() });
    },
    remove(item: any) {
      self.items.remove(item);
    },
    findById(id: string) {
      return self.items.find((item) => item.id === id);
    },
  }));