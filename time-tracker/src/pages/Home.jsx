import { useEffect, useState } from "react";
import ActivityList from "../components/ActivityList";
import Timer from "../components/Timer";
import { getActivities } from "../services/api";

function Home() {
  const [records, setRecords] = useState([]);

  async function loadData() {
    try {
      const data = await getActivities();
      setRecords(data);
    } catch (error) {
      console.error("Erro ao carregar atividades:", error);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center p-4">
      <div className="w-full max-w-3xl space-y-4">
        <h1 className="text-3xl font-bold text-center text-gray-800">
          ⏱️ Time Tracker
        </h1>

        <Timer
          records={records}
          setRecords={setRecords}
          reloadData={loadData}
        />
        <ActivityList records={records} reloadData={loadData} />
      </div>
    </div>
  );
}

export default Home;
