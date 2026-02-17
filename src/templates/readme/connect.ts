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
    icon: 'https://img.shields.io/badge/LinkedIn-%230077B5.svg?style=for-the-badge&logo=data%3Aimage%2Fsvg%2Bxml%3Bbase64%2CPHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0id2hpdGUiPjxwYXRoIGQ9Ik0xOSAwaC0xNGMtMi43NjEgMC01IDIuMjM5LTUgNXYxNGMwIDIuNzYxIDIuMjM5IDUgNSA1aDE0YzIuNzYyIDAgNS0yLjIzOSA1LTV2LTE0YzAtMi43NjEtMi4yMzgtNS01LTV6bS0xMSAxOWgtM3YtMTFoM3YxMXptLTEuNS0xMi4yNjhjLS45NjYgMC0xLjc1LS43OS0xLjc1LTEuNzY0cy43ODQtMS43NjQgMS43NS0xLjc2NCAxLjc1Ljc5IDEuNzUgMS43NjQtLjc4MyAxLjc2NC0xLjc1IDEuNzY0em0xMy41IDEyLjI2OGgtM3YtNS42MDRjMC0zLjM2OC00LTMuMTEzLTQgMHY1LjYwNGgtM3YtMTFoM3YxLjc2NWMxLjM5Ni0yLjU4NiA3LTIuNzc3IDcgMi40NzZ2Ni43NTl6Ii8%2BPC9zdmc%2B',
    height: 30,
  },
  {
    name: 'Gmail',
    url: 'mailto:kirov0407@gmail.com',
    icon: 'https://img.shields.io/badge/Gmail-D14836?style=for-the-badge&logo=gmail&logoColor=white',
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
    url: 'https://github.com/Bodrie',
    icon: 'https://img.shields.io/badge/github-gray?style=for-the-badge&logo=github',
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
