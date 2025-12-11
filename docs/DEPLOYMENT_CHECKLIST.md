# Quick Deployment Checklist

## Before Deploying

- [ ] Push all code to GitHub
- [ ] Get Gemini API key from https://aistudio.google.com/app/apikey
- [ ] Create Render account at https://render.com

## Deploy Backend

1. [ ] New Web Service on Render
2. [ ] Connect GitHub repo: papica777-eng/dpengeneering
3. [ ] Root Directory: `functions`
4. [ ] Build Command: `npm install`
5. [ ] Start Command: `npm start`
6. [ ] Add environment variable: `GEMINI_API_KEY`
7. [ ] Add environment variable: `NODE_ENV=production`
8. [ ] Add environment variable: `PORT=3001`
9. [ ] Deploy and copy the backend URL

## Deploy Frontend

1. [ ] New Static Site on Render
2. [ ] Same GitHub repo
3. [ ] Root Directory: `client`
4. [ ] Build Command: `npm install && npm run build`
5. [ ] Publish Directory: `build`
6. [ ] Add environment variable: `REACT_APP_API_URL=[your backend URL]`
7. [ ] Deploy

## Connect Domain dpengineering.site

### Frontend Domain
1. [ ] In Render frontend settings, add custom domain: `dpengineering.site`
2. [ ] Also add: `www.dpengineering.site`
3. [ ] Copy the CNAME value (e.g., `kodi-frontend.onrender.com`)

### Update DNS (at your domain registrar)
1. [ ] Add CNAME record:
   - Name: `@` or `dpengineering.site`
   - Value: `kodi-frontend.onrender.com`
2. [ ] Add CNAME record:
   - Name: `www`
   - Value: `kodi-frontend.onrender.com`

### Backend API Domain (Optional)
1. [ ] In Render backend settings, add: `api.dpengineering.site`
2. [ ] Add DNS CNAME record:
   - Name: `api`
   - Value: `kodi-backend.onrender.com`
3. [ ] Update frontend env: `REACT_APP_API_URL=https://api.dpengineering.site`

## Wait & Verify

- [ ] Wait 15-30 minutes for DNS propagation
- [ ] Check DNS: https://www.whatsmydns.net/#CNAME/dpengineering.site
- [ ] Test backend: `curl https://api.dpengineering.site/health`
- [ ] Visit: https://dpengineering.site
- [ ] Test the chat interface

## Done! 🎉

Your app is now live at https://dpengineering.site
