// Content Security Policy configuration
export function getCspHeaders() {
  // Define CSP directives
  const directives = {
    'default-src': ["'self'"],
    'script-src': ["'self'", "'unsafe-inline'", "'unsafe-eval'", 'https://js.stripe.com'],
    'style-src': ["'self'", "'unsafe-inline'"],
    'img-src': ["'self'", 'data:', 'https:', 'blob:'],
    'font-src': ["'self'", 'data:'],
    'connect-src': ["'self'", process.env.NEXT_PUBLIC_SUPABASE_URL || '', 'https://api.stripe.com'],
    'frame-src': ["'self'", 'https://js.stripe.com'],
    'object-src': ["'none'"],
    'base-uri': ["'self'"],
    'form-action': ["'self'"],
  };

  // Convert directives to CSP string
  const csp = Object.entries(directives)
    .map(([key, values]) => `${key} ${values.join(' ')}`)
    .join('; ');

  return csp;
} 