"use client";
import * as Sentry from "@sentry/nextjs";

export default function GlobalError({ error }: { error: Error }) {
  Sentry.captureException(error);
  return (
    <html>
      <body>
        <h2>Une erreur est survenue.</h2>
        <p>Notre équipe a été notifiée.</p>
      </body>
    </html>
  );
}
