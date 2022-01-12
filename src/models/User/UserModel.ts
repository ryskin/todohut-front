import { Instance, SnapshotOut, types } from "mobx-state-tree";

export const UserModel = types
  .model("User", {
    id: types.identifier,
    nick: types.string,
    firstName: types.maybe(types.string),
    lastName: types.maybe(types.string),
    email: types.string,
    createdAt: types.maybe(types.Date),
    updatedAt: types.maybe(types.Date),
  })
  .views((self) => ({
    get name() {
      if (!self.firstName && !self.lastName) return self.nick;
      return `${self.firstName} ${self.lastName}`;
    },
    get initials() {
      if (!self.firstName && !self.lastName) return self.nick;
      return `${self.firstName?.charAt(0)}${self.lastName?.charAt(0)}`;
    },
  }))
  .actions((self) => ({}));

type UserType = Instance<typeof UserModel>;
export interface User extends UserType {}
type UserSnapshotType = SnapshotOut<typeof UserModel>;
export type UserSnapshot = UserSnapshotType;
