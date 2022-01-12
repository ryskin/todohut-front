import { types } from "mobx-state-tree";
import { TaskToTaskModel } from "./TaskToTaskModel";

export const TaskToTaskStoreModel = types.model("TaskToTaskStore", {
    items: types.optional(types.array(TaskToTaskModel), [])
})