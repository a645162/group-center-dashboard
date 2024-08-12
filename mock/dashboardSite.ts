import { getRandomBool, getRandomInt } from './FakeData/common';

const generateSite = () => {
  return getRandomBool()
    ? {
        name: '百度',
        url: 'https://www.baidu.com',
        iconUrl: '/favicon.ico',
        supportQrCode: true,
      }
    : {
        name: 'GitHub',
        url: 'https://github.com',
        iconUrl: '/favicon.ico',
        supportQrCode: true,
      };
};

const generateSiteClass = (index: number, count: number = 3) => {
  return {
    classIconUrl: '/favicon.ico',
    className: `Class ${index}`,
    position: 'default',
    index: index,
    sites: Array.from({ length: count }, generateSite),
  };
};

const generateSiteClassList = (count: number = 5, eachMaxCount = 3) => {
  return Array.from({ length: count }, (_, index) =>
    generateSiteClass(index, getRandomInt(eachMaxCount)),
  );
};

export default {
  'GET /web/open/front_end/publicSiteClassList': (req: any, res: any) => {
    res.json(generateSiteClassList());
  },
};
