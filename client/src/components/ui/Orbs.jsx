const ORBS_CSS = `
@keyframes orbF0{0%,100%{transform:translate(-50%,-50%) translate(0px,0px) scale(1)}33%{transform:translate(-50%,-50%) translate(28px,-18px) scale(1.04)}66%{transform:translate(-50%,-50%) translate(-14px,22px) scale(0.97)}}
@keyframes orbF1{0%,100%{transform:translate(-50%,-50%) translate(0px,0px) scale(1)}33%{transform:translate(-50%,-50%) translate(-22px,24px) scale(1.05)}66%{transform:translate(-50%,-50%) translate(18px,-14px) scale(0.96)}}
@keyframes orbF2{0%,100%{transform:translate(-50%,-50%) translate(0px,0px) scale(1)}33%{transform:translate(-50%,-50%) translate(16px,20px) scale(0.98)}66%{transform:translate(-50%,-50%) translate(-24px,-16px) scale(1.03)}}
@keyframes orbF3{0%,100%{transform:translate(-50%,-50%) translate(0px,0px) scale(1)}33%{transform:translate(-50%,-50%) translate(-18px,-22px) scale(1.02)}66%{transform:translate(-50%,-50%) translate(22px,16px) scale(0.98)}}
@keyframes orbF4{0%,100%{transform:translate(-50%,-50%) translate(0px,0px) scale(1)}33%{transform:translate(-50%,-50%) translate(24px,14px) scale(1.05)}66%{transform:translate(-50%,-50%) translate(-12px,-20px) scale(0.96)}}
`;

const ORB_DATA = [
  { size: 460, left: "10%",  top: "20%", color: "rgba(255,122,0,0.10)",   kf: "orbF0", dur: "18s", del: "0s"   },
  { size: 360, left: "72%",  top: "12%", color: "rgba(255,211,61,0.08)",  kf: "orbF1", dur: "22s", del: "-7s"  },
  { size: 320, left: "52%",  top: "60%", color: "rgba(92,214,255,0.08)", kf: "orbF2", dur: "16s", del: "-3s"  },
  { size: 270, left: "20%",  top: "72%", color: "rgba(255,107,107,0.07)", kf: "orbF3", dur: "20s", del: "-10s" },
  { size: 210, left: "85%",  top: "55%", color: "rgba(78,205,196,0.07)",  kf: "orbF4", dur: "25s", del: "-13s" },
];

export default function Orbs({ count = 5 }) {
  return (
    <>
      <style>{ORBS_CSS}</style>
      <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
        {ORB_DATA.slice(0, count).map((orb, i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              width: orb.size,
              height: orb.size,
              borderRadius: "50%",
              background: orb.color,
              filter: "blur(65px)",
              left: orb.left,
              top: orb.top,
              willChange: "transform",
              animation: `${orb.kf} ${orb.dur} ease-in-out infinite ${orb.del}`,
            }}
          />
        ))}
      </div>
    </>
  );
}
