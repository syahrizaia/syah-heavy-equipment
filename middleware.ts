import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll().map(({ name, value }) => ({ name, value }));
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            request.cookies.set({ name, value, ...options })
          );
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set({ name, value, ...options })
          );
        },
      },
    }
  );

  const { data: { user } } = await supabase.auth.getUser();

  const protectedRoutes = ['/dashboard', '/fleet-management', '/spare-part-management', '/site-project', '/account', '/sign-up'];

  const isProtectedRoute = protectedRoutes.some(route => 
    request.nextUrl.pathname.startsWith(route)
  );

  if (isProtectedRoute && !user) {
    // Alihkan (redirect) paksa ke halaman login
    const url = request.nextUrl.clone();
    url.pathname = '/sign-in'; // Ganti dengan rute halaman login Anda
    
    // Opsional: Simpan rute asal agar setelah login bisa langsung diarahkan kembali ke /dashboard
    url.searchParams.set('next', request.nextUrl.pathname); 
    
    return NextResponse.redirect(url);
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Batasi middleware agar TIDAK berjalan di rute:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     * - Semua file dengan ekstensi (e.g., .svg, .png, .jpg)
     */
    "/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
    "/dashboard/:path*",
    "/fleet-management/:path*",
    "/spare-part-management/:path*",
    "/site-project/:path*",
    "/account/:path*",
    "/sign-up/:path*",
  ],
};