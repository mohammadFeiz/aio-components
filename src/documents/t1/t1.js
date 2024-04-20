import React, { useState, createContext, useContext } from 'react';
import RSA from './../../npm/react-super-app/react-super-app';
import AIOInput from './../../npm/aio-input/index.tsx';
import RVD, { renderCard, renderCards, renderCardsRow } from './../../npm/react-virtual-dom/react-virtual-dom';
import { Icon } from '@mdi/react';
import { mdiChevronRight, mdiAccount, mdiDelete, mdiMinus, mdiPlus, mdiHome } from '@mdi/js';
import './t1.css';
const AppContext = createContext();
export default function App({ goToHome }) {
  let [rsa] = useState(new RSA({
    theme: 't1',
    id: 't1',
    nav: {
      nested:false,
      id: 'other',
      items: [
        { text: 'Popups', id: 'popups', render: () => <Popups />,icon:<Icon path={mdiAccount} size={1}/> },
        { text: 'Cards', id: 'cards', render: () => <Cards />,icon:<Icon path={mdiAccount} size={1}/> },
        { text: 'Inputs', id: 'inputs', render: () => <Inputs />,icon:<Icon path={mdiAccount} size={1}/> },
        { text: 'Other', id: 'other', render: () => <Other />,icon:<Icon path={mdiAccount} size={1}/> },
      ]
    },
    body: ({ render }) => {
      return render()
    },
    headerContent: () => {
      return (
        <RVD
          rootNode={{
            row: [
              { html: <Icon path={mdiHome} size={1} />, onClick: () => goToHome() }
            ]
          }}
        />
      )
    }
  }))
  function getContext() {
    return {
      rsa
    }
  }
  return (
    <AppContext.Provider value={getContext()}>
      {rsa.render()}
    </AppContext.Provider>
  );
}

