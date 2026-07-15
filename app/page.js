import SignIn from "./(components)/auth/signIn";

export default function Home() {
    return (
        <div style={{ backgroundImage: "url('/assets/images/login_bg_3.jpeg')", backgroundSize: "cover", minHeight: '100vh', width: '100%' }}>
            <SignIn />
        </div>
    );
}
