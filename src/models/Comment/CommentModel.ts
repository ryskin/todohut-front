import { types } from "mobx-state-tree";
import { UserModel } from "../User/UserModel";

export const CommentModel = types.model("Comment", {
    id: types.identifier,
    text: types.string,
    user: types.reference(types.late(() => types.reference(UserModel))),
    createdAt: types.Date,
    updatedAt: types.Date,
});