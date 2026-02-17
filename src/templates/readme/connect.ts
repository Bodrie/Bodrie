export interface SocialLink {
  name: string;
  url: string;
  icon: string;
  height?: number;
}

const socialLinks: SocialLink[] = [
  {
    name: 'LinkedIn',
    url: 'https://www.linkedin.com/in/d-kirov/',
    icon: 'https://raw.githubusercontent.com/rahuldkjain/github-profile-readme-generator/master/src/images/icons/Social/linked-in-alt.svg',
    height: 30,
  },
  {
    name: 'Gmail',
    url: 'mailto:kirov0407@gmail.com',
    icon: 'https://img.shields.io/badge/Email-D14836?style=for-the-badge&logo=gmail&logoColor=white',
    height: 30,
  },
  {
    name: 'Proton',
    url: 'mailto:dobromir.kirov@proton.me',
    icon: 'https://img.shields.io/badge/proton-d2c7ef?logo=proton&style=for-the-badge',
    height: 30,
  },
  {
    name: 'GitHub',
    url: 'https://github.com/petarzarkov',
    icon: 'https://raw.githubusercontent.com/rahuldkjain/github-profile-readme-generator/master/src/images/icons/Social/github.svg',
    height: 30,
  },
];

//

export function generateConnect(): string {
  const links = socialLinks
    .map(
      link => `  <a href="${link.url}" target="_blank">
    <img align="center" src="${link.icon}" alt="${link.name.toLowerCase()}" height="${link.height}" ${link.name === 'LinkedIn' || link.name === 'Twitter' || link.name === 'YouTube' ? 'width="40"' : ''} />
  </a>`,
    )
    .join('\n');

  return `<h3 align="left">📬 Connect with Me:</h3>
<p align="left">
${links}
</p>`;
}

export { socialLinks };
