import { defineSchema, defineTable } from "convex/server";
import { authTables } from "@convex-dev/auth/server";
import { v } from "convex/values";

export default defineSchema({
  ...authTables,
  questions: defineTable({
    char: v.string(), // あ
    romaji: v.string(), // a
    group: v.optional(v.string()), // a
    category: v.string(), // main
    set: v.id("sets"), // "setId1"
    answer: v.array(v.string()), // ["a", "A"]
    meaning: v.optional(v.string()),
    mode: v.union(v.literal("normal"), v.literal("selection")),
  })
    .index("by_set", ["set"])
    .index("by_category", ["category"]),
  sets: defineTable({
    name: v.string(), // "Hiragana"
    description: v.optional(v.string()), // "Hiragana characters"
    questions: v.array(v.id("questions")), // ["questionId1", "questionId2"]
  }),
});
