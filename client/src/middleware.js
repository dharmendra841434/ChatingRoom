import { NextResponse } from "next/server";

function middleware(request) {
  const token = request.cookies.get("accessToken"); // Get the token from the cookies

  const { pathname } = request.nextUrl; // Get the current pathname

  // If the user is already on the dashboard and has a token, allow access
  if (pathname === "/dashboard" && token) {
    return NextResponse.next(); // Proceed to dashboard if token exists
  }

  // If the user is already on the homepage and doesn't have a token, allow access
  if (pathname === "/" && !token) {
    return NextResponse.next(); // Proceed to homepage if no token
  }

  // Redirect to dashboard if the token exists but the user is not on dashboard
  if (token && pathname !== "/dashboard") {
    console.log("Token found, redirecting to /dashboard");
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // Redirect to login page ("/") if no token is found and the user is not already on "/" page
  if (!token && pathname !== "/") {
    console.log("Token not found, redirecting to /");
    return NextResponse.redirect(new URL("/", request.url));
  }

  // Allow normal flow if none of the conditions match
  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/dashboard"], // Apply middleware to these paths
};

export default middleware;
