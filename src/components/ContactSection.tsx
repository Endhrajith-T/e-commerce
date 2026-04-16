"use client";
import { FormEvent, useState } from "react";

export default function ContactSection() {
  const [submitted, setSubmitted] = useState(false);
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <section id="contact">
      <div className="csp">
        <div>
          <div className="dr rr"><div className="drl" /><div className="drd" /><span className="ey">Write to Us</span></div>
          <h2 className="coh rr d1">We would love<br /><em>to hear from you</em></h2>
          <p className="cob rr d2">Whether you have a question about a book, wish to book a session, or need help choosing the right material for your boards — write to us. We respond within 24 hours.</p>
          <ul className="cdl rr d2"><li><span className="cdlb">Email</span><span className="cdlv">hello@bookshelf.in</span></li><li><span className="cdlb">Phone</span><span className="cdlv">+91 98400 00000</span></li><li><span className="cdlb">Location</span><span className="cdlv">Chennai, Tamil Nadu, India</span></li><li><span className="cdlb">Hours</span><span className="cdlv">Monday - Saturday, 10 am - 6 pm IST</span></li></ul>
        </div>
        <div className="rr d2">
          {!submitted ? (
            <form id="cf" onSubmit={handleSubmit}>
              <div className="ftw"><div className="ff"><label className="fl">Your Name</label><input className="fi" required placeholder="Meera Krishnan" /></div><div className="ff"><label className="fl">Email Address</label><input className="fi" required type="email" placeholder="you@email.com" /></div></div>
              <div className="ff"><label className="fl">Subject</label><input className="fi" placeholder="Regarding a consultation session..." /></div>
              <div className="ff"><label className="fl">Your Message</label><textarea className="fta" required placeholder="Share your questions, aspirations, or thoughts..." /></div>
              <div className="fbr"><span className="fpnote">We never share your data</span><button type="submit" className="fsb">Send Message</button></div>
            </form>
          ) : <div className="fsm show" id="fsm"><p className="fsmt">Your message has been received.<br />We shall write back shortly.</p></div>}
        </div>
      </div>
    </section>
  );
}