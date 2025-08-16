import { NextRequest, NextResponse } from 'next/server';

// 🎯 SOUS-WORKFLOW 2 : PREPARE
// Enrichit les données, fait les mappings et prépare l'exécution
// Maximum 20 modules Make.com

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    
    console.log(`🔧 Preparing ${body.job_type} job ${body.job_id}`);

    // Validation que la stage précédente (validate) a réussi
    if (!body.validated_payload) {
      throw new Error('Missing validated payload from previous stage');
    }

    const { job_id, job_type, validated_payload, attempts } = body;
    
    // Enrichissement des données selon le type de job
    let enrichedData;
    
    switch (job_type) {
      case 'booking_sync':
        enrichedData = await prepareBookingSync(validated_payload);
        break;

      case 'stripe_setup':
        enrichedData = await prepareStripeSetup(validated_payload);
        break;

      case 'email_investor':
        enrichedData = await prepareEmailInvestor(validated_payload);
        break;

      case 'notion_update':
        enrichedData = await prepareNotionUpdate(validated_payload);
        break;

      case 'webhook_delivery':
        enrichedData = await prepareWebhookDelivery(validated_payload);
        break;

      case 'file_processing':
        enrichedData = await prepareFileProcessing(validated_payload);
        break;

      default:
        throw new Error(`Unknown job type: ${job_type}`);
    }

    // Préparation des connexions et authentifications
    const connectionPrep = await prepareConnections(job_type, enrichedData);

    console.log(`✅ Preparation completed for job ${job_id}`);

    return NextResponse.json({
      success: true,
      job_id,
      job_type,
      enriched_payload: enrichedData,
      connections: connectionPrep,
      execution_plan: {
        estimated_duration: getEstimatedDuration(job_type),
        resource_requirements: getResourceRequirements(job_type),
        dependencies: getDependencies(job_type, enrichedData)
      },
      next_stage: 'execute'
    });

  } catch (error) {
    console.error('❌ Preparation error:', error);

    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown preparation error',
      error_code: 'PREPARATION_ERROR',
      stage: 'prepare'
    }, { status: 500 });
  }
}

// Préparation spécifique pour booking sync
async function prepareBookingSync(payload: any) {
  const { booking_data } = payload;

  // Enrichir avec les données du package
  const packageData = await fetchPackageDetails(booking_data.package_id);
  
  // Calculer les prix et taxes
  const pricing = calculateBookingPricing(booking_data, packageData);
  
  // Préparer les données Supabase
  const supabaseData = {
    ...booking_data,
    package_title: packageData.title,
    package_description: packageData.description,
    unit_price: pricing.unit_price,
    tax_amount: pricing.tax_amount,
    total_price_cents: pricing.total_price_cents,
    currency: 'EUR'
  };

  // Préparer les données Stripe
  const stripeData = {
    amount: pricing.total_price_cents,
    currency: 'eur',
    customer_email: booking_data.email,
    metadata: {
      booking_id: booking_data.id,
      package_id: booking_data.package_id,
      participants: booking_data.participants.toString()
    },
    line_items: [{
      name: packageData.title,
      description: packageData.description,
      quantity: booking_data.participants,
      amount: pricing.unit_price_cents
    }]
  };

  // Préparer l'email de confirmation
  const emailData = {
    to: booking_data.email,
    template_id: 'booking_confirmation',
    variables: {
      customer_name: `${booking_data.first_name} ${booking_data.last_name}`,
      package_name: packageData.title,
      booking_date: new Date(booking_data.preferred_date).toLocaleDateString('fr-FR'),
      participants: booking_data.participants,
      total_price: (pricing.total_price_cents / 100).toFixed(2),
      booking_reference: generateBookingReference(booking_data.id)
    }
  };

  return {
    supabase: supabaseData,
    stripe: stripeData,
    email: emailData,
    package: packageData,
    pricing,
    original_payload: payload
  };
}

// Préparation pour Stripe setup
async function prepareStripeSetup(payload: any) {
  const { customer_id, setup_data } = payload;

  // Vérifier que le customer existe dans Stripe
  const customerExists = await verifyStripeCustomer(customer_id);
  
  if (!customerExists) {
    throw new Error(`Stripe customer ${customer_id} not found`);
  }

  // Préparer les données de setup intent
  const setupIntentData = {
    customer: customer_id,
    payment_method_types: setup_data.payment_method_types,
    usage: 'off_session',
    metadata: {
      ...setup_data.metadata,
      created_by: 'windventure_automation',
      created_at: new Date().toISOString()
    }
  };

  // Préparer l'email de confirmation
  const emailData = {
    to: setup_data.email,
    template_id: 'payment_method_setup',
    variables: {
      customer_id,
      setup_url: `${process.env.NEXTAUTH_URL}/setup-payment/${customer_id}`
    }
  };

  return {
    stripe_setup: setupIntentData,
    email: emailData,
    customer_id,
    original_payload: payload
  };
}

