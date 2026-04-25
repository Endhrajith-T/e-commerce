"use client";

const ADMIN_WHATSAPP = "919342489248";

export default function ConsultationSection() {
  const bookSession = () => {
    const message = encodeURIComponent(
      "Hi Naresh Sir! 👋\n\nI'm interested in booking a *One-to-One Session* (₹300/session).\n\nPlease let me know the available slots. 🙏"
    );
    window.open(`https://wa.me/${ADMIN_WHATSAPP}?text=${message}`, "_blank");
  };

  return (
    <section id="consultation">
      <div className="cgd" />
      <div className="cin">
        <div className="ch rr">
          <div className="dr" style={{ justifyContent: "center" }}>
            <div className="drl" style={{ maxWidth: 32 }} />
            <div className="drd" />
            <span className="ey" style={{ flex: 0, color: "rgba(201,168,76,.7)" }}>Personalised Guidance</span>
            <div className="drd" />
            <div className="drl" style={{ maxWidth: 32 }} />
          </div>
          <h2 className="cth">Learn directly from<br /><em>the author himself</em></h2>
          <p className="csub">Focused sessions designed for CBSE and State Board students.<br />Clear your doubts. Strengthen your board preparation.</p>
        </div>
        <div className="ccs rr d1">
          <div className="cc">
            <div className="cnum">01</div>
            <div className="cir"><svg viewBox="0 0 24 24"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg></div>
            <div className="cch">One-to-One Session</div>
            <div className="ccm">Private · Focused · Tailored</div>
            <p className="ccb">A private hour entirely focused on your syllabus — Business Studies, Accountancy, or Economics. Bring your doubts, unsolved problems, or exam fear. Leave with clarity and a plan.</p>
            <ul className="clist">
              <li>Subject-specific concept clearing</li>
              <li>Accountancy problem-solving walkthroughs</li>
              <li>Answer writing & presentation feedback</li>
              <li>Board exam strategy & chapter prioritisation</li>
              <li>60-minute Google Meet session</li>
            </ul>
            <div className="cpb">
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <span style={{ textDecoration: "line-through", opacity: 0.5, fontSize: "1.1rem", color: "inherit" }}>₹ 500</span>
                  <div className="cpa">₹ 300</div>
                </div>
                <div className="cpn">per session</div>
              </div>
              <button className="ccta" onClick={bookSession}>📲 Book on WhatsApp</button>
            </div>
          </div>
        </div>
        <p className="cfn rr d2">Google Meet <span>·</span> Mon-Sat <span>·</span> IST Timezone <span>·</span> Limited slots each week</p>
      </div>
    </section>
  );
}