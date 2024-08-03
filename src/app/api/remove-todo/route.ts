import dbconnect from "@/db/dbconnect";
import Todo from "@/models/Todo";

export async function DELETE(
    req: Request
) {
    await dbconnect();
    try {

        const { todo_id } = await req.json();

        const result = await Todo.findByIdAndDelete(todo_id);

        if (!result) {
            return Response.json({
                success: false,
                message: "Failed to delete todo"
            });
        }

        return Response.json({
            success: true,
            message: "Todo deleted successfully",
            data: result
        });

    } catch (error) {
        return Response
            .json({
                success: false,
                message: error
            })
    }
}