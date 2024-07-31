import dbconnect from "@/db/dbconnect";
import Todo from "@/models/Todo";

export async function PATCH(
    req: Request
) {
    await dbconnect();
    try {

        const { todo_id, updatedTodo } = await req.json();

        const result = await Todo.findByIdAndUpdate(
            todo_id,
            {
                $set: { ...updatedTodo }
            }
        )

        if (!result) {
            return Response.json({
                success: false,
                message: "Failed to update todo"
            });
        }

        return Response.json({
            success: true,
            message: "Todo updated successfully"
        });

    } catch (error) {
        console.log(error)
        return Response
            .json({
                success: false,
                message: error
            })
    }
}