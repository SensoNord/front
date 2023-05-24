type AuthentificationFormProps = {
    children: React.ReactElement;
    title: string;
    description: string;
    information?: string;
};

export default function AuthentificationForm(props: AuthentificationFormProps) {
    const { children, title, description, information } = props;
    return (
        <>
            <div className="min-h-screen flex">
                <section className="littlelaptop:w-1/3 littlelaptop:flex littlelaptop:flex-none bg-gradient-to-r from-blue-400 to-blue-800 items-center justify-center hidden">
                    <img src="/logo.svg" alt="logo" className="w-1/2 h-auto" />
                </section>
                <section className="littlelaptop:w-2/3 w-full flex tablet:bg-blue-100 bg-blue-50 items-center justify-center">
                    <div className="py-12 px-10 tablet:bg-white tablet:rounded-3xl tablet:shadow-2xl text-center">
                        <h1 className="text-3xl tablet:text-4xl text-blue-500 mb-3">{title}</h1>
                        <p className="text-base tablet:text-xl mb-3">{description}</p>
                        <p className="text-sm tablet:text-base text-gray-500 mb-5 tablet:mb-10">{information}</p>
                        {children}
                    </div>
                </section>
            </div>
        </>
    );
}
