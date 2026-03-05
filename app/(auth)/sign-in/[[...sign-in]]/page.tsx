import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
    return (
        <main className="min-h-screen flex items-center justify-center p-4">
            <div className="w-full max-w-sm space-y-6">
                <div className="space-y-1 text-center">
                    <h1 className="text-2xl font-semibold">Sign in to Distill</h1>
                    <p className="text-gray-600 text-sm">
                        We&apos;ll send you a link — no password needed.
                    </p>
                </div>
                <SignIn
                    appearance={{
                        elements: {
                            rootBox: "w-full",
                            cardBox: "shadow-none w-full",
                            card: "shadow-none p-0 w-full",
                        },
                    }}
                />
            </div>
        </main>
    );
}
