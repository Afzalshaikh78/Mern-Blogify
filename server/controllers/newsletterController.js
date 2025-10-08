import Subscriber from "../models/Subscriber.js";
import transporter from "../utils/sendEmail.js";

// 1. Subscribe user
export const subscribe = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: "Email is required" });

    // check if already subscribed
    const exists = await Subscriber.findOne({ email });

    if (exists) return res.json({ message: "Already subscribed" });

    await Subscriber.create({ email });

    // send welcome mail
    // await sendEmail({
    //   to: email,
    //   subject: "🎉 Thanks for subscribing!",
    //   html: `<h2>Welcome to our Blog!</h2>
    //          <p>You’ll get notified when we publish new posts.</p>`,
    // });

    // res.json({ message: "Subscribed successfully" });
    const mailOptions = {
      from: process.env.SENDER_EMAIL,
      to: email,
      subject: "Welcome",
      html: `<h2>Welcome to our Blog!</h2>
              <p>You’ll get notified when we publish new posts.</p>`,
    };

    await transporter.sendMail(mailOptions);
    res.json({ message: "Subscribed successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// 2. Notify all subscribers when a new blog is added
// export const notifySubscribers = async (post) => {
//   try {
//     const subscribers = await Subscriber.find();
//     if (!subscribers.length) return;

//     const subject = `📰 New Blog: ${post.title}`;
//     const html = `
//       <h2>${post.title}</h2>
//       <p>${post.excerpt || post.content.slice(0, 150)}...</p>
//       <a href="${process.env.FRONTEND_URL}/blog/${post.slug}">Read More</a>
//     `;

//     for (const sub of subscribers) {
//       await sendEmail({ to: sub.email, subject, html });
//     }

//     console.log("✅ Notified all subscribers");
//   } catch (err) {
//     console.error("Error sending notifications:", err);
//   }
// };
