"use client";

export default function AuthorSection() {
  return (
    <section id="author">
      <div className="al">
        <div className="al-bg" />
        <div className="al-tex" />
        <div className="al-frame" />
        <div className="al-sil"><svg viewBox="0 0 300 420" xmlns="http://www.w3.org/2000/svg" fill="rgba(253,250,243,1)"><ellipse cx="150" cy="115" rx="72" ry="90" /><path d="M30 420 Q30 290 150 270 Q270 290 270 420Z" /></svg></div>
        <div className="al-bot">
          <div className="al-name"><span>Educator · Author · Commerce Expert</span>Naresh<br />Kumar</div>
          <div className="al-tags"><span className="al-tag">CBSE & State Board</span><div className="al-dot" /><span className="al-tag">9th to 12th Standards</span><div className="al-dot" /><span className="al-tag">Est. 2007</span></div>
        </div>
      </div>
      <div className="ar">
        <div className="ar-in">
          <div className="dr rr"><div className="drl" /><div className="drd" /><span className="ey">About the Author</span></div>
          <blockquote className="pq rr d1">Commerce is not just a subject. It is the language of the world you are stepping into.</blockquote>
          <p className="ab rr d2">Naresh Kumar is one of India&apos;s most trusted names in Commerce education across CBSE and State Boards. With nearly two decades of classroom teaching behind him, his books have become the quiet cornerstone of thousands of students from classes 9 to 12.</p>
          <p className="ab rr d2">Known for breaking complex concepts into clean, memorable frameworks, Naresh writes the way a great teacher speaks — with precision, clarity, and a genuine belief that every student can succeed if given the right material.</p>
          <div className="cs rr d3">
            <div className="ci"><span className="cn">18+</span><span className="cl">Years Teaching</span></div>
            <div className="ci"><span className="cn">14</span><span className="cl">Books Published</span></div>
            <div className="ci"><span className="cn">9,200+</span><span className="cl">Students Guided</span></div>
            <div className="ci"><span className="cn">98%</span><span className="cl">Pass Rate</span></div>
          </div>
        </div>
      </div>
    </section>
  );
}