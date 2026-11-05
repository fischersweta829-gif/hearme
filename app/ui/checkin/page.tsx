// "use client";
// import { useState } from "react";
// import Link from "next/link";
// import { Heart } from "lucide-react";
// import { api } from "../../lib/api";
// import MoodPicker from "../../components/mood_picker";
// import Spinner from "../../components/spinner";

// export default function CheckinForm() {
//   const [mood, setMood] = useState<number | null>(null);
//   const [text, setText] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");
//   const [reply, setReply] = useState<{ message: string; showSupport: boolean } | null>(null);

//   async function onSubmit(e: React.FormEvent) {
//     e.preventDefault();
//     if (mood === null) return setError("Pick how you're feeling first.");
//     setError("");
//     setLoading(true);
//     try {
//       const res = await api.submitCheckin(mood, text.trim() || undefined);
//       setReply({
//         message: res.support_message,
//         showSupport: mood <= 2 || !!res.analysis?.distress_flag,
//       });
//     } catch (err) {
//       setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   }

//   if (reply) {
//     return (
//       <div className="card space-y-4">
//         <Heart style={{ color: "var(--brand)" }} />
//         <p>{reply.message}</p>
//         {reply.showSupport && (
//           <p className="text-sm" style={{ color: "var(--muted)" }}>
//             You don&apos;t have to carry this alone.{" "}
//             <Link href="/crisis" className="underline">See who you can talk to</Link>.
//           </p>
//         )}
//         <button className="btn" onClick={() => { setReply(null); setMood(null); setText(""); }}>
//           Done
//         </button>
//       </div>
//     );
//   }

//   return (
//     <form onSubmit={onSubmit} className="card space-y-5">
//       <MoodPicker value={mood} onChange={setMood} />
//       <label className="block text-sm">
//         Anything you want to add? <span style={{ color: "var(--muted)" }}>(optional)</span>
//         <textarea
//           className="input mt-1 min-h-28"
//           value={text}
//           onChange={e => setText(e.target.value)}
//           placeholder="Write in English, Kiswahili, Sheng, or a mix…"
//           maxLength={1000}
//         />
//       </label>
//       {error && <p role="alert" className="text-sm text-rose-600">{error}</p>}
//       <button className="btn w-full" disabled={loading}>
//         {loading && <Spinner size={16} />} Submit
//       </button>
//     </form>
//   );
// }