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
import { TimeLog } from "../TimeLog/TimeLogModel";

export const TaskModel = types
  .model("TaskStore", {
    id: types.identifier,
    parent: types.maybe(
      types.safeReference(types.late((): IAnyModelType => TaskModel))
    ),
    name: types.string,
    description: types.maybe(types.string),
    priority: types.optional(
      types.enumeration("Priority", [
        "none",
        "low",
        "medium",
        "high",
        "urgent",
      ]),
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
    timeEstimate: types.maybeNull(types.number),
    budget: types.maybeNull(types.number),
    startDate: types.maybeNull(types.Date),
    dueDate: types.maybe(types.Date),
    createdAt: types.maybe(types.Date),
    updatedAt: types.maybe(types.Date),
  })
  .actions((self) => ({
    addTimeEstimate(seconds: number) {
      self.timeEstimate = seconds;
    },
    assignUser(userId: string) {
      const user = getRoot<RootStore>(self).user.findById(userId);
      if (user) {
        if (self.assignees.includes(user)) return false;
        self.assignees.push(user);
        return self.assignees;
      }
    },
    changeStatus(statusId: string) {
      const statusInstance =
        getRoot<RootStore>(self).taskStatus.findById(statusId);
      if (statusInstance) {
        self.status = statusInstance;
        return self.status;
      }
    },
    setBudget(budget: number) {
      self.budget = budget;
    },
    setDescription(description: string) {
      self.description = description;
    },
    remove() {
      const timeLogStore = getRoot<RootStore>(self).timeLog;
      const timeLogs = timeLogStore.items.filter((item) => item.task.id === self.id);
      if (timeLogs) {
        timeLogs.forEach((item: TimeLog) => timeLogStore.remove(item.id));
      };
      getRoot<RootStore>(self).task.remove(self.id);
    },
    setPriority(status: typeof self["priority"]) {
      console.log(status);
      self.priority = status;
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
    get hasParent(): boolean {
      return Boolean(self.parent);
    },
    get spendTime(): number {
      const timeLogs = getRoot<RootStore>(self).timeLog.items.filter(
        (timeLog) => timeLog.task.id === self.id
      );
      return timeLogs.reduce((acc, timeLog) => {
        return acc + timeLog.duration;
      }
      , 0) / 1000;
    },
    get timeTracked(): number {
      const timeLog = getRoot<RootStore>(self).timeLog;
      return timeLog.taskDuration(self.id);
    },
    get spendMoney(): number {
      const timeLogs = getRoot<RootStore>(self).timeLog.items.filter(
        (timeLog) => timeLog.task.id === self.id
      );
      return timeLogs.reduce((acc, timeLog) => {
        return acc + timeLog.price;
      }
      , 0) / 1000;
    }
  }));

type TaskType = Instance<typeof TaskModel>;
export interface Task extends TaskType {}
type TaskSnapshotType = SnapshotOut<typeof TaskModel>;
export type TaskSnapshot = TaskSnapshotType;
