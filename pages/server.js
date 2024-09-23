const express = require('express');
const fs = require('fs');
const path = require('path');
const nodemailer = require('nodemailer');
const app = express();
const port = 3000;
const cors = require('cors');

// Load environment variables
require('dotenv').config();
// Middleware to parse JSON bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname)));

// Load posts from JSON file
function loadPosts() {
    try {
        const data = fs.readFileSync(path.join(__dirname, 'posts.json'), 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error('Error loading posts:', error);
        return [];
    }
}

// Save posts to JSON file
function savePosts(posts) {
    try {
        fs.writeFileSync(path.join(__dirname, 'posts.json'), JSON.stringify(posts, null, 2));
    } catch (error) {
        console.error('Error saving posts:', error);
    }
}

// Route to add a new post
app.post('/add-post', (req, res) => {
    const posts = loadPosts();
    const newPost = req.body;
    posts.push(newPost);
    savePosts(posts);
    res.json({ success: true });
});

// Route to get all posts
app.get('/posts', (req, res) => {
    const posts = loadPosts();
    res.json(posts);
});

// Route to delete a post by title
app.delete('/delete-post', (req, res) => {
    const posts = loadPosts();
    const title = req.query.title;
    const updatedPosts = posts.filter(post => post.title !== title);
    savePosts(updatedPosts);
    res.json({ success: true });
});

// Serve the index.html file at the root URL
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'landing.html'));
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});

// Serve the contact.html file
app.get('/contact', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'contact.html'));
});

// Route to handle contact form submissions
app.post('/send-email', async (req, res) => {
    const { name, email, subject, message } = req.body;

    // Validate form data
    if (!name || !email || !subject || !message) {
        return res.status(400).json({ error: 'Please fill in all fields.' });
    }

    // Create transporter
    let transporter = nodemailer.createTransport({
        service: 'Gmail', // or other service
        auth: {
            user: process.env.EMAIL_USER, // Use environment variables
            pass: process.env.EMAIL_PASS
        }
    });

    // Define email options
    let mailOptions = {
        from: `"${name}" <${email}>`,
        to: 'youremail@gmail.com', // Replace with your email
        subject: `New Contact Form Submission: ${subject}`,
        text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`
    };

    try {
        await transporter.sendMail(mailOptions);
        res.json({ success: 'Thank you! Your message has been sent.' });
    } catch (error) {
        console.error('Error sending email:', error);
        res.status(500).json({ error: 'Oops! Something went wrong, and we couldn\'t send your message.' });
    }
});
