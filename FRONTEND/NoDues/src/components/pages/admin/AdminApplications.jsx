import { useState, useEffect } from "react";
import api from "../../../api/client";
import { format } from "date-fns";

export default function AdminApplications() {
    const [applications, setApplications] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [search, setSearch] = useState("");

    const fetchApplications = async () => {
        try {
            setIsLoading(true);
            const res = await api.get("/admin/applications");
            setApplications(res.data.applications || []);
        } catch (err) {
            console.error("Failed to fetch applications:", err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchApplications();
    }, []);

    const filteredApplications = applications.filter((app) => {
        const query = search.toLowerCase();
        const student = app.studentId || {};
        return (
            (student.name || "").toLowerCase().includes(query) ||
            (student.rollNo || "").toLowerCase().includes(query) ||
            (student.email || "").toLowerCase().includes(query) ||
            (app.status || "").toLowerCase().includes(query)
        );
    });

    return (
        <div className="space-y-6">
            <section className="flex flex-col gap-4 rounded-3xl border border-white/10 bg-white/5 p-6">
                <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
                    <div>
                        <h2 className="text-2xl font-semibold text-white">All Applications</h2>
                        <p className="mt-1 text-sm text-white/60">
                            View and track all student No Dues applications.
                        </p>
                    </div>
                </div>
            </section>

            <section className="grid gap-4 md:grid-cols-4">
                <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                    <p className="text-sm text-white/60">Total Applications</p>
                    <p className="mt-3 text-3xl font-semibold text-white">{applications.length}</p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/5 p-5 md:col-span-3">
                    <input
                        type="text"
                        placeholder="Search by name, roll no, email, or status..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white placeholder:text-white/35 outline-none focus:border-blue-500"
                    />
                </div>
            </section>

            <section className="overflow-hidden rounded-2xl border border-white/10 bg-white/5">
                <div className="overflow-x-auto">
                    <table className="min-w-full text-left text-sm text-white/80">
                        <thead className="bg-white/5 text-xs uppercase tracking-wide text-white/50">
                            <tr>
                                <th className="px-5 py-4">Student Details</th>
                                <th className="px-5 py-4">Applied On</th>
                                <th className="px-5 py-4">Status</th>
                                <th className="px-5 py-4">Current Department</th>
                            </tr>
                        </thead>

                        <tbody>
                            {isLoading ? (
                                <tr>
                                    <td colSpan="4" className="px-5 py-8 text-center text-sm text-white/50">
                                        Loading applications...
                                    </td>
                                </tr>
                            ) : filteredApplications.length > 0 ? (
                                filteredApplications.map((app) => (
                                    <tr key={app._id} className="border-t border-white/10">
                                        <td className="px-5 py-4">
                                            <p className="font-medium text-white">{app.studentId?.name || "Unknown"}</p>
                                            <p className="text-xs text-white/50">{app.studentId?.rollNo}</p>
                                            <p className="text-xs text-white/50">{app.studentId?.email}</p>
                                        </td>
                                        <td className="px-5 py-4">
                                            {app.createdAt ? format(new Date(app.createdAt), "dd MMM yyyy, HH:mm") : "N/A"}
                                        </td>
                                        <td className="px-5 py-4">
                                            <span
                                                className={`rounded-lg px-3 py-1 text-xs font-medium ${app.status === "Approved"
                                                        ? "bg-green-500/10 text-green-400"
                                                        : app.status === "Rejected"
                                                            ? "bg-red-500/10 text-red-400"
                                                            : "bg-yellow-500/10 text-yellow-400"
                                                    }`}
                                            >
                                                {app.status}
                                            </span>
                                        </td>
                                        <td className="px-5 py-4">
                                            <span className="rounded-lg bg-blue-500/10 px-3 py-1 text-xs text-blue-400">
                                                {app.currentDepartment || "Completed"}
                                            </span>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="4" className="px-5 py-8 text-center text-sm text-white/50">
                                        No applications found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </section>
        </div>
    );
}
