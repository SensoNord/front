type AuthentificationFormProps = {
    children: React.ReactElement;
    title: string;
    description?: string;
};

export default function SettingForm(props: AuthentificationFormProps) {
    const { children, title, description } = props;
    return (
        <>
            <div className="min-h-screen flex">
                <section className="">
                    <div className="py-12 px-10 tablet:bg-white tablet:rounded-3xl tablet:shadow-2xl text-center">
                        <h1 className="text-3xl tablet:text-4xl text-blue-500 mb-3">{title}</h1>
                        <p className="text-base tablet:text-xl mb-3">{description}</p>
                        {children}
                    </div>
                </section>
            </div>
        </>
    );
}
