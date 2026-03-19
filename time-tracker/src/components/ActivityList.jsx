import { deleteActivity } from "../services/api";

function ActivityList({ records, reloadData }) {
  async function handleDelete(id) {
    await deleteActivity(id);
    await reloadData();
  }

  // ⏱️ hh:mm:ss
  function formatarDuracao(inicio, fim) {
    const diff = fim - inicio;

    const totalSeconds = Math.floor(diff / 1000);

    const hours = String(Math.floor(totalSeconds / 3600)).padStart(2, "0");
    const minutes = String(Math.floor((totalSeconds % 3600) / 60)).padStart(
      2,
      "0",
    );
    const seconds = String(totalSeconds % 60).padStart(2, "0");

    return `${hours}:${minutes}:${seconds}`;
  }

  // ⏱️ horas decimais
  function calcularHoras(inicio, fim) {
    return (fim - inicio) / 1000 / 60 / 60;
  }

  // 🔥 interseção de períodos
  function calcularIntersecao(inicioA, fimA, inicioB, fimB) {
    const inicio = new Date(Math.max(inicioA, inicioB));
    const fim = new Date(Math.min(fimA, fimB));

    if (inicio >= fim) return 0;

    return calcularHoras(inicio, fim);
  }

  const agora = new Date();

  // 📅 HOJE
  const inicioHoje = new Date(agora);
  inicioHoje.setHours(0, 0, 0, 0);

  const fimHoje = new Date(agora);
  fimHoje.setHours(23, 59, 59, 999);

  // 📅 SEMANA
  const inicioSemana = new Date(agora);
  inicioSemana.setDate(agora.getDate() - agora.getDay());
  inicioSemana.setHours(0, 0, 0, 0);

  const fimSemana = new Date(inicioSemana);
  fimSemana.setDate(inicioSemana.getDate() + 6);
  fimSemana.setHours(23, 59, 59, 999);

  // 📅 MÊS
  const inicioMes = new Date(agora.getFullYear(), agora.getMonth(), 1);

  const fimMes = new Date(agora.getFullYear(), agora.getMonth() + 1, 0);
  fimMes.setHours(23, 59, 59, 999);

  // 🔥 soma por período (em decimal)
  function somarPorPeriodo(inicioPeriodo, fimPeriodo) {
    return records
      .reduce((total, r) => {
        const inicio = new Date(r.startTime);
        const fim = new Date(r.endTime);

        return (
          total + calcularIntersecao(inicio, fim, inicioPeriodo, fimPeriodo)
        );
      }, 0)
      .toFixed(2);
  }

  const totalHoje = somarPorPeriodo(inicioHoje, fimHoje);
  const totalSemana = somarPorPeriodo(inicioSemana, fimSemana);
  const totalMes = somarPorPeriodo(inicioMes, fimMes);

  return (
    <div className="space-y-4">
      {/* 📊 RESUMO */}
      <div className="bg-white p-4 rounded-2xl shadow">
        <h2 className="text-lg font-semibold mb-3">Resumo</h2>

        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="bg-gray-100 p-3 rounded-lg">
            <p className="text-sm text-gray-500">Hoje</p>
            <p className="font-bold text-blue-600">{totalHoje}h</p>
          </div>

          <div className="bg-gray-100 p-3 rounded-lg">
            <p className="text-sm text-gray-500">Semana</p>
            <p className="font-bold text-blue-600">{totalSemana}h</p>
          </div>

          <div className="bg-gray-100 p-3 rounded-lg">
            <p className="text-sm text-gray-500">Mês</p>
            <p className="font-bold text-blue-600">{totalMes}h</p>
          </div>
        </div>
      </div>

      {/* 📋 LISTA */}
      <div className="bg-white p-4 rounded-2xl shadow">
        <h2 className="text-lg font-semibold mb-3">Atividades</h2>

        {records.length === 0 && (
          <p className="text-gray-500 text-center">Nenhuma atividade ainda</p>
        )}

        {records.map((r, index) => {
          const inicio = new Date(r.startTime);
          const fim = new Date(r.endTime);

          const duracaoFormatada = formatarDuracao(inicio, fim);
          const duracaoHoras = calcularHoras(inicio, fim).toFixed(2);

          return (
            <div key={index} className="border-b py-3 last:border-none">
              <p className="font-semibold text-gray-800">{r.activity}</p>

              <p className="text-sm text-gray-500">
                {inicio.toLocaleString()} → {fim.toLocaleString()}
              </p>

              <p className="text-sm text-blue-600 font-medium">
                {duracaoFormatada} - {duracaoHoras}h
                <button
                  onClick={() => handleDelete(r.id)}
                  className="text-red-500 text-sm ml-2"
                >
                  Excluir
                </button>
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default ActivityList;
