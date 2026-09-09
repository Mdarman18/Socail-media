import { Community } from "../models/community.js";
import { Post } from "../models/postSchema.js";
import { User } from "../models/user.js";

const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

export const searchContent = async (req, res, next) => {
  try {
    const query = req.query.q?.trim();
    if (!query) {
      return res.status(200).json({
        success: true,
        data: { users: [], posts: [], communities: [] },
        pagination: { page: 1, limit: 20, total: 0, hasMore: false },
      });
    }

    const page = Math.max(Number.parseInt(req.query.page, 10) || 1, 1);
    const limit = Math.min(
      Math.max(Number.parseInt(req.query.limit, 10) || 20, 1),
      50,
    );
    const expression = new RegExp(escapeRegex(query), "i");
    const type = req.query.type || "all";
    const subject = req.query.subject?.trim();
    const solved = req.query.solved;
    const postFilter = {
      $or: [
        { caption: expression },
        { description: expression },
        { questionTitle: expression },
        { questionExplanation: expression },
        { tags: expression },
      ],
      ...(subject ? { subject } : {}),
      ...(solved === "true" || solved === "false"
        ? { status: "doubt", solved: solved === "true" }
        : {}),
    };

    const shouldSearch = (target) => type === "all" || type === target;
    const [users, posts, communities, userTotal, postTotal, communityTotal] =
      await Promise.all([
        shouldSearch("users")
          ? User.find({
              $or: [
                { username: expression },
                { bio: expression },
                { skills: expression },
              ],
            })
              .select("username img bio reputation")
              .sort({ reputation: -1 })
              .skip((page - 1) * limit)
              .limit(limit)
              .lean()
          : [],
        shouldSearch("posts") || shouldSearch("doubts")
          ? Post.find(
              shouldSearch("doubts") && type !== "all"
                ? { ...postFilter, status: "doubt" }
                : postFilter,
            )
              .select(
                "status caption description questionTitle subject tags img author solved acceptedAnswer createdAt likes comment",
              )
              .populate("author", "username img")
              .sort({ createdAt: -1 })
              .skip((page - 1) * limit)
              .limit(limit)
              .lean()
          : [],
        shouldSearch("communities")
          ? Community.find({
              $or: [
                { name: expression },
                { description: expression },
                { tags: expression },
              ],
            })
              .select("name description img category tags creator members")
              .populate("creator", "username img")
              .sort({ createdAt: -1 })
              .skip((page - 1) * limit)
              .limit(limit)
              .lean()
          : [],
        shouldSearch("users")
          ? User.countDocuments({
              $or: [
                { username: expression },
                { bio: expression },
                { skills: expression },
              ],
            })
          : 0,
        shouldSearch("posts") || shouldSearch("doubts")
          ? Post.countDocuments(
              shouldSearch("doubts") && type !== "all"
                ? { ...postFilter, status: "doubt" }
                : postFilter,
            )
          : 0,
        shouldSearch("communities")
          ? Community.countDocuments({
              $or: [
                { name: expression },
                { description: expression },
                { tags: expression },
              ],
            })
          : 0,
      ]);

    const total = userTotal + postTotal + communityTotal;
    return res.status(200).json({
      success: true,
      data: { users, posts, communities },
      pagination: { page, limit, total, hasMore: page * limit < total },
    });
  } catch (error) {
    return next(error);
  }
};
