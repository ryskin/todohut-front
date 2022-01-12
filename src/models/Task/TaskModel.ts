import {
  IAnyModelType,
  Instance,
  SnapshotOut,
  types,
  getRoot,
} from "mobx-state-tree";
import { UserModel } from "../User/UserModel";
import { ListModel } from "../List/ListModel";
import { TaskStatusModel } from "../TaskStatus/TaskStatusModel";
import { CommentModel } from "../Comment/CommentModel";
import { RootStore } from "../RootStoreModel";

export const TaskModel = types
  .model("TaskStore", {
    id: types.identifier,
    parent: types.maybe(
      types.reference(types.late((): IAnyModelType => TaskModel))
    ),
    name: types.string,
    description: types.maybe(types.string),
    priority: types.optional(
      types.enumeration("Priority", ["none", "low", "medium", "high"]),
      "none"
    ),
    list: types.maybe(types.late(() => types.reference(ListModel))),
    creator: types.maybe(types.late(() => types.reference(UserModel))),
    assignees: types.optional(
      types.array(types.late(() => types.reference(UserModel))),
      []
    ),
    status: types.late(() => types.reference(TaskStatusModel)),
    comments: types.optional(
      types.array(types.late(() => types.reference(CommentModel))),
      []
    ),
    timeEstimate: types.maybe(types.number),
    dueDate: types.maybe(types.Date),
    createdAt: types.maybe(types.Date),
    updatedAt: types.maybe(types.Date),
  })
  .actions((self) => ({
    assignUser(userId: string) {
      const user = getRoot<RootStore>(self).user.findById(userId);
      if (user) {
        self.assignees.push(user);
      }
    },
    removeAssignedUser(userId: string) {
      return self.assignees.replace(
        self.assignees.filter((item) => item.id !== userId)
      );
    },
  }))
  .views((self) => ({
    get subTasks(): Task[] {
      return getRoot<RootStore>(self).task.items.filter(
        (task) => task.parent?.id === self.id
      );
    },
    get timeTracked(): number {
      const timeLog = getRoot<RootStore>(self).timeLog;
      return timeLog.taskDuration(self.id);
    },
  }));

type TaskType = Instance<typeof TaskModel>;
export interface Task extends TaskType {}
type TaskSnapshotType = SnapshotOut<typeof TaskModel>;
export type TaskSnapshot = TaskSnapshotType;
