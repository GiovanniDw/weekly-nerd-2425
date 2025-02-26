export const getData = async (url) => {
  const response = await fetch(url);
  const data = await response.json();
  return data;
};

const emptyAvatarURL = './src/assets/empty_avatar.png';

export const fixGroupData = (data) => {
  const fixData = data;
  if (fixData) {
    fixData.forEach((obj) => {
      if (
        !obj.avatar ||
        obj.avatar === null ||
        obj.avatar === '' ||
        obj.avatar ==
          'https://media.discordapp.net/attachments/852834890566991874/1336985656303423498/images_2.jpeg?ex=67a5cc6c&is=67a47aec&hm=4d816a9913fd74a7d8b700dc475d44b457f2aee619b209be685cab60f6b352ec&=&format=webp&width=450&height=450'
      ) {
        obj.avatar = emptyAvatarURL;
      }
    });
  }
  return fixData;
};

export const fixCustomData = (data) => {
  const fixData = data;
  if (fixData) {
    fixData.forEach((obj) => {
    if (obj.custom) {
        obj.custom = JSON.parse(obj.custom);
      }
    });
  }
  return fixData;
};
