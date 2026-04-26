const axios = require('axios');
const jwt = require('jsonwebtoken');
const supabase = require('../config/supabaseClient');

const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID;
const GITHUB_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET;
const JWT_SECRET = process.env.JWT_SECRET;
const REDIRECT_URI = process.env.NODE_ENV === 'production' || process.env.NETLIFY 
  ? 'https://classy-cat-d46041.netlify.app/api/auth/github/callback'
  : 'http://127.0.0.1:5000/api/auth/github/callback';

// Step 1: Redirect user to GitHub
exports.githubLogin = (req, res) => {
    const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${GITHUB_CLIENT_ID}&redirect_uri=${REDIRECT_URI}&scope=read:user user:email repo`;
    res.redirect(githubAuthUrl);
};

// Step 2: Handle callback from GitHub
exports.githubCallback = async (req, res) => {
    const code = req.query.code;
    
    if (!code) {
        return res.status(400).send('No code provided');
    }

    try {
        // Exchange code for access token
        const tokenResponse = await axios.post('https://github.com/login/oauth/access_token', {
            client_id: GITHUB_CLIENT_ID,
            client_secret: GITHUB_CLIENT_SECRET,
            code: code,
            redirect_uri: REDIRECT_URI
        }, {
            headers: {
                accept: 'application/json'
            }
        });

        const accessToken = tokenResponse.data.access_token;
        if (!accessToken) {
             return res.status(400).send('Failed to get access token');
        }

        // Get user profile from GitHub
        const userResponse = await axios.get('https://api.github.com/user', {
            headers: {
                Authorization: `token ${accessToken}`
            }
        });

        const githubUser = userResponse.data;
        const githubId = githubUser.id.toString();
        const username = githubUser.login;
        const avatarUrl = githubUser.avatar_url;

        // Check if user exists in Supabase
        let { data: existingUser, error: fetchError } = await supabase
            .from('users')
            .select('*')
            .eq('github_id', githubId)
            .single();

        let userId;

        if (!existingUser) {
            // Check if email exists to link account, or purely create
            const { data: newUser, error: insertError } = await supabase
                .from('users')
                .insert([{ 
                    github_id: githubId, 
                    username: username, 
                    avatar_url: avatarUrl, 
                    access_token: accessToken 
                }])
                .select()
                .single();
                
            if (insertError) throw insertError;
            userId = newUser.id;
            existingUser = newUser;
        } else {
            // Update existing user's access token and avatar
            const { data: updatedUser, error: updateError } = await supabase
                .from('users')
                .update({ 
                    access_token: accessToken, 
                    avatar_url: avatarUrl 
                })
                .eq('github_id', githubId)
                .select()
                .single();
                
            if (updateError) throw updateError;
            userId = existingUser.id;
            existingUser = updatedUser;
        }

        // Generate our own JWT
        const payload = {
            user: { id: userId, username: existingUser.username }
        };
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '7d' });

        // Redirect to frontend dashboard with token
        // In local: http://127.0.0.1:5173
        // In Prod: https://classy-cat-d46041.netlify.app
        const frontendUrl = process.env.NODE_ENV === 'production' || process.env.NETLIFY 
            ? 'https://classy-cat-d46041.netlify.app/github-auth-success'
            : 'http://127.0.0.1:5173/github-auth-success';
            
        res.redirect(`${frontendUrl}?token=${token}`);

    } catch (err) {
        console.error('GitHub Auth Error', err.response?.data || err.message);
        res.status(500).send('Authentication failed');
    }
};
