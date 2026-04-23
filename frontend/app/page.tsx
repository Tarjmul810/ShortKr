"use client"

import { CopyButton } from "@/components/animate-ui/components/buttons/copy";
import { postUrl } from "@/lib/api";
import { useState } from "react";
import { toast } from "sonner";

export default function Home() {

  const link = process.env.NEXT_PUBLIC_API_URL;
  const [url, setUrl] = useState("");
  const [code, setCode] = useState("");
  const [success, setSuccess] = useState(false);

  async function handleShorten() {
    if (!url.trim()) return;

    const response = await postUrl(url);
    const data = response.data
    if (data.success === false) return toast.error(data.error);

    setCode(data.data.short);
    toast.success("URL shortened successfully");
    setSuccess(true);
    setUrl("");
  }

  return (
    <div className="bg-[#0d0d0d] min-h-screen font-sans text-[#e5e5e5] flex flex-col">


      <nav className="flex items-center justify-between px-7 py-4 border-b border-[#1f1f1f]">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-[#1a1a1a] border border-[#2e2e2e] rounded-md flex items-center justify-center text-xs font-semibold text-[#e5e5e5]">
            S
          </div>
          <span className="text-[15px] font-semibold text-[#e5e5e5]">Shrinkr</span>
        </div>
        <a
          href="/dashboard"
          className="bg-[#1a1a1a] border border-[#2e2e2e] px-4 py-1.5 rounded-md text-[13px] font-medium text-[#aaa] hover:text-[#e5e5e5] hover:border-[#444] transition-colors duration-150 no-underline"
        >
          Dashboard
        </a>
      </nav>

      {/* Hero */}
      <div className="flex-1 flex flex-col items-center justify-center px-8 pt-20 pb-16 text-center">
        <h1 className="text-[36px] font-semibold leading-[1.15] tracking-tight text-[#e5e5e5] mb-3">
          Shorten any URL,<br />share it anywhere.
        </h1>
        <p className="text-[14px] text-[#666] font-normal leading-relaxed max-w-sm mb-8">
          Paste a long link and get a short one instantly. Track clicks and
          manage all your links from the dashboard.
        </p>

        <div className="flex gap-2 w-full max-w-[520px] mb-3.5">
          <input
            type="text"
            value={url}
            onChange={e => setUrl(e.target.value)}
            onKeyDown={e => e.key === "Enter" && handleShorten()}
            placeholder="https://example.com/your-long-url"
            className="flex-1 bg-[#111] border border-[#2a2a2a] rounded-lg outline-none text-[#e5e5e5] text-[13px] px-3.5 py-2.5 placeholder-[#444] focus:border-[#444] transition-colors duration-150"
          />
          <button
            onClick={handleShorten}
            className="bg-[#e5e5e5] text-[#0d0d0d] rounded-lg px-4 py-2.5 text-[13px] font-semibold whitespace-nowrap hover:bg-[#ccc] transition-colors duration-150 cursor-pointer"
          >
            Shorten
          </button>
        </div>

        {success ? (
          <div className="flex items-center gap-2 w-full max-w-100 mb">
            <span className="text-[#bdbdc5] font-mono text-[13px] truncate flex-1">
              {link}/{code}
            </span>
            <CopyButton content={link + "/" + code} />
          </div>
        ) : (

        <p className="text-[12px] text-[#444] mb-14">
          No account required &nbsp;·&nbsp; Free to use &nbsp;·&nbsp; Custom expiry
        </p>
        )}



        <div className="flex gap-8 border-t border-[#1a1a1a] pt-7">
          <div className="text-center">
            <div className="text-[18px] font-semibold text-[#e5e5e5]">2M+</div>
            <div className="text-[11px] text-[#555] mt-0.5">Links shortened</div>
          </div>
          <div className="w-px bg-[#1a1a1a]" />
          <div className="text-center">
            <div className="text-[18px] font-semibold text-[#e5e5e5]">99.9%</div>
            <div className="text-[11px] text-[#555] mt-0.5">Uptime</div>
          </div>
          <div className="w-px bg-[#1a1a1a]" />
          <div className="text-center">
            <div className="text-[18px] font-semibold text-[#e5e5e5]">&lt;50ms</div>
            <div className="text-[11px] text-[#555] mt-0.5">Redirect speed</div>
          </div>
        </div>
      </div>

    </div>
  );
}