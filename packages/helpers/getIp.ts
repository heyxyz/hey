const getIp = (req: any): string => {
  const ips = (
    req.headers["cf-connecting-ip"] ||
    req.headers["x-real-ip"] ||
    req.headers["x-forwarded-for"] ||
    req.connection.remoteAddress ||
    ""
  ).split(",");

  return ips[0].trim();
};

export default getIp;
