type AuthentificationFormProps = {
    children: React.ReactElement;
    title: string;
};

export default function SettingForm(props: AuthentificationFormProps) {
    const { children, title } = props;
    return (
        <>
            <div className="items-center">
                <section className="">
                    <div className="text-3xl px-10 py-10 tablet:bg-white tablet:rounded-3xl tablet:shadow-2xl space-y-10">
                        <h1 className="text-3xl tablet:text-4xl text-blue-500 text-center">
                            {title}
                        </h1>
                        {children}
                        
                    </div>
                </section>
            </div>
        </>
    );
}
