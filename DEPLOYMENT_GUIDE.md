# 🚀 Render Deployment Guide

## Prerequisites
1. GitHub account with your code pushed
2. Render account (free)
3. MongoDB Atlas account (free)

## Step 1: Set up MongoDB Atlas

1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a free account
3. Create a new cluster (free tier)
4. Create a database user
5. Whitelist your IP (or use 0.0.0.0/0 for all IPs)
6. Get your connection string

## Step 2: Deploy Backend on Render

1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click "New +" → "Web Service"
3. Connect your GitHub repository
4. Configure:
   - **Name**: `portfolio-backend`
   - **Environment**: `Python 3`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn server:app --host 0.0.0.0 --port $PORT`
   - **Plan**: Free

5. Add Environment Variables:
   - `MONGO_URL`: Your MongoDB Atlas connection string
   - `DB_NAME`: `portfolio_db`
   - `CORS_ORIGINS`: `https://your-frontend-url.onrender.com` (update after frontend deployment)

6. Click "Create Web Service"

## Step 3: Deploy Frontend on Render

1. In Render Dashboard, click "New +" → "Static Site"
2. Connect your GitHub repository
3. Configure:
   - **Name**: `portfolio-frontend`
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `build`
   - **Plan**: Free

4. Add Environment Variables:
   - `REACT_APP_BACKEND_URL`: `https://your-backend-url.onrender.com`

5. Click "Create Static Site"

## Step 4: Update CORS Settings

1. Go to your backend service on Render
2. Update the `CORS_ORIGINS` environment variable with your frontend URL
3. Redeploy the backend service

## Step 5: Test Your Deployment

1. Visit your frontend URL
2. Test all functionality
3. Check browser console for any errors

## Environment Variables Summary

### Backend (.env)
```
MONGO_URL=mongodb+srv://username:password@cluster.mongodb.net/
DB_NAME=portfolio_db
CORS_ORIGINS=https://your-frontend-service.onrender.com
```

### Frontend (.env)
```
REACT_APP_BACKEND_URL=https://your-backend-service.onrender.com
```

## Troubleshooting

### Common Issues:
1. **CORS Errors**: Make sure CORS_ORIGINS includes your frontend URL
2. **Build Failures**: Check build logs in Render dashboard
3. **Database Connection**: Verify MongoDB Atlas connection string
4. **Environment Variables**: Ensure all required variables are set

### Render Free Tier Limitations:
- Services sleep after 15 minutes of inactivity
- Cold starts may take 30-60 seconds
- 750 hours/month limit (usually sufficient for portfolios)

## Custom Domain (Optional)

1. In Render dashboard, go to your service
2. Click "Settings" → "Custom Domains"
3. Add your domain
4. Update DNS records as instructed

## Monitoring

- Check Render dashboard for service health
- Monitor MongoDB Atlas for database usage
- Use browser dev tools to debug frontend issues

## Cost

- **Render**: Free tier (750 hours/month)
- **MongoDB Atlas**: Free tier (512MB storage)
- **Total**: $0/month

---

🎉 **Congratulations!** Your portfolio is now live on Render!
