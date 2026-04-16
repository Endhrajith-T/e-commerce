"use client";
const testimonials = [
  { name: "Ananya Kapoor", role: "CBSE 2024 · 98/100 Accountancy", text: "Naresh sir's Accountancy book literally saved my boards. The partnership problems were laid out so clearly — I finally stopped making silly errors in the profit sharing calculations." },
  { name: "Rohan Verma", role: "CBSE 2024 · 95/100 Business Studies", text: "The Business Studies guide is the best out there for case-study questions. The one-to-one session helped me understand exactly how to structure my 6-mark answers for maximum marks." },
  { name: "Priya Nambiar", role: "CBSE 2024 · 96/100 Economics", text: "I was completely lost with macroeconomics until I picked up Naresh sir's Economics book. The diagrams and the way income determination is explained — nothing else comes close." },
  { name: "Vikram Shetty", role: "CBSE 2023 · 97/100 Accountancy", text: "The Accountancy Question Bank has every type of problem you can imagine. I solved it twice before my boards. Full marks in cash flow and ratio analysis — I owe it to this book." },
  { name: "Sneha Iyer", role: "CBSE 2024 · Commerce Stream, Pune", text: "The group masterclass on company accounts was absolutely worth it. Naresh sir explains debentures and share capital in a way that even a nervous student can follow and apply." },
  { name: "Kartik Malhotra", role: "CBSE 2024 · Self-Study, Delhi", text: "Business Studies used to feel like rote memorisation until I read this book. The real-world examples make every concept stick. Scored 94 without any tuition — just this book." },
  { name: "Nidhi Gupta", role: "CBSE 2025 Aspirant · Mumbai", text: "I booked a session two weeks before my Economics exam and it turned everything around. Naresh sir identified exactly which chapters I was weak in and gave me a focused revision plan." },
];

export default function TestimonialsSection() {
  return (
    <section id="testimonials">
      <div className="thd rr">
        <div className="dr" style={{ justifyContent: "center" }}>
          <div className="drl" style={{ maxWidth: 32 }} />
          <div className="drd" />
          <span className="ey" style={{ flex: 0 }}>Student Voices</span>
          <div className="drd" />
          <div className="drl" style={{ maxWidth: 32 }} />
        </div>
        <h2 className="thh">Words from those who <em>walked the path</em></h2>
      </div>
      <div className="mo">
        <div className="mb">
          {[...testimonials, ...testimonials].map((t, i) => (
            <div className="tc" key={`${t.name}-${i}`}>
              <div className="tcs"><div className="si" /><div className="si" /><div className="si" /><div className="si" /><div className="si" /></div>
              <p className="tt">{t.text}</p>
              <div className="ta"><div className="tav">{t.name[0]}</div><div><div className="tn">{t.name}</div><div className="tr">{t.role}</div></div></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}