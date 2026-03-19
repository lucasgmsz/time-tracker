import { useState, useEffect } from "react";
import { createActivity } from "../services/api";

function Timer({ records, setRecords, reloadData }) {
  const [activity, setActivity] = useState("");
  const [startTime, setStartTime] = useState(null);
  const [elapsed, setElapsed] = useState(0);

  function handleStart() {
    if (!activity) return alert("Digite uma atividade");
    setStartTime(new Date());
    setElapsed(0);
  }

  async function handleStop() {
    if (!startTime) return;

    const novoRegistro = {
      activity: activity,
      startTime: startTime,
      endTime: new Date(),
    };

    await createActivity(novoRegistro);

    setActivity("");
    setStartTime(null);

    // 🔥 atualiza lista sem F5
    await reloadData();
  }

  // ⏱️ Atualiza a cada 1 segundo
  useEffect(() => {
    let interval;

    if (startTime) {
      interval = setInterval(() => {
        const now = new Date();
        const diff = now - startTime;
        setElapsed(diff);
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [startTime]);

  // ⏱️ Formatar tempo (hh:mm:ss)
  function formatTime(ms) {
    const totalSeconds = Math.floor(ms / 1000);

    const hours = String(Math.floor(totalSeconds / 3600)).padStart(2, "0");
    const minutes = String(Math.floor((totalSeconds % 3600) / 60)).padStart(
      2,
      "0",
    );
    const seconds = String(totalSeconds % 60).padStart(2, "0");

    return `${hours}:${minutes}:${seconds}`;
  }

  return (
    <div className="bg-white p-4 rounded-2xl shadow space-y-3">
      <h2 className="text-lg font-semibold">Nova Atividade</h2>

      <input
        type="text"
        placeholder="Ex: Jogar, Trabalho..."
        value={activity}
        onChange={(e) => setActivity(e.target.value)}
        className="w-full p-2 border rounded-lg"
      />

      {/* ⏱️ Timer visível */}
      {startTime && (
        <div className="text-center text-2xl font-mono text-blue-600">
          {formatTime(elapsed)}
        </div>
      )}

      {!startTime ? (
        <button
          onClick={handleStart}
          className="w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-600"
        >
          ▶ Iniciar
        </button>
      ) : (
        <button
          onClick={handleStop}
          className="w-full bg-red-500 text-white py-2 rounded-lg hover:bg-red-600"
        >
          ⏹ Parar
        </button>
      )}
    </div>
  );
}

export default Timer;
