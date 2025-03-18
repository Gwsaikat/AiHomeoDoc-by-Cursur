# Deploying AI Homeopathy to Netlify

This guide will walk you through the process of deploying your AI Homeopathy application to Netlify.

## Prerequisites

- A Netlify account (sign up at [netlify.com](https://netlify.com) if you don't have one)
- Git repository with your project (GitHub, GitLab, or Bitbucket)

## Deployment Steps

### 1. Connect Your Repository to Netlify

1. Log in to your Netlify account
2. Click on "New site from Git"
3. Choose your Git provider (GitHub, GitLab, or Bitbucket)
4. Authorize Netlify to access your repositories
5. Select the AI Homeopathy repository

### 2. Configure Build Settings

The following settings are already configured in the `netlify.toml` file, but you can verify them in the Netlify UI:

- **Build command**: `next build`
- **Publish directory**: `.next`

### 3. Set Environment Variables

Set up the following environment variables in Netlify (Site settings > Environment variables):

```
NEXT_PUBLIC_SUPABASE_URL=https://tqmupjjzfrhjiljmsbkh.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRxbXVwamp6ZnJoamlsam1zYmtoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE2MTQyNTksImV4cCI6MjA1NzE5MDI1OX0.ScCMlwAQhqSc_6KXPkk6KSVo7otVccFLnonj1HRa5_k
DATABASE_URL=postgresql://postgres:Saikat@7679@db.tqmupjjzfrhjiljmsbkh.supabase.co:5432/postgres
NEXTAUTH_URL=[YOUR_NETLIFY_URL] (e.g. https://aihomeopathy.netlify.app)
NEXTAUTH_SECRET=your-secret-key-for-jwt-goes-here
OPENAI_API_KEY=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
```

**IMPORTANT:** 
- Update `NEXTAUTH_URL` with your actual Netlify URL after deployment
- Consider generating a new, secure `NEXTAUTH_SECRET` for production

### 4. Deploy Your Site

1. Click on "Deploy site"
2. Wait for the build process to complete (this may take a few minutes)
3. Once the deployment is successful, Netlify will provide you with a URL to access your site

### 5. Post-Deployment Configuration

After your first deployment:

1. Go to Site settings > Environment variables
2. Update `NEXTAUTH_URL` with your actual Netlify domain (e.g., https://aihomeopathy.netlify.app)
3. Trigger a new deployment for the changes to take effect

### 6. Custom Domain (Optional)

To use a custom domain:

1. Go to Site settings > Domain management
2. Click on "Add custom domain"
3. Follow the instructions to set up your domain with Netlify

## Troubleshooting

If you encounter any issues during deployment:

1. Check the build logs for errors
2. Verify that all environment variables are set correctly
3. Ensure your Supabase database is accessible from Netlify
4. Make sure you're using the correct version of Node.js (20.x or later)

## Automatic Deployments

By default, Netlify will automatically rebuild and deploy your site whenever you push changes to your connected repository's main branch.

## Performance Monitoring

Netlify provides built-in analytics and performance monitoring. You can access these features from your Netlify dashboard. 