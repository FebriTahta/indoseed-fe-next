import SignIn from "./(components)/auth/signIn";

export default function Home() {
    return (
        <div style={{ backgroundColor: '#013B21', minHeight: '100vh', width: '100%' }}>
            <SignIn />
        </div>
    );
}
