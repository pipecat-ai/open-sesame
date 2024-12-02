import SignInForm from "@/app/(auth)/sign-in/SignInForm";
import Logo from "@/components/svg/Logo";

const drops = [0, 1, 2, 3];

export default function SignInPage() {
  return (
    <div className="h-dvh w-dvw md:grid md:grid-cols-2">
      <div className="bg-foreground flex items-start justify-start p-8">
        <div className="bg-primary brightness-95 aspect-square grid grid-cols-3 grid-rows-3 gap-2 rounded-lg p-4">
          {drops.map((k) => (
            <Logo key={k} className="block text-background rotate-12 w-5 h-5" />
          ))}
          <Logo className="block text-primary brightness-125 -rotate-12 w-5 h-5" />
          {drops.map((k) => (
            <Logo key={drops.length + k} className="block text-background rotate-12 w-5 h-5" />
          ))}
        </div>
      </div>
      <div className="bg-background flex items-center justify-center p-8 overflow-hidden">
        <SignInForm />
      </div>
    </div>
  );
}
