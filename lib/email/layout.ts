export interface EmailShellOptions {
  greeting: string
  intro: string
  rows: [string, string][]
  bodyAfterRows: string
  ctaLabel: string
  ctaUrl: string
  signoff: string
}

export function renderEmailShell(opts: EmailShellOptions): string {
  const rowsHtml = opts.rows
    .map(
      ([label, value]) => `
      <tr>
        <td style="padding:8px 0;color:#6b7280;font-size:14px;">${label}</td>
        <td style="padding:8px 0;color:#111827;font-size:14px;font-weight:600;text-align:right;">${value}</td>
      </tr>`,
    )
    .join('')

  const tableHtml = opts.rows.length
    ? `<table style="width:100%;border-collapse:collapse;border-top:1px solid #e5e7eb;border-bottom:1px solid #e5e7eb;margin:16px 0;">${rowsHtml}</table>`
    : ''

  return `
    <div style="font-family:-apple-system,Segoe UI,Roboto,sans-serif;max-width:480px;margin:0 auto;color:#111827;">
      <p style="font-size:15px;">${opts.greeting}</p>
      <p style="font-size:15px;line-height:1.5;">${opts.intro}</p>
      ${tableHtml}
      <p style="font-size:15px;line-height:1.5;">${opts.bodyAfterRows}</p>
      <p style="margin:24px 0;">
        <a href="${opts.ctaUrl}" style="display:inline-block;background:#4f46e5;color:#ffffff;text-decoration:none;font-size:14px;font-weight:600;padding:10px 20px;border-radius:8px;">
          ${opts.ctaLabel}
        </a>
      </p>
      <p style="font-size:14px;color:#6b7280;">${opts.signoff}<br>— RenewalGuard 🛡️</p>
    </div>
  `
}