function Popups() {
  const { rsa } = useContext(AppContext)
  function openConfirm() {
    rsa.addConfirm({
      title: 't1-confirm',
      subtitle: 'my sample subtitle',
      text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
      onSubmit:()=>{alert('ok')}
    })
  }
  function openPrompt() {
    rsa.addPrompt({
      title: 't1-prompt',
      subtitle: 'my sample subtitle',
      text: 'inter your text',
      submitText: 'تایید',
      canselText: 'بستن',
      onSubmit: (text) => {
        alert(text)
      }
    })
  }
  return (
    <RVD
      rootNode={{
        className: 't-page',
        column: [
          {
            row: [
              {
                html: (
                  <button onClick={() => openConfirm()}>Confirm</button>
                )
              },
              {
                html: (
                  <button onClick={() => openPrompt()}>Prompt</button>
                )
              }
            ]
          }
        ]
      }}

    />
  )
}
function Cards() {
  let { rsa } = useContext(AppContext);
  return (
    <RVD
      rootNode={{
        className: 't-page p-24', gap:{size:12},
        column: [
          {
            className: 'of-visible',
            html: renderCard({
              uptext: 'my panel uptext',
              text: 'my panel text',
              subtext: 'my panel subtext',
              before: <Icon path={mdiAccount} size={1} />,
              after: <Icon path={mdiChevronRight} size={1} />
            })
          },
          {
            className: 'of-visible',
            html: renderCard({
              text: 'my panel text',
              subtext: 'my panel subtext',
              before: <Icon path={mdiAccount} size={1} />,
              after: <Icon path={mdiChevronRight} size={1} />
            })
          },
          {
            className: 'of-visible',
            html: renderCard({
              uptext: 'my panel uptext',
              text: 'my panel text',
              after: <Icon path={mdiChevronRight} size={1} />
            })
          },
          {
            className: 'of-visible',
            html: renderCard({
              uptext: 'my panel uptext',
              text: 'my panel text',
              subtext: 'my panel subtext',
              after: <Icon path={mdiChevronRight} size={1} />
            })
          },
          {
            className: 'of-visible',
            html: renderCard({
              text: 'my panel text',
              subtext: 'my panel subtext'
            })
          },
          {
            className: 'of-visible',
            html: renderCard({
              header: [
                <span style={{ color: 'orange' }}>this is my header html</span>,
                <Icon path={mdiDelete} size={0.8} />
              ],
              text: 'my panel text',
              subtext: 'my panel subtext'
            })
          },
          {
            className: 'of-visible',
            html: renderCard({
              header: [
                <span style={{ color: 'orange' }}>this is my header html</span>,
                <Icon path={mdiDelete} size={0.8} />
              ],
              text: 'my panel text',
              subtext: 'my panel subtext',
              footer: [
                (
                  <div className='gap-12 align-v'>
                    <Icon path={mdiMinus} size={0.9} />
                    <Icon path={mdiPlus} size={0.9} />
                  </div>
                ),
                <span className='fs-14 bold'>123000 $</span>
              ],
            })
          },
          {
            className: 'of-visible',
            html: renderCard({
              header: [
                <span style={{ color: 'orange' }}>this is my header html</span>,
                <Icon path={mdiDelete} size={0.8} />
              ],
              before: <Icon path={mdiAccount} size={1} />,
              text: 'my panel text',
              subtext: 'my panel subtext',
              footer: [
                <div className='gap-12 align-v'><Icon path={mdiMinus} size={0.9} /><Icon path={mdiPlus} size={0.9} /></div>,
                <span className='fs-14 bold'>123000 $</span>
              ],
            })
          },
          {
            className: 'of-visible',
            html: renderCard({
              attrs: { style: { direction: 'rtl' } },
              after: (
                <img alt=''
                  src="https://hips.hearstapps.com/vader-prod.s3.amazonaws.com/1683736892-71pPQze7jxL.jpg?crop=1xw:1.00xh;center,top&resize=980:*"
                  width='72' className='br-4'
                />
              ),
              text: 'دریل چکشی خفن بروکس به همراه تجهیزات کامل',
              footer: [
                <div className='border-224 p-h-12 p-v-3 br-16 fs-14'>مشاهده کالا</div>,
                <span className='fs-14 bold'>123000 تومان</span>
              ],
            })
          },
          {
            gap:{size: 12}, className: 'of-visible',
            row: [
              {
                flex: 1, className: 'of-visible',
                html: renderCard({ justify: true, uptext: 'uptext', text: '445', subtext: 'subtext', classes: { text: 'fs-24' } })
              },
              {
                flex: 1, className: 'of-visible',
                html: renderCard({ attrs: { className: 't-dark t-shadow' }, justify: true, uptext: 'uptext', text: '536', subtext: 'subtext', classes: { text: 'fs-24' } })
              },
              {
                flex: 1, className: 'of-visible',
                html: renderCard({ attrs: { className: 't-ulight' }, justify: true, uptext: 'uptext', text: '255', subtext: 'subtext', classes: { text: 'fs-24' } })
              }
            ]
          },
          {
            gap:{size:2}, className: 'of-visible',
            column: [
              { className: 'of-visible', html: renderCard({ text: 'my panel text' }) },
              { className: 'of-visible', html: renderCard({ text: 'my panel text' }) },
              { className: 'of-visible', html: renderCard({ text: 'my panel text' }) },
              { className: 'of-visible', html: renderCard({ text: 'my panel text' }) }
            ]
          },
          {
            className: 'of-visible',
            html: renderCards({
              items: [
                [
                  { attrs: { className: 't-dark' }, justify: true, uptext: 'my panel uptext', text: 'my panel text', subtext: 'my panel subtext' },
                  { attrs: { className: 't-dark' }, justify: true, uptext: 'my panel uptext', text: 'my panel text', subtext: 'my panel subtext' },
                  { attrs: { className: 't-dark' }, justify: true, uptext: 'my panel uptext', text: 'my panel text', subtext: 'my panel subtext' }
                ]
              ],
              gap:{size:2}, attrs: { className: 't-shadow' }
            })
          },
          {
            className: 'of-visible',
            html: renderCards({
              items: [
                [
                  { text: 'my panel text', subtext: 'my panel subtext', justify: true },
                  { text: 'my panel text', subtext: 'my panel subtext', justify: true }
                ],
                [{ text: 'my panel text', subtext: 'my panel subtext' }],
                [{ uptext: 'my panel uptext', text: 'my panel text', subtext: 'my panel subtext' }]
              ],
              gap:{size:2},
            })
          },
          {
            className: 'of-visible',
            html: renderCardsRow(new Array(12).fill(0).map(() => { return { text: 'my panel text', subtext: 'my panel subtext', justify: true, attrs: { className: 't-shadow' } } }), 12)
          },
          {
            className: 'of-visible',
            html: renderCard({
              header: ['this is my title', <button className='t-link p-0'>Show All</button>],
              text: renderCardsRow(new Array(12).fill(0).map(() => { return { text: 'my panel text', subtext: 'my panel subtext', justify: true, attrs: { className: 't-shadow t-dark' } } }), 12),

            })
          },


        ]
      }}

    />
  )
}

