import { getRoot, types } from "mobx-state-tree";
import { RootStore } from "../RootStoreModel";
import { Task } from "../Task/TaskModel";

export const TaskStatusModel = types
    .model("TaskStatus", {
        id: types.identifier,
        name: types.string,
        color: types.maybe(types.string),
        description: types.maybe(types.string),
        completed: types.optional(types.boolean, false),
        createdAt: types.maybe(types.Date),
        updatedAt: types.maybe(types.Date),
    })
    .views((self) => ({
        get selectedListTasks(): Task[] {
            const taskStore = getRoot<RootStore>(self).task
            const { selected } = getRoot<RootStore>(self).list
            return taskStore.items.filter(
                (task: Task) => task.status?.id === self.id
            ).filter((task: Task) => task.list?.id === selected?.id)
        },
    }));
