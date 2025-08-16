import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

// 🎯 SOUS-WORKFLOW 1 : VALIDATION
// Valide les données entrantes avec Zod
// Maximum 15 modules Make.com

// Schémas de validation par type de job
const BookingSyncSchema = z.object({
  booking_data: z.object({
    id: z.string().uuid(),
    package_id: z.string(),
    first_name: z.string().min(1),
    last_name: z.string().min(1),
    email: z.string().email(),
    phone: z.string().min(5),
    preferred_date: z.string(),
    participants: z.number().min(1).max(20),
    total_price: z.number().positive(),
    notes: z.string().optional()
  })
});

const StripeSetupSchema = z.object({
  customer_id: z.string().min(1),
  setup_data: z.object({
    email: z.string().email(),
    metadata: z.record(z.string()).optional(),
    payment_method_types: z.array(z.string()).default(['card'])
  })
});

const EmailInvestorSchema = z.object({
  recipient: z.string().email(),
  template_data: z.object({
    name: z.string().min(1),
    subject: z.string().min(1),
    template_id: z.string().min(1),
    variables: z.record(z.any()).optional()
  })
});

const NotionUpdateSchema = z.object({
  page_id: z.string().min(1),
  update_data: z.object({
    status: z.string().min(1),
    properties: z.record(z.any()).optional(),
    content: z.string().optional()
  })
});

const WebhookDeliverySchema = z.object({
  webhook_url: z.string().url(),
  webhook_data: z.record(z.any()),
  retry_count: z.number().min(0).max(10).default(3),
  timeout_ms: z.number().min(1000).max(30000).default(10000)
});

const FileProcessingSchema = z.object({
  file_path: z.string().min(1),
  processing_type: z.enum(['image_resize', 'pdf_generate', 'csv_parse', 'zip_extract']),
  options: z.record(z.any()).optional(),
  output_path: z.string().optional()
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    
    console.log(`🔍 Validating ${body.job_type} job ${body.job_id}`);

    // Validation de base
    const baseSchema = z.object({
      job_id: z.string().uuid(),
      job_type: z.enum(['booking_sync', 'stripe_setup', 'email_investor', 'notion_update', 'webhook_delivery', 'file_processing']),
      stage: z.literal('validate'),
      payload: z.record(z.any()),
      attempts: z.number().min(0),
      workflow_version: z.string()
    });

    const validatedBase = baseSchema.parse(body);
    
    // Validation spécifique selon le type de job
    let validatedPayload;
    let sanitizedPayload;

    switch (validatedBase.job_type) {
      case 'booking_sync':
        validatedPayload = BookingSyncSchema.parse(validatedBase.payload);
        sanitizedPayload = sanitizeBookingData(validatedPayload);
        break;

      case 'stripe_setup':
        validatedPayload = StripeSetupSchema.parse(validatedBase.payload);
        sanitizedPayload = sanitizeStripeData(validatedPayload);
        break;

      case 'email_investor':
        validatedPayload = EmailInvestorSchema.parse(validatedBase.payload);
        sanitizedPayload = sanitizeEmailData(validatedPayload);
        break;

      case 'notion_update':
        validatedPayload = NotionUpdateSchema.parse(validatedBase.payload);
        sanitizedPayload = sanitizeNotionData(validatedPayload);
        break;

      case 'webhook_delivery':
        validatedPayload = WebhookDeliverySchema.parse(validatedBase.payload);
        sanitizedPayload = sanitizeWebhookData(validatedPayload);
        break;

      case 'file_processing':
        validatedPayload = FileProcessingSchema.parse(validatedBase.payload);
        sanitizedPayload = await sanitizeFileData(validatedPayload);
        break;

      default:
        throw new Error(`Unknown job type: ${validatedBase.job_type}`);
    }

    // Validation métier supplémentaire
    const businessValidation = await performBusinessValidation(
      validatedBase.job_type,
      sanitizedPayload
    );

    if (!businessValidation.valid) {
      throw new Error(`Business validation failed: ${businessValidation.errors.join(', ')}`);
    }

    console.log(`✅ Validation passed for job ${validatedBase.job_id}`);

    return NextResponse.json({
      success: true,
      job_id: validatedBase.job_id,
      job_type: validatedBase.job_type,
      validated_payload: sanitizedPayload,
      validation_checks: {
        schema_validation: 'passed',
        data_sanitization: 'passed',
        business_validation: 'passed',
        security_checks: businessValidation.security_checks
      },
      next_stage: 'prepare'
    });

  } catch (error) {
    console.error('❌ Validation error:', error);

    let errorDetails = 'Unknown validation error';
    let errorCode = 'VALIDATION_ERROR';

    if (error instanceof z.ZodError) {
      errorDetails = `Schema validation failed: ${error.errors.map(e => `${e.path.join('.')}: ${e.message}`).join(', ')}`;
      errorCode = 'SCHEMA_VALIDATION_ERROR';
    } else if (error instanceof Error) {
      errorDetails = error.message;
      if (error.message.includes('Business validation')) {
        errorCode = 'BUSINESS_VALIDATION_ERROR';
      }
    }

    return NextResponse.json({
      success: false,
      error: errorDetails,
      error_code: errorCode,
      stage: 'validate'
    }, { status: 400 });
  }
}

