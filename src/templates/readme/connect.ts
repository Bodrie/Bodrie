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
    icon: 'https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=data%3Aimage%2Fsvg%2Bxml%3Bbase64%2CPHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0id2hpdGUiPjxwYXRoIGQ9Ik0yMC40NDcgMjAuNDUyaC0zLjU1NHYtNS41NjljMC0xLjMyOC0uMDI3LTMuMDM3LTEuODUyLTMuMDM3LTEuODUzIDAtMi4xMzYgMS40NDUtMi4xMzYgMi45Mzl2NS42NjdIOS4zNTFWOWgzLjQxNHYxLjU2MWguMDQ2Yy40NzctLjkgMS42MzctMS44NSAzLjM3LTEuODUgMy42MDEgMCA0LjI2NyAyLjM3IDQuMjY3IDUuNDU1djYuMjg2ek01LjMzNyA3LjQzM2MtMS4xNDQgMC0yLjA2My0uOTI2LTIuMDYzLTIuMDYzIDAtMS4xMzguOTItMi4wNjMgMi4wNjMtMi4wNjMgMS4xNCAwIDIuMDY0LjkyNSAyLjA2NCAyLjA2MyAwIDEuMTM5LS45MjUgMi4wNjUtMi4wNjQgMi4wNjV6bTEuNzgyIDEzLjAxOUgzLjU1NVY5aDMuNTY0djExLjQ1MnoiLz48L3N2Zz4=',
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

export function generateConnect(): string {
  const links = socialLinks
    .map(
      link =>
        `<a href="${link.url}" target="_blank">
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
