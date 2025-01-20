// import { NextResponse } from "next/server";

// function middleware(request) {
//   const token = request.cookies.get("accessToken"); // Get the token from the cookies

//   // Check if the token is present
//   if (token) {
//     console.log(token, "this is header token");

//     // localStorage.setItem("token", token);
//     // Redirect to dashboard if token is found
//     return NextResponse.redirect(new URL("/dashboard", request.url));
//   } else {
//     // Redirect to login page if no token is found
//     return NextResponse.redirect(new URL("/", request.url));
//   }
// }

// export const config = {
//   matcher: "/",
//   matcher: "/dashboard", // You can customize the path matcher as per your requirement
// };

// export default middleware;
