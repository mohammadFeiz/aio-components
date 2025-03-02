import { FC } from "react"
import DOC from "../../resuse-components/Doc"
import { Code } from "../../npm/aio-component-utils"

const DOC_Next: FC = (props: any) => {
    return (
        <DOC
            name={props.name} goToHome={props.goToHome}
            items={[
                { text: 'send props', value: 'send props', render: () => <SendProps /> },
                
            ]}
        />
    )
}
export default DOC_Next

const SendProps:FC = ()=>{
    return (
        <div className="example">
            <h3>می‌توانید اطلاعات user را به‌عنوان query parameters ارسال کنید:</h3>
            {
                Code(`
const user = {
    id: '12',
    name: 'mohammad feiz'
};
<Link href={${'`/dashboard/month?id=${user.id}&name=${encodeURIComponent(user.name)}`'}}>
    ماه
</Link>
                `)
            }
            <h3>دریافت مقدار در /dashboard/month:</h3>
            {
                Code(`
const Month = () => {
    const router = useRouter();
    const { id, name } = router.query;
    return (
        ...
    );
};
                `)
            }
            <h3>می‌توانید از useRouter و router.push استفاده کنید</h3>
            {
                Code(`
const goToMonth = () => {
    router.push({
        pathname: "/dashboard/month",
        query: user, // ارسال داده در query (بدون نمایش در URL)
    });
};
<button onClick={goToMonth}>ماه</button>    
                `)
            }
            <h3>دریافت مقدار در /dashboard/month:</h3>
            {
                Code(`
const Month = () => {
    const router = useRouter();
    const { id, name } = router.query; // دریافت مقادیر از query

    return (
        ...
    );
};
                    `)
            }
        </div>
    )
}