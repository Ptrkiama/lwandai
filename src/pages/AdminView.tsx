import { useEffect, useState, useMemo, useRef } from "react";
import { supabase } from "@/lib/supabaseClient";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  Legend,
  ResponsiveContainer,
} from "recharts";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

interface Member {
  id: string;
  name: string;
  expected_contribution: number;
}

function MemberContributionInput({
  member,
  savingId,
  onSave,
}: {
  member: Member;
  savingId: string | null;
  onSave: (id: string, value: number) => void;
}) {
  const [value, setValue] = useState(member.expected_contribution);

  return (
    <div
      key={member.id}
      style={{
        border: "1px solid #ccc",
        padding: "1rem",
        marginBottom: "1rem",
        borderRadius: 5,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <h4 style={{ margin: 0, flex: 1 }}>{member.name}</h4>

      <label style={{ marginRight: 10 }}>
        Expected Contribution:{" "}
        <input
          type="number"
          value={value}
          onChange={(e) => setValue(Number(e.target.value) || 0)}
          style={{ width: "100px", marginLeft: 5 }}
          disabled={savingId === member.id}
        />
      </label>

      <button
        onClick={() => onSave(member.id, value)}
        disabled={savingId === member.id}
        style={{
          padding: "6px 12px",
          backgroundColor: savingId === member.id ? "#ccc" : "#007bff",
          color: "white",
          border: "none",
          borderRadius: 4,
          cursor: savingId === member.id ? "not-allowed" : "pointer",
        }}
      >
        {savingId === member.id ? "Saving..." : "Save"}
      </button>
    </div>
  );
}

export default function AdminDashboard() {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [savingId, setSavingId] = useState<string | null>(null);

  const dashboardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function fetchMembers() {
      setLoading(true);
      setError(null);
      try {
        const { data, error } = await supabase.from("members").select("*");
        if (error) throw error;
        setMembers(data ?? []);
      } catch (err: any) {
        setError(err.message || "Failed to load members");
        setMembers([]);
      } finally {
        setLoading(false);
      }
    }
    fetchMembers();
  }, []);

  async function updateExpectedContribution(memberId: string, value: number) {
    setSavingId(memberId);
    try {
      const { error } = await supabase
        .from("members")
        .update({ expected_contribution: value })
        .eq("id", memberId);

      if (error) throw error;

      setMembers((prev) =>
        prev.map((m) =>
          m.id === memberId ? { ...m, expected_contribution: value } : m
        )
      );
    } catch (err: any) {
      alert("Failed to update contribution: " + err.message);
    } finally {
      setSavingId(null);
    }
  }

  function exportToCSV(data: Member[]) {
    if (data.length === 0) {
      alert("No data to export");
      return;
    }

    const headers = Object.keys(data[0]);
    const csvRows = [];
    csvRows.push(headers.join(","));

    for (const row of data) {
      const values = headers.map((header) => {
        const escaped = ("" + (row as any)[header]).replace(/"/g, '""');
        return `"${escaped}"`;
      });
      csvRows.push(values.join(","));
    }

    const csvData = csvRows.join("\n");
    const blob = new Blob([csvData], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "members.csv";
    a.click();
    window.URL.revokeObjectURL(url);
  }

  // Chart data etc — same as before
  const totalExpected = useMemo(() => {
    return members.reduce((acc, m) => acc + (m.expected_contribution || 0), 0);
  }, [members]);

  const averageContribution = useMemo(() => {
    return members.length ? totalExpected / members.length : 0;
  }, [totalExpected, members.length]);

  const barChartData = members.map((m) => ({
    name: m.name,
    contribution: m.expected_contribution,
  }));

  const sortedMembers = [...members].sort(
    (a, b) => b.expected_contribution - a.expected_contribution
  );
  const top5 = sortedMembers.slice(0, 5);
  const othersTotal = sortedMembers
    .slice(5)
    .reduce((acc, m) => acc + m.expected_contribution, 0);

  const pieData = [
    ...top5.map((m) => ({ name: m.name, value: m.expected_contribution })),
    { name: "Others", value: othersTotal },
  ];

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#AF19FF", "#888888"];

  async function exportToPDF() {
    if (!dashboardRef.current) return;

    const canvas = await html2canvas(dashboardRef.current, {
      scale: 2,
      useCORS: true,
    });

    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "pt",
      format: "a4",
    });

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save("admin-dashboard.pdf");
  }

  if (loading) return <p>Loading members...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div style={{ padding: 20, maxWidth: 900, margin: "auto" }} ref={dashboardRef}>
      <h1>Admin Dashboard</h1>

      <section
        style={{
          marginBottom: 30,
          display: "flex",
          justifyContent: "space-around",
          fontWeight: "bold",
        }}
      >
        <div>Total Members: {members.length}</div>
        <div>Total Expected Contribution: {totalExpected.toFixed(2)}</div>
        <div>Average Contribution: {averageContribution.toFixed(2)}</div>
      </section>

      <button onClick={() => exportToCSV(members)} style={{ marginBottom: 20 }}>
        Export Members CSV
      </button>

      <div style={{ marginBottom: 40 }}>
        <h3>Members & Expected Contributions</h3>
        {members.map((member) => (
          <MemberContributionInput
            key={member.id}
            member={member}
            savingId={savingId}
            onSave={updateExpectedContribution}
          />
        ))}
      </div>

      <div style={{ marginBottom: 40 }}>
        <h3>Contributions Bar Chart</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={barChartData}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="contribution" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div style={{ marginBottom: 40 }}>
        <h3>Contribution Distribution (Top 5 vs Others)</h3>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={pieData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={100}
              label
            >
              {pieData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Legend />
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <button
        onClick={exportToPDF}
        style={{ padding: "10px 20px", fontSize: 16, cursor: "pointer" }}
      >
        Export Dashboard to PDF
      </button>
    </div>
  );
}
