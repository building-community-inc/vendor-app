export const POST = async (red: Request) => {
  return Response.json({
    status: 405,
    body: { message: "Method not allowed" },
  });
};
