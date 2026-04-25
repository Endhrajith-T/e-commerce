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
      <style>{`
        /* ── Consultation responsive overrides ── */

        /* Single card — full width centered */
        #consultation .ccs {
          grid-template-columns: 1fr !important;
          max-width: 680px;
          margin: 0 auto;
        }

        /* Card padding */
        #consultation .cc {
          padding: 52px 46px;
        }

        /* Price + button row */
        #consultation .cpb {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          gap: 16px;
          flex-wrap: wrap;
        }

        /* Button */
        #consultation .ccta {
          cursor: pointer;
          white-space: nowrap;
        }

        /* Tablet */
        @media (max-width: 768px) {
          #consultation .cc {
            padding: 40px 32px;
          }
          #consultation .cpa {
            font-size: 2rem !important;
          }
        }

        /* Mobile */
        @media (max-width: 560px) {
          #consultation .cc {
            padding: 32px 22px;
          }
          #consultation .cpa {
            font-size: 1.8rem !important;
          }
          #consultation .cpb {
            flex-direction: column;
            align-items: stretch;
            gap: 20px;
          }
          #consultation .ccta {
            width: 100%;
            text-align: center;
            padding: 14px 20px;
            font-size: 0.6rem;
          }
          #consultation .cch {
            font-size: 1.35rem;
          }
          #consultation .cnum {
            font-size: 3.2rem;
          }
          #consultation .clist li {
            font-size: 0.62rem;
          }
        }

        /* Very small phones */
        @media (max-width: 380px) {
          #consultation .cc {
            padding: 28px 18px;
          }
          #consultation .cpa {
            font-size: 1.6rem !important;
          }
          #consultation .cth {
            font-size: 1.8rem;
          }
        }
      `}</style>

      <div className="cgd" />
      <div className="cin">

        {/* Header */}
        <div className="ch rr">
          <div className="dr" style={{ justifyContent: "center" }}>
            <div className="drl" style={{ maxWidth: 32 }} />
            <div className="drd" />
            <span className="ey" style={{ flex: 0, color: "rgba(201,168,76,.7)" }}>Personalised Guidance</span>
            <div className="drd" />
            <div className="drl" style={{ maxWidth: 32 }} />
          </div>
          <h2 className="cth">Learn directly from<br /><em>the author himself</em></h2>
          <p className="csub">
            Focused sessions designed for CBSE and State Board students.<br />
            Clear your doubts. Strengthen your board preparation.
          </p>
        </div>

        {/* Card */}
        <div className="ccs rr d1">
          <div className="cc">
            <div className="cnum">01</div>

            {/* Icon */}
            <div className="cir">
              <svg viewBox="0 0 24 24">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            </div>

            <div className="cch">One-to-One Session</div>
            <div className="ccm">Private · Focused · Tailored</div>

            <p className="ccb">
              A private hour entirely focused on your syllabus — Business Studies, Accountancy,
              or Economics. Bring your doubts, unsolved problems, or exam fear.
              Leave with clarity and a plan.
            </p>

            <ul className="clist">
              <li>Subject-specific concept clearing</li>
              <li>Accountancy problem-solving walkthroughs</li>
              <li>Answer writing &amp; presentation feedback</li>
              <li>Board exam strategy &amp; chapter prioritisation</li>
              <li>60-minute Google Meet session</li>
            </ul>

            {/* Price + CTA */}
            <div className="cpb">
              <div>
                {/* Strikethrough + new price */}
                <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
                  <span style={{
                    fontSize: "1.4rem",
                    color: "rgba(201,168,76,0.45)",
                    textDecoration: "line-through",
                    textDecorationColor: "rgba(201,168,76,0.85)",
                    textDecorationThickness: "2px",
                    fontFamily: "inherit",
                  }}>
                    ₹ 500
                  </span>
                  <div className="cpa">₹ 300</div>
                </div>
                <div className="cpn">per session &nbsp;·&nbsp; Sundays only</div>
              </div>

              <button className="ccta" onClick={bookSession}>
                📲 Book on WhatsApp
              </button>
            </div>
          </div>
        </div>

        <p className="cfn rr d2">
          Google Meet <span>·</span> Sundays <span>·</span> IST Timezone <span>·</span> Limited slots
        </p>

      </div>
    </section>
  );
}
