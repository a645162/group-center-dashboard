const siteClassList = [
  {
    classIconUrl: '/favicon.ico',
    className: 'Basic',
    position: 'default',

    sites: [
      {
        name: '百度',
        url: 'https://www.baidu.com',
        iconUrl: '/favicon.ico',
        supportQrCode: true,
      },
      {
        name: 'Github',
        url: 'https://github.com',
        iconUrl: '/favicon.ico',
        supportQrCode: true,
      },
    ],
  },
];

export default {
  'GET /web/open/front_end/publicSiteClassList': (req: any, res: any) => {
    res.json(siteClassList);
  },
};
