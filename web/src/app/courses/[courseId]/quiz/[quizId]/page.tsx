import QuizTakingUI from "@/components/quiz/QuizTakingUI";

export default async function QuizPage({
    params,
}: {
    params: Promise<{ courseId: string; quizId: string }>;
}) {
    const { courseId, quizId } = await params;

    return (
        <QuizTakingUI
            courseId={courseId}
            quizId={quizId}
            basePath={`/courses/${courseId}`}
        />
    );
}