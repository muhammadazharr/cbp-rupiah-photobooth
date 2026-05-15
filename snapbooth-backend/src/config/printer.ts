import ipp from 'ipp';
import prisma from './database';

export const getPrinterConfig = async () => {
  const ipConfig = await prisma.appConfig.findUnique({ where: { key: 'printer_ip' } });
  const portConfig = await prisma.appConfig.findUnique({ where: { key: 'printer_port' } });

  const ip = ipConfig?.value || '127.0.0.1';
  const port = portConfig?.value || '631';

  return { ip, port, url: `ipp://${ip}:${port}/ipp/print` };
};

export const createPrinter = async () => {
  const config = await getPrinterConfig();
  return ipp.Printer(config.url);
};
