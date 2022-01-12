import { types } from "mobx-state-tree";

export const ListModel = types.model("List", {
    id: types.identifier,
    name: types.string,
    description: types.maybe(types.string),
    createdAt: types.maybe(types.Date),
    updatedAt: types.maybe(types.Date),
});
