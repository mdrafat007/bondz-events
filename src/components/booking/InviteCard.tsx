import inviteLight from "@/assets/templates/BONDZ_EVENTS_INVITE_CARD_-_LIGHT.png";
import inviteDark from "@/assets/templates/BONDZ_EVENTS_INVITE_CARD_-_DARK.png";
import { cn } from "@/lib/utils";

export type InviteTheme = "light" | "dark";

export interface InviteContent {
  head: string;
  tag: string;
  dateStr: string;
  slot: string;
  time: string;
  place: string;
  host: string;
  ref: string;
}

export const INVITE_TEMPLATES: Record<InviteTheme, { name: string; src: string }> = {
  light: { name: "Paper", src: inviteLight },
  dark: { name: "Night", src: inviteDark },
};

/** Live preview of the branded invitation, scaled by its container width. */
export function InviteCard({ theme, content, className }: { theme: InviteTheme; content: InviteContent; className?: string }) {
  const dark = theme === "dark";
  return (
    <div
      className={cn("@container relative aspect-square w-full select-none overflow-hidden rounded-card shadow-raised", className)}
      aria-label={`Invitation preview: ${content.head}`}
    >
      <img src={INVITE_TEMPLATES[theme].src} alt="" aria-hidden className="absolute inset-0 size-full object-cover" draggable={false} />
      <div className={cn("absolute inset-0 flex flex-col p-[7.4cqw]", dark ? "text-paper" : "text-night")}>
        <p className="font-sans text-[2.3cqw] font-bold uppercase tracking-[0.18em] text-primary">You’re invited</p>
        <p className="font-serif mt-[4cqw] line-clamp-3 text-[9cqw] italic leading-[0.98]">{content.head}</p>
        <p className="font-serif mt-[2.2cqw] line-clamp-2 text-[4cqw] italic leading-tight text-primary">{content.tag}</p>
        <div className="mt-auto max-w-[52%] space-y-[1cqw] pb-[1cqw]">
          <p className="font-sans text-[3cqw] font-extrabold uppercase leading-tight tracking-tight">{content.dateStr}</p>
          <p className="font-sans text-[2.5cqw] font-medium leading-snug opacity-85">{content.slot} · {content.time}</p>
          <p className="font-sans text-[2.5cqw] font-medium leading-snug opacity-85">{content.place}</p>
          <p className="font-serif text-[2.7cqw] italic leading-snug">Hosted by {content.host}</p>
          <p className="font-sans pt-[0.6cqw] text-[1.8cqw] font-bold uppercase tracking-[0.16em] text-primary">RSVP · Ref {content.ref}</p>
        </div>
      </div>
    </div>
  );
}

function loadImg(src: string) {
  return new Promise<HTMLImageElement>((res, rej) => {
    const i = new Image();
    i.crossOrigin = "anonymous";
    i.onload = () => res(i);
    i.onerror = rej;
    i.src = src;
  });
}

function wrap(ctx: CanvasRenderingContext2D, text: string, maxWidth: number, maxLines: number): string[] {
  const words = text.split(/\s+/).filter(Boolean);
  const lines: string[] = [];
  let line = "";
  for (const w of words) {
    const probe = line ? `${line} ${w}` : w;
    if (ctx.measureText(probe).width > maxWidth && line) {
      lines.push(line);
      line = w;
    } else line = probe;
  }
  if (line) lines.push(line);
  if (lines.length > maxLines) {
    const kept = lines.slice(0, maxLines);
    kept[maxLines - 1] = `${kept[maxLines - 1]!.replace(/[.,]?$/, "")}…`;
    return kept;
  }
  return lines;
}

/** Renders the invitation onto the brand template at its native 1620 px and returns a PNG blob. */
export async function renderInvitePng(theme: InviteTheme, content: InviteContent): Promise<Blob> {
  const S = 1620;
  const PAD = 120;
  const RED = "#f1453b";
  const ink = theme === "dark" ? "#f6f1e7" : "#130f16";
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = S;
  const ctx = canvas.getContext("2d")!;
  await Promise.all([
    document.fonts.load('italic 150px "Instrument Serif"'),
    document.fonts.load('700 40px "Bricolage Grotesque"'),
    document.fonts.load('500 42px "Bricolage Grotesque"'),
  ]).catch(() => {});
  const template = await loadImg(INVITE_TEMPLATES[theme].src);
  ctx.drawImage(template, 0, 0, S, S);

  const spaced = (text: string, x: number, y: number, spacing: number) => {
    let cx = x;
    for (const ch of text) {
      ctx.fillText(ch, cx, y);
      cx += ctx.measureText(ch).width + spacing;
    }
  };

  ctx.textBaseline = "alphabetic";
  ctx.fillStyle = RED;
  ctx.font = '700 38px "Bricolage Grotesque"';
  spaced("YOU’RE INVITED", PAD, PAD + 60, 7);

  ctx.fillStyle = ink;
  ctx.font = 'italic 150px "Instrument Serif"';
  let y = PAD + 230;
  for (const line of wrap(ctx, content.head, S - PAD * 2, 3)) {
    ctx.fillText(line, PAD, y);
    y += 148;
  }

  ctx.fillStyle = RED;
  ctx.font = 'italic 66px "Instrument Serif"';
  y += 6;
  for (const line of wrap(ctx, content.tag, S - PAD * 2, 2)) {
    ctx.fillText(line, PAD, y);
    y += 74;
  }

  const detailWidth = S * 0.52 - PAD;
  let dy = S - PAD - 20;
  ctx.fillStyle = RED;
  ctx.font = '700 30px "Bricolage Grotesque"';
  spaced(`RSVP · REF ${content.ref}`.toUpperCase(), PAD, dy, 5);
  dy -= 62;
  ctx.fillStyle = ink;
  ctx.font = 'italic 44px "Instrument Serif"';
  ctx.fillText(`Hosted by ${content.host}`, PAD, dy);
  dy -= 60;
  ctx.font = '500 42px "Bricolage Grotesque"';
  ctx.globalAlpha = 0.88;
  const placeLines = wrap(ctx, content.place, detailWidth, 2).reverse();
  for (const line of placeLines) {
    ctx.fillText(line, PAD, dy);
    dy -= 52;
  }
  ctx.fillText(`${content.slot} · ${content.time}`, PAD, dy);
  dy -= 62;
  ctx.globalAlpha = 1;
  ctx.font = '800 50px "Bricolage Grotesque"';
  const dateLines = wrap(ctx, content.dateStr.toUpperCase(), detailWidth, 2).reverse();
  for (const line of dateLines) {
    ctx.fillText(line, PAD, dy);
    dy -= 58;
  }

  return new Promise<Blob>((resolve, reject) => canvas.toBlob((b) => (b ? resolve(b) : reject(new Error("Could not render invitation"))), "image/png"));
}

export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  window.setTimeout(() => URL.revokeObjectURL(url), 1500);
}
