import { Instance, SnapshotOut, types } from "mobx-state-tree";
import { randomId } from "../../utils/basic";
import { TaskModel } from "./TaskModel";

export const TaskStoreModel = types.model("TaskStoreModel", {
    items: types.optional(types.array(TaskModel), [])
})
    .views(self => ({
        get parents() {
            return self.items.filter(item => !item.parent);
        }
    }))
    .actions(self => ({
        add(item: any) {
            self.items.push({ ...item, id: randomId() });
        },
        remove(item: any) {
            self.items.remove(item);
        },
        findById(id: string) {
            return self.items.find(item => item.id === id);
        }
    }));

type TaskStoreType = Instance<typeof TaskStoreModel>;
export interface TaskStore extends TaskStoreType { }
type TaskStoreSnapshotType = SnapshotOut<typeof TaskStoreModel>;
export type TaskStoreSnapshot = TaskStoreSnapshotType;