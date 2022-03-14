import {
  getRoot,
  Instance,
  resolveIdentifier,
  SnapshotOut,
  types,
} from "mobx-state-tree";
import { randomId } from "../../utils/basic";
import { TaskModel } from "./TaskModel";
import { RootStore } from "../RootStoreModel";
import { TimeLog } from "../TimeLog/TimeLogModel";

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
      const timeLogStore = getRoot<RootStore>(self).timeLog;
      const timeLogs = timeLogStore.items.filter((item) => item.task.id === taskId);
      if (timeLogs) {
        timeLogs.forEach((item: TimeLog) => timeLogStore.remove(item.id));
      };
      if (instance?.subTasks && instance.subTasks.length > 0) {
        alert("Remove subtasks");
        // return;
      }
      //remove subtasks first
      const children = self.items.filter((item) => item.parent?.id === taskId);
      children.forEach((item) => item.remove());
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
