import { Instance, SnapshotOut, types } from "mobx-state-tree";
import { randomId } from "../../utils/basic";
import { UserModel, UserSnapshot } from "./UserModel";

export const UserStoreModel = types.model("UserStore", {
  items: types.optional(types.array(UserModel), [])
})
  .actions(self => ({
    add(item: UserSnapshot) {
      self.items.push({ ...item, id: randomId() });
    },
    remove(id: string) {
     self.items.replace(self.items.filter(item => item.id !== id));
    },
    findById(id: string) {
      return self.items.find(item => item.id === id);
    }
  }));

type UserStoreType = Instance<typeof UserModel>;
export interface UserStore extends UserStoreType { }
type UserStoreSnapshotType = SnapshotOut<typeof UserModel>;
export type UserStoreSnapshot = UserStoreSnapshotType;