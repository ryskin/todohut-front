import { getRoot, types } from "mobx-state-tree";
import { RootStore } from "../RootStoreModel";
import { Task } from "../Task/TaskModel";

export const ListModel = types
  .model("List", {
    id: types.identifier,
    name: types.string,
    description: types.maybe(types.string),
    createdAt: types.maybe(types.Date),
    updatedAt: types.maybe(types.Date),
  })
  .views((self) => ({
    get tasks(): Task[] {
      return getRoot<RootStore>(self).task.items.filter(
        (task) => task.list?.id === self.id
      );
    },
  }))
  .actions((self) => ({
    setDescription(description: string) {
      console.log("setDescription", description);
      self.description = description;
    }
  }));
