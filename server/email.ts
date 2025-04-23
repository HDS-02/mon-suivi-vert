import sgMail from '@sendgrid/mail';

// Initialiser SendGrid avec la clé API
if (process.env.SENDGRID_API_KEY) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
} else {
  console.warn("Clé API SendGrid non configurée. Les emails ne seront pas envoyés.");
}

interface EmailOptions {
  to: string;
  subject: string;
  text?: string;
  html?: string;
}

/**
 * Envoie un email via SendGrid
 */
export async function sendEmail({ to, subject, text, html }: EmailOptions): Promise<boolean> {
  try {
    if (!process.env.SENDGRID_API_KEY) {
      console.warn("Tentative d'envoi d'email sans clé API SendGrid configurée");
      return false;
    }

    // Configuration de l'expéditeur - à remplacer avec votre adresse d'envoi vérifiée sur SendGrid
    const from = 'noreply@monsuivivert.fr';

    const msg = {
      to,
      from,
      subject,
      text: text || '',
      html: html || ''
    };

    await sgMail.send(msg);
    console.log(`Email envoyé avec succès à ${to}`);
    return true;
  } catch (error: any) {
    console.error('Erreur lors de l\'envoi de l\'email:', error);
    if (error.response) {
      console.error('Détails de l\'erreur SendGrid:', error.response.body);
    }
    return false;
  }
}

/**
 * Envoie un email de bienvenue/confirmation d'inscription
 */
export async function sendWelcomeEmail(email: string, firstName: string = ''): Promise<boolean> {
  const username = firstName || email.split('@')[0];
  
  const subject = 'Bienvenue sur Mon Suivi Vert !';
  
  const text = `
    Bonjour ${username},
    
    Nous sommes ravis de vous accueillir sur Mon Suivi Vert, votre application de suivi et d'analyse de plantes.
    
    Votre compte a été créé avec succès et vous pouvez dès maintenant commencer à suivre l'évolution de vos plantes,
    recevoir des conseils personnalisés et bénéficier de notre analyse par IA.
    
    N'hésitez pas à nous contacter si vous avez des questions.
    
    L'équipe Mon Suivi Vert
  `;
  
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background-color: #4CAF50; padding: 20px; text-align: center; color: white;">
        <h1>Bienvenue sur Mon Suivi Vert !</h1>
      </div>
      <div style="padding: 20px; background-color: #f9f9f9;">
        <p>Bonjour <strong>${username}</strong>,</p>
        
        <p>Nous sommes ravis de vous accueillir sur <strong>Mon Suivi Vert</strong>, votre application de suivi et d'analyse de plantes.</p>
        
        <p>Votre compte a été créé avec succès et vous pouvez dès maintenant :</p>
        
        <ul>
          <li>Ajouter vos plantes à votre collection</li>
          <li>Analyser leur état de santé avec notre IA</li>
          <li>Recevoir des rappels d'entretien personnalisés</li>
          <li>Suivre l'évolution de vos plantes</li>
        </ul>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="https://monsuivivert.fr" style="background-color: #4CAF50; color: white; padding: 12px 20px; text-decoration: none; border-radius: 4px; font-weight: bold;">
            Accéder à mon compte
          </a>
        </div>
        
        <p>N'hésitez pas à nous contacter si vous avez des questions.</p>
        
        <p>Cordialement,<br>L'équipe Mon Suivi Vert</p>
      </div>
      <div style="background-color: #eeeeee; padding: 15px; text-align: center; color: #666; font-size: 12px;">
        <p>© ${new Date().getFullYear()} Mon Suivi Vert. Tous droits réservés.</p>
      </div>
    </div>
  `;
  
  return sendEmail({ to: email, subject, text, html });
}