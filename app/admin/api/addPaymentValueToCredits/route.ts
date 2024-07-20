export const POST = async (req: Request) => {
  const { credits, userId } = await req.json();

  console.log({ credits, userId });
  
  return new Response(JSON.stringify({ credits }));
};