function Inputs() {
  let [tab, setTab] = useState('tab1');
  let [checked, setChecked] = useState(false);
  let [form, setForm] = useState({})
  let [date,setDate] = useState();
  return (
    <RVD
      rootNode={{
        className: 't-page', gap:{size:12},
        column:[
          {
            html: (
              <AIOInput
                type='tabs'
                options={[
                  { text: 'Tab1', value: 'tab1', style: { flex: 1 }, after: <div className='t-badge'>12</div> },
                  { text: 'Tab2', value: 'tab2', style: { flex: 1 }, justify: true },
                ]}
                value={tab}
                onChange={(tab) => setTab(tab)}
              />
            )
          },
          {
            className:'ofy-auto',flex:1,column: [
              {
                className: 'p-12', gap:{size:12},
                column: [
                  { html: <button className='t-link'>t-link</button> },
                  {
                    style: { background: '#fff', padding: 6 },
                    row: [
                      { html: <button className='t-dark'>t-dark</button> },
                      { html: <button className='t-dark t-outline'>t-dark t-outline</button> }
                    ]
                  },
                  {
                    row: [
                      { html: <button className='t-light'>t-light</button> },
                      { html: <button className='t-light t-outline'>t-light t-outline</button> },
                    ]
                  },
                  {
                    row: [
                      { html: <button className='t-ulight'>t-ulight</button> },
                      { html: <button className='t-ulight t-outline'>t-ulight t-outline</button> },
                    ]
                  },
                  {
                    row: [
                      { html: <button className='t-error'>t-error</button> },
                      { html: <button className='t-outline t-error'>t-outline t-error</button> },
                    ]
                  },
                  {
                    row: [
                      { html: <button className='t-warning'>t-warning</button> },
                      { html: <button className='t-outline t-warning'>t-outline t-warning</button> }
                    ]
                  },
                  {
                    row: [
                      { html: <button className='t-info'>t-info</button> },
                      { html: <button className='t-outline t-info'>t-outline t-info</button> }
                    ]
                  },
                  {
                    row: [
                      { html: <button className='t-success'>t-success</button> },
                      { html: <button className='t-outline t-success'>t-outline t-success</button> }
                    ]
                  },
                  { html: <button className='t-ulight t-round'>t-ulight t-round</button> },
                  { html: <button className='t-ulight t-outline t-round'>t-ulight t-outline t-round</button> },
                ]
              },
              {
                className: 'p-12',
                html: (
                  <AIOInput
                    type='select'
                    options={[
                      { text: 'My Select 1', value: 'tab1', after: <div className='t-badge'>12</div> },
                      { text: 'Select2', value: 'tab2' },
                    ]}
                    value={tab}
                    onChange={(tab) => setTab(tab)}
                  />
                )
              },
              {
                className: 'p-12',
                html: (
                  <AIOInput
                    type='date'
                    value={date}
                    onChange={(date) => setDate(date)}
                  />
                )
              },
              {
                className: 'p-12',
                html: (
                  <AIOInput
                    type='form'
                    onSubmit={() => { }}
                    value={{ ...form }}
                    onChange={(form) => setForm(form)}
                    inputs={{
                      column: [
                        {
                          row:[
                            { input: { type: 'checkbox', text: 'Active' }, label: 'Active',field:'value.active', before: <Icon path={mdiAccount} size={1} /> },
                            { input: { type: 'date', text: 'Select Date' }, label: 'Date',field:'value.date', before: <Icon path={mdiAccount} size={1} /> }
                          ]
                        },
                        {
                          row: [
                            { input: { type: 'text' }, label: 'Name', field: 'value.name', validations: [['required']] },
                            { input: { type: 'text' }, label: 'Family', field: 'value.family' }
                          ]
                        },
                        { input: { type: 'textarea' }, label: 'Address', field: 'value.address' },
                        { input: { type: 'slider', start: 0, end: 10 }, label: 'Level', field: 'value.level' },
                      ]
                    }}
                  />
                )
              },
              {
                className: 'p-12',
                html: (
                  <AIOInput
                    type='table'
                    columns={[
                      { title: 'Name', value: 'row.name', input: { type: 'text' }, justify: true },
                      { title: 'Gender', value: 'row.gender', input: { type: 'text' }, justify: true },
                      { title: 'Age', value: 'row.age', input: { type: 'number' }, justify: true },
                    ]}
                    value={[
                      { "name": "save", "gender": "female", "age": 26, "date": "2021/1/21" },
                      { "name": "frame", "gender": "female", "age": 43, "date": "2020/10/25" },
                      { "name": "may", "gender": "male", "age": 22, "date": "2020/5/1", },
                      { "name": "rain", "gender": "female", "age": 26, "date": "2021/9/3" },
                    ]}
                  />
                )
              }
            ]
          }
        ]
      }}
    />
  )
}

