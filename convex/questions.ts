import { v } from "convex/values";
import { query } from "./_generated/server";

export const get = query({
  args: {
    set: v.optional(v.id("sets")),
  },
  handler: async (ctx, args) => {
    let q = ctx.db.query("questions");
    if (args.set) {
      q = q.filter((q) => q.eq(q.field("set"), args.set));
    }
    const questions = await q.collect();
    return questions;
  },
});
