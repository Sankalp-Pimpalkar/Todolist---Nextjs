import dbconnect from "@/db/dbconnect";
import Todo from "@/models/Todo";

export async function POST(
    req: Request
) {
    await dbconnect();

    try {

        const { todo } = await req.json();
        if (!todo) {
            return Response.json({
                success: false,
                message: "Todo field is required"
            });
        }

        const result = await Todo.create({ todo, completed: false });

        if (result) {
            return Response.json({
                success: true,
                message: "Todo added successfully",
                data: result
            });
        }

        return Response.json({
            success: false,
            message: "Failed to add todo"
        });

    } catch (error) {
        return Response
            .json({
                success: false,
                message: error
            })
    }
}