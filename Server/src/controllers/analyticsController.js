import { Comment } from "../models/commentSchema.js";
import { Post } from "../models/postSchema.js";
import { User } from "../models/user.js";

export const getMyAnalytics = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const now = new Date();
    const weekStart = new Date(now);
    weekStart.setDate(now.getDate() - 7);
    const monthStart = new Date(now);
    monthStart.setDate(now.getDate() - 30);

    const [
      user,
      posts,
      doubtsSolved,
      acceptedAnswers,
      likesReceived,
      comments,
      weekly,
      monthly,
    ] = await Promise.all([
      User.findById(userId)
        .select(
          "reputation currentStreak longestStreak followers following post comment",
        )
        .lean(),
      Post.countDocuments({ author: userId }),
      Post.countDocuments({ author: userId, status: "doubt", solved: true }),
      Post.countDocuments({
        acceptedAnswer: {
          $in: await Comment.find({ author: userId }).distinct("_id"),
        },
      }),
      Post.aggregate([
        { $match: { author: userId } },
        { $project: { likes: { $size: { $ifNull: ["$likes", []] } } } },
        { $group: { _id: null, total: { $sum: "$likes" } } },
      ]),
      Comment.countDocuments({ author: userId }),
      Post.countDocuments({ author: userId, createdAt: { $gte: weekStart } }),
      Post.countDocuments({ author: userId, createdAt: { $gte: monthStart } }),
    ]);

    return res.status(200).json({
      success: true,
      data: {
        doubtsAsked: await Post.countDocuments({
          author: userId,
          status: "doubt",
        }),
        doubtsSolved,
        acceptedAnswers,
        posts,
        comments,
        likesReceived: likesReceived[0]?.total || 0,
        followers: user?.followers?.length || 0,
        following: user?.following?.length || 0,
        reputation: user?.reputation || 0,
        currentStreak: user?.currentStreak || 0,
        longestStreak: user?.longestStreak || 0,
        activity: { last7Days: weekly, last30Days: monthly },
      },
    });
  } catch (error) {
    return next(error);
  }
};
