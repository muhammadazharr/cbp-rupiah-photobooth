import prisma from '../../config/database';
import { createPrinter } from '../../config/printer';
import axios from 'axios';
import { prepareForPrint } from '../../utils/imageUtils';

export const printSession = async (sessionId: string) => {
  const session = await prisma.session.findUnique({ where: { id: sessionId } });
  if (!session) throw new Error('Session not found');
  if (session.status !== 'COMPLETED') throw new Error('Only completed sessions can be printed');
  if (!session.finalImageUrl) throw new Error('finalImageUrl is not set');

  const printRecord = await prisma.print.create({
    data: {
      sessionId,
      imageUrl: session.finalImageUrl,
      status: 'PENDING',
    },
  });

  // Async printing process
  setImmediate(async () => {
    try {
      const response = await axios.get(session.finalImageUrl!, { responseType: 'arraybuffer' });
      const imageBuffer = Buffer.from(response.data, 'binary');
      
      const printBuffer = await prepareForPrint(imageBuffer);

      await prisma.print.update({
        where: { id: printRecord.id },
        data: { status: 'PRINTING' },
      });

      const printer = await createPrinter();
      
      const msg = {
        'operation-attributes-tag': {
          'requesting-user-name': 'SnapBooth',
          'document-format': 'image/jpeg',
        },
        data: printBuffer,
      };

      printer.execute('Print-Job', msg, async (err, res) => {
        if (err) {
          await prisma.print.update({
            where: { id: printRecord.id },
            data: { status: 'FAILED', errorMsg: err.message },
          });
          return;
        }

        await prisma.print.update({
          where: { id: printRecord.id },
          data: { status: 'SUCCESS', printedAt: new Date() },
        });
      });
    } catch (err: any) {
      await prisma.print.update({
        where: { id: printRecord.id },
        data: { status: 'FAILED', errorMsg: err.message },
      });
    }
  });

  return { printId: printRecord.id, status: printRecord.status };
};

export const printTestPage = async () => {
  const printer = await createPrinter();
  const msg = {
    'operation-attributes-tag': {
      'requesting-user-name': 'SnapBooth Admin',
      'document-format': 'text/plain',
    },
    data: Buffer.from('SnapBooth Printer Test\nPrinter is working perfectly!\n'),
  };

  return new Promise((resolve, reject) => {
    printer.execute('Print-Job', msg, (err, res) => {
      if (err) return reject(err);
      resolve(res);
    });
  });
};
