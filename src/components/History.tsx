import { IElevatorHistory } from "../App"

type HistoryProp = {
    records: IElevatorHistory[]
}

const History = ({ records }: HistoryProp) => {
    return (
        <table className="table-auto w-full border-collapse border border-slate-500">
            <thead>
              <tr>
                <th className="border border-slate-500">Время вызова</th>
                <th className="border border-slate-500">Номер лифта</th>
                <th className="border border-slate-500">Номер этажа</th>
                <th className="border border-slate-500">Направление</th>
                <th className="border border-slate-500">Кол-во шагов</th>
              </tr>
            </thead>
            <tbody>
              {
                records.map((record, idx) => (
                  <tr key={idx}>
                    <td className="border border-slate-500">{ record.time.toLocaleTimeString() }</td>
                    <td className="border border-slate-500">{ record.elevavatorNumber + 1 }</td>
                    <td className="border border-slate-500">{ record.floorNumber + 1 }</td>
                    <td className="border border-slate-500">{ record.direction }</td>
                    <td className="border border-slate-500">{ record.steps }</td>
                  </tr>
                ))
              }
            </tbody>
          </table>
    )
}

export default History