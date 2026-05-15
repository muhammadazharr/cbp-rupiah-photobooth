import prisma from '../../config/database';

export const getSessions = async (filters: any, page: number, limit: number) => {
  const skip = (page - 1) * limit;

  const [data, total] = await Promise.all([
    prisma.session.findMany({
      where: filters,
      skip,
      take: limit,
      include: {
        _count: { select: { photos: true } },
      },
      orderBy: { createdAt: 'desc' },
    }),
    prisma.session.count({ where: filters }),
  ]);

  return {
    data,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};

export const getAnalytics = async () => {
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const [
    totalSessions,
    completedSessions,
    totalPhotos,
    totalRetakesRaw,
    totalPrints,
    successfulPrints,
    totalWhatsappSends,
    topTemplates,
    topFilters,
  ] = await Promise.all([
    prisma.session.count(),
    prisma.session.count({ where: { status: 'COMPLETED' } }),
    prisma.photo.count(),
    prisma.photo.aggregate({ _sum: { retakeCount: true } }),
    prisma.print.count(),
    prisma.print.count({ where: { status: 'SUCCESS' } }),
    prisma.whatsappSend.count(),
    prisma.session.groupBy({
      by: ['templateId'],
      _count: { templateId: true },
      where: { templateId: { not: null } },
      orderBy: { _count: { templateId: 'desc' } },
      take: 1,
    }),
    prisma.photo.groupBy({
      by: ['filterId'],
      _count: { filterId: true },
      where: { filterId: { not: null } },
      orderBy: { _count: { filterId: 'desc' } },
      take: 1,
    }),
  ]);

  const topTemplateData = topTemplates.length > 0 
    ? await prisma.template.findUnique({ where: { id: topTemplates[0].templateId! } })
    : null;

  const topFilterData = topFilters.length > 0
    ? await prisma.filter.findUnique({ where: { id: topFilters[0].filterId! } })
    : null;

  return {
    period: 'all_time',
    totalSessions,
    completedSessions,
    totalPhotos,
    totalRetakes: totalRetakesRaw._sum.retakeCount || 0,
    totalPrints,
    printSuccessRate: totalPrints > 0 ? (successfulPrints / totalPrints) * 100 : 0,
    totalWhatsappSends,
    topTemplate: topTemplateData ? { id: topTemplateData.id, name: topTemplateData.name, usageCount: topTemplates[0]._count.templateId } : null,
    topFilter: topFilterData ? { id: topFilterData.id, name: topFilterData.name, usageCount: topFilters[0]._count.filterId } : null,
  };
};
