const { z } = require('zod');

// Helper to create validation middleware
const validate = (schema, target = 'json') => {
  return async (c, next) => {
    try {
      let data;
      if (target === 'json') {
        data = await c.req.json().catch(() => ({}));
      } else if (target === 'query') {
        data = c.req.query();
      } else if (target === 'param') {
        data = c.req.param();
      }

      const result = schema.safeParse(data);

      if (!result.success) {
        return c.json({
          error: {
            message: 'Validation failed',
            details: result.error.errors.map(err => ({
              field: err.path.join('.'),
              message: err.message
            }))
          }
        }, 400);
      }

      c.set('validatedData', result.data);
      await next();
    } catch (error) {
      return c.json({
        error: {
          message: 'Validation failed',
          details: [{ field: 'body', message: 'Invalid request body' }]
        }
      }, 400);
    }
  };
};

// Common validation schemas
const schemas = {
  // Auth
  register: z.object({
    email: z.string().email('Please enter a valid email'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    firstName: z.string().min(1, 'First name is required'),
    lastName: z.string().min(1, 'Last name is required')
  }),

  login: z.object({
    email: z.string().email('Please enter a valid email'),
    password: z.string().min(1, 'Password is required')
  }),

  updateProfile: z.object({
    firstName: z.string().min(1, 'First name cannot be empty').optional(),
    lastName: z.string().min(1, 'Last name cannot be empty').optional(),
    avatar: z.string().optional().nullable()
  }),

  changePassword: z.object({
    currentPassword: z.string().min(1, 'Current password is required'),
    newPassword: z.string().min(6, 'New password must be at least 6 characters')
  }),

  // Groups
  createGroup: z.object({
    name: z.string().min(1, 'Group name is required'),
    description: z.string().optional()
  }),

  joinGroup: z.object({
    inviteCode: z.string().length(8, 'Invalid invite code format')
  }),

  updateMemberRole: z.object({
    role: z.enum(['admin', 'member'], { message: 'Role must be admin or member' })
  }),

  // Expenses
  createExpense: z.object({
    amount: z.number().positive('Amount must be greater than 0'),
    description: z.string().min(1, 'Description is required'),
    category: z.enum([
      'groceries', 'utilities', 'rent', 'internet',
      'entertainment', 'transport', 'household', 'other'
    ]).optional(),
    date: z.string().datetime().optional(),
    splitType: z.enum(['equal', 'percentage', 'exact']).optional(),
    paidBy: z.string().uuid().optional(),
    shares: z.array(z.object({
      userId: z.string().uuid(),
      percentage: z.number().optional(),
      amount: z.number().optional()
    })).optional()
  }),

  updateExpense: z.object({
    amount: z.number().positive('Amount must be greater than 0').optional(),
    description: z.string().min(1, 'Description cannot be empty').optional(),
    category: z.enum([
      'groceries', 'utilities', 'rent', 'internet',
      'entertainment', 'transport', 'household', 'other'
    ]).optional(),
    date: z.string().datetime().optional(),
    splitType: z.enum(['equal', 'percentage', 'exact']).optional(),
    paidBy: z.string().uuid().optional(),
    shares: z.array(z.object({
      userId: z.string().uuid(),
      percentage: z.number().optional(),
      amount: z.number().optional()
    })).optional()
  }),

  // Payments
  createPayment: z.object({
    toUser: z.string().uuid('Invalid recipient ID'),
    amount: z.number().positive('Amount must be greater than 0'),
    note: z.string().optional(),
    date: z.string().datetime().optional()
  }),

  updatePaymentStatus: z.object({
    status: z.enum(['confirmed', 'rejected'], { message: 'Status must be confirmed or rejected' })
  }),

  // Notifications
  subscribePush: z.object({
    subscription: z.any()
  }),

  // UUID param
  uuidParam: z.object({
    id: z.string().uuid('Invalid ID')
  }),

  groupIdParam: z.object({
    groupId: z.string().uuid('Invalid group ID')
  }),

  groupAndIdParam: z.object({
    groupId: z.string().uuid('Invalid group ID'),
    id: z.string().uuid('Invalid ID')
  }),

  groupAndUserParam: z.object({
    id: z.string().uuid('Invalid group ID'),
    userId: z.string().uuid('Invalid user ID')
  })
};

module.exports = { validate, schemas, z };
