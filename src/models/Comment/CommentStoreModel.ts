import { types } from "mobx-state-tree";
import { CommentModel } from "./CommentModel";

export const CommentStoreModel = types.model("CommentStore", {
    items: types.optional(types.array(CommentModel), [])
})
