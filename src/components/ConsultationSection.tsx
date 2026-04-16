"use client";
import { useCart } from "@/hooks/useCart";
import { useToast } from "@/context/ToastContext";

export default function ConsultationSection() {
  const { addToCart } = useCart();
  const { showToast } = useToast();

  const addSession = (name: string, price: number, coverClass: string) => {
    addToCart({ id: name, name, price, icon: "📋", coverClass, qty: 1 });
    showToast(`Added to cart — ${name}`);
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
            <div className="cpb"><div><div className="cpa">₹ 2,500</div><div className="cpn">per session</div></div><button className="ccta" onClick={() => addSession("One-to-One Session", 2500, "bca4")}>Book Now</button></div>
          </div>
          <div className="cc">
            <div className="cnum">02</div>
            <div className="cir"><svg viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg></div>
            <div className="cch">Group Masterclass</div>
            <div className="ccm">Many-to-One · Collaborative · Live</div>
            <p className="ccb">A live batch session for 8-15 students on a focused Commerce topic. Naresh teaches, demonstrates with solved examples, and opens the floor for questions. Perfect for pre-board revision.</p>
            <ul className="clist">
              <li>Themed topic — Accounts, BSt, or Economics</li>
              <li>90-minute live interactive session</li>
              <li>Solved examples & case study practice</li>
              <li>Recording shared post-class</li>
              <li>Chapter summary PDF included</li>
            </ul>
            <div className="cpb"><div><div className="cpa">₹ 699</div><div className="cpn">per person</div></div><button className="ccta" onClick={() => addSession("Group Masterclass", 699, "bca6")}>Join Batch</button></div>
          </div>
        </div>
        <p className="cfn rr d2">Google Meet <span>·</span> Mon-Sat <span>·</span> IST Timezone <span>·</span> Limited slots each week</p>
      </div>
    </section>
  );
}