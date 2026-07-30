import SignIn from "./(components)/auth/signIn";

export default function Home() {
    return (
        <div className="bg-[url('/assets/images/login_bg_3.jpeg')] bg-cover bg-right lg:bg-center min-h-screen w-full">
            <SignIn />
        </div>
    );
}
