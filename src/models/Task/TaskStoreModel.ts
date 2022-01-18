import {
  Instance,
  resolveIdentifier,
  SnapshotOut,
  types,
} from "mobx-state-tree";
import { randomId } from "../../utils/basic";
import { TaskModel } from "./TaskModel";

export const TaskStoreModel = types
  .model("TaskStoreModel", {
    items: types.optional(types.array(TaskModel), []),
  })
  .views((self) => ({
    get parents() {
      return self.items.filter((item) => !item.parent);
    },
  }))
  .actions((self) => ({
    add(item: any) {
      self.items.push({ ...item, id: randomId() });
    },
    remove(taskId: string) {
      const instance = resolveIdentifier(TaskModel, self, taskId);
      if (!instance) return;
      console.log("remove", instance);
      if (instance?.subTasks && instance.subTasks.length > 0) {
        alert("You can't remove a task that has a sub task");
        return;
      }
      self.items.remove(instance);
    },
    update(id: string, item: any) {
      const instance = resolveIdentifier(TaskModel, self, id);
      if (instance) {
        Object.assign(instance, item);
        return true;
      }
      return false;
    },
    findById(id: string) {
      return self.items.find((item) => item.id === id);
    },
  }));

type TaskStoreType = Instance<typeof TaskStoreModel>;
export interface TaskStore extends TaskStoreType {}
type TaskStoreSnapshotType = SnapshotOut<typeof TaskStoreModel>;
export type TaskStoreSnapshot = TaskStoreSnapshotType;
