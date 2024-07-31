import dbconnect from "@/db/dbconnect";
import Todo from "@/models/Todo";
import { NextApiRequest } from "next";

export async function GET(
    req: NextApiRequest
) {
    await dbconnect();
    try {

        const result = await Todo.find({}).sort({createdAt: -1 });

        if (result) {
            return Response.json({
                success: true,
                message: "Todo deleted successfully",
                data: result
            });
        }

        return Response.json({
            success: false,
            message: "Failed to delete todo"
        });

    } catch (error) {
        return Response
            .json({
                success: false,
                message: error
            })
    }
}