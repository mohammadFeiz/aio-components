let products = [
    {
        id:'123432',
        name:'تیشرت مردانه پوما',
        price:180000,
        discountpercent:10,
        description:'جنس نخی . آستین کوتاه',
        review:'تیشرت مردانه پوما تهیه شده از بهتری نوع نخ یکی از محصولات جدید شرکت میباشد که سالها به عنوان یکی از محصولات پر فروش در دسته پوشاک آقایان قرار دارد. خاصیت حفظ رنگ و عدم پرز دهی از ویژگی های منحصر به فرد این محصول می باشد.',
        optionTypes: [
            {
                name: 'رنگ', id: 'color',
                iconKey: { 'white': 'white', 'black': 'black', 'grey': 'grey' },
                optionValues: [
                    { name: 'زرد', id: 'yellow' },
                    { name: 'سفید', id: 'white' },
                    { name: 'خاکستری', id: 'grey' },
                ]
            },
            {
                name: 'سایز', id: 'size',
                iconKey: 'size',
                optionValues: [
                    { name: 'L', id: 'l' },
                    { name: 'M', id: 'm' },
                    { name: 'S', id: 's' },
                ]
            }
        ],
        defaultVariantId: '9535463',
        variants: [
            {
                id: '512634', inStock: 25, max: 10, min: 5, step: 5, discountPercent: 0, key: 'white_s',
                image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcToQkJOyFHrb4mtWO00ND15iJYoVwriOxWc8Mh1qXcFVvBtFLb0tDWqJprd3NAijkm9Ink&amp;usqp=CAU',
                details: [['رنگ', 'سفید'], ['سایز', 's']], isDefault: true
            },
            {
                id: '674473', inStock: 12, rate: 2.1,
                image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcToQkJOyFHrb4mtWO00ND15iJYoVwriOxWc8Mh1qXcFVvBtFLb0tDWqJprd3NAijkm9Ink&amp;usqp=CAU',
                details: [['رنگ', 'سفید']], key: 'white_m'
            },
            { id: '9535463', inStock: 1, discountPercent: 15, key: 'grey_l', max: 2 }
        ],
    }
]
export default products