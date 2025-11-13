import type { APIRoute } from "astro";
import { sendLeadEmail } from "../../server/email";
import { writeFile, mkdir } from "node:fs/promises";
import { randomUUID } from "node:crypto";
import { trackApiError, trackEmailError } from "../../../sentry.server.config.js";

export const POST: APIRoute = async ({ request }) => {
  // Validate request size (max 1MB for form submissions)
  const contentLength = parseInt(request.headers.get("content-length") || "0");
  const MAX_BODY_SIZE = 1_048_576; // 1MB
  
  if (contentLength > MAX_BODY_SIZE) {
    trackApiError('POST', '/api/lead', 413, new Error('Payload too large'), {
      contentLength: contentLength.toString()
    });
    return new Response(JSON.stringify({ 
      error: "Request payload too large", 
      code: "PAYLOAD_TOO_LARGE",
      maxSize: "1MB"
    }), { 
      status: 413,
      headers: { 'Content-Type': 'application/json' }
    });
  }
  
  const contentType = request.headers.get("content-type") || "";

  try {
    let data: Record<string, unknown> = {};
    if (contentType.includes("application/json")) {
      data = await request.json();
    } else if (
      contentType.includes("application/x-www-form-urlencoded") ||
      contentType.includes("multipart/form-data")
    ) {
      const form = await request.formData();
      for (const [key, value] of form.entries()) data[key] = value as string;
    } else {
      data = await request.json().catch(() => ({}));
    }
    const payload = {
      name: String((data as any).name || "").trim(),
      phone: String((data as any).phone || "").trim(),
      businessType: String((data as any).businessType || "N/A").trim() || "N/A",
      niche: String((data as any).niche || "General").trim() || "General",
      notes: String((data as any).notes || (data as any).message || "").trim(),
      source: String((data as any).source || "").trim() || "unknown",
    };
    // Validate required fields
    if (!payload.name || !payload.phone) {
      trackApiError('POST', '/api/lead', 400, new Error('Missing required fields'), {
        missing_fields: `${!payload.name ? 'name ' : ''}${!payload.phone ? 'phone' : ''}`.trim()
      });
      return new Response(JSON.stringify({ error: "Missing required fields", code: "VALIDATION_ERROR" }), {
        status: 400,
      });
    }

    try {
      // Send email with error tracking
      const res = await sendLeadEmail({
        name: payload.name,
        email: "",
        business: payload.businessType,
        niche: payload.niche,
        message: `${payload.notes}\n\nPhone: ${payload.phone}\nSource: ${payload.source}`,
      });

      // Store lead data in development
      if (process.env.NODE_ENV !== "production") {
        try {
          const dir = new URL("../../data/leads/", import.meta.url);
          await mkdir(dir, { recursive: true });
          const file = new URL(`${Date.now()}-${randomUUID()}.json`, dir);
          await writeFile(
            file,
            JSON.stringify(
              { ...payload, createdAt: new Date().toISOString(), email: res },
              null,
              2,
            ),
          );
        } catch (fileError) {
          // Log file storage error but don't fail the request
          trackApiError('POST', '/api/lead', 500, fileError, {
            operation: 'file_storage',
            lead_id: payload.name + '_' + Date.now()
          });
        }
      }

      return new Response(JSON.stringify({
        ok: true,
        message: "Lead submitted successfully"
      }), {
        status: 200,
        headers: {
          'Content-Type': 'application/json'
        }
      });

    } catch (emailError) {
      // Track email service errors
      trackEmailError('resend', 'send_lead_email', emailError, {
        lead_name: payload.name,
        business_type: payload.businessType
      });

      return new Response(JSON.stringify({
        error: "Failed to process lead submission",
        code: "EMAIL_ERROR"
      }), {
        status: 500,
      });
    }

  } catch (validationError) {
    // Track validation/parsing errors
    trackApiError('POST', '/api/lead', 400, validationError, {
      operation: 'request_parsing',
      content_type: contentType
    });

    return new Response(JSON.stringify({
      error: "Invalid request format",
      code: "PARSE_ERROR"
    }), {
      status: 400,
    });
  }
};
