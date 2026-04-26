import { useState, useEffect } from "react";

export default function App() {
  const getToday = () => new Date().toISOString().split("T")[0];

  const [form, setForm] = useState({
    date: getToday(),
    vehicleNo: "",
    fastag: "",
    diesel: "",
    driverCash: "",
  });

  const [data, setData] = useState([]);
  const [initialCash, setInitialCash] = useState(0);

  // Load
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("expenses")) || [];
    const cash = JSON.parse(localStorage.getItem("cash")) || 0;

    setData(saved);
    setInitialCash(cash);
  }, []);

  // Save
  useEffect(() => {
    localStorage.setItem("expenses", JSON.stringify(data));
  }, [data]);

  useEffect(() => {
    localStorage.setItem("cash", JSON.stringify(initialCash));
  }, [initialCash]);

  // Auto date update
  useEffect(() => {
    const interval = setInterval(() => {
      setForm((prev) => ({
        ...prev,
        date: getToday(),
      }));
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAdd = () => {
    if (!form.vehicleNo) return;

    const total =
      (parseFloat(form.fastag) || 0) +
      (parseFloat(form.diesel) || 0) +
      (parseFloat(form.driverCash) || 0);

    const newEntry = {
      ...form,
      total,
      id: Date.now(),
    };

    setData([newEntry, ...data]);

    setForm({
      date: getToday(),
      vehicleNo: "",
      fastag: "",
      diesel: "",
      driverCash: "",
    });
  };

  const handleDelete = (id) => {
    setData(data.filter((item) => item.id !== id));
  };

  // TOTAL
  const grandTotal = data.reduce((acc, item) => acc + item.total, 0);

  // REMAINING CASH
  const remainingCash = initialCash - grandTotal;

  // RUNNING CASH
  let running = initialCash;
  const dataWithRunning = data.map((item) => {
    running -= item.total;
    return { ...item, balance: running };
  });

  return (
    <div className="min-h-screen bg-[#051424] text-white p-4">
      {/* Navbar */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-bold text-emerald-400">ALZAHOOR</h1>
        <span className="text-sm text-gray-400">Tracker</span>
      </div>

      {/* Initial Cash */}
      <div className="bg-[#122131] p-4 rounded-2xl mb-4">
        <p className="text-sm text-gray-400">Set Initial Cash</p>
        <input
          type="number"
          value={initialCash}
          onChange={(e) => setInitialCash(Number(e.target.value))}
          className="w-full p-2 mt-2 rounded bg-[#0d1c2d]"
        />
      </div>

      {/* Summary */}
      <div className="bg-[#122131] p-4 rounded-2xl mb-4 flex justify-between">
        <div>
          <p className="text-sm text-gray-400">Total Expense</p>
          <h2 className="text-red-400 font-bold">₹ {grandTotal}</h2>
        </div>

        <div>
          <p className="text-sm text-gray-400">Remaining Cash</p>
          <h2 className="text-emerald-400 font-bold">₹ {remainingCash}</h2>
        </div>
      </div>

      {/* Form */}
      <div className="bg-[#122131] p-4 rounded-2xl mb-4 space-y-3">
        <input
          type="date"
          name="date"
          value={form.date}
          onChange={handleChange}
          className="w-full p-2 rounded bg-[#0d1c2d]"
        />

        <input
          placeholder="Vehicle No"
          name="vehicleNo"
          value={form.vehicleNo}
          onChange={handleChange}
          className="w-full p-2 rounded bg-[#0d1c2d]"
        />

        <div className="flex gap-2">
          <input
            type="number"
            placeholder="FASTag"
            name="fastag"
            value={form.fastag}
            onChange={handleChange}
            className="w-1/3 p-2 rounded bg-[#0d1c2d]"
          />

          <input
            type="number"
            placeholder="Diesel"
            name="diesel"
            value={form.diesel}
            onChange={handleChange}
            className="w-1/3 p-2 rounded bg-[#0d1c2d]"
          />

          <input
            type="number"
            placeholder="Driver Cash"
            name="driverCash"
            value={form.driverCash}
            onChange={handleChange}
            className="w-1/3 p-2 rounded bg-[#0d1c2d]"
          />
        </div>

        <button
          onClick={handleAdd}
          className="w-full bg-emerald-500 p-2 rounded font-bold cursor-pointer hover:bg-emerald-600 active:scale-95 transition"
        >
          + Add Entry
        </button>
      </div>

      {/* List */}
      <div className="space-y-3">
        {dataWithRunning.map((item) => (
          <div key={item.id} className="bg-[#122131] p-3 rounded-xl">
            <div className="flex justify-between">
              <div>
                <p className="text-sm text-gray-400">{item.date}</p>

                <p className="font-bold">{item.vehicleNo}</p>

                {/* 🔥 Running Cash under vehicle */}
                <p className="text-yellow-400 text-sm font-semibold">
                  Balance: ₹ {item.balance}
                </p>
              </div>

              <button
                onClick={() => handleDelete(item.id)}
                className="text-red-400 text-sm cursor-pointer hover:text-red-500"
              >
                Delete
              </button>
            </div>

            <div className="flex justify-between text-sm mt-2">
              <span>FASTag: ₹{item.fastag || 0}</span>
              <span>Diesel: ₹{item.diesel || 0}</span>
              <span>Driver: ₹{item.driverCash || 0}</span>
            </div>

            <div className="text-emerald-400 font-bold mt-2">
              ₹ {item.total}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
