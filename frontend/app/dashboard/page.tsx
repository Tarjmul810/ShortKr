import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { getUrl } from "@/lib/api";
import { Url } from "@/lib/types";

export default async function Dashboard() {


    const isExpired = (date: string) => new Date(date) < new Date();
    const formatDate = (date: string) =>
        new Date(date).toLocaleDateString("en-US", {
            month: "short", day: "numeric", year: "numeric",
        });

    const response = await getUrl();
    const urls: Url[] = response.data.data

    const totalClicks = urls.reduce((sum, u) => sum + u.counts, 0);
    const activeUrls = urls.filter((u) => !isExpired(u.expiredAt)).length;

    return (
        <div>

            <nav className="flex items-center justify-between px-7 py-4 border-b border-[#1f1f1f]">
                <a href="/" className="flex items-center gap-2" >
                    <div className="w-7 h-7 bg-[#1a1a1a] border border-[#2e2e2e] rounded-md flex items-center justify-center text-xs font-semibold text-[#e5e5e5]">
                        S
                    </div>
                    <span className="text-[15px] font-semibold text-[#e5e5e5]">Shrinkr</span>
                </a>
                <div
                    className="bg-[#1a1a1a] border border-[#2e2e2e] px-4 py-1.5 rounded-md text-[13px] font-medium text-[#aaa] hover:text-[#e5e5e5] hover:border-[#444] transition-colors duration-150 no-underline"
                    >
                    {urls.length} URLs
                </div>
            </nav>
                    <div className="min-h-screen bg-[#0A0A0A] text-white p-8 max-w-6xl mx-auto">

            <div className="grid grid-cols-3 gap-3 mb-8">
                {[
                    { label: "Total URLs", value: urls.length },
                    { label: "Total Clicks", value: totalClicks },
                    { label: "Active URLs", value: activeUrls },
                ].map((stat) => (
                    <div key={stat.label} className="bg-[#111] rounded-lg p-4">
                        <p className="text-sm text-[#888] mb-1">{stat.label}</p>
                        <p className="text-2xl font-medium">{stat.value}</p>
                    </div>
                ))}
            </div>

         <div className="border border-[#222] rounded-lg overflow-hidden">
            <Table>
                    <TableHeader>
                        <TableRow className="bg-[#111] border-[#222] hover:bg-[#111]">
                            <TableHead className="text-[#888] uppercase text-xs w-32">Short Code</TableHead>
                            <TableHead className="text-[#888] uppercase text-xs">Original URL</TableHead>
                            <TableHead className="text-[#888] uppercase text-xs w-28">Clicks</TableHead>
                            <TableHead className="text-[#888] uppercase text-xs w-24">Status</TableHead>
                            <TableHead className="text-[#888] uppercase text-xs w-36">Created</TableHead>
                            <TableHead className="text-[#888] uppercase text-xs w-36">Expires</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {urls.map((url) => (
                            <TableRow key={url.id} className="border-[#222] hover:bg-[#111] transition-colors">
                                <TableCell className="text-[#6466e8] font-mono font-medium text-sm">
                                    {`${process.env.NEXT_PUBLIC_API_URL}/${url.short}`}
                                </TableCell>
                                <TableCell className="text-[#888] text-sm truncate max-w-xs">
                                    {url.url}
                                </TableCell>
                                <TableCell>
                                    <span className="flex items-center gap-2">
                                        {url.counts}
                                    </span>
                                </TableCell>
                                <TableCell>
                                    {isExpired(url.expiredAt) ? (
                                        <span className="text-xs px-2 py-0.5 rounded bg-red-500/10 text-red-400">Expired</span>
                                    ) : (
                                        <span className="text-xs px-2 py-0.5 rounded bg-green-500/10 text-green-400">Active</span>
                                    )}
                                </TableCell>
                                <TableCell className="text-[#888] text-sm">
                                    {formatDate(url.createdAt)}
                                </TableCell>
                                <TableCell className="text-[#888] text-sm">
                                    {formatDate(url.expiredAt)}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
        </div>
    );
}