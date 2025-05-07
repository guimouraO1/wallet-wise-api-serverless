import { z } from 'zod';
import { DateTime } from 'luxon';
import { DATE_FORMAT } from '../../../../utils/constants/date-format';

const dateRegex = /^(0[1-9]|[12][0-9]|3[01])-(0[1-9]|1[0-2])-\d{4}$/;

export const GetTransactionsInPeriodQuery = z
  .object({
      startDate: z.string().regex(dateRegex, 'A data deve estar no formato DD-MM-YYYY'),
      endDate:   z.string().regex(dateRegex, 'A data deve estar no formato DD-MM-YYYY'),
      type:      z.enum(['deposit', 'withdraw']).optional()
  })
  .refine((data) => {
      const start = DateTime.fromFormat(data.startDate, DATE_FORMAT);
      const end   = DateTime.fromFormat(data.endDate,   DATE_FORMAT);

      if (!start.isValid || !end.isValid) return false;

      const diff = end.diff(start, 'days').days;
      return diff >= 0 && diff <= 31;
  }, {
      message: 'O intervalo entre startDate e endDate não pode exceder 31 dias',
      path: ['endDate']
  });

export type GetTransactionsInPeriodQueryType = z.infer<typeof GetTransactionsInPeriodQuery>;
