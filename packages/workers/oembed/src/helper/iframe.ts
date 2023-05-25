const generateIframe = (url: string, site: string) => {
  console.log(site);
  switch (site) {
    case 'youtube.com':
    case 'youtu.be':
      return `<iframe width="560" height="315" src="${url}" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>`;
    case 'lenstube.xyz':
      return `<iframe width="560" height="315" src="${url}" title="Lenstube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write;" allowfullscreen></iframe>`;
    case 'oohlala.xyz':
      return `<iframe src="${url}" style="top: 0; left: 0; width: 100%; height: 100%; position: absolute; border: 0;" allowfullscreen scrolling="no"></iframe>`;
    default:
      return `<iframe src="${url}" frameborder="0" allowfullscreen></iframe>`;
  }
};

export default generateIframe;