function Other() {
  return (
    <RVD
      rootNode={{
        className: 't-page p-12 gap-12 t-color4',
        column: [
          {
            className:'align-v gap-12',
            row: [
              { html: 't-fs-xs', className: 't-fs-xs' },
              { html: 't-fs-sm', className: 't-fs-sm' },
              { html: 't-fs-md', className: 't-fs-md' },
              { html: 't-fs-lg', className: 't-fs-lg' },
              { html: 't-fs-sm bold', className: 't-fs-sm bold' }
            ]
          },
          {
            className:'align-v gap-12',
            row: [
              { html: 't-color1', className: 't-fs-md t-color1 t-bg4 p-6' },
              { html: 't-color2', className: 't-fs-md t-color2 t-bg4 p-6' },
              { html: 't-color3', className: 't-fs-md t-color3' },
              { html: 't-color4', className: 't-fs-md t-color4' },
            ]
          },
          {
            className:'align-v gap-12',
            row: [
              { html: 't-color-error', className: 't-fs-sm t-color-error' },
              { html: 't-color-warning', className: 't-fs-sm t-color-warning' },
              { html: 't-color-info', className: 't-fs-sm t-color-info' },
              { html: 't-color-success', className: 't-fs-sm t-color-success' }
            ]
          },
          {
            className:'align-v gap-12',
            row: [
              { html: 't-bg-error', className: 't-fs-sm t-bg-error color-32 p-6' },
              { html: 't-bg-warning', className: 't-fs-sm t-bg-warning color-32 p-6' },
              { html: 't-bg-info', className: 't-fs-sm t-bg-info color-32 p-6' },
              { html: 't-bg-success', className: 't-fs-sm t-bg-success color-32 p-6' }
            ]
          },
          {
            html:'t-badge',className:'t-badge'
          },
          {
            html:(
              <div className='p-12 border-136 align-vh br-6 t-notif'>t-notif</div>
            )
          }



        ]
      }}
    />
  )
}