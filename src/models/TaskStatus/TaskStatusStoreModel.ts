import { types } from "mobx-state-tree";
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
            self.items.push({ ...item, id: randomId() });
        },
        remove(item: any) {
            self.items.remove(item);
        }
    }));