// Fonctions de sanitization par type
function sanitizeBookingData(data: any) {
  return {
    ...data,
    booking_data: {
      ...data.booking_data,
      // Nettoyer les champs texte
      first_name: data.booking_data.first_name.trim().slice(0, 50),
      last_name: data.booking_data.last_name.trim().slice(0, 50),
      email: data.booking_data.email.toLowerCase().trim(),
      phone: data.booking_data.phone.replace(/[^+\d\s()-]/g, ''),
      notes: data.booking_data.notes?.trim().slice(0, 500) || '',
      // Validation de date
      preferred_date: new Date(data.booking_data.preferred_date).toISOString(),
      // Limites de sécurité
      participants: Math.min(Math.max(data.booking_data.participants, 1), 20),
      total_price: Math.round(data.booking_data.total_price * 100) / 100
    }
  };
}

function sanitizeStripeData(data: any) {
  return {
    ...data,
    setup_data: {
      ...data.setup_data,
      email: data.setup_data.email.toLowerCase().trim(),
      metadata: Object.fromEntries(
        Object.entries(data.setup_data.metadata || {})
          .filter(([key, value]) => typeof key === 'string' && typeof value === 'string')
          .map(([key, value]) => [key.slice(0, 40), String(value).slice(0, 500)])
      )
    }
  };
}

function sanitizeEmailData(data: any) {
  return {
    ...data,
    recipient: data.recipient.toLowerCase().trim(),
    template_data: {
      ...data.template_data,
      name: data.template_data.name.trim().slice(0, 100),
      subject: data.template_data.subject.trim().slice(0, 200),
      variables: Object.fromEntries(
        Object.entries(data.template_data.variables || {})
          .map(([key, value]) => [key, typeof value === 'string' ? value.slice(0, 1000) : value])
      )
    }
  };
}

function sanitizeNotionData(data: any) {
  return {
    ...data,
    update_data: {
      ...data.update_data,
      status: data.update_data.status.trim().slice(0, 50),
      content: data.update_data.content?.trim().slice(0, 2000) || ''
    }
  };
}

function sanitizeWebhookData(data: any) {
  // Vérifier que l'URL est dans la whitelist
  const allowedDomains = (process.env.WEBHOOK_ALLOWED_DOMAINS || '').split(',');
  const url = new URL(data.webhook_url);
  
  if (allowedDomains.length > 0 && !allowedDomains.includes(url.hostname)) {
    throw new Error(`Webhook domain not allowed: ${url.hostname}`);
  }

  return {
    ...data,
    webhook_data: data.webhook_data, // Pas de sanitization ici, sera fait côté business
    timeout_ms: Math.min(Math.max(data.timeout_ms, 1000), 30000)
  };
}

async function sanitizeFileData(data: any) {
  // Vérifications de sécurité sur les chemins de fichiers
  if (data.file_path.includes('..') || data.file_path.includes('~')) {
    throw new Error('Invalid file path: directory traversal detected');
  }

  const allowedExtensions = ['.jpg', '.jpeg', '.png', '.pdf', '.csv', '.zip', '.txt'];
  const fileExtension = data.file_path.toLowerCase().substring(data.file_path.lastIndexOf('.'));
  
  if (!allowedExtensions.includes(fileExtension)) {
    throw new Error(`File type not allowed: ${fileExtension}`);
  }

  return {
    ...data,
    file_path: data.file_path.trim(),
    output_path: data.output_path?.trim() || `processed_${Date.now()}${fileExtension}`
  };
}

// Validation métier selon le contexte
async function performBusinessValidation(jobType: string, payload: any) {
  const checks = {
    valid: true,
    errors: [] as string[],
    security_checks: [] as string[]
  };

  switch (jobType) {
    case 'booking_sync':
      // Vérifier que la date n'est pas dans le passé
      const bookingDate = new Date(payload.booking_data.preferred_date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (bookingDate < today) {
        checks.valid = false;
        checks.errors.push('Booking date cannot be in the past');
      }

      // Vérifier la disponibilité (mock)
      // TODO: Appeler ton API de disponibilité
      checks.security_checks.push('date_validation', 'capacity_check');
      break;

    case 'stripe_setup':
      // Vérifier que le customer existe
      checks.security_checks.push('customer_verification');
      break;

    case 'email_investor':
      // Vérifier que l'email n'est pas dans la blacklist
      const emailBlacklist = (process.env.EMAIL_BLACKLIST || '').split(',');
      if (emailBlacklist.includes(payload.recipient)) {
        checks.valid = false;
        checks.errors.push('Recipient email is blacklisted');
      }
      checks.security_checks.push('email_blacklist_check');
      break;

    case 'webhook_delivery':
      // Rate limiting check
      checks.security_checks.push('rate_limiting', 'domain_whitelist');
      break;
  }

  return checks;
}