# SSL Certificate Setup

Place your SSL certificate files in this directory:

- `certificate.pem` - Your SSL certificate
- `private-key.pem` - Your private key

## For Production Deployment

1. Obtain SSL certificates from your certificate authority (Let's Encrypt, etc.)
2. Place the certificate files in this directory
3. Update your `.env` file:
   ```
   SSL_ENABLED=true
   SSL_CERT_PATH=./ssl/certificate.pem
   SSL_KEY_PATH=./ssl/private-key.pem
   PUBLIC_URL=https://your-domain.com
   ```

## Security Note

Never commit actual certificate files to version control. Add them to `.gitignore`.