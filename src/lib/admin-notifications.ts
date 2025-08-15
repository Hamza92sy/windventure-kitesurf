'use client';

import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

interface AdminNotificationData {
  type: 'new_booking' | 'payment_failed' | 'system_alert' | 'user_action';
  title: string;
  message: string;
  data?: any;
  priority: 'low' | 'medium' | 'high' | 'critical';
  recipient_emails?: string[];
}

interface BookingNotificationData {
  booking_id: string;
  customer_name: string;
  customer_email: string;
  package_name: string;
  total_amount: number;
  check_in: string;
  check_out: string;
}

interface PaymentFailedData {
  booking_id: string;
  customer_name: string;
  amount: number;
  error_message: string;
}

// Templates d'emails pour l'admin
const getEmailTemplate = (type: string, data: any) => {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://windventure.fr';

  switch (type) {
    case 'new_booking':
      const booking = data as BookingNotificationData;
      return {
        subject: `🏄‍♂️ Nouvelle réservation - ${booking.customer_name}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 20px; text-align: center;">
              <h1 style="color: white; margin: 0;">Nouvelle Réservation Windventure</h1>
            </div>
            
            <div style="padding: 30px; background: #f8f9fa;">
              <h2 style="color: #2c3e50; margin-bottom: 20px;">📋 Détails de la réservation</h2>
              
              <div style="background: white; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
                <p><strong>Client:</strong> ${booking.customer_name}</p>
                <p><strong>Email:</strong> ${booking.customer_email}</p>
                <p><strong>Package:</strong> ${booking.package_name}</p>
                <p><strong>Montant:</strong> ${booking.total_amount}€</p>
                <p><strong>Arrivée:</strong> ${new Date(booking.check_in).toLocaleDateString('fr-FR')}</p>
                <p><strong>Départ:</strong> ${new Date(booking.check_out).toLocaleDateString('fr-FR')}</p>
              </div>
              
              <div style="text-align: center; margin-top: 30px;">
                <a href="${baseUrl}/admin/bookings" 
                   style="background: #667eea; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">
                  🔍 Voir dans l'admin
                </a>
              </div>
            </div>
            
            <div style="background: #2c3e50; padding: 20px; text-align: center; color: white;">
              <p style="margin: 0;">Windventure Admin • ${new Date().toLocaleDateString('fr-FR')}</p>
            </div>
          </div>
        `,
      };

    case 'payment_failed':
      const payment = data as PaymentFailedData;
      return {
        subject: `🚨 Échec de paiement - ${payment.customer_name}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: linear-gradient(135deg, #dc3545 0%, #c82333 100%); padding: 20px; text-align: center;">
              <h1 style="color: white; margin: 0;">⚠️ Échec de Paiement</h1>
            </div>
            
            <div style="padding: 30px; background: #f8f9fa;">
              <div style="background: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 6px; margin-bottom: 20px;">
                <p style="margin: 0; color: #856404;"><strong>Action requise:</strong> Un paiement a échoué et nécessite votre attention.</p>
              </div>
              
              <div style="background: white; padding: 20px; border-radius: 8px;">
                <p><strong>Client:</strong> ${payment.customer_name}</p>
                <p><strong>Réservation:</strong> #${payment.booking_id}</p>
                <p><strong>Montant:</strong> ${payment.amount}€</p>
                <p><strong>Erreur:</strong> ${payment.error_message}</p>
              </div>
              
              <div style="text-align: center; margin-top: 30px;">
                <a href="${baseUrl}/admin/payments" 
                   style="background: #dc3545; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">
                  🔍 Gérer le paiement
                </a>
              </div>
            </div>
          </div>
        `,
      };

    case 'system_alert':
      return {
        subject: `🔔 Alerte Système Windventure`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: linear-gradient(135deg, #f39c12 0%, #e67e22 100%); padding: 20px; text-align: center;">
              <h1 style="color: white; margin: 0;">🔔 Alerte Système</h1>
            </div>
            
            <div style="padding: 30px; background: #f8f9fa;">
              <div style="background: white; padding: 20px; border-radius: 8px;">
                <h3>${data.title}</h3>
                <p>${data.message}</p>
                ${data.details ? `<pre style="background: #f1f2f6; padding: 10px; border-radius: 4px; overflow-x: auto;">${JSON.stringify(data.details, null, 2)}</pre>` : ''}
              </div>
              
              <div style="text-align: center; margin-top: 30px;">
                <a href="${baseUrl}/admin" 
                   style="background: #f39c12; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">
                  🔍 Voir le dashboard
                </a>
              </div>
            </div>
          </div>
        `,
      };

    default:
      return {
        subject: `Notification Windventure`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: #667eea; padding: 20px; text-align: center;">
              <h1 style="color: white; margin: 0;">Windventure Admin</h1>
            </div>
            <div style="padding: 30px;">
              <h3>${data.title}</h3>
              <p>${data.message}</p>
            </div>
          </div>
        `,
      };
  }
};

// Fonction principale pour envoyer une notification admin
export async function sendAdminNotification(
  notificationData: AdminNotificationData
) {
  try {
    // Emails des admins (à configurer via env ou base de données)
    const adminEmails =
      notificationData.recipient_emails ||
      ([process.env.ADMIN_EMAIL, 'admin@windventure.fr'].filter(
        Boolean
      ) as string[]);

    if (adminEmails.length === 0) {
      console.warn('⚠️ Aucun email admin configuré pour les notifications');
      return { success: false, error: 'No admin emails configured' };
    }

    const template = getEmailTemplate(
      notificationData.type,
      notificationData.data
    );

    // Envoyer l'email via Resend
    const result = await resend.emails.send({
      from: 'Windventure Admin <admin@windventure.fr>',
      to: adminEmails,
      subject: template.subject,
      html: template.html,
      tags: [
        { name: 'type', value: notificationData.type },
        { name: 'priority', value: notificationData.priority },
        { name: 'source', value: 'admin-system' },
      ],
    });

    console.log(
      `📧 [ADMIN_NOTIFICATION] ${notificationData.type} envoyée à ${adminEmails.length} admin(s)`
    );

    return {
      success: true,
      result,
      sent_to: adminEmails,
    };
  } catch (error) {
    console.error('❌ [ADMIN_NOTIFICATION_ERROR]', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

// Notifications spécialisées
export async function notifyNewBooking(bookingData: BookingNotificationData) {
  return sendAdminNotification({
    type: 'new_booking',
    title: 'Nouvelle réservation',
    message: `Nouvelle réservation de ${bookingData.customer_name}`,
    data: bookingData,
    priority: 'medium',
  });
}

export async function notifyPaymentFailed(paymentData: PaymentFailedData) {
  return sendAdminNotification({
    type: 'payment_failed',
    title: 'Échec de paiement',
    message: `Paiement échoué pour ${paymentData.customer_name}`,
    data: paymentData,
    priority: 'high',
  });
}

export async function notifySystemAlert(
  title: string,
  message: string,
  details?: any
) {
  return sendAdminNotification({
    type: 'system_alert',
    title,
    message,
    data: { title, message, details },
    priority: 'critical',
  });
}

// Fonction pour envoyer un résumé quotidien
export async function sendDailySummary() {
  try {
    // Cette fonction sera appelée via un cron job
    // Elle récupère les stats de la journée et envoie un email de résumé

    const today = new Date();
    const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000);

    // Ici on ferait des requêtes à Supabase pour récupérer les stats
    const summaryData = {
      date: today.toLocaleDateString('fr-FR'),
      newBookings: 3, // à récupérer de Supabase
      totalRevenue: 1250, // à récupérer de Supabase
      pendingPayments: 2, // à récupérer de Supabase
      failedPayments: 0, // à récupérer de Supabase
    };

    return sendAdminNotification({
      type: 'system_alert',
      title: '📊 Résumé quotidien',
      message: "Voici le résumé des activités d'hier",
      data: summaryData,
      priority: 'low',
    });
  } catch (error) {
    console.error('❌ [DAILY_SUMMARY_ERROR]', error);
    return { success: false, error };
  }
}

// Types pour l'export
export type {
  AdminNotificationData,
  BookingNotificationData,
  PaymentFailedData,
};
