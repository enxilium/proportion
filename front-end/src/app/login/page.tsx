import { auth0 } from "@/lib/auth0";
import { redirect } from "next/navigation";

export default async function LoginPage() {
  const session = await auth0.getSession();

  if (session) {
    redirect("/home");
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#eb8d62] to-[#c76d4c] [animation:fadeIn_0.5s_ease-in]">
      <div className="max-w-md w-full space-y-8 p-8 bg-[#4d2e1f] rounded-lg shadow-xl transition-all duration-300 hover:shadow-2xl hover:shadow-amber-500/30">
        <div className="text-center">
          <h2 className="mt-6 text-4xl font-bold text-white transition-colors duration-300 font-['Caveat']">
            Welcome to Proportion
          </h2>
          <p className="mt-2 text-sm text-white/80 transition-colors duration-300">
            Please sign in to your account or create a new one
          </p>
        </div>

        <div className="mt-8 space-y-4">
          <a href="/auth/login?screen_hint=signup" className="w-full block transition-transform duration-200 hover:scale-[1.02]">
            <button className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-amber-600 hover:bg-amber-700 transition-colors duration-300">
              Sign up
            </button>
          </a>
          <a href="/auth/login" className="w-full block transition-transform duration-200 hover:scale-[1.02]">
            <button className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-amber-500 hover:bg-amber-600 transition-colors duration-300">
              Log in
            </button>
          </a>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}} />
    </div>
  );
}
