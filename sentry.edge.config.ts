import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  enabled: process.env.NODE_ENV === "production",
  tracesSampleRate: 0.1,

  beforeSend(event) {
    // Scrub reflection content from all error events
    if (event.extra) {
      for (const key of Object.keys(event.extra)) {
        if (
          key === "content" ||
          key === "reflectionContent" ||
          key === "layerContent" ||
          key === "title" ||
          key === "consumeReason"
        ) {
          event.extra[key] = "[REDACTED]";
        }
      }
    }

    if (event.breadcrumbs) {
      for (const breadcrumb of event.breadcrumbs) {
        if (breadcrumb.data) {
          for (const key of Object.keys(breadcrumb.data)) {
            if (
              key === "content" ||
              key === "reflectionContent" ||
              key === "layerContent" ||
              key === "title" ||
              key === "consumeReason"
            ) {
              breadcrumb.data[key] = "[REDACTED]";
            }
          }
        }
      }
    }

    if (event.request?.data) {
      const data = event.request.data;
      if (typeof data === "object" && data !== null) {
        const d = data as Record<string, unknown>;
        if ("content" in d) d.content = "[REDACTED]";
        if ("reflectionContent" in d) d.reflectionContent = "[REDACTED]";
        if ("layerContent" in d) d.layerContent = "[REDACTED]";
        if ("title" in d) d.title = "[REDACTED]";
        if ("consumeReason" in d) d.consumeReason = "[REDACTED]";
      }
    }

    return event;
  },
});
