import { getAuth } from "@/lib/auth/server";

const getHandlers = () => getAuth().handler();
type AuthRouteContext = { params: Promise<{ path: string[] }> };

export const GET = (request: Request, context: AuthRouteContext) => getHandlers().GET(request, context);
export const POST = (request: Request, context: AuthRouteContext) => getHandlers().POST(request, context);
export const PUT = (request: Request, context: AuthRouteContext) => getHandlers().PUT(request, context);
export const PATCH = (request: Request, context: AuthRouteContext) => getHandlers().PATCH(request, context);
export const DELETE = (request: Request, context: AuthRouteContext) => getHandlers().DELETE(request, context);
