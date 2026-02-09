import { PipelineStage, Types } from "mongoose";

export function getCourseProgressPipeline(courseId: string, userId: string): PipelineStage[] {
    return [
        {
            $lookup: {
                from: "coursemodules",
                localField: "module_id",
                foreignField: "_id",
                as: "module"
            }
        },
        {
            $unwind: {
                path: "$module",
                preserveNullAndEmptyArrays: true
            }
        },
        {
            $match: {
                "module.course_id": new Types.ObjectId(courseId)
            }
        },

        // 2. Lookup lesson progress for this user
        {
            $lookup: {
                from: "lessonprogresses",
                let: { lessonId: "$_id" },
                pipeline: [
                    {
                        $match: {
                            $expr: {
                                $and: [
                                    { $eq: ["$lesson_id", "$$lessonId"] },
                                    { $eq: ["$user_id", new Types.ObjectId(userId)] },
                                    { $eq: ["$is_completed", true] }
                                ]
                            }
                        }
                    }
                ],
                as: "progress"
            }
        },

        // 3. Group results
        {
            $group: {
                _id: null,
                totalLessons: { $sum: 1 },
                completedLessons: {
                    $sum: {
                        $cond: [{ $gt: [{ $size: "$progress" }, 0] }, 1, 0]
                    }
                }
            }
        }
    ];
}