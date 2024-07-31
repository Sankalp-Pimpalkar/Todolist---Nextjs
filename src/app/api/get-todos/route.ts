import dbconnect from "@/db/dbconnect";
import Todo from "@/models/Todo";
import { NextApiResponse } from "next";

export async function GET(
    req: Request,
    res: NextApiResponse
) {
    await dbconnect();
    try {
        const result = await Todo.find({}).sort({ createdAt: -1 });

        if (result) {
            return Response.json({
                success: true,
                message: "Todos fetched successfully",
                data: result
            });
        }

        res.setHeader('Cache-Control', 'no-store')
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