// Préparation pour email investor
async function prepareEmailInvestor(payload: any) {
  const { recipient, template_data } = payload;

  // Enrichir avec les données d'investisseur
  const investorData = await fetchInvestorProfile(recipient);
  
  // Préparer les variables d'email enrichies
  const enrichedVariables = {
    ...template_data.variables,
    investor_name: investorData?.name || template_data.name,
    company: investorData?.company || 'Windventure',
    personalization: generatePersonalization(investorData),
    unsubscribe_url: `${process.env.NEXTAUTH_URL}/unsubscribe/${encodeURIComponent(recipient)}`
  };

  // Préparer les données d'envoi
  const emailData = {
    to: recipient,
    from: process.env.FROM_EMAIL || 'noreply@windventure.fr',
    template_id: template_data.template_id,
    subject: template_data.subject,
    variables: enrichedVariables,
    track_opens: true,
    track_clicks: true
  };

  return {
    email: emailData,
    investor: investorData,
    original_payload: payload
  };
}

// Préparation pour Notion update
async function prepareNotionUpdate(payload: any) {
  const { page_id, update_data } = payload;

  // Vérifier que la page existe
  const pageExists = await verifyNotionPage(page_id);
  
  if (!pageExists) {
    throw new Error(`Notion page ${page_id} not found or not accessible`);
  }

  // Mapper les propriétés selon le schéma Notion
  const notionProperties = mapToNotionProperties(update_data.properties || {});

  // Préparer les données de mise à jour
  const updatePayload = {
    properties: {
      'Statut': {
        select: {
          name: update_data.status
        }
      },
      'Dernière mise à jour': {
        date: {
          start: new Date().toISOString()
        }
      },
      ...notionProperties
    }
  };

  // Préparer le contenu si fourni
  let contentBlocks = null;
  if (update_data.content) {
    contentBlocks = parseContentToBlocks(update_data.content);
  }

  return {
    notion_update: updatePayload,
    content_blocks: contentBlocks,
    page_id,
    original_payload: payload
  };
}

