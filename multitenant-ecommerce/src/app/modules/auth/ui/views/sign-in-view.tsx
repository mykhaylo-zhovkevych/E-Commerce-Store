export const SignInView = () => {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-5">
            <div className="bg-[#dedede] h-screen w-full lg:col-span-3 overflow-y-auto">
                Form column
            </div>
            <div className="h-screen w-full lg:col-span-2 hidden lg:block"
                 style={{
                     backgroundImage: "url('/auth-bg.png')",
                     backgroundSize: "cover",
                     backgroundPosition: "center",
                 }}
            />
            {/*Background column*/}
        </div>
    );
};
