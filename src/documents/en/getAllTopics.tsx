import H3H5H5 from "./h3h5h5"
import Notice from "./notice"
import { I_pair, I_topic } from "./types"

const getAllTopics = (getPair: (id: string) => I_pair): I_topic[] => {
    return [
        {
            title: 'would', id: 'would',
            content: (
                <>
                    <H3H5H5 title={'درخواست ادبی'} pairId='549363487' />
                    <H3H5H5 title='برای نشان دادن یک شرط و نتیجه‌ی آن در گذشته یا حال استفاده می‌شود. در اینجا گذشته' pairId='119580609' />
                    <H3H5H5 title='برای نشان دادن یک شرط و نتیجه‌ی آن در گذشته یا حال استفاده می‌شود. در اینجا حال' pairId='485460355' />
                    <H3H5H5 title='برای بیان عادت‌ها یا رفتارهای معمول در گذشته استفاده می‌شود.' pairId='467336692' />
                    <H3H5H5 title='برای بیان آینده از منظر گذشته' pairId='443509780' />
                    <H3H5H5 title='برای پیشنهاد دادن یا ابراز تمایل' pairId='495867345' />
                    <H3H5H5 title='برای بیان نظر شخصی یا واکنش' pairId='448795547' />

                </>
            )
        },
        {
            title: 'have,has,had', id: 'have,has,had',
            content: (
                <>
                    <H3H5H5 title='حال کامل (Have or has)' pairId='112980098' />
                    <H3H5H5 title='حال کامل استمراری (Have or has)' pairId='559855687' />
                    <H3H5H5 title='گذشته کامل (had)' pairId='897786778' />
                    <H3H5H5 title='گذشته کامل استمراری (had)' pairId='447866700' />
                    <H3H5H5 title='فعال کمکی + have + گذشته‌ی participle' pairId='888876567' />
                </>
            )
        },
        {
            title: 'got to', id: 'got to',
            content: (
                <>
                    <H3H5H5 title='مثال' pairId='776123090' />
                    <H3H5H5 title='مثال' pairId='235324576' />
                    <H3H5H5 title='مثال' pairId='734534223' />
                    <H3H5H5 title='مثال' pairId='875453475' />
                    <H3H5H5 title='مثال' pairId='784523554' />
                </>
            )
        },
        {
            title: 'going to', id: 'goping to',
            content: (
                <>
                    <H3H5H5 title='برنامه‌ریزی برای آینده' pairId='554099374' desc='وقتی درباره چیزی صحبت می‌کنید که از قبل تصمیم گرفته‌اید انجام دهید' />
                    <H3H5H5 title='پیش‌بینی بر اساس شواهد' pairId='340007668' desc='وقتی چیزی را پیش‌ بینی می‌کنید که شواهدی برای آن وجود دارد' />
                    <H3H5H5 title='تصمیمات قطعی' pairId='553006112' desc='وقتی با اطمینان درباره تصمیماتتان صحبت می‌کنید' />
                    <H3H5H5 title='ساختار گرامری' desc="Subject + am/is/are + going to + verb (base form)" />
                    <H3H5H5 title='تفاوت Going to با Will' pairId='559899990' desc="Going to بیشتر برای برنامه‌ها و پیش‌بینی‌های مشخص و از پیش تعیین‌شده استفاده می‌شود اما Will بیشتر برای تصمیمات لحظه‌ای یا پیش‌بینی‌های کلی استفاده می‌شود" />
                    <H3H5H5 title='در مکالمات غیررسمی، معمولاً به صورت کوتاه و سریع gonna تلفظ می‌شود' desc='Im gonna go to the store' />
                </>
            )
        },
        {
            title: 'active,passive', id: 'active,passive',
            content: (
                <>
                    <H3H5H5 title='Active Voice' pairId='555777234' />
                    <H3H5H5 title='Passive Voice' pairId='111209567' />
                    <H3H5H5 title='Passive Voice' pairId='854634754' />
                    <H3H5H5 title='Passive Voice' pairId='864368534' />
                    <H3H5H5 title='Passive Voice' pairId='945372355' />
                    <H3H5H5 title='Passive Voice' pairId='998345555' />
                    <H3H5H5 title='Passive Voice' pairId='900006566' />
                    <H3H5H5 title='Passive Voice' pairId='502320990' />
                    <H3H5H5 title='Passive Voice' pairId='222323243' />
                </>
            )
        },
        {
            title: 'use to', id: 'use to',
            content: (
                <>
                    <Notice text={(
                        <>برای بیان <strong className="en-strong">عادات</strong>، <strong className="en-strong">وضعیت‌ها</strong> یا <strong className="en-strong">فعالیت‌ها</strong>یی که در <strong className="en-strong">گذشته</strong> اتفاق می‌افتادند ولی اکنون دیگر انجام نمی‌شوند</>
                    )} />
                    <Notice text={(
                        <><strong className="en-strong">Used to</strong> فقط برای <strong className="en-strong">گذشته</strong> به کار می‌رود. برای اشاره به چیزی که در <strong className="en-strong">حال حاضر</strong> اتفاق می‌افتد، از <strong className="en-strong">be used to</strong> استفاده کنید.</>
                    )} />
                    <H3H5H5 title='مثبت (Subject + used to + base verb)' pairId='347364245' />
                    <H3H5H5 title='منفی (Subject + didn’t use to + base verb)' pairId='383467342' />
                    <H3H5H5 title='سوالی (Did + subject + use to + base verb)' pairId='978897344' />
                    <H3H5H5 title='برای عادات گذشته' pairId='834463564' />
                    <H3H5H5 title='برای وضعیت‌های گذشته' pairId='795654345' />
                    <H3H5H5
                        title='be used to' pairId='468003346'
                        desc={(
                            <Notice
                                text={(<>
                                    <ul className="rtl">
                                        <li>"Used to" و "be used to" از نظر معنایی تفاوت دارند و باید آن‌ها را از هم تفکیک کرد</li>
                                        <li>"Used to" به چیزی اشاره دارد که در گذشته انجام می‌شد ولی اکنون دیگر انجام نمی‌شود</li>
                                        <li>"Used to" فقط برای گذشته به کار می‌رود. برای اشاره به چیزی که در حال حاضر اتفاق می‌افتد، از "be used to" استفاده کنید.</li>
                                        <li>Be used to" به این معنی است که شما به چیزی عادت کرده‌اید یا چیزی برای شما عادی شده است. در این حالت، از "be" به شکل‌های مختلف (am, is, are, was, were) استفاده می‌شود.</li>
                                    </ul>
                                </>)}
                            />
                        )}
                    />

                </>
            )
        },
        {
            title: 'had better', id: 'had better',
            content: (
                <>
                    <Notice
                        text={(
                            <>این عبارت برای دادن <strong className="en-strong">توصیه یا پیشنهاد قوی</strong> به کار می‌رود، به‌ویژه زمانی که می‌خواهید به کسی بگویید که کاری انجام دهد چون در غیر این صورت ممکن است <strong className="en-strong">پیامدهای منفی</strong> داشته باشد</>
                        )}
                    />
                    <H3H5H5 title='مثبت (Subject + had better + base verb)' pairId='467843222' />
                    <H3H5H5 title='مثبت (Subject + had better + base verb)' pairId='634125676' />
                    <H3H5H5 title='منفی (Subject + had better not + base verb)' pairId='888734555' />
                    <H3H5H5 title='منفی (Subject + had better not + base verb)' pairId='573785345' />
                    <H3H5H5 title='سوالی (Had + subject + better + base verb)' pairId='786357344' />
                </>
            )
        },
        {
            title: 'would rather', id: 'would rather',
            content: (
                <>
                    <Notice
                        text={(
                            <>این عبارت برای بیان <strong className="en-strong">ترجیحات یا انتخاب‌های فردی</strong> استفاده می‌شود و به معنای <strong className="en-strong">ترجیح می‌دهم</strong> یا <strong className="en-strong">مایل‌ترم</strong> است</>
                        )}
                    />
                    <H3H5H5 title='مثبت (Subject + would rather + base verb)' pairId='123348744' />
                    <H3H5H5 title='منفی (Subject + would rather not + base verb)' pairId='964573545' />
                    <H3H5H5 title='سوالی (Would + subject + rather + base verb)' pairId='975473322' />
                    <H3H5H5 title='than' pairId='897347323' />
                    <H3H5H5
                        title='تفاوت با prefer'
                        pairId='757347533'
                        desc={(
                            <>
                                <strong className="en-strong">Would rather</strong> بیشتر در <strong className="en-strong">موقعیت‌های خاص و تصمیم‌های فوری</strong> به کار می‌رود، در حالی که <strong className="en-strong">prefer</strong> برای بیان <strong className="en-strong">ترجیحات عمومی‌تر و درازمدت</strong> به کار می‌رود.
                            </>
                        )}
                    />
                </>
            )
        },
        {
            title: 'wish', id: 'wish',
            content: (<>
                <Notice
                    text={(<>
                        این عبارت برای بیان <strong className="en-strong">آرزوها یا درخواست‌های غیرواقعی یا غیرممکن</strong> در <strong className="en-strong">گذشته</strong>، <strong className="en-strong">حال</strong> یا <strong className="en-strong">آینده</strong> به کار می‌رود. ساختار استفاده از "wish" بسته به زمان و نوع آرزو متفاوت است
                    </>)}
                />
                <H3H5H5 title='آرزو برای حال (Subject + wish + past simple)' pairId='123502363' />
                <H3H5H5 title='آرزو برای گذشته (Subject + wish + past perfect)' pairId='899964343' />
                <H3H5H5 title='آرزو برای آینده (Subject + wish + would + base verb)' pairId='758656665' />

            </>)
        },
        {
            title: 'both, either, neither', id: 'both,either,neither',
            content: (<>
                <Notice text='اشاره به انتخاب‌ها و گروه‌های مختلف' />
                <Notice
                    text={(<>
                        <strong className="en-strong">Both</strong> همیشه برای اشاره به <strong className="en-strong">دو چیز یا فرد</strong> استفاده می‌شود.
                    </>)}
                />
                <Notice
                    text={(<>
                        در صورت استفاده از <strong className="en-strong">both of</strong> باید آن را همراه با <strong className="en-strong">the</strong> و اسم جمع بیاورید.
                    </>)}
                />
                <Notice
                    text={(<>
                        <strong className="en-strong">Either</strong> برای اشاره به <strong className="en-strong">یکی از دو گزینه</strong> یا انتخاب استفاده می‌شود. این واژه وقتی به کار می‌رود که بخواهید بگویید یکی از دو چیز درست است
                    </>)}
                />
                <Notice
                    text={(<>
                        <strong className="en-strong">Neither</strong> برای اشاره به این استفاده می‌شود که <strong className="en-strong">هیچ‌ یک</strong> از دو چیز یا نفر درست یا انتخاب‌شده نیستند
                    </>)}
                />
                <H3H5H5 title='Both + noun (plural)' pairId='895433245' />
                <H3H5H5
                    title='Both + of + the + plural noun' pairId='235586356'
                    desc={(<>
                        در صورت استفاده از <strong className="en-strong">both of</strong>, باید آن را همراه با <strong className="en-strong">the</strong> و اسم جمع بیاورید.
                    </>)}
                />
                <H3H5H5 title='Both + of + plural noun' pairId='686589900' />
                <H3H5H5 title='Either + singular noun' pairId='884637333' />
                <H3H5H5 title='Either + singular noun' pairId='586347355' />
                <H3H5H5 title='Either + of + the + plural noun' pairId='893864353'
                    desc={(<>
                        وقتی از <strong className="en-strong">either of</strong> استفاده می‌کنیم، بعد از آن باید <strong className="en-strong">اسم جمع</strong> بیاوریم
                    </>)}
                />
                <H3H5H5 title='Neither به عنوان یک کلمه مستقل' pairId='844394345'
                    desc={(<>
                        وقتی <strong className="en-strong">neither</strong> به <strong className="en-strong">یک اسم</strong> اشاره دارد، فعل مفرد استفاده می‌شود
                    </>)}
                />
                <H3H5H5 title='Neither همراه با nor' pairId='866734685' />
                <H3H5H5 title='مثال' pairId='863734322' />
                <H3H5H5 title='مثال' pairId='745237276' />
            </>)
        },
        {
            title: 'so,such', id: 'so,such',
            content: (<>
                <Notice
                    text={(<>
                        <strong className="en-strong">So</strong> برای تاکید روی <strong className="en-strong">صفت‌ها</strong> یا <strong className="en-strong">قیدها</strong> استفاده می‌شود و به معنای <strong className="en-strong">خیلی</strong> یا <strong className="en-strong">این‌قدر</strong> است.
                    </>)}
                />
                <H3H5H5 title='So + adjective/adverb' pairId='785377532' desc='شدت روی صفت (گرمی هوا)' />
                <H3H5H5 title='So + adjective + that clause' pairId='842363223' desc='شدت روی صفت (سریع)' />
                <Notice
                    text={(<>
                        <strong className="en-strong">Such</strong> برای تاکید روی <strong className="en-strong">اسم‌ها</strong> یا <strong className="en-strong">عبارت‌های اسمی</strong> استفاده می‌شود و به معنای <strong className="en-strong">چنین</strong> یا <strong className="en-strong">خیلی</strong> است.اگر قبل از اسم صفت باشد، از "a/an" بعد از "such" استفاده می‌کنیم. اگر اسم جمع یا غیرقابل‌شمارش باشد، "a/an" استفاده نمی‌کنیم
                    </>)}
                />
                <H3H5H5 title='Such + (adjective) + noun' pairId='832737373' desc='شدت روی اسم (روز)' />
                <H3H5H5 title='Such + (adjective) + noun + that clause' pairId='673648354' desc='شدت روی اسم (دوست خوب)' />
                <Notice
                    text={(<>
                        <table className="en-table" border={1}>
                            <thead><th>Such</th><th>So</th></thead>
                            <tbody>
                                <tr>
                                    <td>قبل از اسم یا عبارت اسمی استفاده می‌شود.</td>
                                    <td>قبل از صفت یا قید استفاده می‌شود.</td>
                                </tr>
                                <tr>
                                    <td>Such a beautiful day (یک روز خیلی زیبا)</td>
                                    <td>So beautiful (خیلی زیبا)</td>
                                </tr>
                                <tr>
                                    <td>همراه با صفت و اسم می‌آید.</td>
                                    <td>نمی‌تواند مستقیماً با اسم بیاید.	</td>
                                </tr>
                            </tbody>
                        </table>
                    </>)}
                />
                <Notice
                    text={(<>
                        <ul>
                            <li>He is such a good boy</li>
                            <li>that boy is so good</li>
                            <li>What a good boy he is!</li>
                            <li>He is a very good boy</li>
                        </ul>
                    </>)}
                />
            </>)
        },
        {
            title: 'Conditionals', id: 'Conditionals',
            content: (<>
                <H3H5H5 title='شرطی نوع صفر (If + Present Simple, Present Simple)' desc={(<>
                    <Notice
                        text={(<>
                            برای بیان حقایق کلی، قوانین علمی، یا شرایطی که <strong className="en-strong">همیشه درست</strong> هستند
                        </>)}
                    />
                </>)} pairId='934625678' />
                <H3H5H5 title='شرطی نوع اول (If + Present Simple, Will + Base Verb)' desc={(<>
                    <Notice
                        text={(<>
                            برای بیان شرایطی که در <strong className="en-strong">آینده</strong> ممکن است اتفاق بیفتد
                        </>)}
                    />
                </>)} pairId='863464746' />
                <H3H5H5 title='شرطی نوع دوم (If + Past Simple, Would + Base Verb)' desc={(<>
                    <Notice
                        text={(<>
                            برای بیان شرایط <strong className="en-strong">غیرممکن</strong> یا غیرواقعی در <strong className="en-strong">حال</strong> یا <strong className="en-strong">آینده</strong>
                        </>)}
                    />
                    <Notice
                        text={(<>
                            برای همه فاعل‌ها در شرطی دوم، از <strong className="en-strong">were</strong> استفاده می‌کنیم <strong className="en-strong">به جای was</strong>
                        </>)}
                    />
                </>)} pairId='942473333,893357357' />
                <H3H5H5 title='شرطی نوع سوم (If + Past Perfect, Would have + Past Participle)' desc={(<>
                    برای بیان شرایطی که در <strong className="en-strong">گذشته</strong> <strong className="en-strong">اتفاق نیفتاده‌اند</strong> و به همین دلیل <strong className="en-strong">نتیجه‌ای متفاوت رخ نداده</strong> است
                </>)} pairId='260542356' />
                <H3H5H5 title='نشان دادن تأثیر یک شرط گذشته روی حال (If + Past Perfect, Would + Base Verb)' desc={(<>
                    برای نشان دادن تأثیر یک شرط <strong className="en-strong">گذشته</strong> روی <strong className="en-strong">حال</strong>
                </>)} pairId='893452543' />
                <H3H5H5 title='نشان دادن تأثیر یک شرط حال روی گذشته (If + Past Simple, Would have + Past Participle)' desc={(<>
                    برای نشان دادن تأثیر یک شرط <strong className="en-strong">حال</strong> روی <strong className="en-strong">گذشته</strong>
                </>)} pairId='754357325' />
            </>)
        }
    ]
}
export default getAllTopics