// Préparation pour webhook delivery
async function prepareWebhookDelivery(payload: any) {
  const { webhook_url, webhook_data } = payload;

  // Enrichir les données webhook
  const enrichedWebhookData = {
    ...webhook_data,
    timestamp: new Date().toISOString(),
    source: 'windventure_automation',
    webhook_version: '1.0'
  };

  // Préparer les headers
  const headers = {
    'Content-Type': 'application/json',
    'User-Agent': 'Windventure-Webhook/1.0',
    'X-Webhook-Timestamp': Date.now().toString(),
    'X-Webhook-ID': `wh_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  };

  // Ajouter signature si secret configuré
  if (process.env.WEBHOOK_SECRET) {
    const signature = generateWebhookSignature(enrichedWebhookData, process.env.WEBHOOK_SECRET);
    headers['X-Webhook-Signature'] = signature;
  }

  return {
    webhook: {
      url: webhook_url,
      method: 'POST',
      headers,
      body: enrichedWebhookData,
      timeout: payload.timeout_ms,
      retry_count: payload.retry_count
    },
    original_payload: payload
  };
}

// Préparation pour file processing
async function prepareFileProcessing(payload: any) {
  const { file_path, processing_type, options, output_path } = payload;

  // Vérifier que le fichier existe et est accessible
  const fileInfo = await getFileInfo(file_path);
  
  if (!fileInfo.exists) {
    throw new Error(`File not found: ${file_path}`);
  }

  // Préparer les options selon le type de processing
  const processingConfig = getProcessingConfig(processing_type, options);

  return {
    file: {
      input_path: file_path,
      output_path,
      size_bytes: fileInfo.size,
      mime_type: fileInfo.mime_type,
      last_modified: fileInfo.last_modified
    },
    processing: {
      type: processing_type,
      config: processingConfig,
      estimated_duration: estimateProcessingTime(fileInfo.size, processing_type)
    },
    original_payload: payload
  };
}

// Préparer les connexions et authentifications
async function prepareConnections(jobType: string, enrichedData: any) {
  const connections = {};

  switch (jobType) {
    case 'booking_sync':
      connections['supabase'] = {
        url: process.env.NEXT_PUBLIC_SUPABASE_URL,
        key: process.env.SUPABASE_SERVICE_ROLE_KEY,
        ready: true
      };
      connections['stripe'] = {
        key: process.env.STRIPE_SECRET_KEY,
        webhook_secret: process.env.STRIPE_WEBHOOK_SECRET,
        ready: true
      };
      break;

    case 'email_investor':
      connections['email_service'] = {
        provider: process.env.EMAIL_PROVIDER || 'resend',
        api_key: process.env.RESEND_API_KEY,
        ready: !!process.env.RESEND_API_KEY
      };
      break;

    case 'notion_update':
      connections['notion'] = {
        api_key: process.env.NOTION_TOKEN,
        version: '2022-06-28',
        ready: !!process.env.NOTION_TOKEN
      };
      break;
  }

  return connections;
}

// Fonctions utilitaires
async function fetchPackageDetails(packageId: string) {
  // TODO: Remplacer par un vrai appel à ta base de données
  return {
    id: packageId,
    title: 'Package Kitesurf Dakhla',
    description: 'Session kitesurf à Dakhla avec matériel inclus',
    base_price: 150,
    currency: 'EUR'
  };
}

function calculateBookingPricing(bookingData: any, packageData: any) {
  const unitPrice = packageData.base_price;
  const subtotal = unitPrice * bookingData.participants;
  const taxRate = 0.20; // 20% TVA
  const taxAmount = Math.round(subtotal * taxRate * 100) / 100;
  const total = subtotal + taxAmount;

  return {
    unit_price: unitPrice,
    unit_price_cents: unitPrice * 100,
    subtotal,
    subtotal_cents: subtotal * 100,
    tax_rate: taxRate,
    tax_amount: taxAmount,
    tax_amount_cents: Math.round(taxAmount * 100),
    total_price: total,
    total_price_cents: Math.round(total * 100)
  };
}

function generateBookingReference(bookingId: string): string {
  return `WV-${bookingId.slice(-8).toUpperCase()}`;
}

async function verifyStripeCustomer(customerId: string): Promise<boolean> {
  // TODO: Appel Stripe API pour vérifier
  return true;
}

async function fetchInvestorProfile(email: string) {
  // TODO: Fetch depuis ta DB d'investisseurs
  return null;
}

function generatePersonalization(investorData: any): string {
  if (!investorData) return '';
  return `Nous apprécions votre intérêt pour ${investorData.sector || 'notre secteur'}.`;
}

async function verifyNotionPage(pageId: string): Promise<boolean> {
  // TODO: Appel Notion API
  return true;
}

function mapToNotionProperties(properties: any): any {
  // TODO: Mapper selon ton schéma Notion
  return properties;
}

function parseContentToBlocks(content: string): any[] {
  return [{ 
    object: 'block',
    type: 'paragraph',
    paragraph: { 
      rich_text: [{ type: 'text', text: { content } }] 
    }
  }];
}

function generateWebhookSignature(data: any, secret: string): string {
  const crypto = require('crypto');
  return crypto
    .createHmac('sha256', secret)
    .update(JSON.stringify(data))
    .digest('hex');
}

async function getFileInfo(filePath: string) {
  // TODO: Vérification fichier système
  return {
    exists: true,
    size: 1024,
    mime_type: 'image/jpeg',
    last_modified: new Date().toISOString()
  };
}

function getProcessingConfig(type: string, options: any) {
  const configs = {
    image_resize: {
      width: options?.width || 800,
      height: options?.height || 600,
      quality: options?.quality || 80
    },
    pdf_generate: {
      format: options?.format || 'A4',
      orientation: options?.orientation || 'portrait'
    }
  };
  
  return configs[type] || {};
}

function estimateProcessingTime(sizeBytes: number, type: string): number {
  // Estimation en secondes
  const baseTime = { image_resize: 2, pdf_generate: 5, csv_parse: 1, zip_extract: 3 };
  return (baseTime[type] || 2) + Math.floor(sizeBytes / (1024 * 1024));
}

function getEstimatedDuration(jobType: string): number {
  const durations = {
    booking_sync: 45,
    stripe_setup: 30,
    email_investor: 15,
    notion_update: 10,
    webhook_delivery: 5,
    file_processing: 60
  };
  return durations[jobType] || 30;
}

function getResourceRequirements(jobType: string) {
  return {
    memory_mb: jobType === 'file_processing' ? 512 : 128,
    cpu_cores: 1,
    network_calls: jobType === 'webhook_delivery' ? 1 : 3
  };
}

function getDependencies(jobType: string, enrichedData: any): string[] {
  const deps = {
    booking_sync: ['supabase', 'stripe', 'email'],
    stripe_setup: ['stripe'],
    email_investor: ['email_service'],
    notion_update: ['notion'],
    webhook_delivery: ['http_client'],
    file_processing: ['file_system']
  };
  return deps[jobType] || [];
}