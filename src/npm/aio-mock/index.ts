// import axios from 'axios';
// import MockAdapter from 'axios-mock-adapter';

// // ایجاد یک Mock Adapter برای axios
// const mock = new MockAdapter(axios);

// // شبیه‌سازی درخواست با وضعیت 200 و تأخیر 2 ثانیه
// mock.onGet('/data').reply(200, { message: 'Request Successful!' }, { delay: 2000 });

// // شبیه‌سازی درخواست با وضعیت 400 و تأخیر 1 ثانیه
// mock.onGet('/data').reply(400, { message: 'Bad Request' }, { delay: 1000 });

// // شبیه‌سازی درخواست با وضعیت 404 و تأخیر 3 ثانیه
// mock.onGet('/data').reply(404, { message: 'Not Found' }, { delay: 3000 });

// // استفاده از axios
// axios.get('/data')
//     .then(response => {
//         console.log('Success:', response.data); // در صورت موفقیت
//     })
//     .catch(error => {
//         if (error.response) {
//             console.error(`Error ${error.response.status}: ${error.response.data.message}`);
//         } else {
//             console.error('Unknown error:', error.message);
//         }
//     });
// import axios from 'axios';
// import MockAdapter from 'axios-mock-adapter';

// // ایجاد یک Mock Adapter برای axios
// const mock = new MockAdapter(axios);

// // شبیه‌سازی درخواست POST بر اساس محتوای body
// mock.onPost('/data').reply(config => {
//     // تبدیل body به شیء جاوا اسکریپت
//     const requestData = JSON.parse(config.data);

//     // بررسی داده‌های body و شبیه‌سازی پاسخ
//     if (requestData.id === 1 && requestData.name === 'John Doe') {
//         return [200, { message: 'Request Successful!' }];
//     } else if (requestData.id === 2) {
//         return [400, { message: 'Bad Request for ID 2' }];
//     } else {
//         return [404, { message: 'Not Found' }];
//     }
// });

// // استفاده از axios برای ارسال درخواست POST
// axios.post('/data', { id: 1, name: 'John Doe' })
//     .then(response => {
//         console.log('Success:', response.data); // در صورت موفقیت
//     })
//     .catch(error => {
//         if (error.response) {
//             console.error(`Error ${error.response.status}: ${error.response.data.message}`);
//         } else {
//             console.error('Unknown error:', error.message);
//         }
//     });

// // درخواست دیگری با body متفاوت
// axios.post('/data', { id: 2, name: 'Jane Doe' })
//     .then(response => {
//         console.log('Success:', response.data); // در صورت موفقیت
//     })
//     .catch(error => {
//         if (error.response) {
//             console.error(`Error ${error.response.status}: ${error.response.data.message}`);
//         } else {
//             console.error('Unknown error:', error.message);
//         }
//     });
// import axios from 'axios';
// import MockAdapter from 'axios-mock-adapter';

// // ایجاد یک Mock Adapter برای axios
// const mock = new MockAdapter(axios);

// // شبیه‌سازی درخواست POST با وضعیت 200 و تأخیر 2 ثانیه
// mock.onPost('/data').reply(200, { message: 'Request Successful!' }, { delay: 2000 });

// // شبیه‌سازی درخواست POST با وضعیت 400 و تأخیر 3 ثانیه
// mock.onPost('/data').reply(400, { message: 'Bad Request' }, { delay: 3000 });

// // استفاده از axios برای ارسال درخواست POST
// axios.post('/data', { id: 1, name: 'John Doe' })
//     .then(response => {
//         console.log('Success:', response.data); // در صورت موفقیت
//     })
//     .catch(error => {
//         if (error.response) {
//             console.error(`Error ${error.response.status}: ${error.response.data.message}`);
//         } else {
//             console.error('Unknown error:', error.message);
//         }
//     });
// import axios from 'axios';
// import MockAdapter from 'axios-mock-adapter';

// // ایجاد یک Mock Adapter برای axios
// const mock = new MockAdapter(axios);

// // شبیه‌سازی درخواست POST با تأخیر مختلف بر اساس body درخواست
// mock.onPost('/data').reply(config => {
//   const requestData = JSON.parse(config.data);

//   // بررسی داده‌ها و تنظیم تأخیر بر اساس داده‌ها
//   if (requestData.id === 1) {
//     return [200, { message: 'Request Successful!' }, { delay: 1000 }];
//   } else if (requestData.id === 2) {
//     return [400, { message: 'Bad Request' }, { delay: 2000 }];
//   } else {
//     return [404, { message: 'Not Found' }, { delay: 3000 }];
//   }
// });

// // استفاده از axios برای ارسال درخواست POST
// axios.post('/data', { id: 1, name: 'John Doe' })
//   .then(response => {
//     console.log('Success:', response.data); // در صورت موفقیت
//   })
//   .catch(error => {
//     if (error.response) {
//       console.error(`Error ${error.response.status}: ${error.response.data.message}`);
//     } else {
//       console.error('Unknown error:', error.message);
//     }
//   });

// // درخواست دیگری با body متفاوت
// axios.post('/data', { id: 2, name: 'Jane Doe' })
//   .then(response => {
//     console.log('Success:', response.data); // در صورت موفقیت
//   })
//   .catch(error => {
//     if (error.response) {
//       console.error(`Error ${error.response.status}: ${error.response.data.message}`);
//     } else {
//       console.error('Unknown error:', error.message);
//     }
//   });