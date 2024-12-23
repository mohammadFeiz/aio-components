import H3H5H5 from "./h3h5h5"
import { I_pair } from "./types"

const getAllTopics = (getPair:(id:string)=>I_pair)=>{
    return [
        {
            title: 'would', id: 'would',
            content: (
                <>
                    <H3H5H5 title={'درخواست ادبی'} pair={getPair('549363487')} />
                    <H3H5H5 title='برای نشان دادن یک شرط و نتیجه‌ی آن در گذشته یا حال استفاده می‌شود. در اینجا گذشته' pair={getPair('119580609')} />
                    <H3H5H5 title='برای نشان دادن یک شرط و نتیجه‌ی آن در گذشته یا حال استفاده می‌شود. در اینجا حال' pair={getPair('485460355')} />
                    <H3H5H5 title='برای بیان عادت‌ها یا رفتارهای معمول در گذشته استفاده می‌شود.' pair={getPair('467336692')} />
                    <H3H5H5 title='برای بیان آینده از منظر گذشته' pair={getPair('443509780')} />
                    <H3H5H5 title='برای پیشنهاد دادن یا ابراز تمایل' pair={getPair('495867345')} />
                    <H3H5H5 title='برای بیان نظر شخصی یا واکنش' pair={getPair('448795547')} />
    
                </>
            )
        },
        {
            title: 'have,has,had', id: 'have,has,had',
            content: (
                <>
                    <H3H5H5 title='حال کامل (Have or has)' pair={getPair('112980098')} />
                    <H3H5H5 title='حال کامل استمراری (Have or has)' pair={getPair('559855687')} />
                    <H3H5H5 title='گذشته کامل (had)' pair={getPair('897786778')} />
                    <H3H5H5 title='گذشته کامل استمراری (had)' pair={getPair('447866700')} />
                    <H3H5H5 title='فعال کمکی + have + گذشته‌ی participle' pair={getPair('888876567')} />
                </>
            )
        },
        {
            title: 'got to', id: 'got to',
            content: (
                <>
                    <H3H5H5 title='مثال' pair={getPair('776123090')} />
                    <H3H5H5 title='مثال' pair={getPair('235324576')} />
                    <H3H5H5 title='مثال' pair={getPair('734534223')} />
                    <H3H5H5 title='مثال' pair={getPair('875453475')} />
                    <H3H5H5 title='مثال' pair={getPair('784523554')} />
                </>
            )
        },
        {
            title:'going to',id:'goping to',
            
        }
    ]
}
export default getAllTopics