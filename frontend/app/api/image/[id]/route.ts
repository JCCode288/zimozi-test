import { type NextRequest, NextResponse } from "next/server";

export async function GET(
   request: NextRequest,
   { params }: { params: Promise<{ id: string }> }
) {
   const id = (await params).id;

   try {
      // Get the token from the request headers or cookies if needed
      const token = request.headers.get("authorization")?.split(" ")[1];

      // Fetch the image from your backend
      const response = await fetch(`${process.env.BE_URL}/images/${id}`, {
         headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      });

      if (!response.ok) {
         return new NextResponse(null, {
            status: response.status,
            statusText: response.statusText,
         });
      }

      // Get the image data and content type
      const imageBuffer = await response.arrayBuffer();
      const contentType =
         response.headers.get("content-type") || "image/jpeg";

      // Return the image with the correct content type
      return new NextResponse(imageBuffer, {
         headers: {
            "Content-Type": contentType,
            "Cache-Control": "public, max-age=86400", // Cache for 24 hours
         },
      });
   } catch (error) {
      console.error(`Error fetching image with ID ${id}:`, error);
      return new NextResponse(null, { status: 500 });
   }
}
